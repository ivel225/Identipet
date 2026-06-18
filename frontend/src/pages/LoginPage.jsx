import { LogIn } from "lucide-react";
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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form className="grid w-full max-w-md gap-5 rounded-md border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div>
          <p className="text-xs font-semibold uppercase text-clinic">IDentiPet</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">Dashboard Sign In</h1>
        </div>
        <FormField label="Email" id="email" type="email" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} required />
        <FormField label="Password" id="password" type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} required />
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <Button icon={LogIn} type="submit">Sign In</Button>
      </form>
    </main>
  );
}
