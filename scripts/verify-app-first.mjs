import {existsSync,readFileSync,statSync} from "node:fs";
import {dirname,join,normalize,resolve,extname} from "node:path";

const dir=".output/public/v2/app-first";
const page=join(dir,"index.html");
if(!existsSync(page))throw Error("Experimento App First não foi gerado");
const html=readFileSync(page,"utf8");
const home=readFileSync(".output/public/v2/index.html","utf8");
const original=readFileSync(".output/public/v2/visao/index.html","utf8");
const project=readFileSync(".output/public/v2/projeto/index.html","utf8");
const mergedCss=readFileSync(join(dir,"legacy-merge.css"),"utf8");
const rockCss=readFileSync(join(dir,"rock-backgrounds.css"),"utf8");
const css=readFileSync(join(dir,"style.css"),"utf8");
const script=readFileSync(join(dir,"app.js"),"utf8");
const errors=[];
const need=(text,label)=>{if(!html.includes(text))errors.push("Falta "+label);};
for(const [key,label] of [
 ['<h1>Feito pela comunidade.<br><em>Aberto para o mundo.</em></h1>',"assinatura de marca no hero"],
 ['Telas reais do aplicativo Aresta Climb',"capturas reais"],
 ['id="recursos"',"recursos"],
 ['id="croquis"',"croquis"],
 ['id="offline"',"offline"],
 ['id="comunidade"',"comunidade"],
 ['id="duvidas"',"perguntas frequentes"],
 ['id="baixar"',"download"],
 ['name="robots" content="noindex,nofollow"',"noindex"],
 ['../blog/',"Diário de Rocha"],
 ['../editor/',"página para mantenedor"],
 ['href="../app/"',"CTA de download"],
 ['href="../croquis/"',"croquis web"],
 ['href="../comunidade/"',"comunidade"],
 ["https://play.google.com/store/apps/details?id=app.escalada.croquis","Google Play"],
 ["https://apps.apple.com/us/app/aresta-climb-guia-de-escalada/id6776467893","App Store"]
])need(key,label);
// V3.2 — a copy V4 precisa respeitar a hierarquia App First e não anunciar visão futura como entregue.
for(const [copy,label] of [
 ["JÁ EXISTE. JÁ ESTÁ NA ROCHA.","posicionamento do produto disponível"],
 ["Um app de escalada.","entrada clara para quem escala"],
 ["Uma porta para o território.","segunda camada narrativa"],
 ["Offline de verdade","benefício offline"],
 ["A comunidade","comunidade na jornada"],
 ["O aplicativo é só o começo.","descoberta progressiva"],
 ["uma visão de evolução","distinção de futuro na FAQ"],
 ["O que é o Aresta, afinal?","FAQ atualizado"]
])if(!html.includes(copy))errors.push("V3.2 copy ausente: "+label);
// V3.3 — manifesto é a mensagem principal, produto continua identificável já no primeiro contato.
if(!html.includes("APP DE ESCALADA · CROQUIS OFFLINE") ||
   !html.includes("um aplicativo para descobrir picos") ||
   !home.includes("Croquis interativos · acesso offline · autoria respeitada · tecnologia aberta"))
 errors.push("Brand hero sem identificação inequívoca do produto");
if(!html.includes("Feito pela comunidade significa reconhecer") ||
   !html.includes("Aberto para o mundo significa ampliar o acesso"))
 errors.push("Manifesto sem tradução em autoria e acesso na segunda camada");
if(!project.includes("FEITO PELA COMUNIDADE. ABERTO PARA O MUNDO."))
 errors.push("Página Projeto sem reforço da assinatura da marca");
if(!project.includes("Conheça o território.") ||
   !project.includes("Conecte possibilidades.") ||
   !project.includes("não são serviços já lançados"))
 errors.push("V3.2: página O Projeto não recebeu a visão V4 com distinção de status");

if(/smartHome|smart home|home automation|client testimonials/i.test(html))errors.push("Texto do template de referência entrou indevidamente");
// Real rock original used as the background photo in multiple existing sections.
// The source image must match the immutable premium HTML, not a generated asset.
const originalPremium=readFileSync("lab-v2/premium/source.html","utf8");
const backgrounds=[...originalPremium.matchAll(/url\('data:image\/webp;base64,([A-Za-z0-9+/=]+)'\)/g)];
const rockPath=".output/public/v2/assets/aresta-rocha-fundo-original.webp";
if(backgrounds.length!==2 || backgrounds[0][1]!==backgrounds[1][1] || !existsSync(rockPath))
 errors.push("Fotografia original da landing premium não foi recuperada");
