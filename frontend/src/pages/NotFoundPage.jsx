import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <div className="rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
        <Link className="mt-4 inline-block text-sm font-semibold text-clinic" to="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
