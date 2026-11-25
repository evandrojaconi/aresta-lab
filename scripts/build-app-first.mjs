import {cpSync,existsSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {join} from "node:path";

// V3 somente laboratório: o HTML premium fica em /v2/visao/; /oficial/ permanece intacto.
const root=".output/public/v2",base="/"+(process.env.GITHUB_REPOSITORY?.split("/").at(-1)||"aresta-lab")+"/v2/";
// Extrair a fotografia real exatamente como foi incorporada à landing premium,
// em vez de criar, redesenhar ou referenciar uma foto externa. É o mesmo WebP
// utilizado no hero e no offline da V2 original.
const originalPremium=readFileSync("lab-v2/premium/source.html","utf8");
const backgroundMatches=[...originalPremium.matchAll(/url\('data:image\/webp;base64,([A-Za-z0-9+/=]+)'\)/g)];
if(backgroundMatches.length!==2 || backgroundMatches[0][1]!==backgroundMatches[1][1])
 throw Error("Foto de rocha premium inesperada: conferir a fonte antes de publicar");
const realRock=Buffer.from(backgroundMatches[0][1],"base64");
if(realRock.length<100000 || realRock.subarray(0,4).toString()!=="RIFF" ||
   realRock.subarray(8,12).toString()!=="WEBP")
 throw Error("Fotografia real premium não é WebP válido");
writeFileSync(join(root,"assets","aresta-rocha-fundo-original.webp"),realRock);

const target=join(root,"app-first"),src="lab-v2/app-first";
for(const filename of ["index.html","style.css","legacy-merge.css","rock-backgrounds.css","app.js","projeto.html"])
 if(!existsSync(join(src,filename)))throw Error("Arquivo App First ausente: "+filename);
for(const file of ["explorar-locais.png","pedra-grande.png","croqui-interativo.png","comunidade-pico.png","setor-principal.png"])
 if(!existsSync(join(root,"assets/app",file)))throw Error("Captura real do app ausente: "+file);
for(const file of ["aresta-climb-simbolo-montanha-branco.svg","aresta-editor-painel-qualidade-real-2026-11-20.webp","gruta-da-lapinha-mapa-historico-2002.webp"])
 if(!existsSync(join(root,"assets",file)))throw Error("Asset validado ausente: "+file);
const esc=v=>String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const posts=JSON.parse(readFileSync("lab-v2/posts.json","utf8"));
const featured=posts.find(p=>p.featured&&p.status==="publicado");
if(!featured||!featured.image||!existsSync(join(root,featured.image)))throw Error("Artigo publicado do Diário sem capa validada");
const card=[
 '<div class="journal-grid">',
 '<a class="journal-lead-card" href="../blog/'+featured.slug+'/" aria-label="Ler '+esc(featured.title)+'">',
 '<div class="journal-photo"><img loading="lazy" src="../'+featured.image+'" alt="'+esc(featured.imageAlt||"Registro documental do Aresta")+'" width="980" height="500"></div>',
 '<div class="journal-copy"><span class="eyebrow">EDIÇÃO DE ESTREIA · '+esc(featured.reading)+'</span>',
 '<h3>'+esc(featured.title)+'</h3><p>'+esc(featured.summary)+'</p>',
 '<span class="journal-card-link">Ler esta história ↗</span></div></a>',
 '<div class="journal-side">',
 '<div class="journal-side-card"><div><span class="eyebrow eyebrow-white">CULTURA & TERRITÓRIO</span>',
 '<strong>O que existe por trás de cada pico?</strong>',
 '<p>Histórias, acesso, cuidados e pessoas fazem parte do croqui.</p></div>',
 '<a href="../blog/">Explorar as histórias ↗</a></div>',
 '<div class="journal-side-card"><div><span class="eyebrow eyebrow-rust">QUEM DOCUMENTA</span>',
 '<strong>Uma história que também pode ser sua.</strong>',
 '<p>Conheça as pessoas e as ferramentas que ajudam a registrar o que existe na rocha.</p></div>',
 '<a href="../projeto/">Como o Aresta é construído ↗</a></div>',
 '</div></div>'
].join("");
const original=readFileSync(join(src,"index.html"),"utf8");
const start="<!-- BLOG_FEATURED_START -->",end="<!-- BLOG_FEATURED_END -->";
if(original.split(start).length!==2||original.split(end).length!==2)throw Error("Espaço editorial dinâmico ausente");
const enriched=original.replace(new RegExp(start+"[\\s\\S]*?"+end),card);
if(!enriched.includes('name="robots" content="noindex,nofollow"')||!enriched.includes("<h1>Feito pela comunidade.<br><em>Aberto para o mundo.</em></h1>"))
 throw Error("Home App First não é uma prévia rastreável");
mkdirSync(target,{recursive:true});
writeFileSync(join(target,"index.html"),enriched);
for(const file of ["style.css","legacy-merge.css","rock-backgrounds.css","app.js"])cpSync(join(src,file),join(target,file));
mkdirSync(join(root,"projeto"),{recursive:true});
cpSync(join(src,"projeto.html"),join(root,"projeto","index.html"));
// Guardar a versão premium integral como acervo navegável, sem alterar o HTML fonte.
const previousHome=join(root,"index.html");
if(!existsSync(previousHome))throw Error("Home premium V2 ausente");
const premium=readFileSync(previousHome,"utf8");
if(!premium.includes("Menos caça à informação.")||!premium.includes('id="cobertura"'))
 throw Error("A home a arquivar não corresponde à premium existente");
mkdirSync(join(root,"visao"),{recursive:true});
writeFileSync(join(root,"visao","index.html"),premium);
// Na raiz /v2/, subir um nível das imagens, rotas e scripts relativos da /app-first/.
let home=enriched.replace(/(href|src)="\.\.\//g,'$1="');
home=home.replace('href="style.css"','href="app-first/style.css"')
         .replace('href="legacy-merge.css"','href="app-first/legacy-merge.css"')
         .replace('href="rock-backgrounds.css"','href="app-first/rock-backgrounds.css"')
         .replace('src="app.js"','src="app-first/app.js"');
writeFileSync(previousHome,home);
const metaPath=join(root,"source.json");
const meta=JSON.parse(readFileSync(metaPath,"utf8"));
meta.variant="V3 · App First + Diário de Rocha + caminhos de aprofundamento";
meta.primaryEntry=base;meta.preservedPremium=base+"visao/";meta.deepDive=base+"projeto/";
meta.noIndex=true;meta.officialUnaffected=true;
writeFileSync(metaPath,JSON.stringify(meta,null,2)+"\n");
console.log("Aresta V3: entrada /v2/ App First; premium /v2/visao/; Diário e Projeto integrados.");
