/* ===================================================
   ICETI 2026 – Conference Website JavaScript
   Features:
     - Sticky header shadow on scroll
     - Mobile hamburger menu
     - Active nav link highlighting
     - Countdown timer to Oct 15, 2026
     - Accordion (Call for Contributions)
     - Day tabs (Programme)
     - Form validation & submission feedback
     - File upload display
     - Certificate download simulation
     - Back-to-top button
     - Reveal-on-scroll animations
   =================================================== */

(function () {
  'use strict';

  // ─── Header scroll shadow ───────────────────────────────
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 20);
    backToTop.classList.toggle('visible', scrollY > 400);
    highlightNav();
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Hamburger / mobile nav ─────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  // ─── Active nav link on scroll ──────────────────────────
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // ─── Countdown timer ────────────────────────────────────
  const CONF_DATE = new Date('2026-07-23T09:00:00+05:30').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function updateCountdown() {
    const now = Date.now();
    const diff = CONF_DATE - now;
    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(mins).padStart(2, '0');
    cdSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ─── Accordion ──────────────────────────────────────────
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = document.getElementById(btn.dataset.target);
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const icon = btn.querySelector('.accordion-icon');

      // Close all
      document.querySelectorAll('.accordion-header').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.querySelector('.accordion-icon').textContent = '+';
        document.getElementById(b.dataset.target).classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        icon.textContent = '+';
        body.classList.add('open');
      }
    });
  });
  // ─── Call for Papers Accordion ─────────────────────────
  document.querySelectorAll('.cfp-accordion-header').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent event bubbling so nested clicks don't trigger parent clicks
      e.stopPropagation();

      const targetId = btn.dataset.cfptarget;
      if (!targetId) return;

      const body = document.getElementById(targetId);
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const icon = btn.querySelector('.cfp-accordion-icon');

      // Find the closest container to only close siblings at the same nesting level
      const parentItem = btn.closest('.cfp-accordion-item');
      if (!parentItem) return;

      const container = parentItem.parentElement;

      // Close all direct sibling accordion items
      const siblingItems = Array.from(container.children).filter(child => child.classList.contains('cfp-accordion-item'));

      siblingItems.forEach(item => {
        // Only target the immediate header of the sibling item
        const header = item.querySelector(':scope > .cfp-accordion-header') || item.children[0];
        if (!header || !header.classList.contains('cfp-accordion-header')) return;

        const hbId = header.dataset.cfptarget;
        header.setAttribute('aria-expanded', 'false');

        const hIcon = header.querySelector('.cfp-accordion-icon');
        if (hIcon) hIcon.textContent = '+';

        if (hbId) {
          const hBody = document.getElementById(hbId);
          if (hBody) hBody.classList.remove('open');
        }
      });

      // Open the clicked one (toggle)
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '+';
        if (body) body.classList.add('open');
      }
    });
  });

  // ─── Programme day tabs ─────────────────────────────────
  document.querySelectorAll('.day-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.schedule-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.day).classList.add('active');
    });
  });


  // ─── Helpers ────────────────────────────────────────────
  function simulateSubmit(btnId, callback, btnEl) {
    const btn = btnEl || (btnId ? document.getElementById(btnId) : null);
    if (btn) {
      btn.disabled = true;
      const orig = btn.textContent;
      btn.textContent = 'Submitting…';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = orig;
        callback();
      }, 1500);
    } else {
      callback();
    }
  }

  function shakeForm(form) {
    form.style.animation = 'none';
    requestAnimationFrame(() => {
      form.style.animation = 'shake 0.5s ease';
    });
  }

  // Shake keyframe via JS injection
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  // ─── Reveal on scroll ────────────────────────────────────
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(revealStyle);

  const revealTargets = document.querySelectorAll('.info-card, .accordion-item, .schedule-item, .venue-detail-item, .sponsor-logo-box, .stat-item');
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 0.07 + 's';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // ─── Smooth nav click on same-page anchors ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 12;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

})();
