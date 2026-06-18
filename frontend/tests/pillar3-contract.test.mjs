import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const projectRoot = dirname(frontendRoot);

const requiredFrontendFiles = [
  "src/features/owners/OwnerForm.jsx",
  "src/features/pets/PetForm.jsx",
  "src/features/nfc-tags/NfcTagAssignmentForm.jsx",
  "src/features/registrations/RegistrationWorkspace.jsx",
  "src/features/maps/HouseholdMap.jsx",
  "src/features/scans/ScanLogPanel.jsx",
  "src/features/vaccinations/VaccinationSchedule.jsx",
  "src/services/ownerService.js",
  "src/services/petService.js",
  "src/services/nfcTagService.js",
  "src/services/scanService.js",
  "src/services/vaccinationService.js",
];

const missingFrontendFiles = requiredFrontendFiles.filter((path) => {
  return !existsSync(join(frontendRoot, path));
});
assert.deepEqual(missingFrontendFiles, []);

const app = readFileSync(join(frontendRoot, "src/App.jsx"), "utf8");
assert.match(app, /ADMIN_DASHBOARD_ROLES/);
assert.match(app, /ProtectedRoute/);

const dashboardService = readFileSync(
  join(frontendRoot, "src/services/dashboardService.js"),
  "utf8",
);
assert.match(dashboardService, /getScanLogs/);
assert.match(dashboardService, /getVaccinationRecords/);
assert.match(dashboardService, /getOwners/);

const apiClient = readFileSync(join(frontendRoot, "src/services/apiClient.js"), "utf8");
assert.match(apiClient, /scanHistory: "\/scan-history\/"/);

const backendViews = readFileSync(join(projectRoot, "backend/api/views.py"), "utf8");
assert.match(backendViews, /class ScanHistoryViewSet/);

const backendUrls = readFileSync(join(projectRoot, "backend/api/urls.py"), "utf8");
assert.match(backendUrls, /router\.register\("scan-history"/);
