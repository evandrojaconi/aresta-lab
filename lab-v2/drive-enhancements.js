/* Aresta Lab V2 — interações locais de demonstração, sem envio de analytics */
(() => {
  "use strict";
  const nav = document.querySelector(".nav-mobile");
  if (nav) {
    nav.querySelectorAll("nav a").forEach(a => a.addEventListener("click", () => { nav.open = false; }));
    document.addEventListener("click", event => { if (nav.open && !nav.contains(event.target)) nav.open = false; });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && nav.open) { nav.open = false; nav.querySelector("summary")?.focus(); } });
  }

  // O celular é uma demonstração CONCEITUAL: não utiliza dados reais de vias.
  const phone = document.querySelector(".phone-stage");
  const steps = Array.from(phone?.querySelectorAll(".app-journey li") || []);
  const markers = Array.from(phone?.querySelectorAll(".route-marker") || []);
  const hints = [
    ["Explore o mapa.", "Veja o contexto da parede antes de escolher uma linha."],
    ["Toque em uma linha.", "Os pontos do exemplo representam caminhos de navegação no croqui."],
    ["Confira os detalhes.", "No aplicativo, consulte informações de cada via quando disponíveis."],
    ["Leve para o campo.", "Baixe o conteúdo antes de ir para um local sem internet."]
  ];
  function chooseStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === index);
      step.classList.toggle("demo-selected", i === index);
      step.setAttribute("aria-current", i === index ? "step" : "false");
    });
    markers.forEach((marker, i) => marker.classList.toggle("demo-selected", index === i+1));
    const title = phone?.querySelector(".app-content h3");
    const explanation = phone?.querySelector(".app-content > p:not(.app-kicker)");
    if (title) title.textContent = hints[index][0];
    if (explanation) explanation.textContent = hints[index][1];
  }
  if (steps.length === 4 && markers.length === 3) {
    steps.forEach((step, index) => {
      step.tabIndex = 0;
      step.setAttribute("role", "button");
      step.setAttribute("aria-label", "Etapa " + (index+1) + ": " + hints[index][0]);
      step.addEventListener("click", () => chooseStep(index));
      step.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); chooseStep(index); }
      });
    });
    markers.forEach((marker, index) => {
      marker.tabIndex = 0;
      marker.setAttribute("role", "button");
      marker.setAttribute("aria-label", "Explorar ponto " + (index+1) + " na demonstração do croqui");
      marker.addEventListener("click", () => chooseStep(index+1));
      marker.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); chooseStep(index+1); }
      });
    });
    chooseStep(1);
  }

  // Busca e filtro rodam inteiramente no navegador sobre artigos PUBLICADOS NA PRÉVIA.
  const query = document.getElementById("lab-blog-search");
  const filters = Array.from(document.querySelectorAll("[data-blog-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-blog-card]"));
  const empty = document.getElementById("lab-no-results");
  const count = document.getElementById("lab-results");
  let active = "todos";
  function normalize(value) {
    return (value || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function filter() {
    const term = normalize(query?.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = active === "todos" || card.dataset.category === active;
      const matchesTerm = !term || normalize(card.textContent).includes(term);
      const show = matchesCategory && matchesTerm;
      card.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
    if (count) count.textContent = visible + (visible === 1 ? " história encontrada" : " histórias encontradas");
  }
  query?.addEventListener("input", filter);
  filters.forEach(button => button.addEventListener("click", () => {
    active = button.dataset.blogFilter || "todos";
    filters.forEach(filterButton => filterButton.setAttribute("aria-pressed", String(filterButton === button)));
    filter();
  }));
  if (cards.length) filter();

  document.querySelectorAll("[data-share-article]").forEach(button => {
    button.addEventListener("click", async () => {
      const url = window.location.href;
      try {
        if (navigator.share) await navigator.share({ title: document.title, url });
        else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          button.textContent = "Link copiado";
        } else button.textContent = "Copie o endereço do navegador";
      } catch { /* Usuário cancelou o compartilhamento. */ }
    });
  });
})();
