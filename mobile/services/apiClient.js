import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL ??
    Constants.expoConfig?.extra?.apiBaseUrl ??
    "http://localhost:8000/api").replace(/\/$/, "");

const TOKEN_KEY = "identipet.jwt";

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function setAuthToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = await getAuthToken();
  const body = options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    if (response.status === 401) {
      await clearAuthToken();
    }
    const fieldErrors = error.error?.fields
      ? Object.entries(error.error.fields)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join(" ")
      : "";
    throw new ApiError(fieldErrors || error.detail || `HTTP ${response.status}`, {
      status: response.status,
      payload: error,
    });
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function requestToken(credentials) {
  const session = await apiRequest("/auth/token/", {
    method: "POST",
    body: credentials,
  });
  await setAuthToken(session.access);
  return session;
}

export function getCurrentUser() {
  return apiRequest("/me/");
}

export function getPetProfileByNfcCode(uniqueCode) {
  return apiRequest(`/nfc-tags/${encodeURIComponent(uniqueCode)}/pet-profile/`);
}

export function logFieldScan(payload) {
  return apiRequest("/scans/", {
    method: "POST",
    body: payload,
  });
}

export function postOfflineSync(payload) {
  return apiRequest("/offline-sync/", {
    method: "POST",
    body: payload,
  });
}
