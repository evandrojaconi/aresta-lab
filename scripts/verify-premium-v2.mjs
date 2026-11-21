import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const slug=process.env.GITHUB_REPOSITORY?.split("/").at(-1)||"aresta-lab";
const base="/"+slug+"/v2/";
const folder=".output/public/v2";
const expected=["index.html","app/index.html","editor/index.html","premium-enhancements.css","premium-enhancements.js",
  "blog.css","blog.js","assets/aresta-climb-logo-oficial-inpi.jpg","assets/aresta-climb-simbolo-montanha-branco.svg","assets/gruta-da-lapinha-mapa-historico-2002.webp","design-source.json","source.json","blog/index.html",
  "blog/historia-escalada-gruta-da-lapinha/index.html","blog/croqui-nao-comeca-na-parede/index.html","blog/offline-e-preparacao/index.html","blog/territorio-e-comunidade/index.html"];
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
const lapinha=file("blog/historia-escalada-gruta-da-lapinha/index.html");
const slugLapinha=base+"blog/historia-escalada-gruta-da-lapinha/";
const cards=blog.match(/data-blog-card/g)||[];
if(cards.length!==4)errors.push("Blog: esperados 4 cards, incluindo artigo inaugural, recebidos "+cards.length);
const firstLink=blog.indexOf('href="'+slugLapinha+'"');
const pilotLink=blog.indexOf('href="'+base+'blog/croqui-nao-comeca-na-parede/"');
if(firstLink<0||pilotLink<0||firstLink>pilotLink)errors.push("Primeiro post não aparece antes dos pilotos");
const coverData=readFileSync(join(folder,"assets/gruta-da-lapinha-mapa-historico-2002.webp"));
if(coverData.length<10000 || coverData.subarray(0,4).toString()!=="RIFF")errors.push("Mapa histórico 2002 não é WebP válido");
for(const needle of [
  "Gruta da Lapinha: a escalada que resistiu","Diego Contaldo de Lara",
  "Rupestre da Lapa","ACEC-MG","2011","2026","2002","Grupo de Trabalho de Escalada da Lapinha",
  "www.rupestredalapa.com.br","www.biblioteca.pucminas.br/teses/TratInfEspacial_LaraDC_1.pdf",
  "https://www.ief.mg.gov.br/w/parque-estadual-do-sumidouro",
  "lab-history-timeline","lab-partner-story","lab-story-sources",
  'rel="noopener noreferrer"',
  '"@type":"BlogPosting"',
  'name="robots" content="noindex,nofollow"'
])if(!lapinha.includes(needle))errors.push("Artigo Lapinha sem: "+needle);
if(!home.includes(slugLapinha))errors.push("Home não destaca a estreia");
if(!blog.includes("EDIÇÃO 01 · GRUTA DA LAPINHA"))errors.push("Blog não identifica estreia");
const blogStyles=file("blog.css");
for(const selector of [".lab-article-card--featured",".lab-partner-story",".lab-history-timeline"])
 if(!blogStyles.includes(selector))errors.push("Blog CSS sem: "+selector);

