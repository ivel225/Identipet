import { Pressable, Text, View } from "react-native";

import { offlineSyncPanelStyles as styles } from "./OfflineSyncPanel.styles";

export default function OfflineSyncPanel({ isOnline, summary, onRefresh, onSync }) {
  const scanLogs = summary?.scan_history ?? 0;
  const registrations = summary?.registrations ?? 0;

  return (
    <View style={styles.card}>
      <Text selectable style={styles.title}>Offline Queue</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Scan logs</Text>
        <Text selectable style={styles.count}>{scanLogs}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>New registrations</Text>
        <Text selectable style={styles.count}>{registrations}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton} onPress={onRefresh}>
          <Text style={styles.secondaryButtonText}>Refresh</Text>
        </Pressable>
        <Pressable
          disabled={!isOnline}
          style={[styles.primaryButton, !isOnline ? styles.disabledButton : null]}
          onPress={onSync}
        >
          <Text style={styles.primaryButtonText}>Sync Now</Text>
        </Pressable>
      </View>
    </View>
  );
}
