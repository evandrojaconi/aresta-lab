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
write("styles.css", readFileSync("lab-v2/drive-reference/styles.css", "utf8"));
write("script.js", readFileSync("lab-v2/drive-reference/script.js", "utf8"));
write("design.css", readFileSync("lab-v2/drive-enhancements.css", "utf8"));
write("enhancements.js", readFileSync("lab-v2/drive-enhancements.js", "utf8"));
cpSync("lab-v2/drive-reference/brand/aresta-logo.png", join(to, "brand/aresta-logo.png"));

const category = post => post.slug === "offline-e-preparacao" ? "produto" : post.slug === "territorio-e-comunidade" ? "territorio" : "cultura";
const card = (post, i) =>
  '<a class="lab-article-card" data-blog-card data-category="' + category(post) + '" href="' + link("blog/" + post.slug + "/") + '">' +
  '<div class="lab-article-photo"><img src="' + link(post.image) + '" alt="" loading="lazy"><span class="lab-article-no">0' + (i+1) + '</span></div>' +
  '<div class="lab-article-copy"><span class="lab-article-tag">' + esc(post.tag) + ' · ' + esc(post.reading) + '</span>' +
  '<h3>' + esc(post.title) + '</h3><p>' + esc(post.summary) + '</p><span class="lab-readmore">Ler história <span aria-hidden="true">↗</span></span></div></a>';

// A referência visual é o index.html original de 31/08/2026,
// versionado dentro do Lab. O código oficial continua preservado em /oficial/.
let html = readFileSync("lab-v2/drive-reference/index.html", "utf8");
function replaceOnce(needle, value, description) {
  const count = html.split(needle).length - 1;
  if (count !== 1) throw Error("Referência do Drive alterada: " + description + " (" + count + ")");
  html = html.replace(needle, value);
}
function replaceRegex(regex, value, description) {
  const next = html.replace(regex, value);
  if (next === html) throw Error("Referência não encontrada: " + description);
  html = next;
}

replaceRegex(/<title>[\s\S]*?<\/title>/, "<title>Aresta Climb | Croquis, território e comunidade — Aresta Lab</title>", "title");
replaceOnce('<link rel="canonical" href="https://arestaclimb.com">', '<meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="light">', "canonical do protótipo");
replaceOnce('href="favicon.svg"', 'href="' + link("favicon.svg") + '"', "favicon");
replaceOnce('href="styles.css"', 'href="' + link("styles.css") + '"', "CSS Drive");
replaceOnce('src="script.js"', 'src="' + link("script.js") + '"', "JS Drive");
replaceOnce("</head>", '<link rel="stylesheet" href="' + link("design.css") + '"><script defer src="' + link("enhancements.js") + '"></script></head>', "enhancements");
replaceRegex(/<nav aria-label="Navegação principal">[\s\S]*?<\/nav>/,
  '<nav aria-label="Navegação principal"><a href="#como-funciona">Como funciona</a><a href="https://arestaclimb.com/croquis">Croquis</a><a href="' + link("blog/") + '">Diário de rocha</a><a href="' + link("editor/") + '">Editor</a><a href="#caminhos">Comunidade</a><a href="#faq">FAQ</a></nav>', "menu principal");
const mobileNav =
  '<details class="nav-mobile"><summary aria-label="Abrir menu de navegação">Menu</summary>' +
  '<nav aria-label="Navegação móvel"><a href="#inicio">Início</a><a href="#como-funciona">Como funciona</a>' +
  '<a href="https://arestaclimb.com/croquis">Croquis</a><a href="' + link("blog/") + '">Diário de rocha</a>' +
  '<a href="' + link("editor/") + '">Editor</a><a href="#caminhos">Participar</a>' +
  '<a href="#autoria">Autoria</a><a href="#faq">FAQ</a><a href="' + link("app/") + '">Baixar app</a></nav></details>';
replaceOnce('<a class="header-cta" href="#como-funciona">Conhecer o Aresta</a>',
  '<a class="header-cta" href="' + link("app/") + '">Baixar aplicativo ↗</a>' + mobileNav, "CTA header");
replaceOnce('<h1>Quer um Beta?<br><em>Use o Aresta!</em></h1>',
  '<h1>Menos incerteza.<br><em>Mais parede.</em></h1>', "hero headline");
