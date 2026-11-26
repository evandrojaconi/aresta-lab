import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = ".output/public/v2";
const base = "/" + (process.env.GITHUB_REPOSITORY?.split("/").at(-1) || "aresta-lab") + "/v2/";
const vision = readFileSync(join(root, "visao/index.html"), "utf8");
const content = readFileSync("lab-v2/landing-v7.html", "utf8").replaceAll("/aresta-lab/v2/", base);

function section(html, id) {
  const block = html.match(new RegExp('<section\\b[^>]* id="' + id + '"[^>]*>[\\s\\S]*?</section>'));
  if (!block) throw new Error("Seção da landing ausente: " + id);
  return block[0];
}

const navigation = vision.slice(vision.indexOf('<div class="navWrap"'), vision.indexOf('<section class="hero"'));
const links = '<a href="#contribuir">Contribuir</a><a href="#aplicativo">Aplicativo</a><a href="#territorio">Território</a><a href="#transparencia">Transparência</a>';
const nav = navigation
  .replace(/(<div class="navLinks">)[\s\S]*?(<div class="navActions">)/, "$1" + links + "</div>$2")
  .replace(/(<div class="mobileMenuLinks">)[\s\S]*?(<\/div><\/details>)/, "$1" + links + "$2");
const hero = section(content, "inicio");
const headline = hero.match(/<h1>(.*?)<\/h1>/s)[1].replace("<em>", '<span class="accent">').replace("</em>", "</span>");
const intro = hero.match(/<p class="lead">(.*?)<\/p>/s)[1];
const actions = hero.match(/<div class="actions">(.*?)<\/div>/s)[1];

const contribution = section(content, "contribuir")
  .replace('class="section cream"', 'class="intro section"')
  .replace('class="eyebrow"', 'class="caps accent"')
  .replace("<h2>", '<h2 class="display">')
  .replace('class="lead"', 'class="copy"')
  .replace('class="grid3"', 'class="questionGrid"')
  .replaceAll('class="tile"', 'class="qCard"');
const product = section(vision, "aplicativo").replace(/<div class="phone back">.*?<\/div>|<div class="phone mid">.*?<\/div>/gs, "");
const territory = section(content, "territorio")
  .replace('class="section dark lapinha"', 'class="intro section"')
  .replace('class="eyebrow"', 'class="caps accent"')
  .replace("<h2>", '<h2 class="display">')
  .replace('class="lead"', 'class="copy"')
  .replace('class="btn ghost"', 'class="btn darkGhost"');
const transparency = section(content, "transparencia")
  .replace('class="section cream"', 'class="faq section"')
  .replace("<h2>", '<h2 class="display">')
  .replace('class="lead"', 'class="copy"')
  .replace('<details id="economia">', '<div class="faqList"><details id="economia">')
  .replace("</details>", "</details></div>");
const closing = section(content, "convite")
  .replace('class="section dark finalcta"', 'class="final"')
  .replace('class="actions"', 'class="finalBtns"')
  .replace('class="brand-signature"', 'class="display"')
  .replace(".</span><span>ABERTO", '.</span><br><span class="accent">ABERTO');

const head = vision.slice(0, vision.indexOf("<body>"))
  .replace(/url\('data:image\/webp;base64,[^']+'\) center\/cover no-repeat(?=;z-index:-2)/, "none")
  .replace(/<title>.*?<\/title>/s, "<title>Aresta Climb · Feito pela comunidade</title>");
const theme = vision.slice(vision.lastIndexOf("<script>"), vision.lastIndexOf("</body>"));
const adjustments = `<style>
.hero{min-height:0;background:#101311}
.hero:before,.hero:after{content:none}
.heroContent{grid-template-columns:1fr;min-height:0;padding:clamp(48px,8vw,108px) 0}
.hero h1{font-size:clamp(42px,7vw,96px)}
.hero p{font-size:clamp(15px,2vw,19px);margin-top:22px}
.heroBtns .textlink{align-self:center;text-decoration:underline}
#contribuir .qCard .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
#contribuir .subtle{font-size:13px;color:var(--muted)}
#contribuir article{scroll-margin-top:110px}
#aplicativo .phones{min-height:320px;display:grid;place-items:center}
#aplicativo .phone.front{position:relative;inset:auto;width:145px;max-width:100%;transform:none}
#territorio .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
#territorio .split{align-items:start}
</style>`;
const footer = vision.match(/<footer>.*?<\/footer>/s)[0]
  .replace("Aplicativo · Offline · Cobertura · Autoria · Editor · Código Aberto · FAQ",
    '<a href="' + base + 'visao/">Visão do Aresta</a> · <a href="' + base + 'blog/">Diário de Rocha</a>');
const output = head.replace("</head>", adjustments + "</head>") + "<body>" + nav +
  '<main><section class="hero" id="inicio"><div class="wrap heroContent"><div>' +
  '<h1 class="display">' + headline + '</h1><p>' + intro + '</p><div class="heroBtns">' +
  actions + "</div></div></div></section>" + contribution + product + territory +
  transparency + closing + "</main>" + footer + theme +
  "<script>if(location.hash.includes('section=convite'))document.getElementById('convite').scrollIntoView();</script></body></html>";
writeFileSync(join(root, "index.html"), output);
