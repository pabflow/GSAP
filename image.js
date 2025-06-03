const wraps = document.querySelectorAll(".reveal-on-scroll");

// Ocultar la imagen al cargar (desde abajo)
wraps.forEach((wrap) => {
  const img = wrap.querySelector(".reveal-image");
  if (img) {
    img.style.clipPath = "inset(0% 0% 100% 0%)"; // Oculto desde abajo
    img.style.transform = "scale(1.22)";
    img.style.transition = "none";
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const img = entry.target.querySelector(".reveal-image");
      if (!img) return;

      if (entry.isIntersecting) {
        // Transición solo para revelar una vez
        requestAnimationFrame(() => {
          img.style.transition =
            "clip-path 0.9s ease-out, transform 0.5s ease-out";

          img.style.clipPath = "inset(0% 0% 0% 0%)"; // Revelar de abajo hacia arriba
        });

        // Parallax scroll handler
        const updateTransform = () => {
          const rect = entry.target.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const percentScrolled = (rect.top / windowHeight) * 100;
          const translateY = Math.min(percentScrolled * 0.3, 20);
          const fixedScale = 1.22;

          img.style.transform = `translate3d(0, -${translateY}%, 0) scale(${fixedScale})`;
        };

        window.addEventListener("scroll", updateTransform);
        updateTransform();

        entry.target._removeScrollListener = () => {
          window.removeEventListener("scroll", updateTransform);
        };

        // Ya no necesitamos observar este elemento después
        observer.unobserve(entry.target);
      } else {
        if (entry.target._removeScrollListener) {
          entry.target._removeScrollListener();
          delete entry.target._removeScrollListener;
        }
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }
);

wraps.forEach((wrap) => observer.observe(wrap));



//GSAP Animation. Use g-animation as attribute and add the animation that you want on the value of that attribute

document.addEventListener("DOMContentLoaded", function () {
  // GSAP Animation. Use g-animation as attribute and add the animation that you want on the value of that attribute
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP o ScrollTrigger no están disponibles.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("[g-animation]").forEach(el => {
    const animation = el.getAttribute("g-animation");
    const triggerType = el.dataset.trigger || "scroll";
    const start = el.dataset.start || "top 80%";

    const settings = {
      "fade-center": {
        from: { clipPath: "inset(50% 50% 50% 50%)" },
        to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power1.out" }
      },
      "scale-in-circle": {
        from: { borderRadius: "50%", scale: 0.5 },
        to: { borderRadius: "0%", scale: 1, duration: 1, ease: "power2.out" }
      },
      "reveal-down": {
        from: { clipPath: "inset(100% 0% 0% 0%)" },
        to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power2.inOut" }
      },
      "reveal-up": {
        from: { clipPath: "inset(0% 0% 100% 0%)" },
        to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power2.inOut" }
      },
      "reveal-sides": {
        from: { clipPath: "inset(0% 50% 0% 50%)" },
        to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "ease" }
      },
      "wipe-left": {
        from: { clipPath: "inset(0% 100% 0% 0%)" },
        to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "ease" }
      },
      "wipe-right": {
        from: { clipPath: "inset(0% 0% 0% 100%)" },
        to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "ease" }
      },
      "blur-zoom": {
        from: { scale: 1.5, filter: "blur(12px)" },
        to: { scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
      },
      "slide-up": {
        from: { y: 100, rotation: 5 },
        to: { y: 0, rotation: 0, duration: 1.2, ease: "power2.out" }
      },
      "slide-left-rotate": {
        from: { x: -200, rotation: -45, transformOrigin: "center center" },
        to: { x: 0, rotation: 0, duration: 1.2, ease: "power2.out" }
      }
    };

    const anim = settings[animation];
    if (!anim) return;

    gsap.set(el, anim.from);

    gsap.to(el, {
      ...anim.to,
      scrollTrigger: triggerType === "scroll" ? {
        trigger: el,
        start: start,
        toggleActions: "play none none reverse"
      } : null
    });
  });
});
