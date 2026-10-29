#!/usr/bin/env bash
#
# deploy.sh — Despliegue de Impacta+ con separación estricta Front/Back
#
# Arquitectura:
#   - Frontend (Host de borde Kingu - 10.88.0.2):
#       Archivos estáticos en /var/www/impacta.pinguinoseguro.cl/ servidos por Nginx.
#       Terminación SSL con Let's Encrypt (impacta.pinguinoseguro.cl).
#       Proxy inverso de /api/ hacia el backend en Fenix vía WireGuard.
#   - Backend (Host interno Fenix - 10.88.0.1):
#       Docker Compose: impacta-backend (puerto 3102), impacta-db (5435), impacta-redis (6381).
#       Base de datos y secretos (.env) aislados sin exposición pública directa.
#
# Uso:
#   ./deploy.sh frontend   # build del SPA y publicación rsync en Kingu (/var/www/...)
#   ./deploy.sh backend    # build + up del stack docker en Fenix (3102)
#   ./deploy.sh migrate    # prisma migrate deploy dentro del contenedor backend
#   ./deploy.sh verify     # verificación de punta a punta (local y HTTPS público)
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE="sudo docker compose -f $REPO_ROOT/docker-compose.yml -f $REPO_ROOT/docker-compose.prod.yml"
API="https://impacta.pinguinoseguro.cl"
FRONTEND_HOST="kingu"
FRONTEND_DEST="/var/www/impacta.pinguinoseguro.cl"

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
  log "Build de frontend/ (Vite + React 19)..."
  (
    cd "$REPO_ROOT/frontend"
    NODE_ENV=development npm ci --silent 2>/dev/null || NODE_ENV=development npm install --silent --include=dev
    npm run build
  )
  [[ -f "$REPO_ROOT/frontend/dist/index.html" ]] || die "El build no generó frontend/dist/index.html"
  ok "Frontend compilado en frontend/dist"

  log "Publicando frontend estático en $FRONTEND_HOST:$FRONTEND_DEST ..."
  ssh "$FRONTEND_HOST" "sudo -n mkdir -p '$FRONTEND_DEST' && sudo -n chown -R jnovoas:jnovoas '$FRONTEND_DEST'"
  rsync -avz --delete "$REPO_ROOT/frontend/dist/" "$FRONTEND_HOST:$FRONTEND_DEST/"

  log "Sincronizando configuración de Nginx en $FRONTEND_HOST ..."
  scp "$REPO_ROOT/infra/nginx/impacta.pinguinoseguro.cl.conf" "$FRONTEND_HOST:/tmp/impacta.conf"
  ssh "$FRONTEND_HOST" "sudo -n mv /tmp/impacta.conf /etc/nginx/conf.d/impacta.pinguinoseguro.cl.conf && sudo -n nginx -t && sudo -n systemctl reload nginx"
  ok "Frontend publicado en $FRONTEND_HOST y Nginx recargado"
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
  log "Build + up del stack backend en Fenix (puerto 3102)..."
  $COMPOSE up -d --build
  log "Esperando backend en :3102..."
  for i in $(seq 1 30); do
    curl -sf -m 2 -o /dev/null "http://127.0.0.1:3102/organizations/public-stats" && break
    [[ $i -eq 30 ]] && die "El backend no respondió en :3102 — revisar: sudo docker logs impacta-backend"
    sleep 2
  done
  ok "Stack backend arriba (impacta-backend:3102, impacta-db:5435, impacta-redis:6381)"
}

verify() {
  local fails=0

  log "1. Verificando estado del contenedor backend en Fenix..."
  $COMPOSE ps --status running | grep -q 'impacta-backend' \
    && ok "docker: impacta-backend corriendo en Fenix" \
    || { echo "FAIL: impacta-backend no corre"; fails=$((fails+1)); }

  log "2. Verificando respuesta interna en 127.0.0.1:3102..."
  local_stats=$(curl -sf -m 5 "http://127.0.0.1:3102/organizations/public-stats" || true)
  if echo "$local_stats" | grep -q 'speciesCount'; then
    ok "backend local :3102 respondiendo"
  else
    echo "FAIL: backend local no respondió adecuadamente"; fails=$((fails+1))
  fi

  log "3. Verificando Frontend público en $API/ ..."
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 10 "$API/" || echo 'ERR')
  [[ "$code" == '200' ]] && ok "landing frontend pública: 200 OK" || { echo "FAIL: landing $code"; fails=$((fails+1)); }

  log "4. Verificando API pública a través de Kingu proxy en $API/api/organizations/public-stats ..."
  stats=$(curl -s -m 10 "$API/api/organizations/public-stats" || true)
  if echo "$stats" | grep -q 'speciesCount'; then
    ok "API pública respondiendo con datos de Fenix: $stats"
  else
    echo "FAIL: API pública sin respuesta válida ($stats)"; fails=$((fails+1))
  fi

  [[ $fails -eq 0 ]] && ok "Verificación completa: Frontend y Backend operativos y aislados con éxito" || die "Verificación con $fails problema(s)"
}

case "${1:-}" in
  frontend) deploy_frontend ;;
  backend)  deploy_backend ;;
  migrate)  run_migrations ;;
  verify)   verify ;;
  *)
    echo "Uso: $0 {frontend|backend|migrate|verify}"
    exit 1
    ;;
esac
