import {existsSync,readFileSync,statSync} from "node:fs";
import {dirname,join,normalize,resolve,extname} from "node:path";

const dir=".output/public/v2/app-first";
const page=join(dir,"index.html");
if(!existsSync(page))throw Error("Experimento App First não foi gerado");
const html=readFileSync(page,"utf8");
const css=readFileSync(join(dir,"style.css"),"utf8");
const script=readFileSync(join(dir,"app.js"),"utf8");
const errors=[];
const need=(text,label)=>{if(!html.includes(text))errors.push("Falta "+label);};
for(const [key,label] of [
 ['<h1>Escalada e croquis.',"mensagem app-first"],
 ['Telas reais do aplicativo Aresta Climb',"capturas reais"],
 ['id="recursos"',"recursos"],
 ['id="croquis"',"croquis"],
 ['id="offline"',"offline"],
 ['id="comunidade"',"comunidade"],
 ['id="duvidas"',"perguntas frequentes"],
 ['id="baixar"',"download"],
 ['name="robots" content="noindex,nofollow"',"noindex"],
 ['../blog/',"Diário de Rocha"],
 ['../editor/',"página para mantenedor"],
 ['href="../app/"',"CTA de download"],
 ['href="../croquis/"',"croquis web"],
 ['href="../comunidade/"',"comunidade"],
 ["https://play.google.com/store/apps/details?id=app.escalada.croquis","Google Play"],
 ["https://apps.apple.com/us/app/aresta-climb-guia-de-escalada/id6776467893","App Store"]
])need(key,label);
if(/smartHome|smart home|home automation|client testimonials/i.test(html))errors.push("Texto do template de referência entrou indevidamente");
if(!css.includes("@media(max-width:720px)")||!css.includes("@media(max-width:430px)"))errors.push("Responsive CSS ausente");
if(!css.includes(".site-header.is-hidden"))errors.push("Scroll tipo notificação ausente");
for(const text of ["nav-mobile","Escape","requestAnimationFrame","faq"])if(!script.includes(text))errors.push("JS sem "+text);
const images=[
 "explorar-locais.png","pedra-grande.png","croqui-interativo.png",
 "comunidade-pico.png","setor-principal.png"
];
for(const file of images) {
  const target=join(".output/public/v2/assets/app",file);
  if(!existsSync(target)||statSync(target).size<50000)errors.push("Falta captura real: "+target);
  need("src=\"../assets/app/"+file+"\"","uso da captura "+file);
}
const base=resolve(dir);
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1];
  if(href.startsWith("#")||/^(?:https?:|mailto:|tel:|data:)/.test(href))continue;
  if(!href.startsWith("../")&&!href.startsWith("./")&&!/^[\w.\/-]+$/.test(href)){errors.push("URL insegura: "+href);continue;}
  const full=normalize(join(base,href));
  if(!full.startsWith(resolve(".output/public/v2/")))errors.push("Destino escapou da V2: "+href);
  else {
    let target=full;
    if(!extname(target))target=join(target,"index.html");
    if(!existsSync(target))errors.push("Link ou asset não encontrado: "+href);
  }
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("App First QA OK: telas reais, responsividade, escada de conteúdo e rotas internas.");