else {
 const rock=readFileSync(rockPath);
 const reference=Buffer.from(backgrounds[0][1],"base64");
 if(!rock.equals(reference) || rock.length<100000) errors.push("Foto de rocha não é idêntica à fonte original");
}
for(const [piece,label] of [
 ['--aresta-rock: url("../assets/aresta-rocha-fundo-original.webp")',"URL real da rocha"],
 [".hero{","hero com foto"],
 [".feature-art-light{","seção do app com foto"],
 [".community-section .feature-art-cream{","comunidade com foto"],
 [".statement{","bloco de destaque com foto"],
 [".download-art{","download com foto"],
 ["@media(max-width:720px)","tratamento da foto no mobile"]
])if(!rockCss.includes(piece))errors.push("CSS fotografia ausente: "+label);
if(!html.includes('href="rock-backgrounds.css"') ||
   !home.includes('aresta-rocha-fundo-original.webp'))
 errors.push("Foto real não está ligada às duas entradas da V3");

if(!css.includes("@media(max-width:720px)")||!css.includes("@media(max-width:430px)"))errors.push("Responsive CSS ausente");
if(!css.includes(".site-header.is-hidden"))errors.push("Scroll tipo notificação ausente");
for(const text of ["nav-mobile","Escape","requestAnimationFrame","faq"])if(!script.includes(text))errors.push("JS sem "+text);
const images=[
 "explorar-locais.png","pedra-grande.png","croqui-interativo.png",
 "comunidade-pico.png","setor-principal.png"
];
for(const file of images) {
  const target=join(".output/public/v2/assets/app",file);
  if(!existsSync(target)||statSync(target).size<50000)errors.push("Falta captura real: "+target);
  need("src=\"../assets/app/"+file+"\"","uso da captura "+file);
}
const base=resolve(dir);
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1];
  if(href.startsWith("#")||/^(?:https?:|mailto:|tel:|data:)/.test(href))continue;
  if(!href.startsWith("../")&&!href.startsWith("./")&&!/^[\w.\/-]+$/.test(href)){errors.push("URL insegura: "+href);continue;}
  const full=normalize(join(base,href));
  if(!full.startsWith(resolve(".output/public/v2/")))errors.push("Destino escapou da V2: "+href);
  else {
    let target=full;
    if(!extname(target))target=join(target,"index.html");
    if(!existsSync(target))errors.push("Link ou asset não encontrado: "+href);
  }
}
// V3.5: a HOME é composta fielmente a partir do HTML ORIGINAL V4.
// A V3.4 App First anterior continua navegável em /app-first/.
for(const [value,label] of [
 ['<h1>Conheça o território.<br/><em>Conecte possibilidades.</em></h1>',"mensagem territorial na abertura"],
 ['class="hero-art"',"composição de duas colunas com telas do aplicativo"],
 ['class="flow-grid"',"fluxo territorial do HTML V4"],
 ['class="feature-links-grid"',"faixa de recursos sem indicadores inventados"],
 ['id="aplicativo"',"app como primeira utilidade"],
 ['id="territorio"',"visão territorial"],
 ['id="comunidade"',"contribuição e comunidade"],
 ['id="oportunidades"',"oportunidades locais"],
 ['id="impacto"',"método de impacto"],
 ['id="blog"',"Diário na narrativa"],
 ['id="route-manifesto"',"template de manifesto integrado"],
 ['name="robots" content="noindex,nofollow"',"prévia sem indexação"]
])if(!home.includes(value))errors.push("V3.5 home sem "+label);
if(home.includes("Usuários em ~2 meses")||home.includes("2.500+"))
 errors.push("Indicadores sem fonte recente permaneceram na V3.5");
if(!existsSync(".output/public/v2/anterior-v34/index.html"))
 errors.push("Versão V3.4 anterior não foi preservada");
if(!original.includes("Menos caça à informação.")||!original.includes('id="codigo"')||original.length<610000)
 errors.push("V2 premium não foi preservada integralmente em /visao/");
if(!project.includes("O Aresta começa na escalada.")||
   !project.includes("aresta-editor-painel-qualidade-real-2026-11-20.webp")||
   !project.includes('href="../manifesto/"')||
   !project.includes('href="../impacto/"')||
   !project.includes('href="../transparencia/"'))errors.push("Página do projeto perdeu conexões entre as visões e conteúdo existente");
if(!mergedCss.includes(".journal-grid")||!mergedCss.includes(".pathway-grid")||
   !mergedCss.includes("@media(max-width:720px)"))errors.push("Camadas editoriais não são responsivas");
