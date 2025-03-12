import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: "src/background.ts", // Background script
        translatePageText: "src/translatePageText.ts", // Translate script
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
