/* Progressive enhancement: menus acessíveis + barra discreta ao rolar.
   O tema claro/escuro continua sendo controlado pelo script original da landing. */
(() => {
  const bar = document.querySelector(".navWrap");
  if (!bar) return;

  const menuMobile = bar.querySelector(".premiumMobileMenu");
  const menuMore = bar.querySelector(".premiumMore");
  const menus = [menuMobile, menuMore].filter(Boolean);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeMenus(except = null) {
    for (const menu of menus) {
      if (menu !== except) menu.open = false;
    }
  }

  menus.forEach(menu => {
    menu.addEventListener("toggle", () => {
      if (menu.open) {
        closeMenus(menu);
        bar.classList.remove("is-hidden");
      }
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      menu.open = false;
      bar.classList.remove("is-hidden");
    }));
  });

  document.addEventListener("click", event => {
    if (!menus.some(menu => menu.contains(event.target))) closeMenus();
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const active = menus.find(menu => menu.open);
    if (active) {
      active.open = false;
      active.querySelector("summary")?.focus();
      event.preventDefault();
    }
  });

  bar.addEventListener("focusin", () => bar.classList.remove("is-hidden"));
  bar.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", () => {
    bar.classList.remove("is-hidden");
  }));

  let previousY = Math.max(0, window.scrollY);
  let direction = 0;
  let travel = 0;
  let scheduled = false;

  function updateHeader() {
    scheduled = false;
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;
    bar.classList.toggle("is-scrolled", currentY > 80);

    if (currentY < 95 || prefersReducedMotion) {
      bar.classList.remove("is-hidden");
      travel = 0;
    } else if (Math.abs(delta) > 0) {
      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) {
        travel = 0;
        direction = nextDirection;
      }
      travel += Math.abs(delta);

      if (nextDirection > 0 && currentY > 210 && travel > 22 && !menus.some(m => m.open)) {
        bar.classList.add("is-hidden");
      } else if (nextDirection < 0 && travel > 15) {
        bar.classList.remove("is-hidden");
      }
    }
    previousY = currentY;
  }

  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, {passive:true});
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960 && menuMobile) menuMobile.open = false;
  }, {passive:true});
  updateHeader();
})();
