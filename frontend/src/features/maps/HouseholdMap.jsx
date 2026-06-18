import { MapPin } from "lucide-react";

import { formatCoordinate } from "../../utils/formatters.js";

function positionForCoordinate(value, min, max) {
  if (value === null || value === undefined) {
    return 50;
  }
  return Math.min(96, Math.max(4, ((Number(value) - min) / (max - min)) * 100));
}

export default function HouseholdMap({ owners }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Registered Household Locations</h2>
          <p className="text-sm text-slate-500">Coordinates are sourced from owner records.</p>
        </div>
        <MapPin className="h-5 w-5 text-clinic" aria-hidden="true" />
      </div>
      <div className="map-grid relative min-h-80 overflow-hidden rounded-md border border-slate-200 bg-skywash">
        {owners
          .filter((owner) => owner.latitude !== null && owner.longitude !== null)
          .map((owner) => (
            <div
              key={owner.owner_id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${positionForCoordinate(owner.longitude, -180, 180)}%`,
                top: `${100 - positionForCoordinate(owner.latitude, -90, 90)}%`,
              }}
              title={`${owner.full_name}: ${formatCoordinate(owner.latitude)}, ${formatCoordinate(owner.longitude)}`}
            >
              <span className="block h-3 w-3 rounded-full border-2 border-white bg-clinic shadow" />
            </div>
          ))}
      </div>
    </section>
  );
}
