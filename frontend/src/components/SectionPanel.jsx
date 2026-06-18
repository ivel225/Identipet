export default function SectionPanel({ title, description, action, children, className = "" }) {
  return (
    <section className={`glass-panel rounded-2xl ${className}`}>
      <div className="flex flex-col gap-3 border-b border-cyan-100/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight text-white">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
