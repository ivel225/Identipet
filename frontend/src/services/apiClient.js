const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";
const AUTH_STORAGE_KEY = "identipet.auth";

function getToken() {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY))?.access;
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
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
    throw new Error(error.detail ?? "API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const endpoints = {
  owners: "/owners/",
  pets: "/pets/",
  nfcTags: "/nfc-tags/",
  vaccinationRecords: "/vaccination-records/",
  scanLogs: "/scans/",
  scanHistory: "/scan-history/",
};
