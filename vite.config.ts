import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
    host: "0.0.0.0",
    allowedHosts: ["port-cyber-experiments.onrender.com", "localhost"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
