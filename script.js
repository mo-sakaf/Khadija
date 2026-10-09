/**
 * ==============================================================================
 * خديجة بن طالب — بورتفليو الخدمة الاجتماعية والأثر الإنساني
 * Master JavaScript Controller (Vanilla ES6+)
 * Features: Dark/Light Mode, Scroll Spy, Scroll Reveal, Mobile Nav,
 * Print CV, Copy-to-Clipboard, Privacy Toggle, Toast Notifications.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light Mode) with LocalStorage & OS Preference
  // ----------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;
  const STORAGE_KEY = 'khadija_portfolio_theme';

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  // Initialize Theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(targetTheme);
    });
  }

  // Listen to OS theme changes if user hasn't overridden
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ----------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Sticky Header
  // ----------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');

  const handleScroll = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledPercent = height > 0 ? (winScroll / height) * 100 : 0;

    // Update progress bar
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolledPercent}%`;
      scrollProgress.setAttribute('aria-valuenow', Math.round(scrolledPercent));
    }

    // Sticky header shadow state
    if (siteHeader) {
      if (winScroll > 30) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (winScroll > 450) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial state

  // Back to Top Action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer & Hamburger
  // ----------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMobileNav = () => {
    if (!mobileNav || !mobileOverlay || !menuToggle) return;
    mobileNav.classList.add('is-active');
    mobileOverlay.classList.add('is-active');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (!mobileNav || !mobileOverlay || !menuToggle) return;
    mobileNav.classList.remove('is-active');
    mobileOverlay.classList.remove('is-active');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  // ----------------------------------------------------------------------------
  // 4. Scroll Reveal via IntersectionObserver
  // ----------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-delay');
          if (delay) {
            setTimeout(() => {
              el.classList.add('revealed');
            }, parseInt(delay, 10));
          } else {
            el.classList.add('revealed');
          }
          observer.unobserve(el);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ----------------------------------------------------------------------------
  // 5. Active Section Navigation Spy
  // ----------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  if ('IntersectionObserver' in window && navLinks.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      threshold: 0.25,
      rootMargin: '-70px 0px -50% 0px'
    });

    sections.forEach((section) => {
      spyObserver.observe(section);
    });
  }

  // ----------------------------------------------------------------------------
  // 6. Privacy Toggle (Show/Hide Additional Identity Details)
  // ----------------------------------------------------------------------------
  const togglePrivacyBtn = document.getElementById('togglePrivacyBtn');
  const privacyDetails = document.getElementById('privacyDetails');

  if (togglePrivacyBtn && privacyDetails) {
    togglePrivacyBtn.addEventListener('click', () => {
      const isHidden = privacyDetails.hasAttribute('hidden');
      if (isHidden) {
        privacyDetails.removeAttribute('hidden');
        togglePrivacyBtn.setAttribute('aria-expanded', 'true');
        const textSpan = togglePrivacyBtn.querySelector('.toggle-text');
        if (textSpan) textSpan.textContent = 'إخفاء التفاصيل الشخصية';
      } else {
        privacyDetails.setAttribute('hidden', '');
        togglePrivacyBtn.setAttribute('aria-expanded', 'false');
        const textSpan = togglePrivacyBtn.querySelector('.toggle-text');
        if (textSpan) textSpan.textContent = 'عرض التفاصيل الشخصية';
      }
    });
  }


  // ----------------------------------------------------------------------------
  // 8. Copy Phone Number to Clipboard with Toast Notification
  // ----------------------------------------------------------------------------
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const toastNotification = document.getElementById('toastNotification');

  const showToast = (message, duration = 3000) => {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  };

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async () => {
      const phone = copyPhoneBtn.getAttribute('data-phone') || '+967737717361';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(phone);
        } else {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = phone;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast('تم نسخ رقم الهاتف بنجاح (+967 737 717 361)');
      } catch (err) {
        showToast('تعذر النسخ التلقائي: ' + phone);
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 9. Dynamic Current Year in Footer
  // ----------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
