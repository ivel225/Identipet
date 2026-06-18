import PageHeader from "../components/PageHeader.jsx";
import RegistrationWorkspace from "../features/registrations/RegistrationWorkspace.jsx";

export default function OwnersPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Owners"
        subtitle="Register and update owner household details, including geospatial coordinates for the map."
      />
      <RegistrationWorkspace section="owners" />
    </div>
  );
}
