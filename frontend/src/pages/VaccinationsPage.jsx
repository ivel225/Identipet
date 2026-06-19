import DataTable from "../components/DataTable.jsx";
import InlineAlert from "../components/InlineAlert.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SectionPanel from "../components/SectionPanel.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import VaccinationRecordForm from "../features/vaccinations/VaccinationRecordForm.jsx";
import { useResourceList } from "../hooks/useResourceList.js";
import { getVaccinationRecords } from "../services/vaccinationService.js";
import { formatDate } from "../utils/formatters.js";

function dueVariant(dateValue) {
  if (!dateValue) {
    return "neutral";
  }
  return new Date(dateValue) < new Date() ? "danger" : "success";
}

export default function VaccinationsPage() {
  const { records, status, error, refresh } = useResourceList(getVaccinationRecords);

  return (
    <div className="grid gap-6">
      <PageHeader title="Vaccinations" />
      <VaccinationRecordForm onSaved={refresh} />
      <SectionPanel title="Vaccination Records">
        <InlineAlert variant="danger">{error}</InlineAlert>
        {status === "loading" ? <LoadingState label="Loading vaccinations" /> : null}
        {status !== "loading" ? (
          <DataTable
            ariaLabel="Vaccination records"
            columns={[
              { key: "record_id", label: "ID" },
              { key: "pet_id", label: "Pet" },
              { key: "vaccine_name", label: "Vaccine" },
              { key: "date_administered", label: "Administered", render: (row) => formatDate(row.date_administered) },
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
            ]}
            emptyDescription="Create a vaccination record to populate this table."
            emptyLabel="No vaccination records found."
            rowKey={(row) => row.record_id}
            rows={records}
          />
        ) : null}
      </SectionPanel>
    </div>
  );
}
