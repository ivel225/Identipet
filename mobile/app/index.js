import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import ScanPrompt from "../components/ScanPrompt";
import StatusBanner from "../components/StatusBanner";
import { useNfcScanner } from "../hooks/useNfcScanner";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { getPetProfileByNfcCode } from "../services/apiClient";
import { cachePetProfile, getCachedPetProfile, queueScanLog } from "../services/offlineStorage";

export default function ScanScreen() {
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const [message, setMessage] = useState("");
  const { isScanning, scanTag } = useNfcScanner();

  async function handleScan() {
    setMessage("");
    try {
      const uniqueCode = await scanTag();
      await queueScanLog({ unique_code: uniqueCode, scan_datetime: new Date().toISOString() });

      if (isOnline) {
        const profile = await getPetProfileByNfcCode(uniqueCode);
        await cachePetProfile(uniqueCode, profile);
        router.push({ pathname: "/pet-profile", params: { uniqueCode } });
        return;
      }

      const cachedProfile = await getCachedPetProfile(uniqueCode);
      if (cachedProfile) {
        router.push({ pathname: "/pet-profile", params: { uniqueCode } });
        return;
      }

      setMessage("Scan saved offline. Pet profile will load after synchronization.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <StatusBanner isOnline={isOnline} />
      <ScanPrompt isScanning={isScanning} onScan={handleScan} />
      {message ? (
        <Text selectable style={{ color: "#9A3412", lineHeight: 20 }}>
          {message}
        </Text>
      ) : null}
      <Link href="/offline-sync" asChild>
        <Pressable style={{ minHeight: 44, justifyContent: "center" }}>
          <Text style={{ color: "#1F7A6E", fontWeight: "700" }}>Open offline sync utility</Text>
        </Pressable>
      </Link>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}
