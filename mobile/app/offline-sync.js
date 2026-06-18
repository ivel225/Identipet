import { useState } from "react";
import { ScrollView, Text } from "react-native";

import OfflineSyncPanel from "../components/OfflineSyncPanel";
import StatusBanner from "../components/StatusBanner";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { getOfflineQueueSummary } from "../services/offlineStorage";
import { flushOfflineQueue } from "../services/syncService";

export default function OfflineSyncScreen() {
  const isOnline = useNetworkStatus();
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");

  async function refreshSummary() {
    setSummary(await getOfflineQueueSummary());
  }

  async function handleSync() {
    setMessage("");
    try {
      const result = await flushOfflineQueue();
      setMessage(`Synced ${result.totalSynced} queued item(s).`);
      await refreshSummary();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <StatusBanner isOnline={isOnline} />
      <OfflineSyncPanel
        isOnline={isOnline}
        summary={summary}
        onRefresh={refreshSummary}
        onSync={handleSync}
      />
      {message ? <Text selectable>{message}</Text> : null}
    </ScrollView>
  );
}