for(const [part,label] of [
 ['id="nav-deeper"',"menu Sobre no desktop"],
 ['id="nav-mobile"',"menu mobile"],
 ['href="../blog/"',"blog no menu"],
 ['href="../projeto/"',"caminho para o projeto"]
])if(!html.includes(part))errors.push("App First sem "+label);
// Rotas internas relativas de todas as páginas integradas, incluindo a nova raiz.
const verifyRelative=(content,sourceFile)=>{
 const basedir=dirname(resolve(sourceFile));
 for(const m of content.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1];
  if(!href||href.startsWith("#")||/^(?:https?:|mailto:|tel:|data:)/.test(href))continue;
  const targetFile=href.split(/[?#]/)[0]; if(!targetFile)continue;
  const labPrefix="/"+(process.env.GITHUB_REPOSITORY?.split("/").at(-1)||"aresta-lab")+"/v2/";
  let full=targetFile.startsWith(labPrefix)?
    normalize(join(resolve(".output/public/v2"),targetFile.slice(labPrefix.length))):
    normalize(join(basedir,targetFile));
  if(!full.startsWith(resolve(".output/public/v2/"))) {errors.push(sourceFile+" escapou da V2: "+href);continue;}
  if(!extname(full))full=join(full,"index.html");
  if(!existsSync(full))errors.push(sourceFile+" tem rota inexistente: "+href);
 }
};
verifyRelative(home,".output/public/v2/index.html");
const institutionalFile=".output/public/v2/apresentacao-institucional/index.html";
if(!existsSync(institutionalFile)) {
 errors.push("Apresentação institucional ausente");
} else {
 const institutional=readFileSync(institutionalFile,"utf8");
 const institutionalLinks=[...home.matchAll(/<a\b[^>]*href="[^"]*\/apresentacao-institucional\/"[^>]*>/g)];
 if(institutionalLinks.length!==1||institutionalLinks[0].index<home.indexOf('<footer class="footer">'))
  errors.push("A apresentação deve ser acessível por um único link discreto no rodapé");
 if(!institutional.includes('name="robots" content="noindex,nofollow"')||
    !institutional.includes("Conversar sobre parceria")||
    /Atlas estratégico|Aresta Intelligence|mapas de empatia/i.test(institutional))
  errors.push("A apresentação precisa ser pública e conter apenas informações institucionais");
 verifyRelative(institutional.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,""),institutionalFile);
}
verifyRelative(project,".output/public/v2/projeto/index.html");
verifyRelative(original,".output/public/v2/visao/index.html");

// V3.4: conferir tradução fiel da DIREÇÃO do guia em caminhos que não fabricam provas.
const territoryCss=readFileSync(join(dir,"territorio-v4.css"),"utf8");
for(const [id,label] of [
 ['id="territorio"',"narrativa territorial"],
 ['id="oportunidades"',"oportunidades"],
 ['id="pesquisa"',"ciência cidadã"],
 ['id="impacto"',"método de impacto"],
 ['id="codigo"',"código/autoria"]
])if(!html.includes(id)||!(home.includes(id)||(id==='id="codigo"'&&home.includes('id="aberto"'))))errors.push("V3.5 sem seção: "+label);
if(!html.includes("25+") && !html.includes("1.000Usuários")){} else errors.push("Métricas não verificadas entraram na home");
for(const label of ["EM DESENVOLVIMENTO / VISÃO","VISÃO FUTURA","MÉTODO PROPOSTO","Não apresentamos indicadores"]){
 if(!html.includes(label))errors.push("Falta aviso de status V4: "+label);
}
if(!html.includes('href="territorio-v4.css"')||!home.includes('class="flow-grid"'))
 errors.push("Estilo de território não está carregado nas duas entradas");
for(const color of ["#14332D","#07372E","#0A4D3E","#CBDCC7","#D9AD62"]){
 if(territoryCss.includes(color))errors.push("Paleta verde/dourada V4 foi incorporada: "+color);
}
if(!territoryCss.includes("@media(max-width:720px)"))
 errors.push("V3.4 não especifica responsividade em celular");
const themePages=["manifesto","impacto","transparencia"];
for(const name of themePages){
 const f=".output/public/v2/"+name+"/index.html";
 if(!existsSync(f)){errors.push("Página V4 ausente "+name);continue;}
 const content=readFileSync(f,"utf8");
 if(!content.includes("Feito pela comunidade. Aberto para o mundo.")||
    !content.includes('noindex,nofollow')||
    !content.includes('class="site-header"')||
    !content.includes("--orange:#d95635"))
  errors.push("Assinatura, rastreabilidade ou design incorretos em "+name);
 verifyRelative(content,f);
}
const articles=JSON.parse(readFileSync("lab-v2/app-first/territorio-v4-content.json","utf8")).essays;
const proposalIndex=".output/public/v2/propostas/index.html";
if(articles.length!==6||!existsSync(proposalIndex))errors.push("Catálogo de propostas V4 não foi produzido");
else{
 const listing=readFileSync(proposalIndex,"utf8");
 if(!listing.includes("não notícias publicadas"))errors.push("Propostas parecem notícias lançadas");
 verifyRelative(listing,proposalIndex);
 for(const article of articles){
  const file=".output/public/v2/propostas/"+article.slug+"/index.html";
  if(!existsSync(file)){errors.push("Proposta ausente "+article.slug);continue;}
  const page=readFileSync(file,"utf8");
  if(!page.includes("PROPOSTA EDITORIAL EM REVISÃO")||!page.includes("noindex,nofollow"))
   errors.push("Falta aviso não publicado: "+article.slug);
  verifyRelative(page,file);
 }
}
const blogNew=readFileSync(".output/public/v2/blog/index.html","utf8");
if(!blogNew.includes("CONTEÚDO EM REVISÃO")||!blogNew.includes("/propostas/"))
 errors.push("Diário não distingue propostas editoriais das matérias publicadas");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("App First QA OK: telas reais, responsividade, escada de conteúdo e rotas internas.");
