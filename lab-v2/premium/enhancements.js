/* A home premium original já implementa o alternador claro/escuro.
   Este script adiciona apenas comportamento para navegação móvel. */
(() => {
  const mobile = document.querySelector(".premiumMobileMenu");
  if (!mobile) return;
  mobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {mobile.open=false;}));
  document.addEventListener("click", e => {if(mobile.open&&!mobile.contains(e.target))mobile.open=false;});
  document.addEventListener("keydown", e => {if(e.key==="Escape"&&mobile.open){mobile.open=false;mobile.querySelector("summary")?.focus();}});
})();
