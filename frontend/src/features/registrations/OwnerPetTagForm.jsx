import { Save } from "lucide-react";
import { useState } from "react";

import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import { assignNfcTag, saveOwner, savePet } from "../../services/dashboardService.js";

const initialOwner = {
  full_name: "",
  address: "",
  contact_number: "",
  latitude: "",
  longitude: "",
};

const initialPet = {
  name: "",
  species: "",
  breed: "",
  gender: "",
  color: "",
  age: "",
  birth_date: "",
};

export default function OwnerPetTagForm() {
  const [owner, setOwner] = useState(initialOwner);
  const [pet, setPet] = useState(initialPet);
  const [uniqueCode, setUniqueCode] = useState("");
  const [status, setStatus] = useState("idle");

  function updateOwner(field, value) {
    setOwner((current) => ({ ...current, [field]: value }));
  }

  function updatePet(field, value) {
    setPet((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    const createdOwner = await saveOwner({
      ...owner,
      latitude: owner.latitude ? Number(owner.latitude) : null,
      longitude: owner.longitude ? Number(owner.longitude) : null,
    });
    const createdPet = await savePet({
      ...pet,
      owner_id: createdOwner.owner_id,
      age: pet.age ? Number(pet.age) : null,
    });
    if (uniqueCode) {
      await assignNfcTag({
        pet_id: createdPet.pet_id,
        unique_code: uniqueCode,
        status: "Active",
      });
    }
    setOwner(initialOwner);
    setPet(initialPet);
    setUniqueCode("");
    setStatus("saved");
  }

  return (
    <form className="grid gap-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-base font-semibold text-ink">Manual Registration</h2>
        <p className="text-sm text-slate-500">Create owner, pet, and NFC assignment records together.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Owner full name" id="owner-name" value={owner.full_name} onChange={(event) => updateOwner("full_name", event.target.value)} required />
        <FormField label="Contact number" id="owner-contact" value={owner.contact_number} onChange={(event) => updateOwner("contact_number", event.target.value)} required />
        <FormField label="Address" id="owner-address" value={owner.address} onChange={(event) => updateOwner("address", event.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Latitude" id="owner-latitude" type="number" step="any" value={owner.latitude} onChange={(event) => updateOwner("latitude", event.target.value)} />
          <FormField label="Longitude" id="owner-longitude" type="number" step="any" value={owner.longitude} onChange={(event) => updateOwner("longitude", event.target.value)} />
        </div>
        <FormField label="Pet name" id="pet-name" value={pet.name} onChange={(event) => updatePet("name", event.target.value)} required />
        <FormField label="Species" id="pet-species" value={pet.species} onChange={(event) => updatePet("species", event.target.value)} required />
        <FormField label="Breed" id="pet-breed" value={pet.breed} onChange={(event) => updatePet("breed", event.target.value)} />
        <FormField label="Gender" id="pet-gender" value={pet.gender} onChange={(event) => updatePet("gender", event.target.value)} />
        <FormField label="Color" id="pet-color" value={pet.color} onChange={(event) => updatePet("color", event.target.value)} />
        <FormField label="Age" id="pet-age" type="number" value={pet.age} onChange={(event) => updatePet("age", event.target.value)} />
        <FormField label="Birth date" id="pet-birth-date" type="date" value={pet.birth_date} onChange={(event) => updatePet("birth_date", event.target.value)} />
        <FormField label="NFC unique code" id="nfc-code" value={uniqueCode} onChange={(event) => setUniqueCode(event.target.value)} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{status === "saved" ? "Registration saved." : "Ready to submit."}</p>
        <Button icon={Save} disabled={status === "saving"} type="submit">
          {status === "saving" ? "Saving" : "Save Registration"}
        </Button>
      </div>
    </form>
  );
}
