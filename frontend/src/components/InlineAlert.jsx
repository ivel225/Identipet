export default function InlineAlert({ children, variant = "info" }) {
  const styles = {
    danger: "border-red-300/20 bg-red-400/12 text-red-100",
    success: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
    info: "border-cyan-300/20 bg-cyan-300/12 text-cyan-50",
  };

  if (!children) {
    return null;
  }

  return (
    <p className={`rounded-2xl border px-3 py-2 text-sm ${styles[variant] ?? styles.info}`} role={variant === "danger" ? "alert" : "status"}>
      {children}
    </p>
  );
}
