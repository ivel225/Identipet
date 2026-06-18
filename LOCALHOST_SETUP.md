# IDentiPet Localhost Setup

This guide focuses only on running IDentiPet on your computer.

## Required Installs

- Python 3.11 or 3.12.
- Node.js 20 LTS or newer.
- Git, optional but useful.

PostgreSQL and Docker are not required for the default localhost setup. The
backend uses SQLite locally.

## Folder

Open PowerShell in:

```powershell
cd C:\Users\imelm\Documents\Codex\2026-06-18\act-as-a-full-stack-senior\outputs\identipet
```

## 1. Start Backend

In PowerShell:

```powershell
.\scripts\start-backend.ps1
```

The first run creates `backend\db.sqlite3` automatically.

Backend URL:

```text
http://localhost:8000/api
```

Create the first administrator:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py create_superadmin --email admin@example.com --password "ChangeThisPassword123!" --name "System Administrator"
cd ..
```

## 2. Start Web Dashboard

Open a second PowerShell window:

```powershell
cd C:\Users\imelm\Documents\Codex\2026-06-18\act-as-a-full-stack-senior\outputs\identipet
.\scripts\start-frontend.ps1
```

Web dashboard URL:

```text
http://localhost:5173
```

## 3. Start Mobile App

Open a third PowerShell window:

```powershell
cd C:\Users\imelm\Documents\Codex\2026-06-18\act-as-a-full-stack-senior\outputs\identipet
.\scripts\start-mobile.ps1
```

For Android Emulator, use this API URL inside `mobile\.env.local`:

```text
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api
```

For a physical phone on the same Wi-Fi, use your computer LAN IP:

```text
EXPO_PUBLIC_API_BASE_URL=http://YOUR-PC-LAN-IP:8000/api
```

NFC requires an Android device or native development build. Plain Expo Go does
not support `react-native-nfc-manager`.

## Daily Start Order

1. `.\scripts\start-backend.ps1`
2. `.\scripts\start-frontend.ps1`
3. `.\scripts\start-mobile.ps1`, only when working on mobile.

## Optional PostgreSQL Mode

PostgreSQL scripts are still included for later. To use PostgreSQL instead of
SQLite, set `USE_POSTGRES=true` in `backend\.env.local` and initialize the
database with `.\scripts\init-local-db.ps1`.
