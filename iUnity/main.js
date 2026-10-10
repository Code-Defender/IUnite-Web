/**
 * Interactive Logic for iUnity by TODA Landing Page & Policy Pages
 * Clean-code refactored: decoupled CSS transitions, RAF parallax throttling, centralized download logic
 */

(function () {
  'use strict';

  // Parallax animation constants
  var PARALLAX_PRIMARY_FACTOR = 50;
  var PARALLAX_TERTIARY_FACTOR = -30;
  var HEADER_SCROLL_OFFSET = 80;

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initParallaxBlobs();
    initActiveLinkObserver();
    initEventBindings();
  });

  /**
   * Initialize mobile menu toggle listener
   */
  function initMobileMenu() {
    var menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', function () {
        toggleMobileMenu();
      });
    }
  }

  /**
   * Toggle mobile navigation open/closed state
   * State and transforms are driven cleanly by CSS classes (.open and .active)
   */
  function toggleMobileMenu() {
    var menuToggle = document.getElementById('menu-toggle');
    var mobileNav = document.getElementById('mobile-nav');

    if (menuToggle && mobileNav) {
      var isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }

  /**
   * Parallax tracking for ambient background blobs on mouse move.
   * Throttled with requestAnimationFrame to prevent layout thrashing.
   */
  function initParallaxBlobs() {
    var blobPrimary = document.getElementById('blob-primary');
    var blobTertiary = document.getElementById('blob-tertiary');

    // Only attach listener if at least one blob exists in the DOM
    if (!blobPrimary && !blobTertiary) {
      return;
    }

    var ticking = false;
    var mouseX = 0;
    var mouseY = 0;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;

      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (blobPrimary) {
            var moveXPrimary = (mouseX - 0.5) * PARALLAX_PRIMARY_FACTOR;
            var moveYPrimary = (mouseY - 0.5) * PARALLAX_PRIMARY_FACTOR;
            blobPrimary.style.transform = 'translate(' + moveXPrimary + 'px, ' + moveYPrimary + 'px)';
          }

          if (blobTertiary) {
            var moveXTertiary = (mouseX - 0.5) * PARALLAX_TERTIARY_FACTOR;
            var moveYTertiary = (mouseY - 0.5) * PARALLAX_TERTIARY_FACTOR;
            blobTertiary.style.transform = 'translate(' + moveXTertiary + 'px, ' + moveYTertiary + 'px)';
          }

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Smooth scrolling helper
   * @param {string} selector Target CSS selector
   */
  function scrollToSection(selector) {
    var target = document.querySelector(selector);
    if (target) {
      var mobileNav = document.getElementById('mobile-nav');
      if (mobileNav && mobileNav.classList.contains('open')) {
        toggleMobileMenu();
      }

      var elementPosition = target.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - HEADER_SCROLL_OFFSET;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Intersection Observer to highlight active navigation links during page scroll
   */
  function initActiveLinkObserver() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links .nav-link');

    if (!sections.length || !navLinks.length || typeof IntersectionObserver === 'undefined') {
      return;
    }

    var options = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target) {
          var id = entry.target.getAttribute('id');
          if (id) {
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        }
      });
    }, options);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /**
   * Modal dialog display controls
   */
  function showUnderConstruction() {
    var modal = document.getElementById('construction-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    var modal = document.getElementById('construction-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function closeModalOnOverlay(event) {
    if (event && event.target && event.target.id === 'construction-modal') {
      closeModal();
    }
  }

  /**
   * Handle app download clicks: delegates to centralized TODA_APP detection
   * @param {Event} [event]
   */
  function handleDownloadClick(event) {
    if (window.TODA_APP && typeof window.TODA_APP.handleDownloadClick === 'function') {
      window.TODA_APP.handleDownloadClick(event);
    } else {
      // Safe fallback if shared engine script fails to load
      var targetUrl = 'https://play.google.com/store/apps/details?id=com.jointoda.iunity&pcampaignid=web_share';
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent || '')) {
        targetUrl = 'https://apps.apple.com/us/app/iunity-for-truckers/id6792612777';
      }
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      window.location.href = targetUrl;
    }
  }

  /**
   * Event bindings for declarative data-action attributes
   */
  function initEventBindings() {
    // Download triggers
    document.querySelectorAll('[data-action="download"]').forEach(function (btn) {
      btn.addEventListener('click', handleDownloadClick);
    });

    // Mobile nav navigation links auto-close the menu
    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var mobileNav = document.getElementById('mobile-nav');
        if (mobileNav && mobileNav.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });

    // Modal overlay backdrop click
    var modal = document.getElementById('construction-modal');
    if (modal) {
      modal.addEventListener('click', closeModalOnOverlay);
    }

    // Modal acknowledge / close buttons
    document.querySelectorAll('[data-action="close-modal"]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
  }

  // Export globally for backward compatibility with existing attributes or external calls
  window.toggleMobileMenu = toggleMobileMenu;
  window.scrollToSection = scrollToSection;
  window.showUnderConstruction = showUnderConstruction;
  window.closeModal = closeModal;
  window.closeModalOnOverlay = closeModalOnOverlay;
  window.handleDownloadClick = handleDownloadClick;

})();
