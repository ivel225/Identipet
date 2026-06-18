export default function StatCard({ label, value, detail, icon: Icon }) {
  return (
    <article className="glass-panel rounded-2xl p-5 transition hover:border-cyan-200/28">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-300">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-white">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-2xl bg-cyan-300/12 p-3 text-cyan-200 ring-1 ring-cyan-100/10">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm text-slate-400">{detail}</p> : null}
    </article>
  );
}
