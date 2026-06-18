import { Radio, Save } from "lucide-react";
import { useState } from "react";

import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import { assignNfcTag } from "../../services/nfcTagService.js";

const initialTag = {
  pet_id: "",
  unique_code: "",
  status: "Active",
};

export default function NfcTagAssignmentForm({ onSaved }) {
  const [tagId, setTagId] = useState("");
  const [tag, setTag] = useState(initialTag);
  const [status, setStatus] = useState("idle");

  function updateTag(field, value) {
    setTag((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    const saved = await assignNfcTag(
      {
        ...tag,
        pet_id: Number(tag.pet_id),
      },
      tagId || null,
    );
    setTag(initialTag);
    setTagId("");
    setStatus("saved");
    onSaved?.(saved);
  }

  return (
    <form className="glass-panel grid gap-4 rounded-xl p-4" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">NFC Tag Assignment</h2>
          <p className="text-sm text-white/58">Assign or update an NTAG215 unique code for a registered pet.</p>
        </div>
        <Radio className="h-5 w-5 text-clinic" aria-hidden="true" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Tag ID for update" id="tag-id" value={tagId} onChange={(event) => setTagId(event.target.value)} />
        <FormField label="Pet ID" id="tag-pet-id" type="number" value={tag.pet_id} onChange={(event) => updateTag("pet_id", event.target.value)} required />
        <FormField label="NTAG215 unique code" id="tag-unique-code" value={tag.unique_code} onChange={(event) => updateTag("unique_code", event.target.value)} required />
        <FormField label="Status" id="tag-status" as="select" value={tag.status} onChange={(event) => updateTag("status", event.target.value)}>
          <option>Active</option>
          <option>Inactive</option>
          <option>Lost</option>
          <option>Retired</option>
        </FormField>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-white/58">{status === "saved" ? "NFC tag saved." : "Ready."}</p>
        <Button icon={Save} disabled={status === "saving"} type="submit">
          {tagId ? "Update Tag" : "Assign Tag"}
        </Button>
      </div>
    </form>
  );
}
