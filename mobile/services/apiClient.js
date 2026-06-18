import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  Constants.expoConfig?.extra?.apiBaseUrl ??
  "http://localhost:8000/api";

const TOKEN_KEY = "identipet.jwt";

export async function setAuthToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getPetProfileByNfcCode(uniqueCode) {
  return apiRequest(`/nfc-tags/${encodeURIComponent(uniqueCode)}/pet-profile/`);
}

export function postOfflineSync(payload) {
  return apiRequest("/offline-sync/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
