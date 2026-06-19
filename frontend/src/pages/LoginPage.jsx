import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail, PawPrint, Radio, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(credentials);
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (caught) {
      setError(caught.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-6 sm:px-6 lg:px-8">
      <section className="glass-shell grid w-full max-w-6xl overflow-hidden rounded-[1.5rem] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="field-grid relative hidden min-h-[620px] border-r border-cyan-100/10 p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 p-3 text-clinic shadow-sm shadow-cyan-950/30">
                <PawPrint className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-white">IDentiPet</p>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Secure access</p>
            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-[1.02] tracking-tight text-white">
              Pet records, NFC tags, and field scans.
            </h1>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "RBAC", value: "Role-secured" },
                { label: "NFC", value: "NTAG215 ready" },
                { label: "Sync", value: "Offline queues" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-cyan-100/12 bg-slate-950/26 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-cyan-100/12 bg-cyan-300/8 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-300/12 text-emerald-200">
                    <Radio className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Field scan network</p>
                  </div>
                </div>
                <span className="inline-flex min-h-8 items-center rounded-xl border border-emerald-300/20 bg-emerald-300/12 px-2.5 text-xs font-bold text-emerald-100">
                  Active
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-950/40">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid place-items-center p-5 sm:p-8 lg:p-10">
          <form className="grid w-full max-w-md gap-5" onSubmit={handleSubmit}>
            <div className="lg:hidden">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-clinic">
                  <PawPrint className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">IDentiPet</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Dashboard</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">Log in</h2>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-emerald-300/16 bg-emerald-300/10 p-3 text-sm text-emerald-50">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
              <p>Authorized access only.</p>
            </div>

            <FormField
              autoComplete="email"
              icon={Mail}
              id="email"
              inputMode="email"
              label="Email address"
              onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
              placeholder="admin@example.com"
              required
              type="email"
              value={credentials.email}
            />
            <FormField
              action={
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="grid h-8 w-8 place-items-center rounded-xl text-slate-300 transition hover:bg-white/8 hover:text-white"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              }
              autoComplete="current-password"
              hint="Required"
              icon={LockKeyhole}
              id="password"
              label="Password"
              onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
              required
              type={showPassword ? "text" : "password"}
              value={credentials.password}
            />

            {error ? (
              <p className="rounded-2xl border border-red-300/18 bg-red-400/12 px-3 py-2 text-sm text-red-100" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              className="w-full"
              disabled={isSubmitting}
              icon={isSubmitting ? LoaderCircle : LogIn}
              iconClassName={isSubmitting ? "animate-spin" : ""}
              type="submit"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-center text-xs leading-5 text-slate-400">
              Keep credentials private on shared devices.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
