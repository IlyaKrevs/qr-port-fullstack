import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@globalShared": path.resolve(__dirname, "../shared"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@admin": path.resolve(__dirname, "./src/admin"),
      "@client": path.resolve(__dirname, "./src/client"),
      "@store": path.resolve(__dirname, "./src/store"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
  },
});
