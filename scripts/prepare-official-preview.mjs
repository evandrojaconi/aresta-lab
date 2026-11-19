import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Cria apenas uma cópia temporária de homologação, sem alterar o repositório oficial.
const dir = process.argv[2] || "official-source";
const slug = process.env.GITHUB_REPOSITORY?.split("/").at(-1) || "aresta-lab";
const base = "/" + slug + "/oficial/";
const config = join(dir, "vite.config.js");
let vite = readFileSync(config,"utf8");
if (!vite.includes("appType: 'mpa'")) throw Error("A estrutura do site oficial mudou");
vite = vite.replace(/^import \{ sentryVitePlugin \} from '@sentry\/vite-plugin';\r?\n/m,"");
vite = vite.replace(/if \(process\.env\.CI && !process\.env\.SENTRY_AUTH_TOKEN[\s\S]*?\n}\r?\n/,"");
vite = vite.replace(/    sentryVitePlugin\(\{[\s\S]*?\n    \}\),\r?\n/,"");
if (vite.includes("sentryVitePlugin") || vite.includes("SENTRY_AUTH_TOKEN")) throw Error("Sentry ativo na prévia");
vite = vite.replace("  appType: 'mpa',","  base: " + JSON.stringify(base) + ",\n  appType: 'mpa',");
writeFileSync(config,vite);

function visit(folder) {
  for (const ent of readdirSync(folder,{withFileTypes:true})) {
    const file = join(folder,ent.name);
    if (ent.isDirectory()) { if (ent.name !== "node_modules") visit(file); continue; }
    if (ent.name.endsWith(".html")) {
      let html=readFileSync(file,"utf8");
      html=html.replace(/<script\b[^>]*src=["']https:\/\/analytics\.arestaclimb\.com\/script\.js["'][^>]*><\/script>/gi,"");
      writeFileSync(file,html);
    }
    if (ent.name.endsWith(".js") && file.includes(join(dir,"src"))) {
      let js=readFileSync(file,"utf8");
      js=js.replace(/^\s*import ['"]\.\/telemetry\.js['"];?\s*$/gm,"");
      js=js.replace(/^\s*import \{\s*inicializarMonitoramentoErrosSentry\s*\} from ['"]\.\/telemetria\.js['"];?\s*$/gm,"");
      js=js.replace(/inicializarMonitoramentoErrosSentry\([^;]*\);/g,"");
      writeFileSync(file,js);
    }
  }
}
visit(dir);
console.log("Cópia oficial preparada sem telemetria de produção. Base:",base);
