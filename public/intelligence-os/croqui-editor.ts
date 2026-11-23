import { isSectorPhoto, type CroquiDraft, type DraftMedia, type Point } from "./croqui-drafts.ts";

export function installDraftEditor(form: HTMLFormElement) {
  const photoInput = form.querySelector<HTMLInputElement>('input[name="arquivoFoto"]')!;
  const photoPreview = form.querySelector<HTMLImageElement>("#sectorPhoto")!;
  const remove = form.querySelector<HTMLButtonElement>("#removeSectorPhoto")!;
  const undo = form.querySelector<HTMLButtonElement>("#undoCroquiPoint")!;
  const canvas = form.querySelector<HTMLCanvasElement>("#croquiCanvas")!;
  const ctx = canvas.getContext("2d");
  const status = form.querySelector<HTMLElement>("#croquiCanvasStatus")!;
  const error = form.querySelector<HTMLElement>("#draftError")!;
  const mapEmpty = form.querySelector<HTMLElement>("#croquiMapEmpty")!;
  const openMaps = form.querySelector<HTMLButtonElement>("#openMapFromPhoto")!;
  const discard = form.querySelector<HTMLElement>("#croquiDiscard")!;
  const body = form.querySelector<HTMLElement>(".croqui-dialog-body")!;
  const panes = [...form.querySelectorAll<HTMLElement>("[data-croqui-content]")];
  const switches = [...form.querySelectorAll<HTMLButtonElement>("[data-croqui-pane]")];

  let foto = "";
  let linha: Point[] = [];
  let image: HTMLImageElement | null = null;
  let cursor: Point | null = null;
  let loading = false;
  let version = 0;
  let originalState = "";

  function snapshot() {
    return JSON.stringify([[...new FormData(form)].filter(([key])=>key!=="arquivoFoto"),foto,linha]);
  }

  function draw() {
    photoPreview.hidden = !foto;
    remove.hidden = !foto;
    undo.disabled = !linha.length;
    undo.hidden = !foto;
    openMaps.hidden = !foto;
    mapEmpty.hidden = Boolean(foto);
    canvas.hidden = !foto;
    status.hidden = !foto;
    status.textContent = !foto ? "Carregue a foto do setor em Imagens." :
      !image ? "Carregando a foto…" : linha.length+" "+(linha.length===1?"ponto marcado":"pontos marcados");
    if (!ctx) return;
    canvas.height = image ? Math.max(180, Math.min(1000, Math.round(canvas.width*image.naturalHeight/image.naturalWidth))) : 460;
    ctx.fillStyle="#f5f3ee";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if (!image) return;
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    if (linha.length) {
      ctx.beginPath();
      linha.forEach(({x,y},i)=>{
        if(i===0)ctx.moveTo(x*canvas.width,y*canvas.height);
        else ctx.lineTo(x*canvas.width,y*canvas.height);
      });
      ctx.lineJoin="round";
      ctx.lineCap="round";
      ctx.lineWidth=7;
      ctx.strokeStyle="#fff";
      ctx.stroke();
      ctx.lineWidth=4;
      ctx.strokeStyle="#e35c34";
      ctx.stroke();
      for(const {x,y} of linha){
        ctx.beginPath();
        ctx.arc(x*canvas.width,y*canvas.height,5,0,Math.PI*2);
        ctx.fillStyle="#e35c34";
        ctx.fill();
        ctx.lineWidth=2;
        ctx.strokeStyle="#fff";
        ctx.stroke();
      }
    }
    if(cursor && document.activeElement===canvas){
      ctx.beginPath();
      ctx.arc(cursor.x*canvas.width,cursor.y*canvas.height,8,0,Math.PI*2);
      ctx.strokeStyle="#fff";
      ctx.lineWidth=4;
      ctx.stroke();
      ctx.strokeStyle="#171c1b";
      ctx.lineWidth=2;
      ctx.stroke();
    }
  }

  function select(name: string){
    for(const pane of panes)pane.hidden=pane.dataset.croquiContent!==name;
    for(const toggle of switches){
      const active=toggle.dataset.croquiPane===name;
      toggle.classList.toggle("active",active);
      toggle.setAttribute("aria-pressed",String(active));
    }
    body.scrollTop=0;
    if(name==="mapas")draw();
  }

  async function showPhoto(source: string, resetLine=false) {
    const current=++version;
    if(!source){
      foto="";
      linha=[];
      image=null;
      cursor=null;
      loading=false;
      photoPreview.removeAttribute("src");
      draw();
      return;
    }
    loading=true;
    const preview = new Image();
    preview.src=source;
    try {
      await preview.decode();
      if(current!==version)return;
      if(resetLine){linha=[];cursor=null;}
      foto=source;
      image=preview;
      photoPreview.src=source;
    } catch {
      if(current===version)error.textContent="Não foi possível abrir essa imagem.";
    } finally {
      if(current===version){loading=false;draw();}
    }
  }

  function addPoint(point: Point){
    if(!image || loading)return;
    if(linha.length>=200){
      status.textContent="O rascunho comporta até 200 pontos.";
      return;
    }
    linha.push(point);
    draw();
  }
  const clamp=(value:number)=>Math.max(0,Math.min(1,value));
  for(const toggle of switches)toggle.addEventListener("click",()=>select(toggle.dataset.croquiPane!));
  openMaps.addEventListener("click",()=>{select("mapas");canvas.focus();});
  form.querySelector("#openImagesFromMap")!.addEventListener("click",()=>{select("imagens");photoInput.focus();});
  form.addEventListener("input",()=>{discard.hidden=true;error.textContent="";});
  photoInput.addEventListener("change",()=>{
    const file=photoInput.files?.[0];
    if(!file)return;
    error.textContent="";
    if(!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size>2*1024*1024){
      error.textContent="Escolha uma foto JPG, PNG ou WebP de até 2 MB.";
      photoInput.value="";
      return;
    }
    const current=++version;
    const reader=new FileReader();
    loading=true;
    reader.addEventListener("load",()=>{
      if(current!==version)return;
      if(isSectorPhoto(reader.result))void showPhoto(reader.result,true);
      else {loading=false;error.textContent="Não foi possível ler o arquivo da foto.";}
    });
    reader.addEventListener("error",()=>{
      if(current===version){loading=false;error.textContent="Não foi possível ler o arquivo da foto.";}
    });
    reader.readAsDataURL(file);
  });
  remove.addEventListener("click",()=>{photoInput.value="";void showPhoto("");});
  undo.addEventListener("click",()=>{linha.pop();draw();});
  canvas.addEventListener("click",event=>{
    const rect=canvas.getBoundingClientRect();
    addPoint({x:clamp((event.clientX-rect.left)/rect.width),y:clamp((event.clientY-rect.top)/rect.height)});
  });
  canvas.addEventListener("keydown",event=>{
    if(!image || !["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"].includes(event.key))return;
    event.preventDefault();
    cursor ||= linha.at(-1) || {x:.5,y:.5};
    if(event.key==="Enter"){addPoint({...cursor});return;}
    const step=.02;
    cursor={x:clamp(cursor.x+(event.key==="ArrowRight"?step:event.key==="ArrowLeft"?-step:0)),
      y:clamp(cursor.y+(event.key==="ArrowDown"?step:event.key==="ArrowUp"?-step:0))};
    draw();
  });
  canvas.addEventListener("blur",()=>{if(cursor)draw();});

  return {
    open(draft?: Partial<CroquiDraft>) {
      form.reset();
      error.textContent="";
      void showPhoto("");
      if(draft){
        for(const [field,value] of Object.entries(draft)){
          const input=form.elements.namedItem(field);
          if(typeof value==="string" && (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement))input.value=value;
        }
        if(draft.foto){linha=(draft.linha||[]).map(point=>({...point}));void showPhoto(draft.foto);}
      }
      select("dados");
      originalState=JSON.stringify([[...new FormData(form)].filter(([key])=>key!=="arquivoFoto"),draft?.foto||"",draft?.linha||[]]);
    },
    hasChanges() { return loading || snapshot()!==originalState; },
    focusInput(name: string) {
      const input=form.elements.namedItem(name);
      if(input instanceof HTMLElement){
        select(input.closest<HTMLElement>("[data-croqui-content]")?.dataset.croquiContent||"dados");
        input.focus();
      }
    },
    focusField(field?: string) {
      const targets: Record<string,[string,string]> = {
        acesso:["dados","acesso"],grau:["dados","grau"],localizacao:["dados","latitude"],
        trilha:["dados","trilhaUrl"],creditos:["dados","creditos"],
        inicio:["betas","beta"],foto:["imagens","arquivoFoto"],mapa:["mapas","croquiCanvas"],
      };
      const [pane,name]=field && Object.hasOwn(targets,field)?targets[field]:["dados","pico"];
      select(pane);
      const target = name==="croquiCanvas"?canvas:form.elements.namedItem(name);
      if(target instanceof HTMLElement)target.focus();
    },
    media(): DraftMedia {
      if(loading)throw new Error("Aguarde a foto carregar antes de salvar.");
      return {foto,linha:linha.map(point=>({...point}))};
    },
  };
}
