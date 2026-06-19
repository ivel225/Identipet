export default function FormField({
  label,
  id,
  type = "text",
  as = "input",
  icon: Icon,
  action,
  hint,
  className = "",
  ...props
}) {
  const Control = as;

  return (
    <label className={`grid gap-1.5 text-sm font-semibold text-slate-200 ${className}`} htmlFor={id}>
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        {hint ? <span className="text-xs font-medium text-slate-400">{hint}</span> : null}
      </span>
      <span className="relative block">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-100/58"
            aria-hidden="true"
          />
        ) : null}
        <Control
          id={id}
          type={as === "input" ? type : undefined}
          className={`min-h-11 w-full rounded-2xl border border-cyan-100/14 bg-slate-950/30 py-2 text-sm text-white outline-none ring-clinic/20 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 ${
            Icon ? "pl-10" : "pl-3"
          } ${action ? "pr-12" : "pr-3"}`}
          {...props}
        />
        {action ? <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{action}</span> : null}
      </span>
    </label>
  );
}
