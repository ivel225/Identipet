import { Save } from "lucide-react";
import { useState } from "react";

import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import { saveOwner } from "../../services/ownerService.js";

const initialOwner = {
  full_name: "",
  address: "",
  contact_number: "",
  latitude: "",
  longitude: "",
};

export default function OwnerForm({ onSaved }) {
  const [ownerId, setOwnerId] = useState("");
  const [owner, setOwner] = useState(initialOwner);
  const [status, setStatus] = useState("idle");

  function updateOwner(field, value) {
    setOwner((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    const saved = await saveOwner(
      {
        ...owner,
        latitude: owner.latitude ? Number(owner.latitude) : null,
        longitude: owner.longitude ? Number(owner.longitude) : null,
      },
      ownerId || null,
    );
    setOwner(initialOwner);
    setOwnerId("");
    setStatus("saved");
    onSaved?.(saved);
  }

  return (
    <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-base font-semibold text-ink">Owner Registration</h2>
        <p className="text-sm text-slate-500">Create an owner or enter an owner ID to update an existing household.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Owner ID for update" id="owner-id" value={ownerId} onChange={(event) => setOwnerId(event.target.value)} />
        <FormField label="Full name" id="owner-full-name" value={owner.full_name} onChange={(event) => updateOwner("full_name", event.target.value)} required />
        <FormField label="Contact number" id="owner-contact-number" value={owner.contact_number} onChange={(event) => updateOwner("contact_number", event.target.value)} required />
        <FormField label="Address" id="owner-address" value={owner.address} onChange={(event) => updateOwner("address", event.target.value)} required />
        <FormField label="Latitude" id="owner-latitude" type="number" step="any" value={owner.latitude} onChange={(event) => updateOwner("latitude", event.target.value)} />
        <FormField label="Longitude" id="owner-longitude" type="number" step="any" value={owner.longitude} onChange={(event) => updateOwner("longitude", event.target.value)} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{status === "saved" ? "Owner saved." : "Ready."}</p>
        <Button icon={Save} disabled={status === "saving"} type="submit">
          {ownerId ? "Update Owner" : "Create Owner"}
        </Button>
      </div>
    </form>
  );
}
