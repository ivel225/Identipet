import { StyleSheet } from "react-native";

export const offlineSyncPanelStyles = StyleSheet.create({
  card: {
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderCurve: "continuous",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  title: {
    color: "#172033",
    fontSize: 22,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
  },
  label: {
    color: "#526173",
    fontSize: 15,
    fontWeight: "700",
  },
  count: {
    color: "#172033",
    fontSize: 20,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#1F7A6E",
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButtonText: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "800",
  },
});
