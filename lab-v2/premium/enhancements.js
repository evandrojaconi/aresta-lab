/* Aresta Lab V2.5 — navegação flutuante, curta e inteligente.
   Desce: desaparece. Sobe: reaparece. Menu aberto ou foco de teclado: visível.
   Funciona no desktop e no mobile; não depende da direção do touch gesture. */
(() => {
  const bar = document.querySelector(".navWrap");
  if (!bar) return;

  const mobile = bar.querySelector(".premiumMobileMenu");
  const more = bar.querySelector(".premiumMore");
  const menus = [mobile, more].filter(Boolean);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const openMenu = () => menus.some(menu => menu.open);
  const keyboardFocus = () =>
    bar.contains(document.activeElement) &&
    Boolean(document.activeElement?.matches?.(":focus-visible"));
  const reveal = () => bar.classList.remove("is-hidden");

  function closeMenus(keep = null) {
    for (const menu of menus) if (menu !== keep) menu.open = false;
  }

  for (const menu of menus) {
    menu.addEventListener("toggle", () => {
      if (menu.open) {
        closeMenus(menu);
        reveal();
      }
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menu.open = false;
      reveal();
    }));
  }

  document.addEventListener("click", event => {
    if (!menus.some(menu => menu.contains(event.target))) closeMenus();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const current = menus.find(menu => menu.open);
    if (!current) return;
    current.open = false;
    current.querySelector("summary")?.focus();
    reveal();
    event.preventDefault();
  });
  bar.addEventListener("focusin", event => {
    if (event.target?.matches?.(":focus-visible")) reveal();
  });

  let lastY = Math.max(0, window.scrollY);
  let lastDirection = 0;
  let distanceInDirection = 0;
  let scheduled = false;

  function syncWithScroll() {
    scheduled = false;
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    lastY = y;
    bar.classList.toggle("is-scrolled", y > 60);

    if (y < 105 || openMenu() || keyboardFocus()) {
      reveal();
      distanceInDirection = 0;
      return;
    }
    if (Math.abs(delta) < 1) return;

    const direction = Math.sign(delta);
    if (direction !== lastDirection) {
      lastDirection = direction;
      distanceInDirection = 0;
    }
    distanceInDirection += Math.abs(delta);

    // Evita piscar com pequenas mudanças de direção ou rolagem elástica.
    if (direction > 0 && y > 160 && distanceInDirection > 19) {
      bar.classList.add("is-hidden");
    } else if (direction < 0 && distanceInDirection > 11) {
      reveal();
    }
  }

  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(syncWithScroll);
  }, { passive:true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840 && mobile) mobile.open = false;
    if (window.innerWidth <= 840 && more) more.open = false;
    reveal();
    lastY = Math.max(0, window.scrollY);
    distanceInDirection = 0;
  }, { passive:true });

  // Movimento reduzido mantém o comportamento sem transições visuais.
  // O browser aplica transition:none; a barra ainda é escondida ao descer.
  reducedMotion.addEventListener?.("change", reveal);
  syncWithScroll();
})();
