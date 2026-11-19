import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const baseDir = ".output/public/v2";
const base = "/" + (process.env.GITHUB_REPOSITORY?.split("/").at(-1) || "aresta-lab") + "/v2/";
const expected = [
  "index.html", "styles.css", "script.js", "design.css", "enhancements.js",
  "brand/aresta-logo.png", "app/index.html", "editor/index.html",
  "blog/index.html", "blog/croqui-nao-comeca-na-parede/index.html",
  "blog/offline-e-preparacao/index.html", "blog/territorio-e-comunidade/index.html",
  "source.json", "design-source.json"
];
const failures=[];
for(const file of expected) if(!existsSync(join(baseDir,file)))failures.push("Faltando: "+file);
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
const home=readFileSync(join(baseDir,"index.html"),"utf8");
const blog=readFileSync(join(baseDir,"blog/index.html"),"utf8");
const source=readFileSync(join(baseDir,"design-source.json"),"utf8");
const css=readFileSync(join(baseDir,"styles.css"),"utf8");
const js=readFileSync(join(baseDir,"script.js"),"utf8");
const enhancements=readFileSync(join(baseDir,"enhancements.js"),"utf8");
for(const [name,content,needles] of [
  ["Home",home,["Menos incerteza.","Mais parede.","RETRATO HISTÓRICO","05/08/2026","id=\"beta-form\"","id=\"web\"","id=\"blog\"","id=\"transparencia\"","noindex, nofollow","https://arestaclimb.com/croquis",base+"styles.css",base+"design.css",base+"script.js",base+"enhancements.js","Navegação móvel","Baixar aplicativo"]],
  ["Blog",blog,["id=\"lab-blog-search\"","data-blog-filter=\"territorio\"","data-blog-card","Nenhuma história encontrada","noindex,nofollow"]],
  ["CSS",css,["--orange: #d95635","--paper: #f1ede4",".phone-stage",".journey-grid",".beta-form"]],
  ["Contato",js,["mailto:contato@arestaclimb.com","conditionalTemplates","form.addEventListener"]],
  ["Interações",enhancements,["route-marker","lab-blog-search","data-blog-filter","data-share-article"]],
  ["Origem",source,["2026-08-31","Google Drive","noBackendContact"]]
]) for(const needle of needles) if(!content.includes(needle)) failures.push(name+": "+needle);
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Aresta V2 Drive: arquivos, referências, formulários, web e blog validados. Base:",base);
