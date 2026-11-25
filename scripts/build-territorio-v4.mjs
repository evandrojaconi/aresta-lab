import {cpSync,existsSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {join} from "node:path";
// Executar após build-app-first; preserva /oficial/ e a premium /v2/visao/.
const root=".output/public/v2",repo=process.env.GITHUB_REPOSITORY?.split("/").at(-1)||"aresta-lab",base="/"+repo+"/v2/";
const obj=JSON.parse(readFileSync("lab-v2/app-first/territorio-v4-content.json","utf8"));
if(obj.pages.length!==3||obj.essays.length!==6)throw Error("V4: quantidade inesperada de páginas");
const esc=x=>String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const loc=p=>base+p;
const css=readFileSync("lab-v2/app-first/territorio-v4.css","utf8");
if(!css.includes("SEM ALTERAR A PALETA"))throw Error("Preservação de paleta V3.1 não documentada");
cpSync("lab-v2/app-first/territorio-v4.css",join(root,"app-first","territorio-v4.css"));
const nav=()=>[
'<header class="site-header" id="site-header"><nav class="nav wrap" aria-label="Navegação principal">',
'<a class="brand" href="'+base+'" aria-label="Aresta Climb — início"><span class="brand-mark"><img src="'+loc("assets/aresta-climb-simbolo-montanha-branco.svg")+'" width="42" height="25" alt=""></span><span class="brand-word">ARESTA <b>CLIMB</b></span></a>',
'<div class="nav-links"><a href="'+base+'#recursos">Aplicativo</a><a href="'+loc("croquis/")+'">Croquis</a><a href="'+loc("blog/")+'">Diário de Rocha</a>',
'<details class="nav-deeper" id="nav-deeper"><summary>Sobre</summary><div class="deeper-links">',
...["Território|#territorio","Oportunidades|#oportunidades","Manifesto|manifesto/","Impacto|impacto/","Transparência|transparencia/","O projeto|projeto/"].map(s=>{const [name,p]=s.split("|");return '<a href="'+(p.startsWith("#")?base+p:loc(p))+'">'+name+'</a>';}),
'</div></details></div><div class="nav-actions"><a class="button button-nav" href="'+loc("app/")+'">Baixar app <span aria-hidden="true">↗</span></a>',
'<details class="nav-mobile" id="nav-mobile"><summary aria-label="Abrir navegação">Menu <span aria-hidden="true">☰</span></summary><div class="nav-drawer">',
...["Aplicativo|","Croquis|croquis/","Diário de Rocha|blog/","Território|#territorio","Oportunidades|#oportunidades","Manifesto|manifesto/","Impacto|impacto/","Transparência|transparencia/","O projeto|projeto/"].map(s=>{const [name,p]=s.split("|");return '<a href="'+(p.startsWith("#")?base+p:loc(p))+'">'+name+'</a>';}),
'<a class="button" href="'+loc("app/")+'">Baixar aplicativo ↗</a></div></details></div></nav></header>'
].join("");
const footer=()=>[
'<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"><div class="footer-lockup"><span class="footer-mark"><img src="'+loc("assets/aresta-climb-simbolo-montanha-branco.svg")+'" width="34" height="20" alt=""></span> ARESTA CLIMB</div><p>Feito pela comunidade. Aberto para o mundo. Informação territorial que começa na escalada.</p></div>',
'<div><h3>Escalada</h3><a href="'+loc("app/")+'">Baixar aplicativo</a><a href="'+loc("croquis/")+'">Croquis Web</a><a href="'+loc("editor/")+'">Editor</a><a href="'+loc("comunidade/")+'">Comunidade</a></div>',
'<div><h3>Aresta</h3><a href="'+loc("manifesto/")+'">Manifesto</a><a href="'+loc("impacto/")+'">Impacto</a><a href="'+loc("transparencia/")+'">Transparência</a><a href="'+loc("blog/")+'">Diário de Rocha</a></div>',
'<div><h3>Conectar</h3><a href="https://github.com/aresta-climb/aresta_app" target="_blank" rel="noopener noreferrer">GitHub</a><a href="'+loc("contato/")+'">Contato</a><a href="'+loc("termos-de-uso/")+'">Termos de uso</a><a href="'+loc("politica-de-privacidade/")+'">Privacidade</a></div></div>',
'<div class="wrap footer-bottom"><span>© 2026 ARESTA CLIMB · FEITO PELA COMUNIDADE. ABERTO PARA O MUNDO.</span><span>Prévia do laboratório · não publicada no domínio oficial</span></div></footer>'
].join("");
const shell=(title,body)=>[
'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
'<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#d95635"><title>'+esc(title)+' | Aresta Climb</title>',
'<meta name="description" content="'+esc(title)+' — Aresta Climb. Feito pela comunidade. Aberto para o mundo.">',
'<link rel="icon" href="'+loc("assets/logo_app.png")+'">',
'<link rel="stylesheet" href="'+loc("app-first/style.css")+'"><link rel="stylesheet" href="'+loc("app-first/legacy-merge.css")+'"><link rel="stylesheet" href="'+loc("app-first/territorio-v4.css")+'">',
'<script defer src="'+loc("app-first/app.js")+'"></script></head><body><a class="skip" href="#conteudo">Pular para o conteúdo</a>',
nav(),body,footer(),'</body></html>'
].join("");
function section(s){
 if(s.quote)return '<blockquote>'+esc(s.quote)+'</blockquote>';
 const pars=(s.paragraphs||[]).map(p=>'<p>'+esc(p)+'</p>').join("");
 const steps=s.steps?'<div class="lab-territory-steps">'+s.steps.map(([h,p])=>'<article><strong>'+esc(h)+'</strong><p>'+esc(p)+'</p></article>').join("")+'</div>':"";
 return '<section><h2>'+esc(s.heading)+'</h2>'+pars+steps+'</section>';
}
function body(eyebrow,title,lead,sections,notice,back){
 return [
 '<main id="conteudo" class="lab-territory-page"><div class="wrap lab-territory-inner">',
 '<div class="lab-territory-head"><p class="eyebrow eyebrow-rust">'+esc(eyebrow)+'</p><h1>'+esc(title)+'</h1><p>'+esc(lead)+'</p></div>',
 '<div class="lab-territory-sections">'+sections.map(section).join("")+'</div>',
 '<aside class="lab-territory-status"><strong>ESTADO DA PUBLICAÇÃO:</strong> '+esc(notice)+'</aside>',
 '<div class="lab-territory-actions"><a class="button button-dark" href="'+loc("app/")+'">Conhecer o aplicativo ↗</a><a class="button button-outline" href="'+loc(back)+'">Voltar e explorar ↗</a></div>',
 '</div></main>'].join("");
}
const seen=new Set();
for(const page of obj.pages){
 if(seen.has(page.slug))throw Error("Página duplicada "+page.slug);seen.add(page.slug);
 const html=shell(page.title,body(page.eyebrow,page.title,page.lead,page.sections,page.notice,""));
 mkdirSync(join(root,page.slug),{recursive:true});
 writeFileSync(join(root,page.slug,"index.html"),html);
}
const draftNotice="PROPOSTA EDITORIAL EM REVISÃO. Não é publicação jornalística validada. Hipóteses e recursos futuros são identificados como visão.";
for(const essay of obj.essays){
 if(seen.has(essay.slug))throw Error("Slug duplicado "+essay.slug);seen.add(essay.slug);
 const blocks=essay.sections.map(([heading,...paragraphs])=>({heading,paragraphs}));
 const html=shell(essay.title,body(essay.tag+" · DIÁRIO DE ROCHA · "+essay.reading+" · PROPOSTA",essay.title,essay.subtitle,blocks,draftNotice,"propostas/"));
 const target=join(root,"propostas",essay.slug);mkdirSync(target,{recursive:true});
 writeFileSync(join(target,"index.html"),html);
}
const cards=obj.essays.map(e=>'<article><span>PROPOSTA EDITORIAL · '+esc(e.tag)+'</span><h2>'+esc(e.title)+'</h2><p>'+esc(e.subtitle)+'</p><a href="'+loc("propostas/"+e.slug+"/")+'">Ler texto em revisão ↗</a></article>').join("");
const listing='<main id="conteudo" class="lab-territory-page"><div class="wrap lab-territory-inner">'+
 '<div class="lab-territory-head"><p class="eyebrow eyebrow-rust">DIÁRIO DE ROCHA · LABORATÓRIO EDITORIAL</p><h1>Ideias em revisão, não notícias publicadas.</h1><p>Seis propostas textuais da Copy V4. Não fazem parte do acervo publicado do Diário; mantêm hipóteses e recursos futuros identificados para revisão humana.</p></div>'+
 '<div class="lab-editorial-index">'+cards+'</div><div class="lab-territory-actions"><a class="button button-dark" href="'+loc("blog/")+'">Ver Diário publicado ↗</a></div></div></main>';
mkdirSync(join(root,"propostas"),{recursive:true});
writeFileSync(join(root,"propostas","index.html"),shell("Propostas editoriais do Diário de Rocha",listing));
const blogFile=join(root,"blog","index.html"),blog=readFileSync(blogFile,"utf8");
if(!blog.includes("</main>"))throw Error("Blog não possui fechamento de main");
const insertion='<section class="lab-v4-drafts" style="--orange:var(--accent);--orange-dark:var(--accent2)">'+
 '<span class="eyebrow eyebrow-rust">LABORATÓRIO EDITORIAL · CONTEÚDO EM REVISÃO</span>'+
 '<h2>O território também gera perguntas.</h2><p>Seis propostas sobre memória, comunidade, ciência, impacto e oportunidades aguardam revisão. Não são reportagens publicadas.</p>'+
 '<a href="'+loc("propostas/")+'">Conhecer os textos em desenvolvimento ↗</a></section>';
writeFileSync(blogFile,blog.replace("</main>",insertion+"</main>").replace("</head>",'<link rel="stylesheet" href="'+loc("app-first/territorio-v4.css")+'"></head>'));
for(const path of ["manifesto/","impacto/","transparencia/","propostas/"])
 if(!existsSync(join(root,path,"index.html")))throw Error("Rota ausente: "+path);
console.log("V3.4: 3 páginas territoriais e 6 propostas editoriais na paleta V3.1.");
