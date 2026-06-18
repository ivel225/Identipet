import { clearOfflineQueue, getOfflineQueue } from "./offlineStorage";
import { postOfflineSync } from "./apiClient";

export async function flushOfflineQueue() {
  const queue = await getOfflineQueue();
  const registrationPayloads = queue.registrations.reduce(
    (accumulator, registration) => {
      if (registration.owner) {
        accumulator.owners.push(registration.owner);
      }
      if (registration.pet) {
        accumulator.pets.push(registration.pet);
      }
      if (registration.nfc_tag) {
        accumulator.nfc_tags.push(registration.nfc_tag);
      }
      if (registration.vaccination_record) {
        accumulator.vaccination_records.push(registration.vaccination_record);
      }
      return accumulator;
    },
    { owners: [], pets: [], nfc_tags: [], vaccination_records: [] },
  );
  const payload = {
    ...registrationPayloads,
    scan_history: queue.scan_history,
  };
  const totalQueued = queue.scan_history.length + queue.registrations.length;

  if (totalQueued === 0) {
    return { totalSynced: 0, response: null };
  }

  const response = await postOfflineSync(payload);
  await clearOfflineQueue();
  return { totalSynced: totalQueued, response };
}
