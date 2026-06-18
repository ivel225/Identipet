export default function Button({ children, icon: Icon, className = "", ...props }) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-clinic px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
