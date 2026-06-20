import { StyleSheet } from "react-native";

export const loginFormStyles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 20,
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDEAF0",
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    color: "#0891B2",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    color: "#0F172A",
    fontSize: 16,
    backgroundColor: "#F8FAFC",
  },
  error: {
    color: "#B91C1C",
    lineHeight: 20,
  },
  button: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderCurve: "continuous",
    backgroundColor: "#0891B2",
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonDisabled: {
    opacity: 0.64,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
