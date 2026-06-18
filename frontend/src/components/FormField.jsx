export default function FormField({ label, id, type = "text", as = "input", ...props }) {
  const Control = as;

  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={id}>
      {label}
      <Control
        id={id}
        type={as === "input" ? type : undefined}
        className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-clinic/20 transition focus:border-clinic focus:ring-4"
        {...props}
      />
    </label>
  );
}
