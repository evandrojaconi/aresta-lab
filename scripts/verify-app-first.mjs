import {existsSync,readFileSync,statSync} from "node:fs";
import {dirname,join,normalize,resolve,extname} from "node:path";

const dir=".output/public/v2/app-first";
const page=join(dir,"index.html");
if(!existsSync(page))throw Error("Experimento App First não foi gerado");
const html=readFileSync(page,"utf8");
const home=readFileSync(".output/public/v2/index.html","utf8");
const original=readFileSync(".output/public/v2/visao/index.html","utf8");
const project=readFileSync(".output/public/v2/projeto/index.html","utf8");
const mergedCss=readFileSync(join(dir,"legacy-merge.css"),"utf8");
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
// V3: App First é a porta de entrada; premium anterior continua navegável.
for(const [value,label] of [
 ["Escalada e croquis.","promessa principal na raiz"],
 ['href="app-first/style.css"',"estilo correto na raiz"],
 ['href="app-first/legacy-merge.css"',"camada editorial na raiz"],
 ['src="app-first/app.js"',"JS da home na raiz"],
 ['href="visao/"',"referência à versão anterior"],
 ['href="blog/"',"Diário de Rocha na home"],
 ['href="projeto/"',"caminho de aprofundamento"],
 ['href="blog/historia-escalada-gruta-da-lapinha/"',"artigo inaugural na home"],
 ['id="descubra-mais"',"trilhas de aprofundamento"],
 ['id="diario"',"Diário integrado"],
 ['name="robots" content="noindex,nofollow"',"prévia com noindex"]
])if(!home.includes(value))errors.push("V3 home sem "+label);
if(!original.includes("Menos caça à informação.")||!original.includes('id="codigo"')||original.length<610000)
 errors.push("V2 premium não foi preservada integralmente em /visao/");
if(!project.includes("O Aresta Climb ajuda o escalador")||
   !project.includes("aresta-editor-painel-qualidade-real-2026-11-20.webp")||
   !project.includes('href="../visao/"'))errors.push("Página do projeto não integrou os conteúdos existentes");
if(!mergedCss.includes(".journal-grid")||!mergedCss.includes(".pathway-grid")||
   !mergedCss.includes("@media(max-width:720px)"))errors.push("Camadas editoriais não são responsivas");
for(const [part,label] of [
 ['id="nav-deeper"',"menu Sobre no desktop"],
 ['id="nav-mobile"',"menu mobile"],
 ['href="../blog/"',"blog no menu"],
 ['href="../projeto/"',"caminho para o projeto"]
])if(!html.includes(part))errors.push("App First sem "+label);
// Rotas internas relativas de todas as páginas integradas, incluindo a nova raiz.
const verifyRelative=(content,sourceFile)=>{
 const basedir=dirname(resolve(sourceFile));
 for(const m of content.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1];
  if(!href||href.startsWith("#")||/^(?:https?:|mailto:|tel:|data:)/.test(href))continue;
  const targetFile=href.split(/[?#]/)[0]; if(!targetFile)continue;
  let full=normalize(join(basedir,targetFile));
  if(!full.startsWith(resolve(".output/public/v2/"))) {errors.push(sourceFile+" escapou da V2: "+href);continue;}
  if(!extname(full))full=join(full,"index.html");
  if(!existsSync(full))errors.push(sourceFile+" tem rota inexistente: "+href);
 }
};
verifyRelative(home,".output/public/v2/index.html");
verifyRelative(project,".output/public/v2/projeto/index.html");
verifyRelative(original,".output/public/v2/visao/index.html");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("App First QA OK: telas reais, responsividade, escada de conteúdo e rotas internas.");
