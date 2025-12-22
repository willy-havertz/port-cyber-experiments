/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0a0e27",
          darker: "#050811",
          border: "#1e2749",
          accent: "#00f0ff",
          danger: "#ff0055",
          success: "#00ff88",
          warning: "#ffaa00",
        },
      },
    },
  },
  plugins: [],
};
