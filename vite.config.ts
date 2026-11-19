import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const githubPages = process.env.GITHUB_PAGES === "true";
// Usa o nome real do repositório, inclusive depois da renomeação para aresta-lab.
const repoSlug = process.env.GITHUB_REPOSITORY?.split("/").pop() || "aresta-lab";
const githubBase = `/${repoSlug}/`;
export default defineConfig({
  base: githubPages ? githubBase : "/",
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
