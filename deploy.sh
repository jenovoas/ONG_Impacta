#!/usr/bin/env bash
#
# deploy.sh — Deploy de Impacta+ en fenix (Alpine, rama infra/alpine-fenix)
#
# Uso:
#   ./deploy.sh frontend   # build de frontend/ (nginx sirve frontend/dist directo)
#   ./deploy.sh migrate    # prisma migrate deploy dentro del contenedor backend
#   ./deploy.sh backend    # build + up del stack docker (db, redis, backend en 3101)
#   ./deploy.sh verify     # verificación post-deploy
#
# Realidad (rama Alpine):
#   - Sin systemd: servicios vía docker compose (stack propio impacta-*; NO tocar sentinel-*).
#   - Nginx (host): /etc/nginx/http.d/impacta.conf — root a frontend/dist, /api/ → 127.0.0.1:3101.
#   - .env en la raíz (gitignored) con JWT_SECRET real — el backend se niega a arrancar sin él.
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE="sudo docker compose -f $REPO_ROOT/docker-compose.yml -f $REPO_ROOT/docker-compose.prod.yml"
API="https://impacta.pinguinoseguro.cl"
RESOLVE="--resolve impacta.pinguinoseguro.cl:443:127.0.0.1"

log()  { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[ ok ]\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m[FAIL]\033[0m %s\n' "$*" >&2; exit 1; }

require_repo_root() {
  [[ -d "$REPO_ROOT/frontend" && -d "$REPO_ROOT/backend" ]] || die "Ejecuta este script desde la raíz del repo ($REPO_ROOT)"
}

require_secrets() {
  [[ -f "$REPO_ROOT/.env" ]] || die "Falta $REPO_ROOT/.env con JWT_SECRET real"
  if grep -q '^JWT_SECRET=PENDIENTE' "$REPO_ROOT/.env"; then
    die ".env aún tiene JWT_SECRET placeholder — reemplazar antes de desplegar"
  fi
}

deploy_frontend() {
  require_repo_root
  log "Build de frontend/ (nginx sirve frontend/dist directo, sin copia)..."
  (
    cd "$REPO_ROOT/frontend"
    NODE_ENV=development npm ci --silent 2>/dev/null || NODE_ENV=development npm install --silent --include=dev
    npm run build
  )
  [[ -f "$REPO_ROOT/frontend/dist/index.html" ]] || die "El build no generó frontend/dist/index.html"
  ok "Frontend construido en frontend/dist (servido directo por nginx)"
}

run_migrations() {
  require_repo_root
  require_secrets
  log "Aplicando migraciones Prisma (prisma migrate deploy en contenedor)..."
  $COMPOSE up -d postgres redis
  $COMPOSE run --rm backend npx prisma migrate deploy
  ok "Migraciones aplicadas"
}

deploy_backend() {
  require_repo_root
  require_secrets
  log "Build + up del stack (db, redis, backend:3102)..."
  $COMPOSE up -d --build
  log "Esperando backend en :3102..."
  for i in $(seq 1 30); do
    curl -sf -m 2 -o /dev/null "http://127.0.0.1:3102/organizations/public-stats" && break
    [[ $i -eq 30 ]] && die "El backend no respondió en :3102 — revisar: sudo docker logs impacta-backend"
    sleep 2
  done
  ok "Stack arriba (impacta-backend, impacta-db, impacta-redis)"
}

verify() {
  local fails=0
  $COMPOSE ps --status running | grep -q 'impacta-backend' \
    && ok "docker: impacta-backend corriendo" \
    || { echo "FAIL: impacta-backend no corre"; fails=$((fails+1)); }

  code=$(curl -sk -o /dev/null -w '%{http_code}' -m 8 $RESOLVE "$API/" || echo 'ERR')
  [[ "$code" == '200' ]] && ok "landing: 200" || { echo "FAIL: landing $code"; fails=$((fails+1)); }

  stats=$(curl -sk -m 8 $RESOLVE "$API/api/organizations/public-stats" || true)
  if echo "$stats" | grep -q 'speciesCount'; then
    ok "public-stats con datos reales"
  else
    echo "FAIL: public-stats sin respuesta válida ($stats)"; fails=$((fails+1))
  fi

  [[ $fails -eq 0 ]] && ok "Verificación completa: todo operativo" || die "Verificación con $fails problema(s)"
}

case "${1:-}" in
  frontend) deploy_frontend ;;
  backend)  deploy_backend ;;
  migrate)  run_migrations ;;
  verify)   verify ;;
  *)
    grep -E '^#\s+\./deploy\.sh|^#\s{3}' "$0" | sed 's/^#\s\?//'
    exit 1
    ;;
esac
