/**
 * Pablo Gubelin Webflow Component Script
 * --------------------------------
 * This file initializes custom scripts for Webflow.
 * It runs safely after Webflow and the DOM have fully loaded.
 *
 * ✅ Fully compatible with:
 *   - Dynamic Webflow CMS content
 *   - Symbols
 *   - Webflow Interactions (IX2)
 *   - Multiple custom scripts running in parallel
 *
 * ℹ️ Use classes, data attributes, or IDs specific to each component.
 */

Webflow ||= [];
Webflow.push(function () {
  console.log("[Webflow Custom Script] Successfully initialized 🚀");

  /** --------------------------------
   * 🎯 COMPONENT 1: GSAP Hover Button
   * -------------------------------- */
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

  document.querySelectorAll('[data-gsap="btn.1"]').forEach(setupBtn1);

  /** --------------------------------
   * 🧠 COMPONENT 2: Animated Underline on Links
   * -------------------------------- */
  document.querySelectorAll('[data-hover="underline"]').forEach(link => {
    const underline = link.querySelector('.underline');
    if (!underline) return;

    link.addEventListener('mouseenter', () => {
      gsap.set(underline, { transformOrigin: 'left' });
      gsap.to(underline, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.set(underline, { transformOrigin: 'right' });
      gsap.to(underline, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power2.in'
      });
    });
  });

  /** --------------------------------
   * ✅ Debug / Test Logs
   * -------------------------------- */
  console.log("[Webflow Custom Script] All components successfully initialized ✅");
});
