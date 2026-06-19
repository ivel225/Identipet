export default function Button({ children, icon: Icon, iconClassName = "", className = "", ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-clinic px-4 py-2 text-sm font-bold text-white shadow-sm shadow-cyan-950/20 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {Icon ? <Icon className={`h-4 w-4 ${iconClassName}`} aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
