import { createContext, useMemo, useState } from "react";

import { requestToken } from "../services/authService.js";

export const AuthContext = createContext(null);

const STORAGE_KEY = "identipet.auth";

function loadStoredSession() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadStoredSession);

  async function login(credentials) {
    const nextSession = await requestToken(credentials);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  const value = useMemo(
    () => ({
      token: session?.access ?? null,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.access),
      login,
      logout,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
