import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repo = process.env.GITHUB_REPOSITORY?.split("/").at(-1) || "aresta-lab";
const original = "/" + repo + "/oficial/";
const base = "/" + repo + "/v2/";
const from = ".output/public/oficial";
const to = ".output/public/v2";
if (!existsSync(join(from, "index.html"))) throw Error("Gerar primeiro o espelho oficial");
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true });
const read = path => readFileSync(join(to, path), "utf8");
const write = (path, content) => writeFileSync(join(to, path), content);
const link = path => base + path;
const posts = JSON.parse(readFileSync("lab-v2/posts.json", "utf8"));
const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(ent => ent.isDirectory() ? walk(join(dir,ent.name)) : [join(dir,ent.name)]);
}

// Reutiliza TODOS os arquivos compilados da landing oficial, mas em uma URL independente.
for (const path of walk(to)) {
  if (!/\.(html|js|css|json|xml)$/.test(path)) continue;
  let source = readFileSync(path, "utf8").split(original).join(base);
  source = source.replace(/ARESTA LAB · Espelho do site oficial \(homologação\)/g, "ARESTA LAB · NOVA DIREÇÃO VISUAL · PROTÓTIPO");
  writeFileSync(path, source);
}
// A marca oficial vem da imagem enviada pelo usuário; mantém a fonte premium imutável.
mkdirSync(join(to, "assets"), {recursive:true});
cpSync("lab-v2/premium/assets/aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg",join(to, "assets", "aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg"));
cpSync("lab-v2/premium/assets/gruta-da-lapinha-mapa-historico-2002.webp",join(to,"assets","gruta-da-lapinha-mapa-historico-2002.webp"));
write("premium-enhancements.css", readFileSync("lab-v2/premium/enhancements.css", "utf8"));
write("premium-enhancements.js", readFileSync("lab-v2/premium/enhancements.js", "utf8"));
write("blog.css", readFileSync("lab-v2/premium/blog.css", "utf8"));
write("blog.js", readFileSync("lab-v2/premium/blog.js", "utf8"));
const category = post => post.category || (post.slug === "offline-e-preparacao" ? "produto" : post.slug === "territorio-e-comunidade" ? "territorio" : "cultura");
const card = (post, i) =>
  '<a class="lab-article-card' + (post.featured ? ' lab-article-card--featured' : '') + '" data-blog-card data-category="' + category(post) + '" href="' + link("blog/" + post.slug + "/") + '">' +
  '<div class="lab-article-photo"><img src="' + link(post.image) + '" alt="' + esc(post.imageAlt || "") + '" loading="lazy"><span class="lab-article-no">0' + (i+1) + '</span></div>' +
  '<div class="lab-article-copy"><span class="lab-article-tag">' + (post.featured ? 'ESTREIA · ' : '') + esc(post.tag) + ' · ' + esc(post.reading) + '</span>' +
  '<h3>' + esc(post.title) + '</h3><p>' + esc(post.summary) + '</p><span class="lab-readmore">Ler história <span aria-hidden="true">↗</span></span></div></a>';

// A referência visual é o index.html original de 31/08/2026,
// versionado dentro do Lab. O código oficial continua preservado em /oficial/.
// O HTML PREMIUM fornecido pelo usuário é a fonte visual integral desta página.
// Não usar o protótipo de agosto nem reconstituir telas com CSS. Imagens já estão embutidas.
let html = readFileSync("lab-v2/premium/source.html", "utf8");
if (html.length < 750000 || !html.includes("Menos caça à informação.") || !html.includes("Tela real de setores")) {
  throw Error("Arquivo premium original ausente ou incompleto");
}
function replaceOnce(needle, value, label) {
  const count = html.split(needle).length - 1;
  if (count !== 1) throw Error("Fonte premium alterada em " + label + ": " + count);
  html = html.replace(needle, value);
}
replaceOnce("</head>",
  '<meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="' + link("premium-enhancements.css") + '">' +
  '<script defer src="' + link("premium-enhancements.js") + '"></script></head>', "head");
// Quatro destinos principais + agrupamento. Nenhuma seção da landing é apagada.
const sourceNavigation =
  '<div class="navLinks"><a class="active" href="#aplicativo">Aplicativo</a>' +
  '<a href="#offline">Offline</a><a href="#cobertura">Cobertura</a>' +
  '<a href="#autoria">Autoria</a><a href="#editor">Editor</a>' +
  '<a href="#codigo">Código Aberto</a><a href="#faq">FAQ</a></div>';
