/**
 * TODA / iUnity Unified Application Configuration & Device Detection
 * Shared across Root Portal, Download Page, and iUnity Application
 */
(function (global) {
  'use strict';

  // Store Configuration
  var APP_STORE_URL = 'https://apps.apple.com/us/app/iunity-for-truckers/id6792612777';
  var PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.jointoda.iunity&pcampaignid=web_share';

  var CONFIG = Object.freeze({
    stores: {
      ios: APP_STORE_URL,
      android: PLAY_STORE_URL
    },
    debounceMs: 2500
  });

  /**
   * Accurately detect client device platform:
   * - 'ios': iPhone, iPad, iPod, and modern iPadOS (reporting MacIntel/Macintosh with touch points)
   * - 'android': Android smartphones and tablets
   * - 'desktop': Windows, macOS (no touch), Linux, or uncertain devices
   *
   * Supports URL query parameter overrides for QA testing:
   * ?platform=ios | ?platform=android | ?platform=desktop
   */
  function detectPlatform() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        var urlParams = new URLSearchParams(window.location.search);
        var testPlatform = urlParams.get('platform');
        if (testPlatform) {
          var normalized = testPlatform.toLowerCase();
          if (normalized === 'ios' || normalized === 'android' || normalized === 'desktop') {
            return normalized;
          }
        }
      }
    } catch (e) {
      // Fall through to standard detection on URLSearchParams parse failure
    }

    var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    var platform = (typeof navigator !== 'undefined' && navigator.platform) ? navigator.platform : '';
    var maxTouchPoints = (typeof navigator !== 'undefined' && navigator.maxTouchPoints) ? navigator.maxTouchPoints : 0;

    // 1. Traditional iOS (iPhone, iPad, iPod in userAgent)
    var isTraditionalIOS = /iPhone|iPad|iPod/i.test(ua);

    // 2. Modern iPadOS (Safari requests desktop site by default on iPadOS 13+;
    // reports 'MacIntel' or 'Macintosh' in UA, but has multi-touch capability)
    var isModernIPad = (/Macintosh/i.test(ua) || platform === 'MacIntel') && maxTouchPoints > 1;

    if (isTraditionalIOS || isModernIPad) {
      return 'ios';
    }

    // 3. Android devices
    if (/Android/i.test(ua)) {
      return 'android';
    }

    // 4. Desktop, unsupported, or uncertain
    return 'desktop';
  }

  /**
   * Detect device and return the appropriate store URL.
   * - iOS / iPadOS -> Apple App Store
   * - Android & Other -> Google Play Store
   */
  function getAppDownloadUrl() {
    var platform = detectPlatform();
    if (platform === 'ios') {
      return APP_STORE_URL;
    }
    return PLAY_STORE_URL;
  }

  // Redirect debounce flag to prevent multiple redirects or duplicate clicks
  var isRedirecting = false;

  /**
   * Handle app download click with automatic device-based routing.
   * @param {Event} [event] Optional click event to prevent default navigation
   */
  function handleDownloadClick(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    if (isRedirecting) {
      return;
    }
    isRedirecting = true;

    var targetUrl = getAppDownloadUrl();
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = targetUrl;
    }

    setTimeout(function () {
      isRedirecting = false;
    }, CONFIG.debounceMs);
  }

  // Unified Namespace
  var TODA_APP = {
    CONFIG: CONFIG,
    detectPlatform: detectPlatform,
    getAppDownloadUrl: getAppDownloadUrl,
    handleDownloadClick: handleDownloadClick
  };

  // Expose namespace & global aliases for backwards compatibility
  global.TODA_APP = TODA_APP;
  global.APP_STORE_URL = APP_STORE_URL;
  global.PLAY_STORE_URL = PLAY_STORE_URL;
  global.detectPlatform = detectPlatform;
  global.getAppDownloadUrl = getAppDownloadUrl;
  global.handleDownloadClick = handleDownloadClick;

})(typeof window !== 'undefined' ? window : this);
