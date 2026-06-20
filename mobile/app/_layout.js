import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#F7FAFC" },
          headerTintColor: "#172033",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#F7FAFC" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Scan Collar" }} />
        <Stack.Screen name="login" options={{ title: "Log in" }} />
        <Stack.Screen name="pet-profile" options={{ title: "Pet Profile" }} />
        <Stack.Screen name="offline-sync" options={{ title: "Offline Sync" }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
