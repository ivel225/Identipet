import { StyleSheet } from "react-native";

export const petProfileCardStyles = StyleSheet.create({
  card: {
    gap: 18,
    padding: 18,
    borderRadius: 18,
    borderCurve: "continuous",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  header: {
    gap: 4,
  },
  name: {
    color: "#172033",
    fontSize: 28,
    fontWeight: "800",
  },
  species: {
    color: "#1F7A6E",
    fontSize: 16,
    fontWeight: "700",
  },
  grid: {
    gap: 10,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  rowLabel: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },
  rowValue: {
    flexShrink: 1,
    color: "#172033",
    fontSize: 14,
    textAlign: "right",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: "#172033",
    fontSize: 17,
    fontWeight: "800",
  },
  primaryText: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryText: {
    color: "#526173",
    fontSize: 14,
    lineHeight: 20,
  },
  vaccineRow: {
    gap: 2,
    padding: 12,
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#F8FAFC",
  },
});
