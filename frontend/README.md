# IDentiPet Web Frontend

React + Tailwind CSS admin dashboard for Administrator and Veterinary Staff
workflows.

## Structure

- `public/` static files and assets served as-is.
- `src/assets/` images, fonts, icons, and static UI assets.
- `src/components/` reusable UI components.
- `src/layout/` protected dashboard shell and route guards.
- `src/pages/` routed application pages.
- `src/features/` domain modules for scans, maps, schedules, and registration.
- `src/hooks/` custom React hooks.
- `src/context/` global auth context.
- `src/redux/` Redux store and slices.
- `src/services/` backend API clients.
- `src/utils/` helpers and constants.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run test:structure
npm run test:pillar3
npm run test:design
npm run build
```

## Environment

Local:

```text
VITE_API_BASE_URL=http://localhost:8000/api
```

Production:

```text
VITE_API_BASE_URL=https://your-api.example.com/api
```

The value must point to the deployed Django backend `/api` base path.

## Production Workflows

- `/login` obtains a JWT from the backend.
- `/dashboard` loads owners, pets, vaccinations, and scan history.
- `/dashboard/users` lets Administrators create user accounts.
- `/dashboard/owners` creates, updates, and lists owners.
- `/dashboard/pets` creates, updates, and lists pets.
- `/dashboard/vaccinations` creates, updates, and lists vaccination records.
- `/dashboard/nfc-tags` creates, updates, and lists NFC tag assignments.

The API client clears expired sessions on `401` responses and surfaces backend
validation messages in the forms.
