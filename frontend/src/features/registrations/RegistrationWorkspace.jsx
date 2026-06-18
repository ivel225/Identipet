import NfcTagAssignmentForm from "../nfc-tags/NfcTagAssignmentForm.jsx";
import OwnerForm from "../owners/OwnerForm.jsx";
import PetForm from "../pets/PetForm.jsx";

export default function RegistrationWorkspace({ section = "all" }) {
  const showOwners = section === "all" || section === "owners";
  const showPets = section === "all" || section === "pets";
  const showTags = section === "all" || section === "nfc-tags";

  return (
    <div className="grid gap-5">
      {showOwners ? <OwnerForm /> : null}
      {showPets ? <PetForm /> : null}
      {showTags ? <NfcTagAssignmentForm /> : null}
    </div>
  );
}
