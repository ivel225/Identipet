import { Save } from "lucide-react";
import { useState } from "react";

import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import InlineAlert from "../../components/InlineAlert.jsx";
import { savePet } from "../../services/petService.js";

const initialPet = {
  owner_id: "",
  name: "",
  species: "",
  breed: "",
  gender: "",
  color: "",
  age: "",
  birth_date: "",
};

export default function PetForm({ onSaved }) {
  const [petId, setPetId] = useState("");
  const [pet, setPet] = useState(initialPet);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updatePet(field, value) {
    setPet((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    setError("");
    try {
      const saved = await savePet(
        {
          ...pet,
          owner_id: Number(pet.owner_id),
          age: pet.age ? Number(pet.age) : null,
          birth_date: pet.birth_date || null,
        },
        petId || null,
      );
      setPet(initialPet);
      setPetId("");
      setStatus("saved");
      setMessage(petId ? "Pet updated." : "Pet created.");
      onSaved?.(saved);
    } catch (caught) {
      setStatus("idle");
      setError(caught.message);
    }
  }

  return (
    <form className="glass-panel grid gap-4 rounded-xl p-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-base font-semibold text-white">Pet Profile</h2>
      </div>
      <InlineAlert variant="success">{message}</InlineAlert>
      <InlineAlert variant="danger">{error}</InlineAlert>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Pet ID for update" id="pet-id" value={petId} onChange={(event) => setPetId(event.target.value)} />
        <FormField label="Owner ID" id="pet-owner-id" type="number" value={pet.owner_id} onChange={(event) => updatePet("owner_id", event.target.value)} required />
        <FormField label="Pet name" id="pet-name" value={pet.name} onChange={(event) => updatePet("name", event.target.value)} required />
        <FormField label="Species" id="pet-species" value={pet.species} onChange={(event) => updatePet("species", event.target.value)} required />
        <FormField label="Breed" id="pet-breed" value={pet.breed} onChange={(event) => updatePet("breed", event.target.value)} />
        <FormField label="Gender" id="pet-gender" value={pet.gender} onChange={(event) => updatePet("gender", event.target.value)} />
        <FormField label="Color" id="pet-color" value={pet.color} onChange={(event) => updatePet("color", event.target.value)} />
        <FormField label="Age" id="pet-age" type="number" value={pet.age} onChange={(event) => updatePet("age", event.target.value)} />
        <FormField label="Birth date" id="pet-birth-date" type="date" value={pet.birth_date} onChange={(event) => updatePet("birth_date", event.target.value)} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{status === "saving" ? "Saving..." : "Ready."}</p>
        <Button icon={Save} disabled={status === "saving"} type="submit">
          {petId ? "Update Pet" : "Create Pet"}
        </Button>
      </div>
    </form>
  );
}
