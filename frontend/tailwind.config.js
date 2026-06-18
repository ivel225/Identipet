/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        clinic: "#1F7A6E",
        amber: "#D58A1F",
        skywash: "#EAF3F7",
      },
    },
  },
  plugins: [],
};
