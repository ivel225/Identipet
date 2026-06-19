import { Save } from "lucide-react";
import { useState } from "react";

import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import InlineAlert from "../../components/InlineAlert.jsx";
import { saveVaccinationRecord } from "../../services/vaccinationService.js";

const initialRecord = {
  pet_id: "",
  vaccine_name: "",
  date_administered: "",
  next_due_date: "",
};

export default function VaccinationRecordForm({ onSaved }) {
  const [recordId, setRecordId] = useState("");
  const [record, setRecord] = useState(initialRecord);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateRecord(field, value) {
    setRecord((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    setError("");
    try {
      const saved = await saveVaccinationRecord(
        {
          ...record,
          pet_id: Number(record.pet_id),
          next_due_date: record.next_due_date || null,
        },
        recordId || null,
      );
      setRecord(initialRecord);
      setRecordId("");
      setStatus("saved");
      setMessage(recordId ? "Vaccination updated." : "Vaccination created.");
      onSaved?.(saved);
    } catch (caught) {
      setStatus("idle");
      setError(caught.message);
    }
  }

  return (
    <form className="glass-panel grid gap-4 rounded-xl p-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-base font-semibold text-white">Vaccination Record</h2>
      </div>
      <InlineAlert variant="success">{message}</InlineAlert>
      <InlineAlert variant="danger">{error}</InlineAlert>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Record ID for update" id="vaccination-id" value={recordId} onChange={(event) => setRecordId(event.target.value)} />
        <FormField label="Pet ID" id="vaccination-pet-id" type="number" value={record.pet_id} onChange={(event) => updateRecord("pet_id", event.target.value)} required />
        <FormField label="Vaccine" id="vaccination-name" value={record.vaccine_name} onChange={(event) => updateRecord("vaccine_name", event.target.value)} required />
        <FormField label="Administered" id="vaccination-date-administered" type="date" value={record.date_administered} onChange={(event) => updateRecord("date_administered", event.target.value)} required />
        <FormField label="Next due" id="vaccination-next-due" type="date" value={record.next_due_date} onChange={(event) => updateRecord("next_due_date", event.target.value)} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{status === "saving" ? "Saving..." : "Ready."}</p>
        <Button icon={Save} disabled={status === "saving"} type="submit">
          {recordId ? "Update Record" : "Create Record"}
        </Button>
      </div>
    </form>
  );
}
