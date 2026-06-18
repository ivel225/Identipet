import PageHeader from "../components/PageHeader.jsx";
import RegistrationWorkspace from "../features/registrations/RegistrationWorkspace.jsx";

export default function NfcTagsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="NFC Tag Assignments"
        subtitle="Assign NTAG215 unique codes to registered pets and prepare collars for field scanning."
      />
      <RegistrationWorkspace section="nfc-tags" />
    </div>
  );
}
