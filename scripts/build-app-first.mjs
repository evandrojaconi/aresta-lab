import {cpSync,existsSync,mkdirSync,readFileSync} from "node:fs";
import {join} from "node:path";

// Aresta Lab: experimento isolado. Nunca substitui a V2 nem /oficial/.
const root=".output/public/v2";
const target=join(root,"app-first");
const src="lab-v2/app-first";
for(const filename of ["index.html","style.css","app.js"]){
  if(!existsSync(join(src,filename)))throw Error("Arquivo app-first ausente: "+filename);
}
for(const file of [
  "explorar-locais.png","pedra-grande.png","croqui-interativo.png",
  "comunidade-pico.png","setor-principal.png"
]){
 if(!existsSync(join(root,"assets/app",file)))throw Error("Captura real do app ausente: "+file);
}
if(!existsSync(join(root,"assets/aresta-climb-simbolo-montanha-branco.svg")))
 throw Error("Símbolo oficial da marca ausente");
mkdirSync(target,{recursive:true});
for(const file of ["index.html","style.css","app.js"]){
 cpSync(join(src,file),join(target,file));
}
const html=readFileSync(join(target,"index.html"),"utf8");
if(!html.includes('name="robots" content="noindex,nofollow"')||
   !html.includes("Escalada e croquis."))throw Error("Experimento app-first não é isolado");
console.log("Novo experimento app-first disponível em /v2/app-first/");
