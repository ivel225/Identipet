# IDentiPet Backend Pillar

This service is the Django REST Framework API for IDentiPet.

## Setup

1. Start PostgreSQL with the database pillar.
2. Create a Python virtual environment.
3. Install dependencies with `pip install -r requirements.txt`.
4. Copy `.env.example` to `.env` and set production-safe secrets.
5. Run the SQL scripts from `../database/init` before starting the API.
6. Start Django with `python manage.py runserver`.

The database SQL remains the source of truth. Django models map onto the exact
table and column names created by Pillar 1.

## Main Endpoints

- `POST /api/auth/token/` obtains a JWT.
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

For cloud hosts, set these environment variables and run the same command without
arguments:

```text
IDENTIPET_SUPERADMIN_EMAIL=admin@example.com
IDENTIPET_SUPERADMIN_PASSWORD=ChangeThisPassword123!
IDENTIPET_SUPERADMIN_NAME=System Administrator
```
