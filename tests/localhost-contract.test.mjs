import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const requiredPaths = [
  "LOCALHOST_SETUP.md",
  "scripts/init-local-db.ps1",
  "scripts/start-backend.ps1",
  "scripts/start-frontend.ps1",
  "scripts/start-mobile.ps1",
  "backend/.env.local.example",
  "frontend/.env.local.example",
  "mobile/.env.local.example",
];

const missing = requiredPaths.filter((path) => !existsSync(join(root, path)));
assert.deepEqual(missing, []);

const localGuide = readFileSync(join(root, "LOCALHOST_SETUP.md"), "utf8");
assert.match(localGuide, /SQLite/);
assert.match(localGuide, /start-backend\.ps1/);
assert.match(localGuide, /start-frontend\.ps1/);
assert.match(localGuide, /Optional PostgreSQL Mode/);

const rootPackage = readFileSync(join(root, "package.json"), "utf8");
assert.match(rootPackage, /local:init-db/);
assert.match(rootPackage, /local:backend/);
assert.match(rootPackage, /local:frontend/);
assert.match(rootPackage, /local:mobile/);

const frontendEnv = readFileSync(join(root, "frontend/.env.local.example"), "utf8");
assert.match(frontendEnv, /VITE_API_BASE_URL=http:\/\/localhost:8000\/api/);

const mobileEnv = readFileSync(join(root, "mobile/.env.local.example"), "utf8");
assert.match(mobileEnv, /EXPO_PUBLIC_API_BASE_URL=http:\/\/localhost:8000\/api/);
