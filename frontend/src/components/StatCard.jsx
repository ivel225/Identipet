export default function StatCard({ label, value, detail, icon: Icon }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-md bg-skywash p-2 text-clinic">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm text-slate-500">{detail}</p> : null}
    </article>
  );
}
