/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        clinic: "#0891B2",
        health: "#059669",
        aqua: "#22D3EE",
        amber: "#D58A1F",
        skywash: "#ECFEFF",
        night: "#07111F",
        panel: "#0E1B2E",
      },
    },
  },
  plugins: [],
};
