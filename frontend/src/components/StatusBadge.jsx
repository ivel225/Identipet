const variants = {
  success: "border-emerald-300/24 bg-emerald-300/12 text-emerald-100",
  warning: "border-amber-300/24 bg-amber-300/12 text-amber-100",
  neutral: "border-cyan-100/14 bg-white/8 text-slate-300",
  danger: "border-red-300/24 bg-red-300/12 text-red-100",
  info: "border-cyan-300/24 bg-cyan-300/12 text-cyan-100",
};

export default function StatusBadge({ children, variant = "neutral" }) {
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-lg border px-2 py-0.5 text-xs font-bold ${variants[variant] ?? variants.neutral}`}
    >
      {children}
    </span>
  );
}
