import { apiRequest, endpoints } from "./apiClient.js";

export function getOwners() {
  return apiRequest(endpoints.owners);
}

export function saveOwner(payload, ownerId = null) {
  return apiRequest(ownerId ? `${endpoints.owners}${ownerId}/` : endpoints.owners, {
    method: ownerId ? "PATCH" : "POST",
    body: JSON.stringify(payload),
  });
}
