import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import ScanPrompt from "../components/ScanPrompt";
import StatusBanner from "../components/StatusBanner";
import { useNfcScanner } from "../hooks/useNfcScanner";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { clearAuthToken, getAuthToken, getCurrentUser, getPetProfileByNfcCode, logFieldScan } from "../services/apiClient";
import { cachePetProfile, getCachedPetProfile, queueScanLog } from "../services/offlineStorage";

export default function ScanScreen() {
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { isScanning, scanTag } = useNfcScanner();

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const token = await getAuthToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        if (isOnline) {
          const payload = await getCurrentUser();
          if (!cancelled) {
            setUser(payload.user);
          }
        }
      } catch {
        router.replace("/login");
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [isOnline, router]);

  async function handleScan() {
    setMessage("");
    try {
      const uniqueCode = await scanTag();
      const scanLog = { unique_code: uniqueCode, scan_datetime: new Date().toISOString() };

      if (isOnline) {
        try {
          await logFieldScan(scanLog);
        } catch {
          await queueScanLog(scanLog);
        }
        const profile = await getPetProfileByNfcCode(uniqueCode);
        await cachePetProfile(uniqueCode, profile);
        router.push({ pathname: "/pet-profile", params: { uniqueCode } });
        return;
      }

      await queueScanLog(scanLog);
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

  async function handleLogout() {
    await clearAuthToken();
    router.replace("/login");
  }

  if (isCheckingSession) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, gap: 16 }}>
        <ActivityIndicator color="#0891B2" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <StatusBanner isOnline={isOnline} />
      {user ? (
        <Text selectable style={{ color: "#334155", fontWeight: "700" }}>
          {user.name} - {user.role}
        </Text>
      ) : null}
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
      <Pressable onPress={handleLogout} style={{ minHeight: 44, justifyContent: "center" }}>
        <Text style={{ color: "#B91C1C", fontWeight: "700" }}>Log out</Text>
      </Pressable>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}
