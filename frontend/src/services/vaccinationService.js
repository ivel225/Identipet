import { apiRequest, endpoints } from "./apiClient.js";

export function getVaccinationRecords() {
  return apiRequest(endpoints.vaccinationRecords);
}

export function saveVaccinationRecord(payload, recordId = null) {
  return apiRequest(
    recordId ? `${endpoints.vaccinationRecords}${recordId}/` : endpoints.vaccinationRecords,
    {
      method: recordId ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    },
  );
}
