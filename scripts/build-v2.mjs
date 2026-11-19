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
write("premium-enhancements.css", readFileSync("lab-v2/premium/enhancements.css", "utf8"));
write("premium-enhancements.js", readFileSync("lab-v2/premium/enhancements.js", "utf8"));
write("blog.css", readFileSync("lab-v2/premium/blog.css", "utf8"));
write("blog.js", readFileSync("lab-v2/premium/blog.js", "utf8"));
const category = post => post.slug === "offline-e-preparacao" ? "produto" : post.slug === "territorio-e-comunidade" ? "territorio" : "cultura";
const card = (post, i) =>
  '<a class="lab-article-card" data-blog-card data-category="' + category(post) + '" href="' + link("blog/" + post.slug + "/") + '">' +
  '<div class="lab-article-photo"><img src="' + link(post.image) + '" alt="" loading="lazy"><span class="lab-article-no">0' + (i+1) + '</span></div>' +
  '<div class="lab-article-copy"><span class="lab-article-tag">' + esc(post.tag) + ' · ' + esc(post.reading) + '</span>' +
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
replaceOnce('<a href="#codigo">Código Aberto</a><a href="#faq">FAQ</a>',
  '<a href="#codigo">Código Aberto</a><a href="https://arestaclimb.com/croquis">Croquis web</a><a href="' +
  link("blog/") + '">Diário de rocha</a><a href="#faq">FAQ</a>', "desktop navigation");
const menu =
  '<details class="premiumMobileMenu"><summary aria-label="Abrir menu de navegação">Menu</summary>' +
  '<div class="mobileMenuLinks"><a href="#aplicativo">Aplicativo</a><a href="#offline">Offline</a>' +
  '<a href="#cobertura">Cobertura</a><a href="#autoria">Autoria</a><a href="#editor">Editor</a>' +
  '<a href="#codigo">Código aberto</a><a href="https://arestaclimb.com/croquis" class="premiumMenuAccent">Croquis web ↗</a>' +
  '<a href="' + link("blog/") + '" class="premiumMenuAccent">Diário de rocha ↗</a><a href="#faq">FAQ</a></div></details>';
replaceOnce('<button class="theme" id="theme" aria-label="Alternar tema">☼</button>',
  '<button class="theme" id="theme" aria-label="Alternar tema">☼</button>' + menu, "mobile navigation");
// O build oficial é copiado no próprio Lab: os links institucionais podem ser testados sem tocar em produção.
html = html.split('https://arestaclimb.com/app').join(link("app/"));
html = html.split('https://arestaclimb.com/editor').join(link("editor/"));
const blogSection =
  '<section class="premiumBlog section" id="blog" aria-labelledby="premium-blog-title"><div class="wrap">' +
  '<div class="blogHeader"><div><div class="caps" style="color:var(--accent2)">Diário de rocha · cultura & território</div>' +
  '<h2 class="display" id="premium-blog-title">O croqui conta a via.<br><span class="accent">A comunidade conta a história.</span></h2></div>' +
  '<div><p>Histórias e conhecimento para quem escala, cuida e mantém viva a relação com a rocha. Textos de demonstração editorial.</p>' +
  '<a href="' + link("blog/") + '">Conhecer o Diário de Rocha →</a></div></div>' +
  '<div class="blogCards">' + posts.map(post =>
    '<a class="blogCard" href="' + link("blog/" + post.slug + "/") + '"><span class="blogTag">' + esc(post.tag) + ' · ' + esc(post.reading) + '</span>' +
    '<h3>' + esc(post.title) + '</h3><p>' + esc(post.summary) + '</p><span class="blogRead">Ler história →</span></a>'
  ).join("") + '</div><small>Conteúdos piloto para avaliação, não informações atualizadas de campo.</small></div></section>\n';
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
function shell(title, body) {
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">' +
  '<title>' + esc(title) + ' · Aresta Climb — Diário de Rocha</title>' +
  '<meta name="description" content="Histórias de croquis, escalada em rocha, preparação e território.">' +
  '<link rel="icon" href="' + link("assets/logo_app.png") + '"><link rel="stylesheet" href="' + link("blog.css") + '"><script defer src="' + link("blog.js") + '"></script></head>' +
  '<body class="lab-site"><nav class="lab-blog-nav" aria-label="Navegação do Diário">' +
  '<a href="' + link("") + '" class="brandlink">▲ ARESTA</a><div class="links">' +
  '<a href="' + link("") + '">Aresta Climb</a><a href="https://arestaclimb.com/croquis">Croquis</a>' +
  '<a href="' + link("blog/") + '">Diário de rocha</a><a href="' + link("app/") + '">Baixar app</a></div></nav>' +
  body + '<footer class="lab-blog-footer"><strong>ARESTA CLIMB · CONHECIMENTO EM MOVIMENTO</strong>' +
  '<span>Proposta editorial para homologação · <a href="https://arestaclimb.com">Site oficial</a> · ' +
  '<a href="' + original + '">Comparar original</a></span></footer></body></html>';
}
mkdirSync(join(to, "blog"), { recursive: true });
const index =
  '<main class="lab-blog-layout"><header class="lab-blog-hero"><div>' +
  '<span class="lab-kicker">EDIÇÃO PILOTO · TERRITÓRIO · INFORMAÇÃO</span>' +
  '<h1>Diário<br><em>de rocha.</em></h1></div>' +
  '<p>Histórias, aprendizados e informação para quem entende que um pico não é só um ponto no mapa. Conteúdo editorial em avaliação no Aresta Lab.</p>' +
  '</header><div class="lab-article-grid">' + posts.map(card).join("") + '</div>' +
  '<p class="lab-blog-note">Textos editoriais piloto, baseados na proposta pública do Aresta. Não representam dados de campo atualizados ou regras oficiais de acesso.</p></main>';
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

for (const post of posts) {
  mkdirSync(join(to, "blog", post.slug), { recursive: true });
  const article =
    '<main class="lab-article-layout"><a class="back" href="' + link("blog/") + '">← VOLTAR AO DIÁRIO</a>' +
    '<span class="lab-kicker" style="margin-top:35px">' + esc(post.tag.toUpperCase()) + ' · ' + esc(post.reading) + '</span>' +
    '<h1>' + esc(post.title) + '</h1><p class="lead">' + esc(post.lead) + '</p>' +
    '<img class="lab-article-cover" src="' + link(post.image) + '" alt="Imagem do acervo visual Aresta Climb">' +
    '<article class="lab-article-body">' + post.sections.map(part => '<section><h2>' + esc(part[0]) + '</h2><p>' + esc(part[1]) + '</p></section>').join("") + '</article>' +
    '<div class="lab-article-footer">Texto piloto de UX e linguagem. Consulte sempre as informações atuais no ' +
    '<a href="https://arestaclimb.com/croquis">catálogo oficial de croquis</a>.</div></main>';
  write("blog/" + post.slug + "/index.html", shell(post.title, article.replace('<div class="lab-article-footer">', '<button type="button" data-share-article class="lab-readmore">Compartilhar esta história ↗</button><div class="lab-article-footer">')));
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
