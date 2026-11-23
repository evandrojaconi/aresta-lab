import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "public/intelligence-os",
  publicDir: false,
  base: "./",
  build: {
    outDir: resolve(".output/public/intelligence-os"),
    emptyOutDir: true,
  },
});
