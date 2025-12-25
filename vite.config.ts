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
    // allow all hosts in preview (true is accepted by vite types)
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
