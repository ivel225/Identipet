export default function LoadingState({ label = "Loading records" }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-cyan-100/10 bg-slate-950/20">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-200" role="status">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-100/20 border-t-cyan-300" />
        <span>{label}</span>
      </div>
    </div>
  );
}
