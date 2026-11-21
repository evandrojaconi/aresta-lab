import {cpSync,existsSync,mkdirSync,readFileSync,readdirSync,writeFileSync} from "node:fs";
import {join,relative,sep} from "node:path";
// Somente V2. /oficial/ e fonte premium permanecem intactos.
const root=".output/public/v2",base="/"+(process.env.GITHUB_REPOSITORY?.split("/").at(-1)||"aresta-lab")+"/v2/";
if(!existsSync(join(root,"index.html"))||!existsSync(join(root,"blog/index.html")))throw Error("Preparar V2 antes da unificação");
const out=path=>base+path;
cpSync("lab-v2/premium/shared-pages.css",join(root,"shared-pages.css"));
cpSync("lab-v2/premium/shared-pages.js",join(root,"shared-pages.js"));
const pages=[["app/","Aplicativo"],["croquis/","Croquis"],["editor/","Editor"],["comunidade/","Comunidade"],["blog/","Diário de Rocha"]];
function routeFor(path){
 if(path.startsWith("blog/"))return "blog/";
 if(path.startsWith("editor/")||path==="editor.html")return "editor/";
 if(path.startsWith("app")||path.startsWith("download"))return "app/";
 if(path.startsWith("comunidade"))return "comunidade/";
 if(path.startsWith("croquis"))return "croquis/";
 return "";
}
function nav(path){
 const current=routeFor(path);
 const item=([href,label])=>'<a href="'+out(href)+'"'+(current===href?' aria-current="page"':'')+'>'+label+'</a>';
 return '<nav class="lab-unified-nav" aria-label="Navegação principal Aresta Climb">'+
 '<a class="lab-unified-nav__brand" href="'+base+'" aria-label="Aresta Climb — página inicial">'+
 '<span class="lab-unified-nav__mark"><img src="'+out("assets/aresta-climb-simbolo-montanha-branco.svg")+'" width="300" height="167" alt=""></span>'+
 '<span class="lab-unified-nav__name">ARESTA CLIMB</span></a>'+
 '<div class="lab-unified-nav__links">'+pages.map(item).join("")+'</div>'+
 '<div class="lab-unified-nav__actions"><button type="button" class="lab-unified-nav__theme" data-lab-theme aria-label="Alternar tema">☼</button>'+
 '<a class="lab-unified-nav__cta" href="'+out("app/")+'">Baixar App <span aria-hidden="true">→</span></a>'+
 '<details class="lab-unified-nav__mobile"><summary aria-label="Abrir navegação">Menu</summary>'+
 '<div class="lab-unified-nav__drawer">'+pages.map(item).join("")+
 '<a href="'+out("contato/")+'">Contato e suporte</a><a href="'+base+'">Página inicial</a>'+
 '<a class="lab-unified-nav__cta" href="'+out("app/")+'">Baixar aplicativo →</a></div></details></div></nav>';
}
const action=(href,label,secondary=false,external=false)=>
 '<a class="lab-action'+(secondary?' lab-action--secondary':'')+'" href="'+href+'"'+(external?' target="_blank" rel="noopener noreferrer"':'')+'>'+label+' <span aria-hidden="true">↗</span></a>';
