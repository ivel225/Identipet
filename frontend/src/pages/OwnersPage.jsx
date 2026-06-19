import DataTable from "../components/DataTable.jsx";
import InlineAlert from "../components/InlineAlert.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SectionPanel from "../components/SectionPanel.jsx";
import RegistrationWorkspace from "../features/registrations/RegistrationWorkspace.jsx";
import { useResourceList } from "../hooks/useResourceList.js";
import { getOwners } from "../services/ownerService.js";

export default function OwnersPage() {
  const { records: owners, status, error, refresh } = useResourceList(getOwners);

  return (
    <div className="grid gap-6">
      <PageHeader title="Owners" />
      <RegistrationWorkspace section="owners" onSaved={refresh} />
      <SectionPanel title="Owner Records">
        <InlineAlert variant="danger">{error}</InlineAlert>
        {status === "loading" ? <LoadingState label="Loading owners" /> : null}
        {status !== "loading" ? (
          <DataTable
            ariaLabel="Owner records"
            columns={[
              { key: "owner_id", label: "ID" },
              { key: "full_name", label: "Name" },
              { key: "contact_number", label: "Contact" },
              { key: "address", label: "Address" },
              { key: "latitude", label: "Latitude" },
              { key: "longitude", label: "Longitude" },
            ]}
            emptyDescription="Create an owner to populate this table."
            emptyLabel="No owners found."
            rowKey={(row) => row.owner_id}
            rows={owners}
          />
        ) : null}
      </SectionPanel>
    </div>
  );
}
