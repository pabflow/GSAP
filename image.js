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
