import {existsSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {join} from "node:path";

// Usa a cópia adaptada do HTML V4 original (arquivo editável do design).
// Não toca /oficial/, dados, Editor, CRM, blog publicado nem na baseline V3.1.
const root=".output/public/v2";
const base="/"+(process.env.GITHUB_REPOSITORY?.split("/").at(-1)||"aresta-lab")+"/v2/";
const source=readFileSync("lab-v2/design-v35.html","utf8").replaceAll("/aresta-lab/v2/",base);
if(source.length<80000||!source.includes('class="hero-art"')||
   !source.includes("Feito pela comunidade.")||
   !source.includes('id="route-manifesto"'))
 throw Error("Redesign V3.5 não corresponde ao HTML V4 adaptado");
if(!existsSync(join(root,"app-first/index.html"))||!existsSync(join(root,"visao/index.html")))
 throw Error("Histórico V3.1/V3.4 ausente; não substituir sem cópia navegável");
const prev=readFileSync(join(root,"index.html"),"utf8");
if(!prev.includes('id="territorio"')||!prev.includes('id="descubra-mais"'))
 throw Error("A home anterior não é a V3.4 aprovada");
// Registrar a última versão de página antes do redesign.
mkdirSync(join(root,"anterior-v34"),{recursive:true});
writeFileSync(join(root,"anterior-v34","index.html"),
 prev.replace("</head>",'<base href="'+base+'"></head>'));
writeFileSync(join(root,"index.html"),source);

const institutionalPath=join(root,"apresentacao-institucional");
mkdirSync(institutionalPath,{recursive:true});
writeFileSync(join(institutionalPath,"index.html"),
 readFileSync("lab-v2/apresentacao-institucional.html","utf8"));

// Reutilizar a aparência do HTML de referência nos caminhos estáticos. Uma
// página estática com URL própria é mais navegável que depender só de #/rota.
const style=source.match(/<style>[\s\S]*?<\/style>/)?.[0];
const header=source.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
const footer=source.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0];
if(!style||!header||!footer)throw Error("Cabeçalho, estilo ou footer do HTML V4 ausente");
function links(html){
 return html
  .replaceAll('href="#/home?section=', 'href="'+base+'#/home?section=')
  .replaceAll('href="#/home"','href="'+base+'#/home"')
  .replaceAll('href="#/manifesto"','href="'+base+'manifesto/"')
  .replaceAll('href="#/impacto"','href="'+base+'impacto/"')
  .replaceAll('href="#/transparencia"','href="'+base+'transparencia/"')
  .replaceAll('href="#/blog"','href="'+base+'blog/"')
  .replace(/href="#\/blog\/([^"]+)"/g,(_,slug)=>'href="'+base+'propostas/'+slug+'/"');
}
const nav=links(header),foot=links(footer).replace("© 2026 Aresta Climb · Use. Contribua. Preserve.","© 2026 Aresta Climb · Feito pela comunidade. Aberto para o mundo.");
const mobile='<script>(function(){const t=document.getElementById("mobile-toggle"),n=document.getElementById("nav-items"),h=document.querySelector(".site-header");if(!t||!n)return;t.addEventListener("click",()=>{const open=n.classList.toggle("open");t.setAttribute("aria-expanded",String(open));t.textContent=open?"×":"☰"});n.addEventListener("click",e=>{if(e.target.closest("a")){n.classList.remove("open");t.setAttribute("aria-expanded","false");t.textContent="☰"}});let last=scrollY;addEventListener("scroll",()=>{const y=scrollY;if(h&&y>180&&Math.abs(y-last)>3)h.classList.toggle("is-hidden",y>last);else if(h&&y<65)h.classList.remove("is-hidden");last=y},{passive:true})})();</script>';
const titles={
 manifesto:"Manifesto",
 impacto:"Impacto e preservação",
 transparencia:"Transparência",
 blog:"Histórias que começam na rocha. E seguem pelo território."
};
function pageShell(title,content,label=""){
 return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#d95635">'+
 '<title>'+title+' | Aresta Climb</title><meta name="description" content="Feito pela comunidade. Aberto para o mundo. Informação territorial que começa na escalada."><link rel="icon" href="'+base+'assets/logo_app.png">'+style+
 '</head><body><a class="skip" href="#conteudo">Pular para o conteúdo</a>'+nav+
 '<main id="conteudo">'+label+links(content)+'</main>'+foot+mobile+'</body></html>';
}
const names=["manifesto","impacto","transparencia"];
for(const name of names){
 const fragment=source.match(new RegExp('<template id="route-'+name+'">([\\s\\S]*?)<\\/template>'));
 if(!fragment)throw Error("Página V4 não existe no HTML original: "+name);
 mkdirSync(join(root,name),{recursive:true});
 writeFileSync(join(root,name,"index.html"),pageShell(titles[name],fragment[1]));
}
const topics=["territorio-nao-e-produto","agricultor-escalador-pesquisa",
"informacao-territorial-tempo-real","comunidade-autonomia-confianca",
"impacto-e-transparencia","croqui-e-memoria"];
const status='<aside class="editorial-note"><strong>PROPOSTA EDITORIAL EM REVISÃO</strong> — Texto de posicionamento e análise. Não é notícia publicada nem comprovação de recursos e impactos concluídos.</aside>';
for(const slug of topics){
 const fragment=source.match(new RegExp('<template id="route-blog--'+slug+'">([\\s\\S]*?)<\\/template>'));
 if(!fragment)throw Error("Artigo V4 não existe no HTML original: "+slug);
 const target=join(root,"propostas",slug);mkdirSync(target,{recursive:true});
 writeFileSync(join(target,"index.html"),pageShell(slug.replaceAll("-"," "),fragment[1],status));
}
const postIndex=join(root,"propostas","index.html");
let proposals=readFileSync(postIndex,"utf8");
// Adaptar o cabeçalho e os cartões de propostas ao CSS original sem introduzir
// novos artigos no feed do Diário publicado.
const cards=topics.map(slug=>
 '<a class="article-card" href="'+base+'propostas/'+slug+'/">'+
 '<div class="article-image"><span>PROPOSTA EM REVISÃO</span></div>'+
 '<div class="article-body"><h3>'+slug.replaceAll("-"," ")+'</h3>'+
 '<p>Texto conceitual do Aresta Território. Não publicado como reportagem.</p>'+
 '<span class="article-link">Ler texto em revisão ↗</span></div></a>').join("");
const listing='<section class="section"><div class="wrap"><p class="eyebrow">DIÁRIO DE ROCHA · LABORATÓRIO</p>'+
 '<h1>Ideias em revisão, não notícias publicadas.</h1><p>Seis textos de posicionamento territorial, separados das matérias já publicadas.</p>'+
 '<div class="three-grid">'+cards+'</div><a class="button" href="'+base+'blog/">Ir ao Diário publicado ↗</a></div></section>';
writeFileSync(postIndex,pageShell("Propostas editoriais em revisão",listing));
// Sem depender de cor ou layout antigos nas páginas profundas: links para o
// Diário real permanecem presentes, e o Design V4 é o mesmo da nova home.
for(const name of names){
 const c=readFileSync(join(root,name,"index.html"),"utf8");
 if(!c.includes("--orange:#d95635")||!c.includes("brand-mark"))
  throw Error("Página profunda não herdou identidade V3.1: "+name);
}
console.log("V3.5: HTML V4 original virou a home com cores Aresta + 3 páginas + 6 textos no mesmo design.");
