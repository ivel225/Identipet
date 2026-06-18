import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const requiredFiles = [
  "src/components/EmptyState.jsx",
  "src/components/LoadingState.jsx",
  "src/components/SectionPanel.jsx",
  "src/components/StatusBadge.jsx",
  "src/features/dashboard/DashboardSummary.jsx",
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));
assert.deepEqual(missing, []);

const dashboardPage = readFileSync(join(root, "src/pages/DashboardPage.jsx"), "utf8");
assert.match(dashboardPage, /DashboardSummary/);
assert.match(dashboardPage, /SectionPanel/);
assert.match(dashboardPage, /LoadingState/);
assert.match(dashboardPage, /EmptyState/);

const dataTable = readFileSync(join(root, "src/components/DataTable.jsx"), "utf8");
assert.match(dataTable, /EmptyState/);
assert.match(dataTable, /aria-label/);

const indexCss = readFileSync(join(root, "src/index.css"), "utf8");
assert.match(indexCss, /--color-ink/);
assert.match(indexCss, /--color-clinic/);
assert.match(indexCss, /--color-panel/);
assert.match(indexCss, /glass-shell/);
assert.match(indexCss, /glass-panel/);
assert.match(indexCss, /focus-visible/);

const app = readFileSync(join(root, "src/App.jsx"), "utf8");
assert.match(app, /Navigate to="\/login"/);
