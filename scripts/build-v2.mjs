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
write("design.css", readFileSync("lab-v2/design.css", "utf8"));

const card = (post, i) =>
  '<a class="lab-article-card" href="' + link("blog/" + post.slug + "/") + '">' +
  '<div class="lab-article-photo"><img src="' + link(post.image) + '" alt="" loading="lazy"><span class="lab-article-no">0' + (i+1) + '</span></div>' +
  '<div class="lab-article-copy"><span class="lab-article-tag">' + esc(post.tag) + ' · ' + esc(post.reading) + '</span>' +
  '<h3>' + esc(post.title) + '</h3><p>' + esc(post.summary) + '</p><span class="lab-readmore">Ler história <span aria-hidden="true">↗</span></span></div></a>';

let html = read("index.html");
function replaceOnce(needle, value, description) {
  const count = html.split(needle).length - 1;
  if (count !== 1) throw Error("HTML oficial mudou: " + description + " encontrou " + count);
  html = html.replace(needle, value);
}
replaceOnce("<h1>Quer um Beta?<br><em>Use o Aresta!</em></h1>",
  "<h1>Menos incerteza.<br><em>Mais parede.</em></h1>", "headline");
replaceOnce("ESCALADA EM ROCHA · CROQUIS · 100% OFFLINE",
  "ESCALADA EM ROCHA · CONHECIMENTO COLETIVO · OFFLINE", "eyebrow");
replaceOnce("Encontre a via, navegue pela parede e leve o croqui interativo para o campo — pronto para funcionar quando o sinal fica pelo caminho.",
  "A escalada começa antes da primeira agarra. Descubra picos e setores, consulte croquis interativos e leve o conhecimento da comunidade para a rocha — inclusive sem sinal, depois do download.", "hero lead");
replaceOnce('<a href="#faq">FAQ</a>',
  '<a href="' + link("blog/") + '">Diário de rocha</a><a href="#faq">FAQ</a>', "menu blog");
replaceOnce('<div class="metrics-grid">',
  '<p class="lab-metrics-note">NÚMEROS REPRODUZIDOS DA LANDING OFICIAL · VALIDAÇÃO DE ATUALIDADE PENDENTE</p><div class="metrics-grid">', "nota histórica");
replaceOnce("Uma base real para começar a explorar.",
  "Conhecimento de rocha, organizado para escalar.", "seção cobertura");
const articleSection =
  '<section id="blog" class="lab-blog-section" aria-labelledby="lab-blog-title"><div class="container">' +
  '<div class="lab-editorial-heading"><div><span class="lab-kicker">DIÁRIO DE ROCHA · CULTURA · CAMPO</span>' +
  '<h2 id="lab-blog-title">A história não termina<br><em>no croqui.</em></h2></div>' +
  '<div class="lab-editorial-aside"><p>Escalada também é memória, acesso, preparação e conhecimento transmitido entre pessoas.</p>' +
  '<a href="' + link("blog/") + '">Explorar o diário <span aria-hidden="true">↗</span></a></div></div>' +
  '<div class="lab-article-grid">' + posts.map(card).join("") + '</div></div></section>';
replaceOnce('<section id="faq" class="section">', articleSection + '<section id="faq" class="section">', "seção blog");
replaceOnce("</head>", '<link rel="stylesheet" href="' + link("design.css") + '">\n</head>', "estilos v2");
const mobile =
  '<details class="lab-mobile-menu"><summary aria-label="Abrir menu">Menu</summary>' +
  '<nav aria-label="Navegação móvel"><a href="' + link("") + '">Início</a>' +
  '<a href="https://arestaclimb.com/croquis">Croquis</a><a href="' + link("blog/") + '">Diário de rocha</a>' +
  '<a href="' + link("editor/") + '">Editor</a><a href="' + link("app/") + '">Baixar aplicativo</a>' +
  '<a href="' + link("") + '#autoria">Autoria</a><a href="' + link("") + '#comunidade">Comunidade</a></nav></details>';
replaceOnce('<div class="nav-actions">', '<div class="nav-actions">' + mobile, "navegação móvel");
write("index.html", html);

function shell(title, body) {
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">' +
  '<title>' + esc(title) + ' · Aresta Climb — Diário de Rocha</title>' +
  '<meta name="description" content="Histórias de croquis, escalada em rocha, preparação e território.">' +
  '<link rel="icon" href="' + link("assets/logo_app.png") + '"><link rel="stylesheet" href="' + link("design.css") + '"></head>' +
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
  write("blog/" + post.slug + "/index.html", shell(post.title, article));
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
