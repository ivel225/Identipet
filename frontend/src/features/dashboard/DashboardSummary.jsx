import { MapPin, PawPrint, Radio, Syringe } from "lucide-react";

import StatCard from "../../components/StatCard.jsx";

export default function DashboardSummary({ owners, pets, vaccinationRecords, scanLogs, status }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard label="Owners" value={owners.length} detail={status} icon={MapPin} />
      <StatCard label="Pets" value={pets.length} detail="Registered profiles" icon={PawPrint} />
      <StatCard label="Vaccines" value={vaccinationRecords.length} detail="Tracked records" icon={Syringe} />
      <StatCard label="Scans" value={scanLogs.length} detail="System logs" icon={Radio} />
    </div>
  );
}
