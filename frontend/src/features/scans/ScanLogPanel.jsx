import DataTable from "../../components/DataTable.jsx";
import { formatDate } from "../../utils/formatters.js";

const columns = [
  { key: "scan_id", label: "Scan ID" },
  { key: "tag_id", label: "Tag" },
  { key: "user_id", label: "User" },
  {
    key: "scan_datetime",
    label: "Scanned",
    render: (row) => formatDate(row.scan_datetime),
  },
];

export default function ScanLogPanel({ scanLogs }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-base font-semibold text-ink">System Scan Logs</h2>
      <DataTable columns={columns} rows={scanLogs} emptyLabel="Scan history appears here after field activity." />
    </section>
  );
}
