# IDentiPet Field Mobile App

Expo React Native app for Field Personnel.

## Core Capabilities

- Reads NFC NTAG215 collar tags with `react-native-nfc-manager`.
- Queries the backend by NFC `unique_code`.
- Caches pet profiles locally for offline viewing.
- Queues scan logs and new registration payloads while offline.
- Pushes queued data to `/api/offline-sync/` when connectivity returns.
- Includes an EAS `apk` profile for `.apk` installer builds.

## Run

```bash
npm install
npm start
```

NFC requires a native build because `react-native-nfc-manager` is not available
inside plain Expo Go:

```bash
npm run build:apk
```
