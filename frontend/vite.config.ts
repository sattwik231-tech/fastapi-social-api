import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      "frontend-production-ccfe.up.railway.app",
      "connectin.up.railway.app",
    ],
  },
  server: {
    port: 5173,
    proxy: {
      "/login": "http://127.0.0.1:8000",
      "/users": "http://127.0.0.1:8000",
      "/posts": "http://127.0.0.1:8000",
      "/vote": "http://127.0.0.1:8000",
    },
  },
});
