import DataTable from "../components/DataTable.jsx";
import InlineAlert from "../components/InlineAlert.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SectionPanel from "../components/SectionPanel.jsx";
import RegistrationWorkspace from "../features/registrations/RegistrationWorkspace.jsx";
import { useResourceList } from "../hooks/useResourceList.js";
import { getPets } from "../services/petService.js";

export default function PetsPage() {
  const { records: pets, status, error, refresh } = useResourceList(getPets);

  return (
    <div className="grid gap-6">
      <PageHeader title="Pets" />
      <RegistrationWorkspace section="pets" onSaved={refresh} />
      <SectionPanel title="Pet Records">
        <InlineAlert variant="danger">{error}</InlineAlert>
        {status === "loading" ? <LoadingState label="Loading pets" /> : null}
        {status !== "loading" ? (
          <DataTable
            ariaLabel="Pet records"
            columns={[
              { key: "pet_id", label: "ID" },
              { key: "owner_id", label: "Owner" },
              { key: "name", label: "Name" },
              { key: "species", label: "Species" },
              { key: "breed", label: "Breed" },
              { key: "gender", label: "Gender" },
              { key: "age", label: "Age" },
            ]}
            emptyDescription="Create a pet profile to populate this table."
            emptyLabel="No pets found."
            rowKey={(row) => row.pet_id}
            rows={pets}
          />
        ) : null}
      </SectionPanel>
    </div>
  );
}
