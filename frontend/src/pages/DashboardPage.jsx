import { MapPin, PawPrint, Radio, Syringe } from "lucide-react";

import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
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
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Owners" value={owners.length} detail={status} icon={MapPin} />
        <StatCard label="Pets" value={pets.length} detail="Registered profiles" icon={PawPrint} />
        <StatCard label="Vaccines" value={vaccinationRecords.length} detail="Tracked records" icon={Syringe} />
        <StatCard label="Scans" value={scanLogs.length} detail="Current session" icon={Radio} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <HouseholdMap owners={owners} />
        <VaccinationSchedule records={vaccinationRecords} />
      </div>
      <ScanLogPanel scanLogs={scanLogs} />
    </div>
  );
}
