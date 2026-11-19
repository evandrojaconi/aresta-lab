import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const slug=process.env.GITHUB_REPOSITORY?.split("/").at(-1) || "aresta-lab";
const base="/" + slug + "/oficial/";
const source="official-source/dist", dest=".output/public/oficial";
if (!existsSync(join(source,"index.html"))) throw Error("Build oficial inexistente");
mkdirSync(dest,{recursive:true});
cpSync(source,dest,{recursive:true});

const routes=new Set(["app","download","editor","comunidade","contato","termos-de-uso","politica-de-privacidade","politica-de-privacidade-editor","privacidade-contribuidores","termos-de-uso-fixalog","politica-de-privacidade-fixalog"]);
for (const route of routes) {
  const src=join(dest,route+".html");
  if (existsSync(src)) {
    mkdirSync(join(dest,route),{recursive:true});
    cpSync(src,join(dest,route,"index.html"));
  }
}

function rewriteTarget(path) {
  if (path.startsWith(base.slice(1))) return "/" + path;
  if (path==="croquis" || path.startsWith("croquis/")) return "https://arestaclimb.com/" + path;
  const [pathname,suffix]=[path.split(/[?#]/)[0],path.slice(path.split(/[?#]/)[0].length)];
  if (routes.has(pathname)) return base+pathname+"/"+suffix;
  return base+path;
}
function processHtml(text) {
  let html=text.replace(/\b(href|src|action|data-doc)=(["'])\/(?!\/)([^"']*)\2/gi,
    (_match,attr,quote,path)=>attr+"="+quote+rewriteTarget(path)+quote);
  html=html.replace(/<head(\s[^>]*)?>/i,tag=>tag+'\n<meta name="robots" content="noindex, nofollow">\n');
  html=html.replace(/<script\b[^>]*src=["']https:\/\/analytics\.arestaclimb\.com\/script\.js["'][^>]*><\/script>/gi,"");
  const badge='<div style="position:relative;z-index:9999;padding:10px 16px;text-align:center;background:#1d1c19;color:#f4f1e9;font:600 12px system-ui">ARESTA LAB · Espelho do site oficial (homologação) · <a style="color:#e7b198" href="/'+slug+'/">Voltar ao laboratório</a></div>';
  html=html.replace(/<body(\s[^>]*)?>/i,tag=>tag+badge);
  return html;
}
function walk(folder) {
  const a=[];
  for(const item of readdirSync(folder,{withFileTypes:true})){
    const path=join(folder,item.name);
    if(item.isDirectory()) a.push(...walk(path));
    else a.push(path);
  }
  return a;
}
let htmlCount=0;
for(const path of walk(dest)) {
  if(path.endsWith(".html")) {
    writeFileSync(path,processHtml(readFileSync(path,"utf8")));
    htmlCount++;
  }else if(path.endsWith(".js")||path.endsWith(".css")) {
    let code=readFileSync(path,"utf8");
    // Referências dinâmicas a assets não são reescritas pelo Vite automaticamente.
    code=code.replace(/(["'(=:])\/assets\//g,(_m,prefix)=>prefix+base+"assets/");
    code=code.replace(/(["'(=:])\/brand\//g,(_m,prefix)=>prefix+base+"brand/");
    code=code.replace(/(["'(=:])\/docs\//g,(_m,prefix)=>prefix+base+"docs/");
    writeFileSync(path,code);
  }
}
writeFileSync(join(dest,"robots.txt"),"User-agent: *\nDisallow: /\n");
const fallback='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aresta Lab · Página não encontrada</title></head><body style="background:#f4f1e9;color:#1d1c19;font:16px system-ui;margin:3rem"><h1>Página não encontrada na prévia</h1><a href="'+base+'">Voltar ao espelho</a></body></html>';
writeFileSync(join(dest,"404.html"),fallback);
for(const route of ["index.html","app/index.html","editor/index.html","comunidade/index.html"]) {
  if(!existsSync(join(dest,route))) throw Error("Página faltando no espelho: "+route);
}
const index=readFileSync(join(dest,"index.html"),"utf8");
for(const test of ["https://arestaclimb.com/croquis",base+"assets/",'name="robots" content="noindex, nofollow"']) {
  if(!index.includes(test)) throw Error("Verificação falhou: "+test);
}
const sha=execFileSync("git",["-C","official-source","rev-parse","HEAD"],{encoding:"utf8"}).trim();
writeFileSync(join(dest,"source.json"),JSON.stringify({source:"aresta-climb/arestaclimb.com",sha,createdAt:new Date().toISOString(),base,notice:"Cópia estática. Catálogo /croquis permanece no domínio oficial."},null,2)+"\n");
console.log("Espelho oficial gerado:",base,"revisão",sha,"páginas HTML",htmlCount);