const officialJpg=readFileSync(join(folder,"assets/aresta-climb-logo-oficial-inpi.jpg"));
const officialLogoSrc=base+"assets/aresta-climb-simbolo-montanha-branco.svg";
const symbolSvg=file("assets/aresta-climb-simbolo-montanha-branco.svg");
if(officialJpg.length<50000 || officialJpg[0]!==0xff || officialJpg[1]!==0xd8)errors.push("Arquivo INPI original não preservado");
if(!symbolSvg.includes('fill="#fff"') || !symbolSvg.includes('viewBox="0 0 300 167"'))errors.push("Símbolo branco inválido");
if(!home.includes('src="'+officialLogoSrc+'"'))errors.push("Header não usa símbolo branco");
if(!home.includes('class="brandIcon"'))errors.push("Falta bloco coral compacto da marca");
if(!home.includes('class="brandName">ARESTA CLIMB</span>'))errors.push("Nome ARESTA CLIMB não aparece na lateral");
if(!home.includes('alt="Símbolo da montanha Aresta Climb"'))errors.push("Logo: texto alternativo ausente");
if(home.includes('class="inpiLogo"'))errors.push("O quadrado branco gigante do JPG ainda está no header");
if(home.includes('src="data:image/webp;base64,UklGRj4AAABXRUJQ'))errors.push("Placeholder antigo reapareceu");
if(!css.includes("width:min(780px") || !css.includes("min-height:50px;height:50px") || !css.includes(".navWrap .brandIcon"))errors.push("Header ainda não está fino e estreito");
if(!css.includes(".premiumMore:not([open])")||!css.includes(".premiumMore > summary"))errors.push("Resumo Sobre pode crescer excessivamente");
if(!css.includes("@media (max-width:820px)") || !css.includes("min-height:46px;height:46px"))errors.push("Mobile ainda não está compacto");
const blogLogo=officialLogoSrc;
const blogPages=["blog/index.html","blog/historia-escalada-gruta-da-lapinha/index.html","blog/croqui-nao-comeca-na-parede/index.html","blog/offline-e-preparacao/index.html","blog/territorio-e-comunidade/index.html"];
for(const path of blogPages) {
 const page=file(path);
 if(!page.includes('class="brandlink lab-brand-lockup"'))errors.push("Blog marca oficial ausente: "+path);
 if(!page.includes('src="'+blogLogo+'"'))errors.push("Blog logo: imagem ausente "+path);
 if(!page.includes('alt="Símbolo da montanha Aresta Climb"'))errors.push("Blog logo: descrição ausente "+path);
 if(page.includes('>▲ ARESTA</a>'))errors.push("Blog logo antigo ainda presente: "+path);
 if(!page.includes('class="lab-footer-brand"'))errors.push("Blog rodapé sem marca oficial: "+path);
 if(!page.includes('class="lab-brand-symbol"'))errors.push("Blog sem símbolo branco: "+path);
 if(!page.includes('class="lab-brand-name">ARESTA CLIMB</span>'))errors.push("Blog sem lettering lateral: "+path);
}
const brandCSS=file("blog.css");
if(!brandCSS.includes(".lab-brand-symbol") || !brandCSS.includes(".lab-brand-lockup"))errors.push("Blog: estilos da marca compacta ausentes");
// Design da V2.1 — acessibilidade da navegação, contraste e comportamento de rolagem.
const navAt=home.indexOf('<div class="navWrap">');
const heroAt=home.indexOf('<section class="hero" id="inicio">');
if(navAt<0||heroAt<0||navAt>heroAt)errors.push("O header ainda está dentro do hero, impossibilitando navegação persistente");
const navOnly=home.slice(navAt,heroAt);
if(!navOnly.includes('<div class="navLinks"><a class="active" href="#aplicativo">Aplicativo</a>'))errors.push("Menu principal errado");
for(const label of [
  '>Croquis</a>', '>Comunidade</a>', '>Diário de Rocha</a>',
  'class="premiumMore"', '>Sobre</summary>',
  'class="moreMenu"', '>Editor Aresta</a>',
  '>Acesso offline</a>', '>Picos e cobertura</a>',
  '>Dúvidas frequentes</a>', 'class="premiumMobileMenu"',
  'class="mobileMenuLinks"', 'class="mobileDownload"',
  '>Baixar aplicativo ↗</a>', 'id="theme"'
]) if(!navOnly.includes(label))errors.push("Navegação sem: "+label);
if(navOnly.includes('<a href="#offline">Offline</a>') && navOnly.slice(0,navOnly.indexOf('class="premiumMobileMenu"')).includes('<a href="#offline">Offline</a>'))errors.push("Desktop: links antigos ainda no menu principal");
if(!css.includes(".hero::before")||!css.includes(".hero::after")||!css.includes("brightness(.62)"))errors.push("Contraste: a imagem do hero não foi escurecida");
if(!css.includes(".navWrap.is-hidden")||!css.includes(".navWrap.is-scrolled"))errors.push("Header: falta estado de rolagem");
if(!css.includes(".premiumMore")||!css.includes("@media(max-width:720px)")||!css.includes("prefers-reduced-motion"))errors.push("Header: falta responsividade ou redução de movimento");
const headerJs=file("premium-enhancements.js");
for(const behavior of ["requestAnimationFrame(updateHeader)",'window.addEventListener("scroll"',"is-hidden","is-scrolled",'event.key !== "Escape"',"focusin","prefersReducedMotion"])
 if(!headerJs.includes(behavior))errors.push("Comportamento do header: "+behavior);

if(!css.includes("premiumMobileMenu"))errors.push("CSS mobile ausente");
if(!body.includes("HTML premium integral"))errors.push("Metadados sem origem exata");
if(source.length<750000||home.length<750000)errors.push("Imagens premium ausentes ou arquivo truncado");
if(home.includes("Quer um Beta?<br>")||home.includes("Menos incerteza.<br>"))errors.push("Landing antiga ainda presente");
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Premium V2 QA OK: fonte intacta + navegação + blog + páginas oficiais; origem",source.length,"chars");
