import { apiRequest } from "./apiClient.js";

export function requestToken(credentials) {
  return apiRequest("/auth/token/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
