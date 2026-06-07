/* =========================================================
   AZUR IMMO — Scripts
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- Menu mobile (burger) ---- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Referme le menu après un clic sur un lien
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Apparition des éléments au scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Carousel agences : 3 couches, auto lent + flèches/points/swipe ---- */
  (function () {
    const strip = document.querySelector('.strip');
    if (!strip) return;
    const cards  = document.querySelector('.layer-cards  .mtrack');
    const apts   = document.querySelector('.layer-apts   .mtrack');
    const people = document.querySelector('.layer-people .mtrack');
    const prevBtn = document.querySelector('.strip-arrow.prev');
    const nextBtn = document.querySelector('.strip-arrow.next');
    const dotsBox = document.querySelector('.strip-dots');
    const N = 6; // nombre de villes

    const pitch = parseFloat(getComputedStyle(strip).getPropertyValue('--pitch')) || 420;
    const setW = pitch * N;          // largeur d'un jeu de cartes
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let pos = 0;        // position rendue (en px)
    let goal = 0;       // cible (px) — l'auto fait avancer goal lentement
    let paused = false;
    const AUTO = reduce ? 0 : 14;    // vitesse auto (px/s) -> lent
    let last = performance.now();

    // points
    const dots = [];
    if (dotsBox) {
      for (let i = 0; i < N; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Agence ' + (i + 1));
        b.addEventListener('click', function () { goTo(i); });
        dotsBox.appendChild(b);
        dots.push(b);
      }
    }
    function mod(v, m) { return ((v % m) + m) % m; }
    function activeIndex() { return mod(Math.round(pos / pitch), N); }
    function refreshDots() {
      const a = activeIndex();
      dots.forEach((d, i) => d.classList.toggle('active', i === a));
    }
    function goTo(i) {
      const delta = mod(i - activeIndex() + N / 2, N) - N / 2; // chemin le plus court
      goal = Math.round(goal / pitch) * pitch + delta * pitch;
    }
    function step(dir) { goal += dir * pitch; }

    if (nextBtn) nextBtn.addEventListener('click', () => step(1));
    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));

    // survol -> pause auto
    strip.addEventListener('mouseenter', () => { paused = true; });
    strip.addEventListener('mouseleave', () => { paused = false; });

    // swipe tactile
    let sx = null, sgoal = 0;
    strip.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sgoal = goal; paused = true; }, { passive: true });
    strip.addEventListener('touchmove',  e => { if (sx !== null) goal = sgoal - (e.touches[0].clientX - sx); }, { passive: true });
    strip.addEventListener('touchend',   () => { sx = null; goal = Math.round(goal / pitch) * pitch; paused = false; });

    function render(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!paused) goal += AUTO * dt;
      pos += (goal - pos) * Math.min(1, dt * 6); // easing doux
      const w = mod(pos, setW);
      cards.style.transform  = 'translateX(' + (-w) + 'px)';
      people.style.transform = 'translateX(' + (-w) + 'px)';        // même sens/position que les cartes
      apts.style.transform   = 'translateX(' + (-(setW - w)) + 'px)'; // sens opposé
      refreshDots();
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  })();

  /* ---- Carousel des biens (fondu automatique, sans contrôles) ---- */
  (function () {
    const root = document.querySelector('.biens');
    if (!root) return;
    const panels = Array.from(root.querySelectorAll('.bien'));
    if (!panels.length) return;
    const N = panels.length;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = 0, timer = null;
    const DELAY = 5000;

    function show(i) {
      idx = (i + N) % N;
      panels.forEach((p, k) => p.classList.toggle('active', k === idx));
    }
    function next() { show(idx + 1); }
    function start() { if (!reduce && !timer) timer = setInterval(next, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // pause au survol
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    // swipe tactile (optionnel)
    let sx = null;
    root.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });

    show(0);
    start();
  })();

  /* ---- Bande de maisons : cadres fixes, images qui se décalent de maison en maison (flou) ---- */
  (function () {
    const imgs = Array.from(document.querySelectorAll('.house-band .house-shape img'));
    if (imgs.length < 2) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const srcs = imgs.map(img => img.src);   // pool des photos
    const N = srcs.length;
    let offset = 0;
    let timer = null;
    const DELAY = 3000;   // temps entre deux décalages
    const STAGGER = 150;  // décalage en vague (gauche -> droite)
    const BLUR = 350;     // durée du flou avant le changement d'image

    function shift() {
      offset = (offset + 1) % N;
      imgs.forEach(function (img, i) {
        setTimeout(function () {
          img.classList.add('shifting');                 // floute
          setTimeout(function () {
            img.src = srcs[(i + offset) % N];             // image suivante
            img.classList.remove('shifting');            // redevient nette
          }, BLUR);
        }, i * STAGGER);
      });
    }

    function start() { if (!timer) timer = setInterval(shift, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    const band = document.querySelector('.house-band');
    if (band) {
      band.addEventListener('mouseenter', stop);   // pause au survol
      band.addEventListener('mouseleave', start);
    }
    start();
  })();

  /* ---- Carte interactive de France (survol + clic) ---- */
  (function () {
    const svg = document.querySelector('.france-svg');
    if (!svg) return;
    const loc = document.getElementById('location');
    const regions = svg.querySelectorAll('.region');
    regions.forEach(function (r) {
      r.addEventListener('click', function () {
        const already = r.classList.contains('is-selected');
        regions.forEach(x => x.classList.remove('is-selected'));
        if (!already) {
          r.classList.add('is-selected');
          if (loc) loc.value = r.getAttribute('data-nom');
        } else if (loc) {
          loc.value = '';
        }
      });
    });
  })();

  /* ---- Formulaire de recherche (placeholder, pas de back-end) ---- */
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // À brancher sur la vraie recherche / carte plus tard
      console.log('Recherche AZUR IMMO :', Object.fromEntries(new FormData(searchForm)));
    });
  }

  /* ---- Newsletter / connexion (placeholder) ---- */
  const newsletter = document.querySelector('.newsletter');
  if (newsletter) {
    newsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Inscription :', newsletter.querySelector('input').value);
    });
  }

});
