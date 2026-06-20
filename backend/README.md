# IDentiPet Backend

This service is the Django REST Framework API for IDentiPet.

## Local Setup

The local backend uses SQLite by default so it can run without Docker or local
PostgreSQL.

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate --run-syncdb
.\.venv\Scripts\python.exe manage.py create_superadmin --email admin@example.com --password "ChangeThisPassword123!" --name "System Administrator"
.\.venv\Scripts\python.exe manage.py create_django_admin --username backendadmin --email backendadmin@example.com --password "ChangeThisPassword123!"
.\.venv\Scripts\python.exe manage.py runserver
```

## Production Readiness

Production mode requires PostgreSQL and explicit secrets. Copy
`.env.production.example` into your cloud provider's environment variables.

Required deployment settings:

- `DJANGO_DEBUG=false`
- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `USE_DATABASE_URL=true`
- `DATABASE_URL`
- `DATABASE_SSL_REQUIRE=true`
- `IDENTIPET_JWT_SECRET`

Before deploying, run:

```bash
python manage.py check --deploy
python manage.py check_deploy_ready
```

The production start script runs:

```bash
python manage.py migrate --run-syncdb --noinput
python manage.py check --deploy
python manage.py check_deploy_ready
gunicorn identipet_backend.asgi:application -k uvicorn.workers.UvicornWorker
```

If `IDENTIPET_SUPERADMIN_EMAIL` and `IDENTIPET_SUPERADMIN_PASSWORD` are set,
`start.sh` also creates or updates the first Administrator account.

If `DJANGO_ADMIN_USERNAME` and `DJANGO_ADMIN_PASSWORD` are set, `start.sh` also
creates or updates a Django Admin account for the backend database editor.

## Main Endpoints

- `GET /` opens the backend service page.
- `GET /admin/` opens the Django Admin database editor.
- `GET /api/` opens the API resource index.
- `GET /api/docs/` opens the backend API documentation page.
- `GET /api/health/` checks API and database health.
- `POST /api/auth/token/` obtains a JWT.
- `GET|POST /api/users/` manages system user accounts. Administrator only.
- `GET|POST /api/owners/` and `/api/owners/{id}/` manage owners.
- `GET|POST /api/pets/` and `/api/pets/{id}/` manage pets.
- `GET|POST /api/vaccination-records/` and `/api/vaccination-records/{id}/`
  manage vaccination records.
- `GET /api/nfc-tags/{unique_code}/pet-profile/` returns the pet profile for an
  NFC NTAG215 code.
- `POST /api/scans/` logs a field scan.
- `GET /api/scan-history/` lists scan logs for dashboard users.
- `POST /api/offline-sync/` accepts bulk offline payloads from mobile clients.

## Create Superadmin

After the database schema exists, create the first dashboard administrator with:

```bash
python manage.py create_superadmin --email admin@example.com --password "ChangeThisPassword123!" --name "System Administrator"
```

Remove the bootstrap superadmin environment variables after the first successful
deployment if you do not want future deploys to update that account.

For cloud hosts, set these environment variables and run the same command without
arguments:

```text
IDENTIPET_SUPERADMIN_EMAIL=admin@example.com
IDENTIPET_SUPERADMIN_PASSWORD=ChangeThisPassword123!
IDENTIPET_SUPERADMIN_NAME=System Administrator
```

## Backend Database Editor

Django Admin is available at:

```text
http://127.0.0.1:8000/admin/
```

This login is separate from the IDentiPet dashboard login. Use it when you want
to directly view, create, edit, or delete backend data such as IDentiPet users,
owners, pets, NFC tags, vaccination records, and scan history.

Create the Django Admin backend account with:

```bash
python manage.py create_django_admin --username backendadmin --email backendadmin@example.com --password "ChangeThisPassword123!"
```

The React dashboard account is created with `create_superadmin`. The Django Admin
backend account is created with `create_django_admin`.
