#!/usr/bin/env bash
set -o errexit

python manage.py migrate --run-syncdb --noinput
python manage.py check --deploy
python manage.py check_deploy_ready

if [ -n "$IDENTIPET_SUPERADMIN_EMAIL" ] && [ -n "$IDENTIPET_SUPERADMIN_PASSWORD" ]; then
  python manage.py create_superadmin
fi

if [ -n "$DJANGO_ADMIN_USERNAME" ] && [ -n "$DJANGO_ADMIN_PASSWORD" ]; then
  python manage.py create_django_admin
fi

exec gunicorn identipet_backend.asgi:application \
  -k uvicorn.workers.UvicornWorker \
  --bind "0.0.0.0:${PORT:-8000}" \
  --workers "${WEB_CONCURRENCY:-2}" \
  --timeout "${GUNICORN_TIMEOUT:-60}" \
  --access-logfile - \
  --error-logfile -
