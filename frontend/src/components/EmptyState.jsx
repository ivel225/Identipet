import { ClipboardList } from "lucide-react";

export default function EmptyState({
  title = "No records yet",
  description = "New activity will appear here when data is available.",
  icon: Icon = ClipboardList,
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cyan-100/20 bg-slate-950/20 px-4 py-8 text-center">
      <div className="rounded-2xl bg-cyan-300/12 p-3 text-cyan-200 ring-1 ring-cyan-100/10">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-300">{description}</p>
      </div>
    </div>
  );
}
