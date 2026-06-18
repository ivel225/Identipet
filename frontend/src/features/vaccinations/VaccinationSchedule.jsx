import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { formatDate } from "../../utils/formatters.js";

function dueVariant(dateValue) {
  if (!dateValue) {
    return "neutral";
  }
  const dueDate = new Date(dateValue);
  const today = new Date();
  return dueDate < today ? "danger" : "success";
}

const columns = [
  { key: "record_id", label: "Record" },
  { key: "pet_id", label: "Pet" },
  { key: "vaccine_name", label: "Vaccine" },
  {
    key: "date_administered",
    label: "Administered",
    render: (row) => formatDate(row.date_administered),
  },
  {
    key: "next_due_date",
    label: "Next Due",
    render: (row) => (
      <div className="flex flex-wrap items-center gap-2">
        <span>{formatDate(row.next_due_date)}</span>
        <StatusBadge variant={dueVariant(row.next_due_date)}>
          {dueVariant(row.next_due_date) === "danger" ? "Overdue" : "Scheduled"}
        </StatusBadge>
      </div>
    ),
  },
];

export default function VaccinationSchedule({ records }) {
  return (
    <div className="grid gap-3">
      <DataTable
        ariaLabel="Vaccination schedule"
        columns={columns}
        rows={records}
        emptyLabel="No vaccination records"
        emptyDescription="Vaccination schedules will appear once veterinary staff add records."
      />
    </div>
  );
}
