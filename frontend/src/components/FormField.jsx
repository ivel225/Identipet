export default function FormField({ label, id, type = "text", as = "input", ...props }) {
  const Control = as;

  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-200" htmlFor={id}>
      {label}
      <Control
        id={id}
        type={as === "input" ? type : undefined}
        className="min-h-11 rounded-2xl border border-cyan-100/14 bg-slate-950/30 px-3 py-2 text-sm text-white outline-none ring-clinic/20 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
        {...props}
      />
    </label>
  );
}
