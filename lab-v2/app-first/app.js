/* Aresta Lab — conceito App First: navegação acessível e sem dependências externas. */
(() => {
  const bar=document.getElementById("site-header");
  const menu=document.getElementById("nav-mobile");
  const deeper=document.getElementById("nav-deeper");
  const menus=[menu,deeper].filter(Boolean);
  const faq=Array.from(document.querySelectorAll(".faq-list details"));
  if(!bar)return;
  menus.forEach(m=>m.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{m.open=false;})));
  menus.forEach(m=>m.addEventListener("toggle",()=>{if(m.open){menus.filter(other=>other!==m).forEach(other=>{other.open=false;});bar.classList.remove("is-hidden");}}));
  document.addEventListener("click",event=>{menus.forEach(m=>{if(m.open&&!m.contains(event.target))m.open=false;});});
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    for(const m of menus){if(m.open){m.open=false;m.querySelector("summary")?.focus();break;}}
  });
  faq.forEach(item=>item.addEventListener("toggle",()=>{
    if(item.open)faq.filter(other=>other!==item).forEach(other=>{other.open=false;});
  }));
  let previous=Math.max(0,window.scrollY),direction=0,travel=0,pending=false;
  const visible=()=>bar.classList.remove("is-hidden");
  const focusViaKeyboard=()=>Boolean(bar.querySelector(":focus-visible"));
  const update=()=>{
    pending=false;
    const y=Math.max(0,window.scrollY),delta=y-previous;previous=y;
    if(y<90||menus.some(m=>m.open)||focusViaKeyboard()){visible();travel=0;return;}
    if(Math.abs(delta)<1)return;
    const nextDir=Math.sign(delta);
    if(nextDir!==direction){direction=nextDir;travel=0;}
    travel+=Math.abs(delta);
    if(nextDir>0&&y>160&&travel>22)bar.classList.add("is-hidden");
    else if(nextDir<0&&travel>12)visible();
  };
  window.addEventListener("scroll",()=>{
    if(pending)return;
    pending=true;window.requestAnimationFrame(update);
  },{passive:true});
  menu?.addEventListener("toggle",()=>{if(menu.open)visible();});
  update();
})();