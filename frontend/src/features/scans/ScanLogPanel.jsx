import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { formatDate } from "../../utils/formatters.js";

const columns = [
  { key: "scan_id", label: "Scan ID" },
  { key: "tag_id", label: "Tag" },
  { key: "user_id", label: "User" },
  {
    key: "status",
    label: "Status",
    render: () => <StatusBadge variant="success">Logged</StatusBadge>,
  },
  {
    key: "scan_datetime",
    label: "Scanned",
    render: (row) => formatDate(row.scan_datetime),
  },
];

export default function ScanLogPanel({ scanLogs }) {
  return (
    <div className="grid gap-3">
      <DataTable
        ariaLabel="System scan logs"
        columns={columns}
        rows={scanLogs}
        emptyLabel="No scan logs yet"
        emptyDescription="Field scans will appear here after personnel scan NFC collars."
      />
    </div>
  );
}
