(() => {
 const search=document.getElementById("lab-blog-search"),cards=[...document.querySelectorAll("[data-blog-card]")],buttons=[...document.querySelectorAll("[data-blog-filter]")],counter=document.getElementById("lab-results"),empty=document.getElementById("lab-no-results");
 const norm=s=>(s||"").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 let active="todos";
 function filter(){let n=0;const query=norm(search?.value.trim());cards.forEach(c=>{const ok=(active==="todos"||c.dataset.category===active)&&(!query||norm(c.textContent).includes(query));c.hidden=!ok;if(ok)n++;});if(counter)counter.textContent=n+(n===1?" história encontrada":" histórias encontradas");if(empty)empty.hidden=n>0;}
 search?.addEventListener("input",filter);
 buttons.forEach(btn=>btn.addEventListener("click",()=>{active=btn.dataset.blogFilter||"todos";buttons.forEach(b=>b.setAttribute("aria-pressed",String(b===btn)));filter();}));
 if(cards.length)filter();
 document.querySelectorAll("[data-share-article]").forEach(btn=>btn.addEventListener("click",async()=>{try{if(navigator.share){await navigator.share({title:document.title,url:location.href});}else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);btn.textContent="Link copiado";}else btn.textContent="Copie o endereço na barra do navegador";}catch{}}));
})();
