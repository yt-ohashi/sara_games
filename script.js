document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  initExpressionSwitcher();
  initLightbox();
  initSmoothScroll();
  initMobileMenu();
  initRevealObserver();

  function initExpressionSwitcher() {
    const portrait = document.querySelector(".expression-portrait");
    const buttons = Array.from(document.querySelectorAll(".expression-button"));

    if (!portrait || buttons.length === 0) {
      return;
    }

    const messageTarget =
      document.querySelector("[data-expression-message]") ||
      document.querySelector(".persona-card [data-message]") ||
      document.querySelector(".persona-card .expression-message") ||
      document.querySelector(".persona-card .persona-message");

    const setPortrait = (button) => {
      const nextSrc =
        button.dataset.expressionSrc ||
        button.dataset.portraitSrc ||
        button.dataset.imageSrc ||
        button.dataset.image ||
        button.querySelector("img")?.getAttribute("src");
      const nextAlt =
        button.dataset.expressionAlt ||
        button.dataset.portraitAlt ||
        button.querySelector("img")?.getAttribute("alt") ||
        portrait.getAttribute("alt") ||
        "";
      const nextMessage =
        button.dataset.expressionMessage ||
        button.dataset.message ||
        button.getAttribute("aria-label") ||
        button.textContent.trim();

      if (!nextSrc) {
        return;
      }

      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      const swapImage = () => {
        portrait.setAttribute("src", nextSrc);
        portrait.setAttribute("alt", nextAlt);

        if (messageTarget && nextMessage) {
          messageTarget.textContent = nextMessage;
        }
      };

      if (reduceMotion.matches) {
        swapImage();
        return;
      }

      portrait.classList.add("is-switching");

      window.setTimeout(() => {
        swapImage();
        portrait.classList.remove("is-switching");
      }, 160);
    };

    buttons.forEach((button, index) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));

      if (!button.classList.contains("is-active") && index === 0) {
        button.classList.add("is-active");
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
      }

      button.addEventListener("click", () => setPortrait(button));
    });
  }

  function initLightbox() {
    const triggers = Array.from(document.querySelectorAll("[data-lightbox-src]"));

    if (triggers.length === 0) {
      return;
    }

    const lightbox = getOrCreateLightbox();
    const image = lightbox.querySelector(".lightbox__image, .lightbox-image");
    const caption = lightbox.querySelector(".lightbox__caption, .lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox__close, .lightbox-close");
    let lastFocusedElement = null;

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-lightbox-open");
      document.body.style.overflow = "";

      if (image) {
        image.removeAttribute("src");
        image.setAttribute("alt", "");
      }

      if (caption) {
        caption.textContent = "";
      }

      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    };

    const openLightbox = (trigger) => {
      const src = trigger.dataset.lightboxSrc;

      if (!src || !image) {
        return;
      }

      const alt =
        trigger.dataset.lightboxAlt ||
        trigger.querySelector("img")?.getAttribute("alt") ||
        trigger.getAttribute("aria-label") ||
        "";
      const captionText =
        trigger.dataset.lightboxCaption ||
        trigger.querySelector("figcaption")?.textContent.trim() ||
        trigger.querySelector(".gallery-card__title")?.textContent.trim() ||
        trigger.querySelector("span")?.textContent.trim() ||
        "";

      lastFocusedElement = document.activeElement;
      image.setAttribute("src", src);
      image.setAttribute("alt", alt);

      if (caption) {
        caption.textContent = captionText;
        caption.hidden = captionText.length === 0;
      }

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-lightbox-open");
      document.body.style.overflow = "hidden";
      closeButton?.focus();
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openLightbox(trigger);
      });
    });

    closeButton?.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  function getOrCreateLightbox() {
    const existing = document.querySelector(".lightbox");

    if (existing) {
      ensureLightboxMarkup(existing);
      return existing;
    }

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("aria-label", "画像の拡大表示");
    lightbox.innerHTML = `
      <button class="lightbox__close lightbox-close" type="button" aria-label="閉じる">×</button>
      <figure class="lightbox__frame lightbox-frame">
        <img class="lightbox__image lightbox-image" src="" alt="" />
        <figcaption class="lightbox__caption lightbox-caption" hidden></figcaption>
      </figure>
    `;
    document.body.appendChild(lightbox);
    return lightbox;
  }

  function ensureLightboxMarkup(lightbox) {
    if (!lightbox.querySelector(".lightbox__close, .lightbox-close")) {
      const closeButton = document.createElement("button");
      closeButton.className = "lightbox__close lightbox-close";
      closeButton.type = "button";
      closeButton.setAttribute("aria-label", "閉じる");
      closeButton.textContent = "×";
      lightbox.appendChild(closeButton);
    }

    if (!lightbox.querySelector(".lightbox__image, .lightbox-image")) {
      const image = document.createElement("img");
      image.className = "lightbox__image lightbox-image";
      image.alt = "";
      lightbox.appendChild(image);
    }

    if (!lightbox.querySelector(".lightbox__caption, .lightbox-caption")) {
      const caption = document.createElement("div");
      caption.className = "lightbox__caption lightbox-caption";
      caption.hidden = true;
      lightbox.appendChild(caption);
    }

    lightbox.setAttribute("role", lightbox.getAttribute("role") || "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function initSmoothScroll() {
    document.querySelectorAll("[data-scroll-target]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        const targetSelector = trigger.dataset.scrollTarget;

        if (!targetSelector) {
          return;
        }

        const target =
          document.querySelector(targetSelector) ||
          document.getElementById(targetSelector.replace(/^#/, ""));

        if (!target) {
          return;
        }

        event.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({
          behavior: reduceMotion.matches ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  function initMobileMenu() {
    const button = document.querySelector(".mobile-menu-button");
    const nav = document.querySelector(".site-nav");

    if (!button || !nav) {
      return;
    }

    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const shouldOpen = !nav.classList.contains("is-open");
      setMobileMenuState(shouldOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  }

  function setMobileMenuState(isOpen) {
    const button = document.querySelector(".mobile-menu-button");
    const nav = document.querySelector(".site-nav");

    if (!button || !nav) {
      return;
    }

    button.classList.toggle("is-open", isOpen);
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("is-menu-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  }

  function closeMobileMenu() {
    setMobileMenuState(false);
  }

  function initRevealObserver() {
    const revealItems = Array.from(document.querySelectorAll(".reveal"));

    if (revealItems.length === 0) {
      return;
    }

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }
});
