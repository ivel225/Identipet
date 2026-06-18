import NfcManager, { NfcTech } from "react-native-nfc-manager";

let started = false;

async function ensureNfcStarted() {
  if (!started) {
    const supported = await NfcManager.isSupported();
    if (!supported) {
      throw new Error("NFC is not supported on this device.");
    }
    await NfcManager.start();
    started = true;
  }
}

export async function readNtag215UniqueCode() {
  await ensureNfcStarted();

  try {
    await NfcManager.requestTechnology(NfcTech.NfcA);
    const tag = await NfcManager.getTag();
    const uniqueCode = tag?.id;

    if (!uniqueCode) {
      throw new Error("No NTAG215 unique code was found.");
    }

    return uniqueCode.toUpperCase();
  } finally {
    await NfcManager.cancelTechnologyRequest().catch(() => undefined);
  }
}