replaceOnce('Explore o croqui como nunca antes: toque nas linhas e nos pontos do mapa, navegue entre setores e vias e abra cada detalhe no contexto da parede.',
  'Descubra picos, explore os croquis interativos e conheça as histórias por trás das vias. Um aplicativo feito com a comunidade para levar informação da cidade até a parede.', "hero copy");
replaceOnce('O Aresta transforma um arquivo para consultar em uma experiência para explorar, entender e levar ao campo — inclusive offline, depois do download.',
  'Toque para conhecer a experiência, encontre a cobertura publicada na web e baixe os croquis disponíveis antes de sair para a rocha.', "hero support");
replaceOnce('<a class="button primary" href="#como-funciona">Conhecer os croquis <span>↗</span></a>',
  '<a class="button primary" href="https://arestaclimb.com/croquis" data-event="catalog_click">Explorar croquis <span>↗</span></a>', "catalog hero CTA");
replaceOnce('<a class="text-link" href="#caminhos">Escolher como participar <span>↓</span></a>',
  '<a class="text-link" href="' + link("app/") + '">Baixar aplicativo <span>↗</span></a>', "download hero CTA");
replaceOnce('O que a base publicada já reúne', 'Registro da base em agosto de 2026', "historical metric headline");
replaceOnce('Base local analisada em 05/08/2026. Os números devem ser atualizados a partir da fonte do produto.',
  'Recorte histórico analisado em 05/08/2026. Estes dados não representam a cobertura atual. <a href="https://arestaclimb.com/croquis">Confira os croquis publicados hoje ↗</a>', "historical metric context");
replaceOnce('PROVA ATUAL', 'RETRATO HISTÓRICO · 05/08/2026', "proof eyebrow");
replaceOnce('<a href="#participar" data-event="journey_cta" data-journey="user">Quero conhecer os croquis <span>↗</span></a>',
  '<a href="https://arestaclimb.com/croquis" data-event="catalog_click">Quero explorar os croquis <span>↗</span></a>', "user journey");
replaceOnce('O formulário mostra somente as perguntas ligadas ao caminho escolhido.',
  'Explore o catálogo ou escolha um caminho de colaboração. O contato abaixo se adapta ao seu interesse.', "journey instruction");

// Diferencia acesso à base web, Editor e aplicativo em três jornadas reais.
const webSection =
  '<section class="web-journey" id="web" aria-labelledby="web-title">' +
  '<div class="section-label">WEB · APLICATIVO · COLABORAÇÃO</div>' +
  '<h2 id="web-title">A informação começa aqui. E acompanha você até a rocha.</h2>' +
  '<p class="intro">O Aresta tem pontos de entrada diferentes para descobrir croquis, levar conteúdo ao campo e participar da construção do conhecimento. Cada botão leva a uma experiência real.</p>' +
  '<div class="web-journey-grid">' +
  '<a href="https://arestaclimb.com/croquis"><span class="num">01 / NAVEGADOR</span><h3>Explore os croquis na web.</h3><p>Conheça os picos publicados no catálogo oficial, sem duplicar informações nesta landing.</p><span class="action">Abrir catálogo ↗</span></a>' +
  '<a href="' + link("app/") + '"><span class="num">02 / APLICATIVO</span><h3>Leve o croqui ao campo.</h3><p>Baixe o app para iPhone ou Android e prepare o conteúdo disponível antes de perder o sinal.</p><span class="action">Baixar aplicativo ↗</span></a>' +
  '<a href="' + link("editor/") + '"><span class="num">03 / CONSTRUÇÃO</span><h3>Conheça o Editor Aresta.</h3><p>Ferramenta de organização e edição de croquis, com autoria e revisões que precisam ser respeitadas.</p><span class="action">Conhecer o Editor ↗</span></a>' +
  '</div></section>';
replaceOnce('<section class="journeys section-pad" id="caminhos">', webSection + '<section class="journeys section-pad" id="caminhos">', "web section");

