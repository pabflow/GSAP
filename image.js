document.querySelectorAll("[data-reveal-wrapper]").forEach((wrap) => {
  const img = wrap.querySelector("[data-reveal-image]");
  if (!img) return;

  const direction = wrap.getAttribute("data-reveal") || "bottom";
  const useScale = wrap.getAttribute("data-scale") !== "false"; // true por default

  // Estados iniciales según dirección
  let clipStart = "";
  let transformStart = "";

  switch (direction) {
    case "top":
      clipStart = "inset(100% 0% 0% 0%)";
      transformStart = "translateY(-20%)";
      break;
    case "left":
      clipStart = "inset(0% 100% 0% 0%)";
      transformStart = "translateX(-20%)";
      break;
    case "right":
      clipStart = "inset(0% 0% 0% 100%)";
      transformStart = "translateX(20%)";
      break;
    case "bottom":
    default:
      clipStart = "inset(0% 0% 100% 0%)";
      transformStart = "translateY(20%)";
      break;
  }

  img.style.clipPath = clipStart;
  img.style.transition = "none";
  img.style.willChange = "clip-path, transform";
  img.style.transform = useScale
    ? `${transformStart} scale(1.22)`
    : transformStart;
});

// Observador
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const wrap = entry.target;
      const img = wrap.querySelector("[data-reveal-image]");
      if (!img) return;

      const direction = wrap.getAttribute("data-reveal") || "bottom";
      const useScale = wrap.getAttribute("data-scale") !== "false";

      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          img.style.transition =
            "clip-path 0.9s ease-out, transform 0.6s ease-out";
          img.style.clipPath = "inset(0% 0% 0% 0%)";
          img.style.transform = useScale ? "scale(1)" : "translate(0, 0)";
        });

        // Scroll parallax si tiene zoom
        if (useScale) {
          const updateTransform = () => {
            const rect = wrap.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const percentScrolled = (rect.top / windowHeight) * 100;
            const translateY = Math.min(percentScrolled * 0.3, 20);

            img.style.transform = `translate3d(0, -${translateY}%, 0) scale(1.22)`;
          };

          window.addEventListener("scroll", updateTransform);
          updateTransform();

          wrap._removeScrollListener = () => {
            window.removeEventListener("scroll", updateTransform);
          };
        }

        observer.unobserve(wrap);
      } else {
        if (wrap._removeScrollListener) {
          wrap._removeScrollListener();
          delete wrap._removeScrollListener;
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

// Aplicar el observador a cada wrapper
document
  .querySelectorAll("[data-reveal-wrapper]")
  .forEach((wrap) => observer.observe(wrap));
