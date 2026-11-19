import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const slug=process.env.GITHUB_REPOSITORY?.split("/").at(-1)||"aresta-lab";
const base="/"+slug+"/v2/";
const folder=".output/public/v2";
const expected=["index.html","app/index.html","editor/index.html","premium-enhancements.css","premium-enhancements.js",
  "blog.css","blog.js","assets/aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg","design-source.json","source.json","blog/index.html",
  "blog/croqui-nao-comeca-na-parede/index.html","blog/offline-e-preparacao/index.html","blog/territorio-e-comunidade/index.html"];
const errors=[];
for(const p of expected)if(!existsSync(join(folder,p)))errors.push("Arquivo ausente: "+p);
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
const file=p=>readFileSync(join(folder,p),"utf8");
const home=file("index.html"),blog=file("blog/index.html"),css=file("premium-enhancements.css"),body=file("design-source.json");
const source=readFileSync("lab-v2/premium/source.html","utf8");
const checks=[
["hero premium","Menos caça à informação."],["continuação hero","Mais tempo na parede."],
["telas reais","Tela real de setores no Aresta Climb"],
["captura do Editor","Editor Aresta Desktop real"],
["imagem embutida","data:image/webp;base64,"],
["estilo original",":root{--bg:#f5f1e9;"],
["tema original",'id="theme"'],
["seções oficiais",'id="croquis"'],["app",'id="aplicativo"'],["offline",'id="offline"'],
["cobertura",'id="cobertura"'],["autoria",'id="autoria"'],["editor",'id="editor"'],
["código",'id="codigo"'],["comunidade",'id="comunidade"'],["faq",'id="faq"'],
["blog",'id="blog"'],["blog CTA",base+"blog/"],["página web","https://arestaclimb.com/croquis"],
["acesso Editor",base+"editor/"],["acesso App",base+"app/"],
["menu mobile",'class="premiumMobileMenu"'],["CSS de extensão",base+"premium-enhancements.css"],
["anti-indexação",'name="robots" content="noindex,nofollow"'],
["lojas","https://apps.apple.com"],["Play Store","https://play.google.com"]
];
for(const [name,needle] of checks)if(!home.includes(needle))errors.push("Home premium: "+name);
for(const [name,needle] of [["busca",'id="lab-blog-search"'],["filtros","data-blog-filter"],["posts","data-blog-card"],["caminho","noindex,nofollow"]])if(!blog.includes(needle))errors.push("Blog: "+name);
const officialIcon=file("assets/aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg");
const officialLogoSrc=base+"assets/aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg";
if(!home.includes('src="'+officialLogoSrc+'"'))errors.push("Logo oficial: URL do arquivo não usada na navegação");
if(!home.includes('alt="Símbolo oficial do Aresta Climb, aplicativo e guia de croquis de escalada em Belo Horizonte (BH), Minas Gerais"'))errors.push("Logo oficial: texto alternativo SEO incompleto");
if(!home.includes('title="Aresta Climb — croquis e guia de escalada em BH e Minas Gerais"'))errors.push("Logo oficial: título ausente");
if(!officialIcon.includes('viewBox="0 0 343 194"')||!officialIcon.includes('Símbolo oficial Aresta Climb'))errors.push("Logo oficial: arquivo SVG inválido ou sem identificação");
if(home.includes('src="data:image/webp;base64,UklGRj4AAABXRUJQ'))errors.push("Logo placeholder antiga ainda presente");
if(!css.includes("premiumMobileMenu"))errors.push("CSS mobile ausente");
if(!body.includes("HTML premium integral"))errors.push("Metadados sem origem exata");
if(source.length<750000||home.length<750000)errors.push("Imagens premium ausentes ou arquivo truncado");
if(home.includes("Quer um Beta?<br>")||home.includes("Menos incerteza.<br>"))errors.push("Landing antiga ainda presente");
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Premium V2 QA OK: fonte intacta + navegação + blog + páginas oficiais; origem",source.length,"chars");
