const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/$/, "");
const AUTH_STORAGE_KEY = "identipet.auth";

function getToken() {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY))?.access;
  } catch {
    return null;
  }
}

export class ApiRequestError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
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
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("identipet:auth-expired"));
    }
    const fieldErrors = error.error?.fields
      ? Object.entries(error.error.fields)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join(" ")
      : "";
    throw new ApiRequestError(fieldErrors || error.detail || "API request failed", {
      status: response.status,
      payload: error,
    });
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const endpoints = {
  owners: "/owners/",
  users: "/users/",
  pets: "/pets/",
  nfcTags: "/nfc-tags/",
  vaccinationRecords: "/vaccination-records/",
  scanLogs: "/scans/",
  scanHistory: "/scan-history/",
};
