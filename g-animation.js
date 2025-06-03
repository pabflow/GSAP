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
