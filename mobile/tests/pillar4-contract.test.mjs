import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const mobileRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const requiredPaths = [
  "app/_layout.js",
  "app/index.js",
  "app/pet-profile.js",
  "app/offline-sync.js",
  "components/ScanPrompt.jsx",
  "components/ScanPrompt.styles.js",
  "components/PetProfileCard.jsx",
  "components/PetProfileCard.styles.js",
  "components/OfflineSyncPanel.jsx",
  "components/OfflineSyncPanel.styles.js",
  "components/StatusBanner.jsx",
  "components/StatusBanner.styles.js",
  "services/apiClient.js",
  "services/nfcService.js",
  "services/offlineStorage.js",
  "services/syncService.js",
  "hooks/useNetworkStatus.js",
  "hooks/useNfcScanner.js",
  "app.json",
  "eas.json",
  "package.json",
  "README.md",
];

const missing = requiredPaths.filter((path) => !existsSync(join(mobileRoot, path)));
assert.deepEqual(missing, []);

const nfcService = readFileSync(join(mobileRoot, "services/nfcService.js"), "utf8");
assert.match(nfcService, /react-native-nfc-manager/);
assert.match(nfcService, /NfcTech/);

const offlineStorage = readFileSync(join(mobileRoot, "services/offlineStorage.js"), "utf8");
assert.match(offlineStorage, /@react-native-async-storage\/async-storage/);
assert.match(offlineStorage, /queueScanLog/);
assert.match(offlineStorage, /cachePetProfile/);

const syncService = readFileSync(join(mobileRoot, "services/syncService.js"), "utf8");
assert.match(syncService, /flushOfflineQueue/);

const apiClient = readFileSync(join(mobileRoot, "services/apiClient.js"), "utf8");
assert.match(apiClient, /\/offline-sync\//);

const eas = readFileSync(join(mobileRoot, "eas.json"), "utf8");
assert.match(eas, /"buildType": "apk"/);
