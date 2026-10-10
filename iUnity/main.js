// Interactive Logic for iUnity by TODA Landing Page

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initParallaxBlobs();
  initActiveLinkObserver();
});

// Mobile menu toggle logic
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      toggleMobileMenu();
    });
  }
}

function toggleMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active');

    // Toggle menu button bar rotations
    const spans = menuToggle.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      document.body.style.overflow = 'hidden'; // prevent scrolling behind menu
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      document.body.style.overflow = '';
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }
}

// Parallax tracking for ambient background blobs on mouse move
function initParallaxBlobs() {
  const blobPrimary = document.getElementById('blob-primary');
  const blobTertiary = document.getElementById('blob-tertiary');

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    if (blobPrimary) {
      const moveX = (x - 0.5) * 50;
      const moveY = (y - 0.5) * 50;
      blobPrimary.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    if (blobTertiary) {
      const moveX = (x - 0.5) * -30;
      const moveY = (y - 0.5) * -30;
      blobTertiary.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });
}

// Smooth scrolling function helper
function scrollToSection(selector) {
  const target = document.querySelector(selector);
  if (target) {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && mobileNav.classList.contains('open')) {
      toggleMobileMenu();
    }

    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Intersection Observer to highlight the active menu link during page scroll
function initActiveLinkObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  const options = {
    root: null,
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
}

// Modal popup controls
function showUnderConstruction() {
  const modal = document.getElementById('construction-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('construction-modal');
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

// ==========================================
// AUTOMATIC DEVICE DETECTION FOR APP DOWNLOAD
// ==========================================

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.jointoda.iunity&pcampaignid=web_share';
const APP_STORE_URL = 'https://apps.apple.com/us/app/iunity-for-truckers/id6792612777';

/**
 * Detect the visitor's device and return the appropriate store URL.
 * - iPhone & iPad (iOS/iPadOS): Apple App Store
 * - Android, Windows & Other: Google Play Store
 */
function getAppDownloadUrl() {
  const ua = navigator.userAgent || '';
  const isTraditionalIOS = /iPhone|iPad|iPod/i.test(ua);
  const isModernIPad = (navigator.platform === 'MacIntel' || /Macintosh/i.test(ua)) && navigator.maxTouchPoints > 1;

  if (isTraditionalIOS || isModernIPad) {
    return APP_STORE_URL;
  }

  return PLAY_STORE_URL;
}

// Redirect debounce flag to prevent multiple redirects or duplicate clicks
let isRedirecting = false;

/**
 * Handle app download click with automatic device-based routing.
 */
function handleDownloadClick(event) {
  if (event) {
    event.preventDefault();
  }

  if (isRedirecting) {
    return;
  }
  isRedirecting = true;

  window.location.href = getAppDownloadUrl();

  setTimeout(() => {
    isRedirecting = false;
  }, 2500);
}