function next(path){
 const here=routeFor(path);
 const choices=path.startsWith("editor/beta")?
 [["editor/","Editor para computador"],["app/","Aplicativo"],["contato/","Suporte"]]:
 pages.filter(([url])=>url!==here).slice(0,3);
 return '<section class="lab-next-steps" aria-label="Continue explorando o Aresta">'+
 '<span class="lab-next-steps__eyebrow">MAIS ARESTA · MESMA COMUNIDADE</span>'+
 '<h2>Explore outras formas de chegar à rocha.</h2><div class="lab-next-steps__links">'+
 choices.map(([url,label],i)=>action(out(url),label,i>0)).join("")+'</div></section>';
}
// Apenas <a href>, não alterar canonical, fontes externas ou links de lojas.
function fixLinks(html){
 return html.replace(/<a\b[^>]*>/g,tag=>{
  let t=tag;
  const rules=[
   [/href="https:\/\/arestaclimb\.com\/croquis\/?"/g,'href="'+out("croquis/")+'"'],
   [/href="https:\/\/arestaclimb\.com\/editor\/?"/g,'href="'+out("editor/")+'"'],
   [/href="https:\/\/arestaclimb\.com\/app\/?"/g,'href="'+out("app/")+'"'],
   [/href="https:\/\/arestaclimb\.com\/comunidade\/?"/g,'href="'+out("comunidade/")+'"'],
   [/href="https:\/\/arestaclimb\.com\/?"/g,'href="'+base+'"'],
   [/href="\/aresta-lab\/"/g,'href="'+base+'"']
  ];
  for(const [pattern,replacement] of rules)t=t.replace(pattern,replacement);
  if(t.includes('href="'+base))t=t.replace(/\s+target="_blank"/g,"").replace(/\s+rel="noopener noreferrer"/g,"");
  return t;
 });
}
const assets='<link rel="stylesheet" href="'+out("shared-pages.css")+'"><script defer src="'+out("shared-pages.js")+'"></script>';
function unify(html,path){
 html=fixLinks(html);
 if(path==="index.html"){
  html=html.replace('href="'+base+'">Comunidade oficial','href="'+out("comunidade/")+'">Comunidade oficial');
  return html; // Home já possui navegação, tema e rolagem própria.
 }
 // Remove o aviso visual "Voltar ao laboratório" presente no espelho.
 html=html.replace(/<div style="position:relative;z-index:9999;[^"]*"[^>]*>[\s\S]*?<\/div>/,"");
 if(!html.includes("</head>")||!/<body\b/.test(html))throw Error("HTML incompleto: "+path);
 html=html.replace("</head>",assets+"</head>");
 html=html.replace(/<body([^>]*)>/,(all,attrs)=>{
  if(/\bclass="/.test(attrs))return '<body'+attrs.replace(/\bclass="([^"]*)"/,'class="$1 lab-v2-unified"')+'>';
  return '<body'+attrs+' class="lab-v2-unified">';
 });
 html=html.replace(/(<body[^>]*>)/,'$1'+nav(path));
 if(path.startsWith("blog/")){
  html=html.replace(/<span>Proposta editorial para homologação ·[\s\S]*?<\/span><\/footer>/,
   '<span>Aresta Lab · <a href="'+out("editor/")+'">Editor</a> · <a href="'+out("comunidade/")+'">Comunidade</a></span></footer>');
 }
 const marketing=/^(app\/|app\.html|download\/|download\.html|editor\/|editor\.html|comunidade\/|comunidade\.html|contato\/|contato\.html|blog\/|404\.html)/.test(path);
 if(marketing){
  const end=html.match(/<footer\b[^>]*>/);
  if(end)html=html.replace(end[0],next(path)+end[0]);
  else html=html.replace("</body>",next(path)+"</body>");
 }
 return html;
}
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
let n=0;
for(const filename of walk(root).filter(x=>x.endsWith(".html"))){
 const path=relative(root,filename).split(sep).join("/");
 const before=readFileSync(filename,"utf8");
 writeFileSync(filename,unify(before,path));n++;
}
mkdirSync(join(root,"croquis"),{recursive:true});
const hub=[
'<!doctype html><html lang="pt-BR" data-theme="light"><head><meta charset="utf-8">',
'<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">',
'<title>Croquis Web | Aresta Climb</title><meta name="description" content="Croquis no navegador, planejamento offline e conhecimento comunitário.">',
'<link rel="icon" href="'+out("assets/logo_app.png")+'">'+assets+'</head>',
'<body class="lab-v2-unified lab-site">'+nav("croquis/"),
'<main class="lab-croquis-hub"><span class="lab-kicker">CROQUIS · WEB + APP</span>',
'<h1>Da pesquisa<br>à parede.</h1>',
'<p class="lead">Organize sua escalada com informações de picos, setores, acessos e croquis. Use o navegador para explorar e o aplicativo para levar o conteúdo ao campo.</p>',
'<div class="lab-croquis-grid">',
'<article><span>01 · DESCOBRIR</span><h2>Conheça os picos</h2><p>O catálogo web reúne as informações disponíveis para consulta e planejamento.</p>',
 action("https://arestaclimb.com/croquis","Abrir catálogo oficial",false,true),'</article>',
'<article><span>02 · PREPARAR</span><h2>Leve o conteúdo com você</h2><p>Baixe o app e prepare seus croquis antes de perder o sinal.</p>',
 action(out("app/"),"Conhecer o aplicativo"),'</article>',
'<article><span>03 · CONTRIBUIR</span><h2>Conhecimento vivo</h2><p>Entenda como o Editor e as contribuições ajudam a documentar a escalada.</p>',
 action(out("editor/"),"Conhecer o Editor"),'</article></div>',
'<div class="lab-web-live"><strong>Catálogo de dados em operação</strong><p>Esta é a página de integração visual do Aresta Lab. Os croquis atualizados são consultados no catálogo oficial; não apresentamos aqui uma cópia de dados que pode ficar desatualizada.</p>',
 action("https://arestaclimb.com/croquis","Ir ao catálogo oficial de croquis",false,true),
'</div></main>',next("croquis/"),
'<footer class="lab-blog-footer"><a href="'+base+'" class="lab-footer-brand">ARESTA CLIMB</a><span>Menos incerteza. Mais parede. · <a href="'+out("blog/")+'">Diário de Rocha</a></span></footer>',
'</body></html>'].join("");
writeFileSync(join(root,"croquis","index.html"),hub);
if(n<20)throw Error("Poucas páginas processadas: "+n);
console.log("V2: navegação e CTAs unificados em",n,"páginas + Croquis Web.");
