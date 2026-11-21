/* Shared header: same Aresta identity on inner pages and Diário de Rocha.
   No dependency on other application scripts. */
(() => {
  const header=document.querySelector(".lab-unified-nav");
  if(!header) return;
  const menu=header.querySelector(".lab-unified-nav__mobile");
  const theme=header.querySelector("[data-lab-theme]");
  const getTheme=()=>document.documentElement.getAttribute("data-theme")||"light";
  const paint=()=>{if(theme){theme.textContent=getTheme()==="dark"?"☾":"☼";theme.setAttribute("aria-label",getTheme()==="dark"?"Ativar tema claro":"Ativar tema escuro");}};
  paint();
  theme?.addEventListener("click",()=>{
    const next=getTheme()==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",next);
    try{localStorage.setItem("aresta-theme",next);}catch{}
    paint();
  });
  menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.open=false;}));
  document.addEventListener("click",e=>{if(menu?.open&&!header.contains(e.target))menu.open=false;});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&menu?.open){menu.open=false;menu.querySelector("summary")?.focus();}});
  let previous=Math.max(0,window.scrollY),direction=0,travel=0,scheduled=false;
  function sync(){
    scheduled=false;
    const y=Math.max(0,window.scrollY),delta=y-previous;previous=y;
    if(y<100||menu?.open||header.matches(":focus-within")&&header.querySelector(":focus-visible")) {
      header.classList.remove("is-hidden");travel=0;return;
    }
    if(Math.abs(delta)<1)return;
    const d=Math.sign(delta);if(d!==direction){direction=d;travel=0;}travel+=Math.abs(delta);
    if(d>0&&y>165&&travel>22)header.classList.add("is-hidden");
    else if(d<0&&travel>14)header.classList.remove("is-hidden");
  }
  window.addEventListener("scroll",()=>{if(!scheduled){scheduled=true;requestAnimationFrame(sync);}}, {passive:true});
  menu?.addEventListener("toggle",()=>{if(menu.open)header.classList.remove("is-hidden");});
  sync();
})();