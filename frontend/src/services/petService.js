import { apiRequest, endpoints } from "./apiClient.js";

export function getPets() {
  return apiRequest(endpoints.pets);
}

export function savePet(payload, petId = null) {
  return apiRequest(petId ? `${endpoints.pets}${petId}/` : endpoints.pets, {
    method: petId ? "PATCH" : "POST",
    body: JSON.stringify(payload),
  });
}