const compactNavigation =
  '<div class="navLinks">' +
  '<a class="active" href="#aplicativo">Aplicativo</a>' +
  '<a href="https://arestaclimb.com/croquis">Croquis</a>' +
  '<a href="#comunidade">Comunidade</a>' +
  '<a href="' + link("blog/") + '">Diário de Rocha</a>' +
  '<details class="premiumMore"><summary aria-label="Abrir mais informações sobre o Aresta">Sobre</summary>' +
  '<div class="moreMenu"><a href="#croquis">Por que Aresta</a>' +
  '<a href="#editor" class="highlightLink">Editor Aresta</a>' +
  '<a href="#offline">Acesso offline</a><a href="#cobertura">Picos e cobertura</a>' +
  '<a href="#autoria">Autoria e comunidade</a><a href="#codigo">Código aberto</a>' +
  '<a href="#faq">Dúvidas frequentes</a></div></details></div>';
replaceOnce(sourceNavigation,compactNavigation,"menu principal simplificado");
// Substitui só o marcador visual original (uma miniatura de 66 bytes) pelo símbolo oficial.
const markPattern=/<span class="mark"><img src="data:image\/webp;base64,[^"]+" alt=""><\/span>/g;
const markHits=[...html.matchAll(markPattern)];
if(markHits.length!==1)throw Error("Imagem de logo original não encontrada: "+markHits.length);
html=html.replace(markPattern,
  '<span class="mark"><img src="' + link("assets/aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg") + '" width="343" height="194" alt="Símbolo oficial do Aresta Climb, aplicativo e guia de croquis de escalada em Belo Horizonte (BH), Minas Gerais" title="Aresta Climb — croquis e guia de escalada em BH e Minas Gerais" decoding="async"></span>');
const menu =
  '<details class="premiumMobileMenu"><summary aria-label="Abrir menu de navegação">Menu</summary>' +
  '<div class="mobileMenuLinks">' +
  '<a class="mobileDownload" href="' + link("app/") + '">Baixar aplicativo ↗</a>' +
  '<a href="#aplicativo">Aplicativo</a>' +
  '<a href="https://arestaclimb.com/croquis" class="premiumMenuAccent">Croquis ↗</a>' +
  '<a href="#comunidade">Comunidade</a>' +
  '<a href="' + link("blog/") + '" class="premiumMenuAccent">Diário de Rocha ↗</a>' +
  '<div class="menuSectionTitle">Conheça o Aresta</div>' +
  '<a href="#croquis">Por que Aresta</a><a href="#editor">Editor Aresta</a>' +
  '<a href="#offline">Acesso offline</a><a href="#cobertura">Picos e cobertura</a>' +
  '<a href="#autoria">Autoria e comunidade</a><a href="#codigo">Código aberto</a>' +
  '<a href="#faq">Dúvidas frequentes</a></div></details>';
replaceOnce('<button class="theme" id="theme" aria-label="Alternar tema">☼</button>',
  '<button class="theme" id="theme" aria-label="Alternar tema">☼</button>' + menu, "mobile navigation");
// Barra de navegação fora da seção hero (overflow:hidden) para rolagem persistente.
const navStartTag='<div class="navWrap"><div class="wrap"><nav class="nav">';
const navCloseTag='</nav></div></div>';
const navStart=html.indexOf(navStartTag);
const navClose=html.indexOf(navCloseTag,navStart);
if(navStart<0 || navClose<0 || html.indexOf(navStartTag,navStart+1)!==-1) {
  throw Error("Não foi possível isolar o header premium sem perder a fonte");
}
const navHTML=html.slice(navStart,navClose+navCloseTag.length);
html=html.slice(0,navStart)+html.slice(navClose+navCloseTag.length);
replaceOnce('<body>\n<section class="hero" id="inicio">',
  '<body>\n' + navHTML + '\n<section class="hero" id="inicio">',
  "header fixo acessível fora do hero");

