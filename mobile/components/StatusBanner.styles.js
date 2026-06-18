import { StyleSheet } from "react-native";

export const statusBannerStyles = StyleSheet.create({
  banner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  online: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  offline: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  text: {
    color: "#172033",
    fontSize: 14,
    fontWeight: "700",
  },
});
