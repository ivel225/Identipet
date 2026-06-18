export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-3xl text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