// O build oficial é copiado no próprio Lab: os links institucionais podem ser testados sem tocar em produção.
html = html.split('https://arestaclimb.com/app').join(link("app/"));
html = html.split('https://arestaclimb.com/editor').join(link("editor/"));
const blogSection =
  '<section class="premiumBlog section" id="blog" aria-labelledby="premium-blog-title"><div class="wrap">' +
  '<div class="blogHeader"><div><div class="caps" style="color:var(--accent2)">Diário de rocha · cultura & território</div>' +
  '<h2 class="display" id="premium-blog-title">O croqui conta a via.<br><span class="accent">A comunidade conta a história.</span></h2></div>' +
  '<div><p>Na estreia, a história da Lapinha e o trabalho de quem cuida da rocha. Memória, informação e comunidade no mesmo lugar.</p>' +
  '<a href="' + link("blog/") + '">Conhecer o Diário de Rocha →</a></div></div>' +
  '<div class="blogCards">' + posts.map(post =>
    '<a class="blogCard" href="' + link("blog/" + post.slug + "/") + '"><span class="blogTag">' + esc(post.tag) + ' · ' + esc(post.reading) + '</span>' +
    '<h3>' + esc(post.title) + '</h3><p>' + esc(post.summary) + '</p><span class="blogRead">Ler história →</span></a>'
  ).join("") + '</div><small>Estreia baseada em pesquisa acadêmica e fontes do território; outros artigos seguem como conteúdos piloto.</small></div></section>\n';
replaceOnce('<section class="faq section" id="faq">',blogSection+'<section class="faq section" id="faq">',"blog section");
write("index.html",html);
write("design-source.json", JSON.stringify({
  original:"aresta-climb-home-premium-conteudo-oficial-LEVE(2).html",
  localSource:"lab-v2/premium/source.html",
  sourceType:"HTML premium integral fornecido pelo usuário",
  includesOriginalMedia:true,
  changes:["noindex","links institucionais de homologação","menu acessível para mobile","atalho do catálogo web","Diário de Rocha"],
  disclaimer:"O site de produção e o espelho oficial estão intactos."
},null,2)+"\n");
// A mesma marca vetorial da home premium deve aparecer no cabeçalho e rodapé
// de todas as páginas do blog. Não reconstruir símbolos com texto ou emoji.
// Metadados de compartilhamento específicos para publicações editoriais com fontes.
function articleMeta(post) {
  if(!post || !post.date) return "";
  const url="https://evandrojaconi.github.io"+link("blog/"+post.slug+"/");
  const imageUrl="https://evandrojaconi.github.io"+link(post.image);
  const structured={
    "@context":"https://schema.org","@type":"BlogPosting",headline:post.title,
    description:post.summary,inLanguage:"pt-BR",datePublished:post.date,
    dateModified:post.date,mainEntityOfPage:url,image:imageUrl,
    author:{"@type":"Organization",name:post.author||"Aresta Climb"},
    publisher:{"@type":"Organization",name:"Aresta Climb",url:"https://arestaclimb.com/"},
    isBasedOn:"https://www.biblioteca.pucminas.br/teses/TratInfEspacial_LaraDC_1.pdf"
  };
  return '<meta property="og:type" content="article">'+
    '<meta property="og:title" content="'+esc(post.title)+'">'+
    '<meta property="og:description" content="'+esc(post.summary)+'">'+
    '<meta property="og:image" content="'+imageUrl+'">'+
    '<meta property="og:url" content="'+url+'">'+
    '<meta name="article:published_time" content="'+esc(post.date)+'">'+
    '<script type="application/ld+json">'+JSON.stringify(structured).replace(/</g,"\\u003c")+'</script>';
}
function shell(title, body, post=null) {
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">' +
  '<title>' + esc(title) + ' · Aresta Climb — Diário de Rocha</title>' +
  '<meta name="description" content="' + esc(post?.summary || "Histórias de croquis, escalada em rocha, preparação e território.") + '">' + articleMeta(post) +
  '<link rel="icon" href="' + link("assets/logo_app.png") + '"><link rel="stylesheet" href="' + link("blog.css") + '"><script defer src="' + link("blog.js") + '"></script></head>' +
  '<body class="lab-site"><nav class="lab-blog-nav" aria-label="Navegação do Diário">' +
  '<a href="' + link("") + '" class="brandlink lab-brand-lockup" aria-label="Aresta Climb — página inicial">' +
  '<span class="lab-brand-mark"><img src="' + link("assets/aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg") + '" width="343" height="194" alt="Símbolo oficial Aresta Climb" decoding="async"></span>' +
  '<span class="lab-brand-name">ARESTA CLIMB</span></a><div class="links">' +
  '<a href="' + link("") + '">Aresta Climb</a><a href="https://arestaclimb.com/croquis">Croquis</a>' +
  '<a href="' + link("blog/") + '">Diário de Rocha</a><a href="' + link("app/") + '">Baixar app</a></div></nav>' +
  body + '<footer class="lab-blog-footer"><a href="' + link("") + '" class="lab-footer-brand" aria-label="Voltar para Aresta Climb">' +
  '<span class="lab-brand-mark"><img src="' + link("assets/aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg") + '" width="343" height="194" alt="" decoding="async" loading="lazy"></span>' +
  '<strong>ARESTA CLIMB</strong></a>' +
  '<span>Proposta editorial para homologação · <a href="https://arestaclimb.com">Site oficial</a> · ' +
  '<a href="' + original + '">Comparar original</a></span></footer></body></html>';
}
mkdirSync(join(to, "blog"), { recursive: true });
const index =
  '<main class="lab-blog-layout"><header class="lab-blog-hero"><div>' +
  '<span class="lab-kicker">EDIÇÃO 01 · GRUTA DA LAPINHA · TERRITÓRIO</span>' +
  '<h1>Diário<br><em>de rocha.</em></h1></div>' +
  '<p>Estreamos com a história da Gruta da Lapinha: da descoberta das vias à luta pelo acesso e ao cuidado coletivo que continua hoje. Outros textos estão em desenvolvimento.</p>' +
  '</header><div class="lab-article-grid">' + posts.map(card).join("") + '</div>' +
  '<p class="lab-blog-note">Artigo inaugural fundamentado em pesquisa acadêmica e registros do ArestaDB. Os demais textos são pilotos editoriais. Consulte sempre as normas atuais do Parque antes de escalar.</p></main>';
