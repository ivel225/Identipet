import { LogOut, MapPin, PawPrint, Radio, Syringe } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: Syringe },
  { to: "/owners", label: "Owners", icon: MapPin },
  { to: "/pets", label: "Pets", icon: PawPrint },
  { to: "/nfc-tags", label: "NFC Tags", icon: Radio },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 md:block">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase text-clinic">IDentiPet</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Admin Console</h2>
        </div>
        <nav className="grid gap-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-clinic text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">{user?.name ?? "User"}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={logout}
              title="Sign out"
              type="button"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
