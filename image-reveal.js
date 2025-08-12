Webflow ||= [];
Webflow.push(() => {
  const wraps = document.querySelectorAll("[data-reveal-on-scroll]");

  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const img = wrap.querySelector("[data-reveal-image]");
    if (!img) return;
    img.style.clipPath = "inset(0% 0% 100% 0%)";
    img.style.transform = "scale(1.22)";
    img.style.transition = "none";
    img.style.willChange = "clip-path, transform";
    wrap.style.overflow = "hidden";
  });

  const observer = new IntersectionObserver((entries) => {
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
          const translateY = Math.min(percent * 0.3, 20);
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

  wraps.forEach((wrap) => observer.observe(wrap));
});
