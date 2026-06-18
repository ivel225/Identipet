import EmptyState from "./EmptyState.jsx";

export default function DataTable({
  columns,
  rows,
  emptyLabel = "No records found.",
  emptyDescription = "Records will appear here when they are available.",
  ariaLabel = "Data table",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-100/10 bg-slate-950/24">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-cyan-100/10 text-left text-sm" aria-label={ariaLabel}>
          <thead className="bg-cyan-300/8 text-xs font-bold uppercase tracking-wide text-cyan-100/72">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-100/8">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6" colSpan={columns.length}>
                  <EmptyState title={emptyLabel} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id ?? index} className="transition hover:bg-cyan-300/6">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-slate-200">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
