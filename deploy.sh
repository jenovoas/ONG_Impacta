#!/usr/bin/env bash
# Despliegue separado: frontend estático en Kingu; API y datos en Fenix.
# Las migraciones Prisma se aplican una vez sobre la base compartida multi-tenant.
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_HOST="fenix"
FRONTEND_HOST="${IMPACTA_FRONTEND_HOST:-kingu}"
BACKEND_BIND_IP="10.88.0.1"
BACKEND_PORT="3102"
PUBLIC_URL="https://impacta.pinguinoseguro.cl"
FRONTEND_ROOT="/var/www/impacta.pinguinoseguro.cl"
NGINX_CONFIG="/etc/nginx/conf.d/impacta.pinguinoseguro.cl.conf"
COMPOSE_FILES=(-f "$REPO_ROOT/docker-compose.yml" -f "$REPO_ROOT/docker-compose.prod.yml")
COMPOSE=(sudo docker compose "${COMPOSE_FILES[@]}")

log()  { printf '[despliegue] %s\n' "$*"; }
ok()   { printf '[ correcto ] %s\n' "$*"; }
die()  { printf '[ ERROR ] %s\n' "$*" >&2; exit 1; }
compose() { "${COMPOSE[@]}" "$@"; }
env_value() {
  local key="$1"
  sed -n "s/^${key}=//p" "$REPO_ROOT/.env" | tail -n 1 \
    | sed 's/[[:space:]]*#.*$//' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

require_repo_root() {
  [[ -f "$REPO_ROOT/frontend/package.json" && -f "$REPO_ROOT/backend/package.json" ]] \
    || die "No encuentro frontend/ y backend/ bajo $REPO_ROOT"
}

require_backend_host() {
  local actual
  actual="$(hostname -s)"
  [[ "$actual" == "$BACKEND_HOST" ]] \
    || die "Este comando debe ejecutarse en $BACKEND_HOST; host actual: $actual"
  ip -o -4 addr show | grep -Fq "$BACKEND_BIND_IP/" \
    || die "La IP privada $BACKEND_BIND_IP no está asignada en $actual"
}

require_secrets() {
  local secret docker_url db_password
  [[ -r "$REPO_ROOT/.env" ]] || die "Falta $REPO_ROOT/.env en Fenix"
  secret="$(env_value JWT_SECRET)"
  [[ -n "$secret" && "$secret" != PENDIENTE* && "$secret" != changeme* ]] \
    || die "JWT_SECRET está vacío o conserva un valor de ejemplo"
  db_password="$(env_value POSTGRES_PASSWORD)"
  [[ -n "$db_password" && "$db_password" != impacta_pass && "$db_password" != PENDIENTE* ]] \
    || die "Define POSTGRES_PASSWORD en .env y confirma que coincide con el rol PostgreSQL ya existente"
  docker_url="$(env_value DATABASE_URL_DOCKER)"
  [[ "$docker_url" == *'@postgres:5432/impacta'* ]] \
    || die "DATABASE_URL_DOCKER debe apuntar al servicio interno postgres:5432/impacta"
}

require_data_services_healthy() {
  local service state
  for service in impacta-db impacta-redis; do
    state="$(sudo docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$service" 2>/dev/null || true)"
    [[ "$state" == healthy || "$state" == running ]] \
      || die "$service no está disponible (estado: ${state:-desconocido}); no lo reinicio automáticamente"
  done
}

release_id() {
  local revision
  revision="$(git -C "$REPO_ROOT" rev-parse --short=12 HEAD)"
  printf 'release-%s-%s' "$revision" "$(date -u +%Y%m%dT%H%M%SZ)"
}

prepare_frontend_build() {
  require_repo_root
  [[ -z "${VITE_API_URL:-}" || "$VITE_API_URL" == /api ]] \
    || die "Producción debe usar la API del mismo dominio; VITE_API_URL debe estar vacío o ser /api"
  log "Instalando dependencias bloqueadas y compilando frontend/ para producción..."
  (
    cd "$REPO_ROOT/frontend"
    npm ci --include=dev --silent
    NODE_ENV=production npm run build
  )
  [[ -s "$REPO_ROOT/frontend/dist/index.html" ]] || die "El build no generó frontend/dist/index.html"
  ok "Build listo; solo se copiará frontend/dist/, nunca el .env ni el código backend"
}

