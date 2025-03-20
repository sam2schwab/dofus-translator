import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: "src/background.ts", // Background script
        translatePageText: "src/translatePageText.ts", // Translate script
        options: "src/options.html", // Options page
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [tailwindcss()],
});
