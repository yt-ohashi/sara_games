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
    const previousButton = lightbox.querySelector(".lightbox__nav--previous");
    const nextButton = lightbox.querySelector(".lightbox__nav--next");
    const itemGroups = new Map();
    const triggerIndexes = new Map();
    let lastFocusedElement = null;
    let activeItems = [];
    let currentIndex = -1;
    let swipeStartX = 0;
    let swipeStartY = 0;

    triggers.forEach((trigger) => {
      const src = trigger.dataset.lightboxSrc;

      if (!src) {
        return;
      }

      const groupKey = trigger.closest(".gallery-grid") ? "gallery" : `single:${src}`;
      const groupItems = itemGroups.get(groupKey) || [];
      let index = groupItems.findIndex((item) => item.src === src);

      if (index === -1) {
        index = groupItems.length;
        groupItems.push({
          src,
          alt:
            trigger.dataset.lightboxAlt ||
            trigger.querySelector("img")?.getAttribute("alt") ||
            trigger.getAttribute("aria-label") ||
            "",
          caption: trigger.dataset.lightboxCaption || "",
        });
        itemGroups.set(groupKey, groupItems);
      }

      triggerIndexes.set(trigger, { groupKey, index });
    });

    const updateNavigationButtons = () => {
      const shouldHide = activeItems.length < 2;

      if (previousButton) {
        previousButton.hidden = shouldHide;
      }

      if (nextButton) {
        nextButton.hidden = shouldHide;
      }
    };

    const renderLightboxItem = (index) => {
      const item = activeItems[index];

      if (!item || !image) {
        return;
      }

      currentIndex = index;
      image.setAttribute("src", item.src);
      image.setAttribute("alt", item.alt);

      if (caption) {
        caption.textContent = item.caption;
        caption.hidden = item.caption.length === 0;
      }
    };

    const navigateLightbox = (direction) => {
      if (!lightbox.classList.contains("is-open") || activeItems.length < 2) {
        return;
      }

      const nextIndex = (currentIndex + direction + activeItems.length) % activeItems.length;
      renderLightboxItem(nextIndex);
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-lightbox-open");
      document.body.style.overflow = "";
      activeItems = [];
      currentIndex = -1;
      updateNavigationButtons();

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
      const context = triggerIndexes.get(trigger);

      if (!context || !image) {
        return;
      }

      lastFocusedElement = document.activeElement;
      activeItems = itemGroups.get(context.groupKey) || [];
      updateNavigationButtons();
      renderLightboxItem(context.index);

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
    previousButton?.addEventListener("click", () => navigateLightbox(-1));
    nextButton?.addEventListener("click", () => navigateLightbox(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) {
        return;
      }

      swipeStartX = event.clientX;
      swipeStartY = event.clientY;
    });

    lightbox.addEventListener("pointerup", (event) => {
      if (!swipeStartX || event.target.closest("button")) {
        return;
      }

      const distanceX = event.clientX - swipeStartX;
      const distanceY = event.clientY - swipeStartY;
      swipeStartX = 0;
      swipeStartY = 0;

      if (Math.abs(distanceX) < 48 || Math.abs(distanceX) < Math.abs(distanceY) * 1.4) {
        return;
      }

      navigateLightbox(distanceX > 0 ? -1 : 1);
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateLightbox(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateLightbox(1);
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
      <button class="lightbox__nav lightbox__nav--previous" type="button" aria-label="前の画像">‹</button>
      <figure class="lightbox__frame lightbox-frame">
        <img class="lightbox__image lightbox-image" src="" alt="" />
        <figcaption class="lightbox__caption lightbox-caption" hidden></figcaption>
      </figure>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="次の画像">›</button>
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

    if (!lightbox.querySelector(".lightbox__nav--previous")) {
      const previousButton = document.createElement("button");
      previousButton.className = "lightbox__nav lightbox__nav--previous";
      previousButton.type = "button";
      previousButton.setAttribute("aria-label", "前の画像");
      previousButton.textContent = "‹";
      lightbox.appendChild(previousButton);
    }

    if (!lightbox.querySelector(".lightbox__nav--next")) {
      const nextButton = document.createElement("button");
      nextButton.className = "lightbox__nav lightbox__nav--next";
      nextButton.type = "button";
      nextButton.setAttribute("aria-label", "次の画像");
      nextButton.textContent = "›";
      lightbox.appendChild(nextButton);
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