deploy_frontend() {
  local id remote_release
  prepare_frontend_build
  id="$(release_id)"
  remote_release="$FRONTEND_ROOT/releases/$id"
  log "Publicando archivos estáticos en $FRONTEND_HOST:$remote_release ..."
  ssh -o BatchMode=yes "$FRONTEND_HOST" "mkdir -p '$remote_release'"
  rsync -az --delete "$REPO_ROOT/frontend/dist/" "$FRONTEND_HOST:$remote_release/"
  scp -q "$REPO_ROOT/infra/nginx/impacta.pinguinoseguro.cl.conf" "$FRONTEND_HOST:/tmp/impacta-$id.conf"
  ssh -o BatchMode=yes "$FRONTEND_HOST" bash -s -- "$FRONTEND_ROOT" "$remote_release" "$NGINX_CONFIG" "/tmp/impacta-$id.conf" <<'REMOTE'
set -Eeuo pipefail
root="$1"
release="$2"
nginx_config="$3"
candidate="$4"
current="$root/current"
trap 'rm -f "$candidate"' EXIT

[[ -s "$release/index.html" ]] || { echo 'El release no contiene index.html' >&2; exit 1; }
mkdir -p "$root/releases"

# Migración conservadora desde la carpeta estática actual a un release inicial.
if [[ ! -L "$current" ]]; then
  legacy="$root/releases/legacy-$(date -u +%Y%m%dT%H%M%SZ)"
  mkdir -p "$legacy"
  rsync -a --exclude='/releases/' --exclude='/current' "$root/" "$legacy/"
  [[ -s "$legacy/index.html" ]] || { echo 'No hay frontend anterior para inicializar current' >&2; exit 1; }
  ln -s "${legacy#"$root"/}" "$root/current.next"
  mv -Tf "$root/current.next" "$current"
fi

# Cambia el enlace en el mismo sistema de archivos: Nginx ve el release completo.
ln -s "${release#"$root"/}" "$root/current.next"
mv -Tf "$root/current.next" "$current"

if ! sudo cmp -s "$candidate" "$nginx_config"; then
  sudo install -o root -g root -m 0644 "$candidate" "$nginx_config"
  sudo nginx -t
  sudo systemctl reload nginx
fi
REMOTE
  ok "Frontend publicado en $FRONTEND_HOST; release $id"
  log "Para volver atrás, indica el ID del release anterior a frontend-rollback."
}

rollback_frontend() {
  local id="${2:-}"
  [[ "$id" =~ ^release-[A-Za-z0-9._-]+$ || "$id" =~ ^legacy-[0-9TZ]+$ ]] \
    || die "Indica un identificador existente, por ejemplo release-a1b2c3d4-20261106T120000Z"
  ssh -o BatchMode=yes "$FRONTEND_HOST" bash -s -- "$FRONTEND_ROOT" "$id" <<'REMOTE'
set -Eeuo pipefail
root="$1"
id="$2"
[[ -s "$root/releases/$id/index.html" ]] || { echo "Release inexistente: $id" >&2; exit 1; }
ln -s "releases/$id" "$root/current.next"
mv -Tf "$root/current.next" "$root/current"
REMOTE
  ok "Frontend revertido al release $id"
}

list_frontend_releases() {
  ssh -o BatchMode=yes "$FRONTEND_HOST" bash -s -- "$FRONTEND_ROOT" <<'REMOTE'
set -Eeuo pipefail
root="$1"
printf 'Activo: '
readlink "$root/current" || true
find "$root/releases" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -r
REMOTE
}

run_migrations() {
  require_repo_root
  require_backend_host
  require_secrets
  require_data_services_healthy
  log "Construyendo imagen de API para aplicar una sola vez las migraciones del esquema compartido..."
  compose build backend
  compose run --rm --no-deps backend npx prisma migrate deploy
  ok "Migraciones aplicadas a la base multi-tenant compartida; no se ejecutan por organización"
}

deploy_backend() {
  require_repo_root
  require_backend_host
  require_secrets
  require_data_services_healthy
  log "Construyendo la API y comprobando el estado de migraciones antes del cambio..."
  compose build backend
  compose run --rm --no-deps backend npx prisma migrate status
  log "Actualizando solo el servicio backend; PostgreSQL y Redis no se recrean"
  compose up -d --no-deps backend
  for _ in $(seq 1 30); do
    if curl -fsS --max-time 2 "http://$BACKEND_BIND_IP:$BACKEND_PORT/organizations/public-stats" >/dev/null; then
      ok "API operativa en $BACKEND_BIND_IP:$BACKEND_PORT"
      return
    fi
    sleep 2
  done
  die "La API no respondió; revisar con: sudo docker logs impacta-backend"
}

verify() {
  require_backend_host
  local fails=0 code stats compose_status
  log "Comprobando contenedor backend en Fenix..."
  compose_status="$(compose ps --status running --services backend)"
  if [[ "$compose_status" == *backend* ]]; then ok "backend activo en Fenix"; else log "FALLO: backend no está activo"; fails=$((fails+1)); fi

  log "Comprobando API por la interfaz privada de WireGuard..."
  stats="$(curl -fsS --max-time 5 "http://$BACKEND_BIND_IP:$BACKEND_PORT/organizations/public-stats" || true)"
  if [[ "$stats" == *speciesCount* ]]; then ok "API privada responde"; else log "FALLO: API privada sin respuesta válida"; fails=$((fails+1)); fi

  log "Comprobando frontend público en $PUBLIC_URL..."
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$PUBLIC_URL/" || true)"
  if [[ "$code" == 200 ]]; then ok "frontend en Kingu responde 200"; else log "FALLO: frontend devuelve ${code:-sin respuesta}"; fails=$((fails+1)); fi

  log "Comprobando API pública en el mismo dominio..."
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$PUBLIC_URL/api/organizations/public-stats" || true)"
  if [[ "$code" == 200 ]]; then ok "proxy Kingu → Fenix responde 200"; else log "FALLO: API pública devuelve ${code:-sin respuesta}"; fails=$((fails+1)); fi

  [[ $fails -eq 0 ]] || die "Verificación con $fails fallo(s)"
  ok "Verificación de ambas capas completada; no se escribieron datos de organizaciones"
}

case "${1:-}" in
  frontend) deploy_frontend ;;
  frontend-list) list_frontend_releases ;;
  frontend-rollback) rollback_frontend "$@" ;;
  backend) deploy_backend ;;
  migrate) run_migrations ;;
  verify) verify ;;
  *)
    echo "Uso: $0 {frontend|frontend-list|frontend-rollback <release>|backend|migrate|verify}"
    exit 1
    ;;
esac
