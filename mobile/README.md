# IDentiPet Field Mobile App

Expo React Native app for Field Personnel.

## Core Capabilities

- Logs in with backend JWT credentials stored in `expo-secure-store`.
- Reads NFC NTAG215 collar tags with `react-native-nfc-manager`.
- Queries the backend by NFC `unique_code`.
- Caches pet profiles locally for offline viewing.
- Logs scan history immediately when online and queues failed/offline scans.
- Queues new registration payloads while offline.
- Pushes queued data to `/api/offline-sync/` when connectivity returns.
- Includes an EAS `apk` profile for `.apk` installer builds.

## Run

```bash
npm install
npm start
```

Local API URL:

```text
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Android emulator API URL:

```text
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api
```

Physical phone API URL:

```text
EXPO_PUBLIC_API_BASE_URL=http://YOUR-PC-LAN-IP:8000/api
```

NFC requires a native build because `react-native-nfc-manager` is not available
inside plain Expo Go:

```bash
npm run build:apk
```

Production builds should set:

```text
EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com/api
```
