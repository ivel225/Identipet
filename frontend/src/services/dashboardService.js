import { getOwners } from "./ownerService.js";
import { getPets } from "./petService.js";
import { getScanLogs } from "./scanService.js";
import { getVaccinationRecords } from "./vaccinationService.js";

export async function getDashboardData() {
  const [owners, pets, vaccinationRecords, scanLogs] = await Promise.all([
    getOwners(),
    getPets(),
    getVaccinationRecords(),
    getScanLogs(),
  ]);

  return {
    owners: owners.results ?? owners,
    pets: pets.results ?? pets,
    vaccinationRecords: vaccinationRecords.results ?? vaccinationRecords,
    scanLogs: scanLogs.results ?? scanLogs,
  };
}