write("blog/index.html", shell("Diário de rocha", index));
const filters = '<div class="lab-blog-tools"><label for="lab-blog-search" style="font-size:0">Buscar histórias</label>' +
  '<input id="lab-blog-search" type="search" placeholder="Busque por croquis, offline ou território..." aria-label="Buscar histórias">' +
  '<div class="lab-blog-filters" aria-label="Filtrar por tema">' +
  '<button type="button" data-blog-filter="todos" aria-pressed="true">Todas</button>' +
  '<button type="button" data-blog-filter="cultura" aria-pressed="false">Cultura</button>' +
  '<button type="button" data-blog-filter="produto" aria-pressed="false">Produto</button>' +
  '<button type="button" data-blog-filter="territorio" aria-pressed="false">Território</button></div></div>' +
  '<p id="lab-results" aria-live="polite" class="lab-blog-note"></p>';
let blogIndex = read("blog/index.html");
if(!blogIndex.includes('<div class="lab-article-grid">'))throw Error("Artigos não encontrados");
blogIndex = blogIndex.replace('<div class="lab-article-grid">', filters + '<div class="lab-article-grid">');
blogIndex = blogIndex.replace('</div><p class="lab-blog-note">', '</div><p id="lab-no-results" class="lab-no-results" hidden>Nenhuma história encontrada. Tente outro termo ou selecione todas.</p><p class="lab-blog-note">');
write("blog/index.html", blogIndex);

