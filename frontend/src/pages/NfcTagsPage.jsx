import DataTable from "../components/DataTable.jsx";
import InlineAlert from "../components/InlineAlert.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SectionPanel from "../components/SectionPanel.jsx";
import RegistrationWorkspace from "../features/registrations/RegistrationWorkspace.jsx";
import { useResourceList } from "../hooks/useResourceList.js";
import { getNfcTags } from "../services/nfcTagService.js";
import { formatDate } from "../utils/formatters.js";

export default function NfcTagsPage() {
  const { records: tags, status, error, refresh } = useResourceList(getNfcTags);

  return (
    <div className="grid gap-6">
      <PageHeader title="NFC Tags" />
      <RegistrationWorkspace section="nfc-tags" onSaved={refresh} />
      <SectionPanel title="Tag Records">
        <InlineAlert variant="danger">{error}</InlineAlert>
        {status === "loading" ? <LoadingState label="Loading NFC tags" /> : null}
        {status !== "loading" ? (
          <DataTable
            ariaLabel="NFC tag records"
            columns={[
              { key: "tag_id", label: "ID" },
              { key: "pet_id", label: "Pet" },
              { key: "unique_code", label: "Unique Code" },
              { key: "status", label: "Status" },
              { key: "issue_at", label: "Issued", render: (row) => formatDate(row.issue_at) },
            ]}
            emptyDescription="Assign an NFC tag to populate this table."
            emptyLabel="No NFC tags found."
            rowKey={(row) => row.tag_id}
            rows={tags}
          />
        ) : null}
      </SectionPanel>
    </div>
  );
}
