import { Activity, LogOut, MapPin, PawPrint, Radio, ShieldCheck, Syringe, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import { ROLES } from "../utils/roles.js";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: Syringe },
  { to: "/dashboard/users", label: "Users", icon: Users, roles: [ROLES.ADMINISTRATOR] },
  { to: "/dashboard/owners", label: "Owners", icon: MapPin },
  { to: "/dashboard/pets", label: "Pets", icon: PawPrint },
  { to: "/dashboard/vaccinations", label: "Vaccinations", icon: Syringe },
  { to: "/dashboard/nfc-tags", label: "NFC Tags", icon: Radio },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const visibleNavigation = navigation.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="min-h-screen p-3 text-slate-100 sm:p-5 lg:p-8">
      <div className="glass-shell mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[1.25rem] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-cyan-100/10 bg-slate-950/22 p-5 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-clinic shadow-sm shadow-cyan-950/20">
              <PawPrint className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-white">IDentiPet</p>
            </div>
          </div>

          <nav className="grid gap-2" aria-label="Primary dashboard navigation">
            {visibleNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-cyan-50 text-slate-950 shadow-sm shadow-cyan-950/20"
                      : "text-cyan-50/76 hover:bg-white/8 hover:text-white"
                  }`
                }
                title={item.label}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-cyan-100/12 bg-cyan-300/8 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/14 text-emerald-200">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Local secure mode</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-cyan-100/10 bg-slate-950/58 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-50 text-clinic lg:hidden">
                  <PawPrint className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">IDentiPet Command</p>
                  <h1 className="text-xl font-bold tracking-tight text-white">{user?.name ?? "User"}</h1>
                  <p className="text-sm text-slate-300">{user?.role ?? "Personnel"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-emerald-300/18 bg-emerald-300/10 px-3 text-sm font-semibold text-emerald-100">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                  Online
                </div>
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-cyan-100/14 bg-white/8 px-3 text-sm font-semibold text-white transition hover:bg-white/12"
                  onClick={logout}
                  title="Sign out"
                  type="button"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </div>
          </header>

          <nav
            className="grid gap-2 border-b border-cyan-100/10 bg-slate-950/36 p-3 lg:hidden"
            style={{ gridTemplateColumns: `repeat(${visibleNavigation.length}, minmax(0, 1fr))` }}
            aria-label="Mobile dashboard navigation"
          >
            {visibleNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `grid min-h-12 place-items-center rounded-2xl text-xs font-semibold transition ${
                    isActive ? "bg-cyan-50 text-slate-950" : "text-cyan-50/76 hover:bg-white/8"
                  }`
                }
                title={item.label}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <main className="field-grid px-4 py-5 sm:px-6 lg:px-7 lg:py-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
