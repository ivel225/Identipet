import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { scanPromptStyles as styles } from "./ScanPrompt.styles";

export default function ScanPrompt({ isScanning, onScan }) {
  return (
    <View style={styles.card}>
      <View style={styles.nfcBox}>
        {isScanning ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.nfcText}>NFC</Text>}
      </View>
      <View style={styles.copyBlock}>
        <Text selectable style={styles.title}>Tap the collar case</Text>
        <Text selectable style={styles.body}>
          Hold the phone near the NFC box-type collar case to read the NTAG215 unique code.
        </Text>
      </View>
      <Pressable
        disabled={isScanning}
        onPress={onScan}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
          isScanning ? styles.buttonDisabled : null,
        ]}
      >
        <Text style={styles.buttonText}>{isScanning ? "Scanning..." : "Start Scan"}</Text>
      </Pressable>
    </View>
  );
}
