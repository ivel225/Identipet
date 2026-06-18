import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";

import PetProfileCard from "../components/PetProfileCard";
import StatusBanner from "../components/StatusBanner";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { getPetProfileByNfcCode } from "../services/apiClient";
import { cachePetProfile, getCachedPetProfile } from "../services/offlineStorage";

export default function PetProfileScreen() {
  const { uniqueCode } = useLocalSearchParams();
  const isOnline = useNetworkStatus();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const cached = await getCachedPetProfile(uniqueCode);
        if (!cancelled && cached) {
          setProfile(cached);
        }

        if (isOnline) {
          const fresh = await getPetProfileByNfcCode(uniqueCode);
          await cachePetProfile(uniqueCode, fresh);
          if (!cancelled) {
            setProfile(fresh);
          }
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught.message);
        }
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [isOnline, uniqueCode]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <StatusBanner isOnline={isOnline} />
      {!profile && !error ? <ActivityIndicator color="#1F7A6E" /> : null}
      {error ? <Text selectable style={{ color: "#B91C1C" }}>{error}</Text> : null}
      {profile ? <PetProfileCard profile={profile} /> : null}
    </ScrollView>
  );
}
