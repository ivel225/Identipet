# IDentiPet Full Stack System Structure

IDentiPet is an NFC-enabled pet collar identification and geospatial veterinary
record system.

For a no-local-database deployment, see `CLOUD_DEPLOYMENT.md`.

## FRONTEND

`frontend/` contains the React + Tailwind CSS dashboard for Administrator and
Veterinary Staff users.

- `public/` static files.
- `src/` source code.
- `src/components/` reusable UI components.
- `src/pages/` routed application pages.
- `src/services/` API clients.
- `src/context/` auth and global state context.
- `src/utils/` helper functions.

## BACKEND

`backend/` contains the Django REST Framework API. The project keeps standard
Django files in `identipet_backend/` and `api/`, while `backend/src/` mirrors the
layered structure from the reference diagram:

- `src/config/` Django settings and configuration references.
- `src/controllers/` request handler entry points.
- `src/models/` database model exports.
- `src/routes/` API URL route exports.
- `src/middleware/` JWT authentication and permission middleware concepts.
- `src/services/` domain service helpers for scans and offline sync.
- `src/utils/` shared constants and response helpers.

## DATABASE

`database/` contains PostgreSQL initialization scripts and a consolidated
`schema.sql` entry point. The schema follows the requested 3NF tables:
`users`, `owners`, `pets`, `nfc_tags`, `vaccination_records`, and
`scan_history`.

## MOBILE

`mobile/` contains the Expo React Native app for Field Personnel.

- `app/` Expo Router screens for scanning, pet profile viewing, and offline sync.
- `components/` reusable native components with separate `.styles.js` files.
- `services/` API, NFC, offline storage, and synchronization helpers.
- `hooks/` network and NFC scanner hooks.
- `eas.json` includes an Android `apk` build profile for installer generation.

## How It Works

1. Field or dashboard users interact with the frontend or mobile app.
2. Clients call the Django REST API with JWT authentication.
3. Backend permissions enforce Administrator, Veterinary Staff, and Field
   Personnel access rules.
4. PostgreSQL stores normalized pet, owner, NFC, vaccination, and scan records.
5. API responses return pet profiles, schedules, maps, and scan history to the
   clients.
6. The mobile app caches profiles and queues scans while offline, then syncs
   queued records when connectivity returns.
