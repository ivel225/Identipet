import { Text, View } from "react-native";

import { statusBannerStyles as styles } from "./StatusBanner.styles";

export default function StatusBanner({ isOnline }) {
  return (
    <View style={[styles.banner, isOnline ? styles.online : styles.offline]}>
      <Text selectable style={styles.text}>
        {isOnline ? "Online. Field data can sync." : "Offline. Scans will be queued locally."}
      </Text>
    </View>
  );
}