const blog =
  '<section class="lab-blog-section" id="blog" aria-labelledby="lab-blog-title"><div class="lab-container">' +
  '<div class="lab-editorial-heading"><div><span class="lab-kicker">DIÁRIO DE ROCHA · HISTÓRIAS · TERRITÓRIO</span>' +
  '<h2 id="lab-blog-title">Há muito mais história<br><em>entre as vias.</em></h2></div>' +
  '<div class="lab-editorial-aside"><p>Uma publicação para quem escala e para quem mantém vivo o conhecimento sobre os lugares. Textos piloto para avaliar a linguagem do Aresta.</p><a href="' +
  link("blog/") + '">Ler todas as histórias <span aria-hidden="true">↗</span></a></div></div>' +
  '<div class="lab-article-grid">' + posts.map(card).join("") + '</div></div></section>';
replaceOnce('<section class="faq section-pad" id="faq">', blog + '<section class="faq section-pad" id="faq">', "blog section");

replaceOnce('<section class="signup section-pad" id="participar">',
  '<section class="signup section-pad" id="participar">', "form section exists");
// O formulário original prepara um mailto. Sem backend e sem mensagens falsas de sucesso.
replaceOnce('<form class="beta-form" id="beta-form" data-event="form_submit" data-journey="unselected">',
  '<form class="beta-form" id="beta-form" data-journey="unselected">', "remove falsa instrumentação");
replaceOnce('Ao tocar em uma linha, ponto ou área do mapa, você navega para o setor, a escalada ou o conteúdo relacionado sem procurar em páginas soltas.',
  'Nos croquis interativos disponíveis, linhas e pontos ajudam a navegar para setores, vias e seus conteúdos relacionados, conforme o material publicado.', "product capacity copy");
replaceOnce('<footer><a class="brand footer-brand"',
  '<footer><a class="brand footer-brand"', "footer exists");
replaceOnce('<a href="mailto:contato@arestaclimb.com">Contato</a>',
  '<a href="' + link("blog/") + '">Diário de rocha</a><a href="' + link("editor/") + '">Editor</a><a href="https://arestaclimb.com/croquis">Croquis</a><a href="mailto:contato@arestaclimb.com">Contato</a>', "footer links");
replaceOnce('</footer>', '</footer>', "footer unique");
html=html.replaceAll('src="brand/aresta-logo.png"', 'src="' + link("brand/aresta-logo.png") + '"');
html=html.replace('Demonstração conceitual da experiência interativa no aplicativo ARESTA', 'Demonstração conceitual navegável do aplicativo ARESTA, não representa vias ou graus reais');
write("index.html",html);

// Controle de origem: nenhum banner do espelho fiel pode ser convertido em V2 silenciosamente.
const metadata = { driveSource:"[LANDING] / Google Drive", driveModifiedAt:"2026-08-31T17:32:16Z", homepageBasis:"HTML/CSS/JS do protótipo do Drive", appAndInstitutionalPages:"Build atual de aresta-climb/arestaclimb.com", noBackendContact:true };
write("design-source.json", JSON.stringify(metadata,null,2) + "\n");
function shell(title, body) {
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">' +
  '<title>' + esc(title) + ' · Aresta Climb — Diário de Rocha</title>' +
  '<meta name="description" content="Histórias de croquis, escalada em rocha, preparação e território.">' +
  '<link rel="icon" href="' + link("assets/logo_app.png") + '"><link rel="stylesheet" href="' + link("styles.css") + '"><link rel="stylesheet" href="' + link("design.css") + '"><script defer src="' + link("enhancements.js") + '"></script></head>' +
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
meta.variant = "Aresta Lab V2 — proposta de design e blog";
meta.base = base; meta.blog = posts.map(p => p.slug);
meta.notice = "Prévia editorial. /croquis continua sendo um serviço externo de produção.";
write("source.json", JSON.stringify(meta, null, 2) + "\n");
write("robots.txt", "User-agent: *\nDisallow: /\n");
for (const path of ["index.html", "design.css", "blog/index.html", ...posts.map(p => "blog/" + p.slug + "/index.html")]) {
  if (!existsSync(join(to, path))) throw Error("Arquivo V2 ausente: " + path);
}
if (!read("index.html").includes("Menos incerteza.") || !read("index.html").includes("Diário de rocha")) throw Error("Home V2 não atualizada");
if (!read("index.html").includes("https://arestaclimb.com/croquis")) throw Error("Catálogo de croquis perdido");
console.log("Aresta Lab V2 publicada no artefato:", base, "Artigos:", posts.length);
