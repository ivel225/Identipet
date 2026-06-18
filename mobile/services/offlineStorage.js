import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_PREFIX = "identipet.profile.";
const QUEUE_KEY = "identipet.offline.queue";

const emptyQueue = {
  scan_history: [],
  registrations: [],
};

async function readQueue() {
  const stored = await AsyncStorage.getItem(QUEUE_KEY);
  return stored ? { ...emptyQueue, ...JSON.parse(stored) } : emptyQueue;
}

async function writeQueue(queue) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return queue;
}

export async function cachePetProfile(uniqueCode, profile) {
  await AsyncStorage.setItem(`${PROFILE_PREFIX}${uniqueCode}`, JSON.stringify(profile));
  return profile;
}

export async function getCachedPetProfile(uniqueCode) {
  const stored = await AsyncStorage.getItem(`${PROFILE_PREFIX}${uniqueCode}`);
  return stored ? JSON.parse(stored) : null;
}

export async function queueScanLog(scanLog) {
  const queue = await readQueue();
  queue.scan_history.push(scanLog);
  await writeQueue(queue);
  return queue;
}

export async function queueRegistration(registration) {
  const queue = await readQueue();
  queue.registrations.push(registration);
  await writeQueue(queue);
  return queue;
}

export async function getOfflineQueue() {
  return readQueue();
}

export async function clearOfflineQueue() {
  return writeQueue(emptyQueue);
}

export async function getOfflineQueueSummary() {
  const queue = await readQueue();
  return {
    scan_history: queue.scan_history.length,
    registrations: queue.registrations.length,
  };
}