function renderBlock(block) {
  if (block.type === "heading") return '<h2>'+esc(block.text)+'</h2>';
  if (block.type === "paragraph") return '<p>'+esc(block.text)+'</p>';
  if (block.type === "timeline") return '<div class="lab-history-timeline" aria-label="Linha do tempo da Lapinha"><span class="lab-kicker">PONTOS DA HISTÓRIA</span><ol>'+
    block.events.map(evt=>'<li><strong>'+esc(evt.year)+'</strong><span>'+esc(evt.text)+'</span></li>').join("")+'</ol></div>';
  if (block.type === "callout") return '<aside class="lab-history-callout"><h3>'+esc(block.title)+'</h3><p>'+esc(block.text)+'</p></aside>';
  if (block.type === "figure") return '<figure class="lab-history-figure"><img src="'+link(block.src)+'" alt="'+esc(block.alt)+'" loading="lazy"><figcaption>'+esc(block.caption)+'</figcaption></figure>';
  if (block.type === "partner") {
    const url=new URL(block.href);
    if(url.protocol!=="https:")throw Error("Link do parceiro inseguro");
    return '<aside class="lab-partner-story"><span class="lab-kicker">'+esc(block.eyebrow)+'</span><h2>'+esc(block.title)+'</h2><p>'+esc(block.text)+'</p>'+
      '<a href="'+esc(url.toString())+'" target="_blank" rel="noopener noreferrer">'+esc(block.linkText)+' <span aria-hidden="true">↗</span></a></aside>';
  }
  if (block.type === "sources") return '<section class="lab-story-sources" aria-labelledby="lapinha-sources"><h2 id="lapinha-sources">'+esc(block.title)+'</h2><ol>'+
    block.items.map(src=>{const url=new URL(src.href);if(url.protocol!=="https:")throw Error("Fonte insegura");return '<li><a href="'+esc(url.toString())+'" target="_blank" rel="noopener noreferrer">'+esc(src.label)+'</a></li>'}).join("")+'</ol></section>';
  throw Error("Tipo de bloco editorial desconhecido: "+block.type);
}
function storyBody(post){
  if(Array.isArray(post.blocks))return post.blocks.map(renderBlock).join("");
  return post.sections.map(part=>'<section><h2>'+esc(part[0])+'</h2><p>'+esc(part[1])+'</p></section>').join("");
}

for (const post of posts) {
  mkdirSync(join(to,"blog",post.slug),{recursive:true});
  const context=post.date?
    '<div class="lab-story-byline"><span>EDIÇÃO DE ESTREIA</span><time datetime="'+esc(post.date)+'">'+new Date(post.date+"T12:00:00Z").toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric",timeZone:"UTC"})+'</time><span>'+esc(post.author||"Aresta Climb")+'</span></div>':"";
  const cover='<figure class="lab-article-cover-figure"><img class="lab-article-cover" src="'+link(post.image)+'" alt="'+esc(post.imageAlt||"Imagem ilustrativa do Aresta Climb")+'">' +
    (post.imageCredit?'<figcaption>'+esc(post.imageCredit)+'</figcaption>':"")+'</figure>';
  const article=
    '<main class="lab-article-layout"><a class="back" href="'+link("blog/")+'">← VOLTAR AO DIÁRIO</a>'+
    '<span class="lab-kicker" style="margin-top:35px">'+esc(post.tag.toUpperCase())+' · '+esc(post.reading)+'</span>'+
    '<h1>'+esc(post.title)+'</h1>'+context+'<p class="lead">'+esc(post.lead)+'</p>'+cover+
    '<article class="lab-article-body">'+storyBody(post)+'</article>'+
    '<button type="button" data-share-article class="lab-readmore">Compartilhar esta história ↗</button>'+
    '<div class="lab-article-footer">'+(post.featured?
      'Reportagem produzida pelo Aresta Climb a partir da pesquisa de Diego Contaldo de Lara (PUC Minas, 2018) e de registros documentais mais recentes. A publicação não constitui orientação técnica de escalada nem declaração de parceria comercial.':
      'Texto piloto de UX e linguagem. Consulte sempre as informações atuais no catálogo oficial de croquis.')+
    ' <a href="https://arestaclimb.com/croquis">Explorar croquis publicados ↗</a></div></main>';
  write("blog/"+post.slug+"/index.html",shell(post.title,article,post));
}
const meta = JSON.parse(read("source.json"));
meta.variant = "Aresta Lab V2 — landing premium original e Diário de Rocha";
meta.base = base; meta.blog = posts.map(p => p.slug);
meta.notice = "Prévia editorial. /croquis continua sendo um serviço externo de produção.";
write("source.json", JSON.stringify(meta, null, 2) + "\n");
write("robots.txt", "User-agent: *\nDisallow: /\n");
for (const path of ["index.html","premium-enhancements.css","premium-enhancements.js","blog.css","blog.js","design-source.json", "blog/index.html", ...posts.map(p => "blog/" + p.slug + "/index.html")]) {
  if (!existsSync(join(to, path))) throw Error("Arquivo V2 ausente: " + path);
}
if (!read("index.html").includes("Menos caça à informação.") || !read("index.html").includes("Diário de rocha")) throw Error("Home V2 não atualizada");
if (!read("index.html").includes("https://arestaclimb.com/croquis")) throw Error("Catálogo de croquis perdido");
console.log("Aresta Lab V2 publicada no artefato:", base, "Artigos:", posts.length);
