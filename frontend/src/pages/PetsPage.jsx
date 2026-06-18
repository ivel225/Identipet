import PageHeader from "../components/PageHeader.jsx";
import RegistrationWorkspace from "../features/registrations/RegistrationWorkspace.jsx";

export default function PetsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Pets"
        subtitle="Manage pet profiles and keep ownership data connected to field identification records."
      />
      <RegistrationWorkspace section="pets" />
    </div>
  );
}
