# IDentiPet Fully Cloud-Based Deployment

This version removes the need for local Docker or local PostgreSQL.

## Cloud Stack

- Database: Supabase hosted PostgreSQL.
- Backend API: Render web service running Django REST Framework.
- Web dashboard: Vercel static Vite React deployment.
- Mobile app: Expo EAS cloud builds for Android APK installers.

## 1. Supabase PostgreSQL

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `database/schema.sql`.
4. Run `database/supabase_hardening.sql` if the tables are in the public schema
   and you do not want them exposed through Supabase's Data API.
5. Copy the database connection string from Supabase.

Use this value as `DATABASE_URL` in the backend cloud service:

```text
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## 2. Render Django API

1. Push `outputs/identipet` to a GitHub repository.
2. In Render, create a Blueprint from the repository.
3. Use the included `render.yaml`.
4. Set these environment variables:

```text
DATABASE_URL=<Supabase connection string>
DATABASE_SSL_REQUIRE=true
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=<your-render-service>.onrender.com
DJANGO_CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
```

Render will generate `DJANGO_SECRET_KEY` and `IDENTIPET_JWT_SECRET` from the
blueprint.

## 3. Vercel React Dashboard

1. Import the same GitHub repository in Vercel.
2. Set the project root directory to `frontend`.
3. Set this environment variable:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

4. Deploy.

## 4. Expo EAS Android APK

1. Open the `mobile` folder locally or in a cloud CI runner.
2. Set:

```text
EXPO_PUBLIC_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

3. Build the APK:

```bash
npm install
npm run build:apk
```

The `apk` build profile is defined in `mobile/eas.json`.

## Cloud Data Flow

```text
React dashboard / Expo mobile app
  -> Render Django REST API
  -> Supabase PostgreSQL
```

Field scans can still work offline on mobile. Queued scan logs are pushed to the
Render API when connectivity returns.
