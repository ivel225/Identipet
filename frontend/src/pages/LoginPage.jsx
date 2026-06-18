import { LogIn, PawPrint, ShieldCheck } from "lucide-react";
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

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(credentials);
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (caught) {
      setError(caught.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <form className="glass-shell grid w-full max-w-md gap-5 rounded-[1.25rem] p-6" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-clinic">
            <PawPrint className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">IDentiPet</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Dashboard Sign In</h1>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-300/16 bg-emerald-300/10 p-3 text-sm text-emerald-50">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          <p>Authorized Administrator and Veterinary Staff access only.</p>
        </div>
        <FormField label="Email" id="email" type="email" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} required />
        <FormField label="Password" id="password" type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} required />
        {error ? <p className="rounded-2xl border border-red-300/18 bg-red-400/12 px-3 py-2 text-sm text-red-100">{error}</p> : null}
        <Button icon={LogIn} type="submit">Sign In</Button>
      </form>
    </main>
  );
}
