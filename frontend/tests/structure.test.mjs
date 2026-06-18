import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const requiredPaths = [
  "public",
  "src/assets",
  "src/components",
  "src/layout",
  "src/pages",
  "src/features",
  "src/hooks",
  "src/context",
  "src/redux",
  "src/services",
  "src/utils",
  "src/App.jsx",
  "src/index.css",
  "src/main.jsx",
  "package.json",
  "vite.config.js",
  "tailwind.config.js",
  "postcss.config.js",
  ".eslintrc.json",
  ".gitignore",
  "README.md",
];

const missing = requiredPaths.filter((path) => !existsSync(join(root, path)));
assert.deepEqual(missing, []);

const app = readFileSync(join(root, "src/App.jsx"), "utf8");
assert.match(app, /ProtectedRoute/);
assert.match(app, /DashboardPage/);
assert.match(app, /OwnersPage/);
assert.match(app, /PetsPage/);
assert.match(app, /NfcTagsPage/);

const services = readFileSync(join(root, "src/services/apiClient.js"), "utf8");
assert.match(services, /vaccination-records/);
assert.match(services, /nfc-tags/);
assert.match(services, /scans/);
