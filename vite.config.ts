import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const githubPages = process.env.GITHUB_PAGES === "true";
export default defineConfig({
  base: githubPages ? "/aresta-climb-navegue-e-escalar/" : "/",
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  plugins: [
    tailwindcss(),
    tanstackStart(
      githubPages
        ? {
            spa: { enabled: true, prerender: { crawlLinks: true } },
            prerender: { enabled: true, crawlLinks: true, failOnError: true },
          }
        : { server: { entry: "server" } },
    ),
    react(),
    nitro(),
  ],
});
