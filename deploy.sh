#!/usr/bin/env bash
#
# deploy.sh — Deploy de Impacta+ en el server fenix (Azure, Ubuntu 24.04)
#
# Uso:
#   ./deploy.sh frontend   # build de frontend/ → copia dist/ a /var/www/ (landing + dashboard)
#   ./deploy.sh backend    # build de backend/  → restart del servicio systemd impacta-backend
#   ./deploy.sh migrate    # ejecuta prisma migrate deploy contra la DB nativa
#   ./deploy.sh verify     # verificación post-deploy de los 3 dominios + API
#
# Realidad de producción (ver AGENTS.md):
#   - Postgres 16 y Redis corren NATIVOS como servicios systemd (no hay contenedores).
#   - El backend corre como servicio systemd `impacta-backend.service` desde backend/dist/.
#   - Ambos dominios web (landing + dashboard) se sirven desde /var/www/impacta.pinguinoseguro.cl/.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WWW_DIR="/var/www/impacta.pinguinoseguro.cl"
SERVICE="impacta-backend.service"

log()  { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[ ok ]\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m[FAIL]\033[0m %s\n' "$*" >&2; exit 1; }

require_repo_root() {
  [[ -d "$REPO_ROOT/frontend" && -d "$REPO_ROOT/backend" ]] || die "Ejecuta este script desde la raíz del repo ($REPO_ROOT)"
}

deploy_frontend() {
  require_repo_root
  log "Build de frontend/ (sirve landing impacta.* Y dashboard app-impacta.*)..."
  (
    cd "$REPO_ROOT/frontend"
    npm ci --silent 2>/dev/null || npm install --silent
    npm run build
  )
  [[ -f "$REPO_ROOT/frontend/dist/index.html" ]] || die "El build no generó frontend/dist/index.html"
  log "Copiando dist/ → $WWW_DIR ..."
  sudo mkdir -p "$WWW_DIR"
  sudo rsync -a --delete --chown=www-data:www-data \
    --exclude='.well-known' \
    "$REPO_ROOT/frontend/dist/" "$WWW_DIR/"
  ok "Frontend desplegado en $WWW_DIR (ambos dominios)"
}

deploy_backend() {
  require_repo_root
  log "Build de backend/..."
  (
    cd "$REPO_ROOT/backend"
    npm ci --silent 2>/dev/null || npm install --silent
    npx prisma generate
    npm run build
  )
  [[ -f "$REPO_ROOT/backend/dist/src/main.js" ]] || die "El build no generó backend/dist/src/main.js (el unit file espera dist/src/main)"
  log "Reiniciando $SERVICE ..."
  sudo systemctl restart "$SERVICE"
  sleep 2
  systemctl is-active --quiet "$SERVICE" && ok "Servicio $SERVICE activo" || die "El servicio $SERVICE no arrancó — revisar: journalctl -u $SERVICE -n 50"
}

run_migrations() {
  require_repo_root
  log "Aplicando migraciones Prisma (prisma migrate deploy)..."
  (
    cd "$REPO_ROOT/backend"
    # El CLI de Prisma no sube a buscar el .env de la raíz — cargarlo explícitamente
    set -a; source "$REPO_ROOT/.env"; set +a
    npx prisma migrate deploy
  )
  log "Reiniciando backend para cargar cambios de schema..."
  sudo systemctl restart "$SERVICE"
  ok "Migraciones aplicadas y backend reiniciado"
}

verify() {
  local fails=0
  systemctl is-active --quiet "$SERVICE" \
    && ok "systemd: $SERVICE activo" \
    || { echo "FAIL: $SERVICE inactivo"; fails=$((fails+1)); }

  for h in impacta api-impacta app-impacta; do
    code=$(curl -s -o /dev/null -w '%{http_code}' -m 8 "https://$h.pinguinoseguro.cl/" || echo 'ERR')
    case "$h" in
      api-impacta) [[ "$code" == '200' || "$code" == '401' ]] && verdict='ok (API responde)' || { verdict='FAIL'; fails=$((fails+1)); } ;;
      *)           [[ "$code" == '200' ]] && verdict='ok' || { verdict='FAIL'; fails=$((fails+1)); } ;;
    esac
    printf '  %-28s %s %s\n' "$h.pinguinoseguro.cl" "$code" "$verdict"
  done

  stats=$(curl -s -m 8 https://api-impacta.pinguinoseguro.cl/organizations/public-stats || true)
  if echo "$stats" | grep -q 'speciesCount'; then
    ok "public-stats con datos reales: $stats"
  else
    echo "FAIL: public-stats sin respuesta válida"; fails=$((fails+1))
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
