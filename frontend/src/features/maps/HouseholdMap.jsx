import { MapPin } from "lucide-react";

import EmptyState from "../../components/EmptyState.jsx";
import { formatCoordinate } from "../../utils/formatters.js";

function positionForCoordinate(value, min, max) {
  if (value === null || value === undefined) {
    return 50;
  }
  return Math.min(96, Math.max(4, ((Number(value) - min) / (max - min)) * 100));
}

export default function HouseholdMap({ owners }) {
  const mappedOwners = owners.filter((owner) => owner.latitude !== null && owner.longitude !== null);

  return (
    <div>
      {mappedOwners.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No mapped households"
          description="Owner records with latitude and longitude will appear on this map."
        />
      ) : (
        <div className="map-grid relative min-h-80 overflow-hidden rounded-2xl border border-cyan-100/14 bg-slate-950/24">
          {mappedOwners.map((owner) => (
            <div
              key={owner.owner_id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${positionForCoordinate(owner.longitude, -180, 180)}%`,
                top: `${100 - positionForCoordinate(owner.latitude, -90, 90)}%`,
              }}
              title={`${owner.full_name}: ${formatCoordinate(owner.latitude)}, ${formatCoordinate(owner.longitude)}`}
            >
              <span className="block h-4 w-4 rounded-full border-2 border-white bg-health shadow-lg shadow-emerald-950/40" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
