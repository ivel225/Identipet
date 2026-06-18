import { apiRequest, endpoints } from "./apiClient.js";

export function getScanLogs() {
  return apiRequest(endpoints.scanHistory);
}

export function logScan(payload) {
  return apiRequest(endpoints.scanLogs, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
