import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/goai-literature-agent-demo/",
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [react()],
});
