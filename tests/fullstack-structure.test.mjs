import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const requiredPaths = [
  "frontend/public",
  "frontend/src/assets",
  "frontend/src/components",
  "frontend/src/pages",
  "frontend/src/hooks",
  "frontend/src/context",
  "frontend/src/services",
  "frontend/src/utils",
  "frontend/src/App.jsx",
  "frontend/src/main.jsx",
  "frontend/src/index.css",
  "frontend/vite.config.js",
  "backend/src/config",
  "backend/src/controllers",
  "backend/src/models",
  "backend/src/routes",
  "backend/src/middleware",
  "backend/src/services",
  "backend/src/utils",
  "backend/src/app.py",
  "backend/src/server.py",
  "backend/manage.py",
  "backend/build.sh",
  "backend/runtime.txt",
  "mobile/app/_layout.js",
  "mobile/app/index.js",
  "mobile/app/pet-profile.js",
  "mobile/app/offline-sync.js",
  "mobile/components/ScanPrompt.styles.js",
  "mobile/services/nfcService.js",
  "mobile/services/offlineStorage.js",
  "mobile/eas.json",
  "database/schema.sql",
  "database/supabase_hardening.sql",
  "frontend/vercel.json",
  "render.yaml",
  "CLOUD_DEPLOYMENT.md",
  ".env.example",
  ".gitignore",
  "package.json",
  "README.md",
];

const missing = requiredPaths.filter((path) => !existsSync(join(root, path)));
assert.deepEqual(missing, []);

const readme = readFileSync(join(root, "README.md"), "utf8");
assert.match(readme, /FRONTEND/);
assert.match(readme, /BACKEND/);
assert.match(readme, /DATABASE/);

const schema = readFileSync(join(root, "database/schema.sql"), "utf8");
assert.match(schema, /CREATE TABLE users/);
assert.match(schema, /CREATE TABLE owners/);
assert.match(schema, /CREATE TABLE pets/);
assert.match(schema, /CREATE TABLE nfc_tags/);
assert.match(schema, /CREATE TABLE vaccination_records/);
assert.match(schema, /CREATE TABLE scan_history/);
