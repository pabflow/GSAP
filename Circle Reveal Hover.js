  function setupBtn1(element) {
    const config = {
      duration: 0.3,
      ease: "power1.in",
      leaveEase: "power1.out",
      overlayColor: element.getAttribute("data-overlay-color") || "#05002e",
      textColorOnHover: element.getAttribute("data-text-hover") || "#ffffff"
    };

    const textElement = element.querySelector('[data-text]') || element;
    const originalTextColor = getComputedStyle(textElement).color;

    element.style.overflow = "hidden";
    element.style.position = "relative";

    const overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    Object.assign(overlay.style, {
      position: "absolute",
      backgroundColor: config.overlayColor,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "none",
      pointerEvents: "none",
      zIndex: 0
    });
    element.appendChild(overlay);

    element.style.zIndex = 1;

    function percent(pos, size) {
      return (pos / size) * 100;
    }

    function onEnter(e) {
      const rect = element.getBoundingClientRect();
      const y = percent(e.clientY - rect.top, rect.height);
      const x = percent(e.clientX - rect.left, rect.width);
      overlay.style.display = "block";

      gsap.fromTo(
        overlay,
        { clipPath: `circle(0% at ${x}% ${y}%)` },
        {
          clipPath: `circle(141.4% at ${x}% ${y}%)`,
          duration: config.duration,
          ease: config.ease
        }
      );

      gsap.to(textElement, {
        color: config.textColorOnHover,
        duration: config.duration,
        ease: config.ease
      });
    }

    function onLeave(e) {
      const rect = element.getBoundingClientRect();
      const y = percent(e.clientY - rect.top, rect.height);
      const x = percent(e.clientX - rect.left, rect.width);

      gsap.to(overlay, {
        clipPath: `circle(0% at ${x}% ${y}%)`,
        overwrite: true,
        duration: config.duration,
        ease: config.leaveEase,
        onComplete: () => {
          overlay.style.display = "none";
        }
      });

      gsap.to(textElement, {
        color: originalTextColor,
        duration: config.duration,
        ease: config.leaveEase
      });
    }

    element.addEventListener("mouseenter", onEnter);
    element.addEventListener("mouseleave", onLeave);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-gsap="btn.1"]').forEach(setupBtn1);
  });
