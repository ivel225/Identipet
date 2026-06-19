import { apiRequest, endpoints } from "./apiClient.js";

export function getUsers() {
  return apiRequest(endpoints.users);
}

export function createUser(payload) {
  return apiRequest(endpoints.users, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
