(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Scroll reveal (entrance animations) ----
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in-view"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -80px 0px" }
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }

  if (reduceMotion) return;

  // ---- Parallax layers ----
  const fixedLayers = [
    { el: document.querySelector(".parallax-stars"), speed: -0.15 },
    { el: document.querySelector(".parallax-moon"), speed: -0.45 },
    { el: document.querySelector(".cosmos-hero-bg"), speed: 0.25 },
    // À propos page: giant cream moon behind the hero stage drifts slower
    // than the page (negative speed) for a soft echo-parallax effect.
    { el: document.querySelector(".apropos-back-moon"), speed: -0.3, baseY: "-28%", baseX: "-50%" },
  ].filter((l) => l.el);

  // The signature image drifts inside its circular mask while the section is
  // in view, producing a "looking through a lens" mirror-zoom effect.
  const signatureImg = document.querySelector(".signature-img");
  const signatureFigure = document.querySelector(".signature-figure");

  const cosmosCenter = document.querySelector(".cosmos-center");
  const hero = document.querySelector(".cosmos-hero");
  const topbar = document.querySelector(".cosmos-topbar");

  let ticking = false;

  const apply = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;

    for (const layer of fixedLayers) {
      const { el, speed, baseX, baseY } = layer;
      const drift = (y * speed).toFixed(2);
      if (baseX || baseY) {
        // Element uses translate(-50%, -38%) as its base — preserve it and add the scroll drift.
        el.style.transform = `translate(${baseX || "0"}, calc(${baseY || "0"} + ${drift}px))`;
      } else {
        el.style.transform = `translate3d(0, ${drift}px, 0)`;
      }
    }

    if (signatureImg && signatureFigure) {
      const rect = signatureFigure.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      // Normalized offset: how far the figure center is from viewport center
      // (-1 = above viewport, 0 = perfectly centered, +1 = below viewport).
      const offset = (center - vh / 2) / vh;
      const drift = -offset * 80;       // up to ±80 px vertical drift
      const scale = 1 + Math.max(0, 0.04 - Math.abs(offset) * 0.04); // slight zoom near center
      signatureImg.style.transform = `translate3d(0, ${drift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
    }

    if (cosmosCenter && hero) {
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(1, Math.max(0, y / heroHeight));
      const heroDrift = progress * -60;
      const opacity = 1 - progress * 0.85;
      cosmosCenter.style.transform = `translate(-50%, calc(-55% + ${heroDrift.toFixed(1)}px))`;
      cosmosCenter.style.opacity = opacity.toFixed(2);
    }

    if (topbar && hero) {
      topbar.classList.toggle("cosmos-topbar--solid", y > hero.offsetHeight * 0.7);
    }

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  apply();

  // ---- Magnifier lens on signature image ----
  const lens = document.querySelector(".signature-lens");
  if (signatureFigure && lens) {
    const ZOOM = 2.2;

    const moveLens = (e) => {
      const rect = signatureFigure.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      const lensW = lens.offsetWidth;
      const lensH = lens.offsetHeight;

      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;
      lens.style.backgroundSize = `${w * ZOOM}px ${h * ZOOM}px`;
      lens.style.backgroundPosition = `${-(x * ZOOM - lensW / 2)}px ${-(y * ZOOM - lensH / 2)}px`;
    };

    signatureFigure.addEventListener("mousemove", moveLens, { passive: true });
    signatureFigure.addEventListener("touchmove", (e) => {
      if (e.touches[0]) moveLens(e.touches[0]);
    }, { passive: true });
  }

  // ---- Testimonials carousel (paginated by groups) ----
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".testimonial-slide"));
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    const counterCurrent = carousel.querySelector(".carousel-current");
    const counterTotal = carousel.querySelector(".carousel-total");
    const progressBar = carousel.querySelector(".carousel-progress-bar");
    const autoplayDelay = parseInt(carousel.dataset.autoplay || "0", 10);
    let page = 0;
    let timer = null;
    let progressStart = 0;
    let rafId = null;

    const pad = (n) => String(n).padStart(2, "0");

    const getPerView = () => {
      if (window.innerWidth <= 700) return 1;
      if (window.innerWidth <= 1000) return 2;
      return 3;
    };

    const getPageCount = () => Math.ceil(slides.length / getPerView());

    const goTo = (p) => {
      const pages = getPageCount();
      page = (p + pages) % pages;
      track.style.transform = `translateX(-${page * 100}%)`;
      if (counterCurrent) counterCurrent.textContent = pad(page + 1);
      if (counterTotal) counterTotal.textContent = pad(pages);
    };

    const next = () => goTo(page + 1);
    const prev = () => goTo(page - 1);

    window.addEventListener("resize", () => goTo(page));

    const tickProgress = (now) => {
      if (!progressBar || !autoplayDelay) return;
      const elapsed = now - progressStart;
      const pct = Math.min(100, (elapsed / autoplayDelay) * 100);
      progressBar.style.width = pct + "%";
      if (pct < 100) rafId = requestAnimationFrame(tickProgress);
    };

    const restart = () => {
      clearInterval(timer);
      cancelAnimationFrame(rafId);
      if (progressBar) progressBar.style.width = "0%";
      if (!autoplayDelay || reduceMotion) return;
      progressStart = performance.now();
      rafId = requestAnimationFrame(tickProgress);
      timer = setInterval(next, autoplayDelay);
    };

    nextBtn && nextBtn.addEventListener("click", () => { next(); restart(); });
    prevBtn && prevBtn.addEventListener("click", () => { prev(); restart(); });

    carousel.addEventListener("mouseenter", () => {
      clearInterval(timer);
      cancelAnimationFrame(rafId);
    });
    carousel.addEventListener("mouseleave", restart);

    let touchStartX = 0;
    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
    });

    goTo(0);
    restart();
  }
})();
