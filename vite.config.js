import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Mantener la precisión de las columnas Bootstrap al integrar su CSS en Vite.
  build: { cssMinify: false },
});
