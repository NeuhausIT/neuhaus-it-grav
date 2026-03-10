/**
 * app.js – Neuhaus-IT Theme JavaScript
 *
 * Hamburger-Menü, Dropdown-Navigation (Keyboard), Scroll-Behavior.
 * Kein Framework, kein Build-Step erforderlich.
 */

(function () {
  'use strict';

  // ── Hamburger-Menü ───────────────────────────────────────────────────── //
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.getElementById('nav-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Menü öffnen' : 'Menü schließen');
      mobileMenu.hidden = isOpen;
      mobileMenu.classList.toggle('is-open', !isOpen);
    });

    // Menü bei Klick außerhalb schließen
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Menü öffnen');
        mobileMenu.hidden = true;
        mobileMenu.classList.remove('is-open');
      }
    });

    // Menü bei Escape schließen
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        mobileMenu.classList.remove('is-open');
        hamburger.focus();
      }
    });
  }

  // ── Dropdown-Navigation (Keyboard) ──────────────────────────────────── //
  document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.nav-dropdown-trigger');
    var menu    = dropdown.querySelector('.nav-dropdown-menu');

    if (!trigger || !menu) return;

    // Enter/Space öffnen das Dropdown
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
      }
    });

    // Escape schließt das Dropdown
    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // ── Aktiven Nav-Link hervorheben ─────────────────────────────────────── //
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link, .footer-nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

})();
