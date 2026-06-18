import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SectionPanel from "../components/SectionPanel.jsx";
import DashboardSummary from "../features/dashboard/DashboardSummary.jsx";
import HouseholdMap from "../features/maps/HouseholdMap.jsx";
import ScanLogPanel from "../features/scans/ScanLogPanel.jsx";
import VaccinationSchedule from "../features/vaccinations/VaccinationSchedule.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";

export default function DashboardPage() {
  const { owners, pets, vaccinationRecords, scanLogs, status, error } = useDashboardData();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Operational Dashboard"
        subtitle="Monitor registered households, field scans, and upcoming vaccination activity."
      />
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <DashboardSummary
        owners={owners}
        pets={pets}
        vaccinationRecords={vaccinationRecords}
        scanLogs={scanLogs}
        status={status}
      />
      {status === "loading" ? <LoadingState label="Loading dashboard records" /> : null}
      {status !== "loading" && owners.length + pets.length + vaccinationRecords.length + scanLogs.length === 0 ? (
        <EmptyState
          title="No operational records yet"
          description="Start by registering an owner, pet, and NFC tag assignment from the sidebar."
        />
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <SectionPanel
          title="Household Coverage"
          description="Registered owner coordinates for field planning."
        >
          <HouseholdMap owners={owners} />
        </SectionPanel>
        <SectionPanel
          title="Clinical Schedule"
          description="Upcoming and overdue vaccination records."
        >
          <VaccinationSchedule records={vaccinationRecords} />
        </SectionPanel>
      </div>
      <SectionPanel title="Field Activity" description="NFC collar scan history from field personnel.">
        <ScanLogPanel scanLogs={scanLogs} />
      </SectionPanel>
    </div>
  );
}
