/**
 * Image Reveal on Scroll - Standalone Version
 * -------------------------------------------
 * Wrapper: [data-reveal-on-scroll]
 * Target : [data-reveal-image] (img/video/elemento a revelar)
 *
 * ✅ Compatible con:
 *   - Webflow CMS dinámico
 *   - Lazy load de imágenes
 *   - Símbolos
 *   - Filtros, paginación (MutationObserver)
 *   - Interacciones de Webflow (IX2)
 */

Webflow ||= [];
Webflow.push(function () {
  console.log("[Image Reveal] Initialized 🚀");

  const INIT_ATTR = "data-reveal-initialized";

  // Crea un IntersectionObserver para el reveal
  const makeObserver = () =>
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const wrap = entry.target;
        const img = wrap.querySelector("[data-reveal-image]");
        if (!img) return;

        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            img.style.transition = "clip-path 0.9s ease-out, transform 0.5s ease-out";
            img.style.clipPath = "inset(0% 0% 0% 0%)";
          });

          const updateTransform = () => {
            const rect = wrap.getBoundingClientRect();
            const windowH = window.innerHeight || document.documentElement.clientHeight;
            const percent = (rect.top / windowH) * 100;
            const translateY = Math.min(percent * 0.3, 20); // parallax suave
            img.style.transform = `translate3d(0, -${translateY}%, 0) scale(1.22)`;
          };

          wrap._parallaxHandler = updateTransform;
          window.addEventListener("scroll", updateTransform, { passive: true });
          window.addEventListener("resize", updateTransform);
          updateTransform();

          observer.unobserve(wrap);
        } else {
          if (wrap._parallaxHandler) {
            window.removeEventListener("scroll", wrap._parallaxHandler);
            window.removeEventListener("resize", wrap._parallaxHandler);
            delete wrap._parallaxHandler;
          }
        }
      });
    }, { threshold: 0.1 });

  let observer = makeObserver();

  // Inicializa un wrapper (idempotente)
  function initWrap(wrap) {
    if (!wrap || wrap.hasAttribute(INIT_ATTR)) return;

    const img = wrap.querySelector("[data-reveal-image]");
    if (!img) return;

    const applyInitial = () => {
      img.style.clipPath = "inset(0% 0% 100% 0%)";
      img.style.transform = "scale(1.22)";
      img.style.transition = "none";
      img.style.willChange = "clip-path, transform";
      wrap.style.overflow = "hidden";
      observer.observe(wrap);
      wrap.setAttribute(INIT_ATTR, "true");
    };

    if (!("complete" in img) || img.complete) {
      applyInitial();
    } else {
      img.addEventListener("load", applyInitial, { once: true });
      img.addEventListener("error", () => wrap.setAttribute(INIT_ATTR, "error"), { once: true });
    }
  }

  // Inicializa todos los actuales
  function initAll() {
    document.querySelectorAll("[data-reveal-on-scroll]").forEach(initWrap);
  }

  // 1) Al iniciar (ya dentro de Webflow.push)
  initAll();

  // 2) Tras carga completa (por CMS/assets/tabs/sliders)
  window.addEventListener("load", initAll);

  // 3) Observa cambios en el DOM (CMS dinámico, filtros, paginación, etc.)
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes && m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches?.("[data-reveal-on-scroll]")) initWrap(node);
        node.querySelectorAll?.("[data-reveal-on-scroll]").forEach(initWrap);
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 4) (Opcional) Fade/scale si GSAP está disponible
  if (typeof gsap !== "undefined") {
    document.querySelectorAll("[data-reveal-on-scroll]").forEach((wrap) => {
      const img = wrap.querySelector("[data-reveal-image]");
      if (!img) return;
      gsap.set(img, { opacity: 0.001, scale: 1.22 });
      const io = new IntersectionObserver((ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(img, { opacity: 1, duration: 0.6, ease: "power1.out" });
            io.disconnect();
          }
        });
      }, { threshold: 0.05 });
      io.observe(wrap);
    });
  }

  console.log("[Image Reveal] All wrappers initialized ✅");
});
