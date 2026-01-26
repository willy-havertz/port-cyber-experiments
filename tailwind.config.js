/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0f172a",
          darker: "#020617",
          border: "#1e293b",
          accent: "#22c55e",
          "accent-light": "#4ade80",
          danger: "#ef4444",
          success: "#22c55e",
          warning: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
