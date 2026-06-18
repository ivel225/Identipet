import DataTable from "../../components/DataTable.jsx";
import { formatDate } from "../../utils/formatters.js";

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
    render: (row) => formatDate(row.next_due_date),
  },
];

export default function VaccinationSchedule({ records }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-base font-semibold text-ink">Vaccination Schedule</h2>
      <DataTable columns={columns} rows={records} emptyLabel="No vaccination records are due." />
    </section>
  );
}
