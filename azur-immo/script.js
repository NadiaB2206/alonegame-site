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
