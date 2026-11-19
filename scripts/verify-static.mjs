import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = ".output/public";
const repo = process.env.GITHUB_REPOSITORY?.split("/").at(-1) || "aresta-lab";
const base = "/" + repo + "/";
const routes = [
  "index.html",
  "picos/index.html",
  "picos/pedra-grande-igarape/index.html",
  "guias/croqui-de-escalada/index.html",
  "guias/croqui-offline/index.html",
  "guias/onde-escalar-em-belo-horizonte/index.html",
  "comunidade/index.html",
  "faq/index.html",
];
const errors = [];
for (const route of routes) {
  const path = join(outDir, route);
  if (!existsSync(path)) {
    errors.push("Arquivo ausente: " + route);
    continue;
  }
  const html = readFileSync(path, "utf8");
  if (!html.includes("<html")) errors.push("HTML invalido: " + route);
  if (!html.includes("Aresta")) errors.push("Marca ausente: " + route);
  if (!html.includes("noindex")) errors.push("Pagina preview sem noindex: " + route);
  if (route === "index.html") {
    if (!html.includes("https://arestaclimb.com/croquis")) errors.push("Home sem link para croquis");
    if (!html.includes("play.google.com/store/apps/details")) errors.push("Home sem Android");
    if (!html.includes("apps.apple.com/")) errors.push("Home sem iOS");
    if (!html.includes(base + "assets/")) errors.push("Assets nao usam base: " + base);
    if (html.includes("Modelo visual. Os dados ainda nao sao enviados")) errors.push("Formulario falso reapareceu");
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

// A previa nao deve competir nos mecanismos de busca com o site oficial.
writeFileSync(join(outDir, "robots.txt"), "User-agent: *\nDisallow: /\n");
writeFileSync(join(outDir, ".nojekyll"), "");
const fourOhFour = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aresta Lab · Pagina nao encontrada</title></head><body style="margin:0;background:#08090d;color:#f7f5f2;font:16px system-ui;display:grid;place-items:center;min-height:100vh;text-align:center"><main><h1>Pagina nao encontrada</h1><p>Este caminho nao existe na previa do Aresta Lab.</p><a style="color:#f0643c" href="' + base + '">Voltar para o inicio</a></main></body></html>';
writeFileSync(join(outDir, "404.html"), fourOhFour);
console.log("Aresta Lab: " + routes.length + " paginas verificadas. Base: " + base);
