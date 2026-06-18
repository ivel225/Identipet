import { StyleSheet } from "react-native";

export const scanPromptStyles = StyleSheet.create({
  card: {
    gap: 18,
    padding: 20,
    borderRadius: 18,
    borderCurve: "continuous",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  nfcBox: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 148,
    height: 148,
    borderRadius: 28,
    borderCurve: "continuous",
    backgroundColor: "#1F7A6E",
  },
  nfcText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0,
  },
  copyBlock: {
    gap: 8,
  },
  title: {
    color: "#172033",
    fontSize: 24,
    fontWeight: "800",
  },
  body: {
    color: "#526173",
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#1F7A6E",
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
