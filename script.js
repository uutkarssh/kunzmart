/* ============================================================
   KUNZ MART — Interactions v3.0
   Fixes: slider, hamburger drawer+overlay, no body-scroll-lock
   ============================================================ */

/* ── Site Config Renderer ───────────────────────────────────
   Reads KUNZMART_CONFIG from site-config.js and renders:
   1. Notice / Announcement Bar
   2. Special Offer Panel
   3. Navigation Menu (all pages)
────────────────────────────────────────────────────────────── */
(function () {
  if (typeof KUNZMART_CONFIG === 'undefined') return;
  const cfg = KUNZMART_CONFIG;

  /* ── 1. Nav Menu (runs on ALL pages) ── */
  const navMenu = document.getElementById('navMenu');
  if (navMenu && cfg.navItems && cfg.navItems.length) {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    navMenu.innerHTML = cfg.navItems.map(item => {
      const isActive = item.href === page || (page === '' && item.href === 'index.html');
      const cls = [item.cta ? 'nav-cta' : '', isActive ? 'nav-active' : ''].filter(Boolean).join(' ');
      return `<li><a href="${item.href}"${cls ? ` class="${cls}"` : ''}>${item.label}</a></li>`;
    }).join('\n        ');
  }

  /* ── 2. Notice Bar (index.html only) ── */
  const bar      = document.getElementById('kmNoticeBar');
  const noticeText = document.getElementById('kmNoticeText');
  const noticeLink = document.getElementById('kmNoticeLink');
  const noticeClose= document.getElementById('kmNoticeClose');
  if (bar && cfg.notice) {
    const n = cfg.notice;
    if (!n.visible) {
      bar.style.display = 'none';
    } else {
      bar.setAttribute('data-type', n.type || 'info');
      if (noticeText) noticeText.textContent = n.text || '';
      if (noticeLink) {
        if (n.link) {
          noticeLink.href = n.link;
          noticeLink.textContent = n.linkText || 'Learn More →';
          noticeLink.style.display = '';
        } else {
          noticeLink.style.display = 'none';
        }
      }
      /* Type icon */
      const icon = bar.querySelector('.km-notice-icon');
      if (icon) {
        icon.textContent = n.type === 'alert' ? '!' : (n.type === 'offer' ? '★' : 'i');
      }
    }
  }

  /* ── 3. Notice Bar dismiss (persists in sessionStorage) ── */
  if (bar && bar.style.display !== 'none') {
    if (sessionStorage.getItem('km-notice-dismissed') === 'true') {
      bar.classList.add('dismissed');
    }
    if (noticeClose) {
      noticeClose.addEventListener('click', () => {
        bar.classList.add('dismissed');
        sessionStorage.setItem('km-notice-dismissed', 'true');
      });
    }
  }

  /* ── 4. Offer Panel (index.html only) ── */
  const offerPanel = document.getElementById('kmOfferPanel');
  if (offerPanel && cfg.offer) {
    const o = cfg.offer;
    if (!o.visible) {
      offerPanel.style.display = 'none';
      /* If notice also hidden, push hero down manually */
      if (!cfg.notice || !cfg.notice.visible) {
        const hero = document.querySelector('.hero');
        if (hero) hero.style.paddingTop = 'var(--nav-h)';
      }
    } else {
      const set = (id, val, prop) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (prop === 'href') el.href = val;
        else el.textContent = val || '';
      };
      set('kmOfferBadge',   o.badge);
      set('kmOfferBody',    o.body);
      set('kmOfferAmount',  o.highlight);
      set('kmOfferNote',    o.highlightNote);
      set('kmOfferCtaText', o.ctaText);
      set('kmOfferCta',     o.ctaLink, 'href');
      /* Heading — allow <em> for italics via innerHTML safely */
      const heading = document.getElementById('kmOfferHeading');
      if (heading && o.heading) {
        heading.innerHTML = o.heading.replace(/₹(\d+)/g, '<em>₹$1</em>');
      }
    }
  }

})();

/* ── Custom Cursor ─────────────────────────────────────────── */
(function () {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function lerp() {
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  document.querySelectorAll('a,button,.dept-card,.prize-card,.gallery-item,.gallery-full-item,.branch-card,.dept-section').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      ring.style.width = ring.style.height = '56px'; ring.style.opacity = '.35';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.width = ring.style.height = '36px'; ring.style.opacity = '.6';
    });
  });
})();

/* ── Navbar scroll state ───────────────────────────────────── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Active nav link — handled by site-config.js renderer ── */
/* (nav-active class is applied during navItems render above) */

/* ── Hamburger — side-drawer + overlay ─────────────────────── */
(function initHamburger() {
  /* Runs immediately if DOM ready, else waits for DOMContentLoaded */
  function setup() {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu      = document.querySelector('.nav-menu');
    const overlay   = document.querySelector('.nav-overlay');
    if (!hamburger || !menu) return;

    const bars = hamburger.querySelectorAll('span');

    const open = () => {
      menu.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      hamburger.setAttribute('aria-expanded', 'true');
      if (bars[0]) bars[0].style.transform = 'rotate(45deg) translate(4.5px,4.5px)';
      if (bars[1]) bars[1].style.opacity   = '0';
      if (bars[2]) bars[2].style.transform = 'rotate(-45deg) translate(4.5px,-4.5px)';
    };

    const close = () => {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      hamburger.setAttribute('aria-expanded', 'false');
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    };

    /* Remove any previous listeners by cloning (avoids double-bind) */
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);

    newHamburger.addEventListener('click', () =>
      menu.classList.contains('open') ? close() : open()
    );
    if (overlay) overlay.addEventListener('click', close);

    /* Close on any nav link click (handles both page nav & anchor links) */
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      close();
    }));

    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

/* ── Image Slider ──────────────────────────────────────────── */
(function () {
  const slider  = document.querySelector('.km-slider');
  if (!slider) return;

  const track   = slider.querySelector('.km-slider-track');
  const slides  = slider.querySelectorAll('.km-slide');
  const dotsWrap= slider.querySelector('.km-dots');
  const btnPrev = slider.querySelector('.km-btn-prev');
  const btnNext = slider.querySelector('.km-btn-next');
  if (!track || !slides.length) return;

  let current = 0;
  const total = slides.length;

  /* Build dots */
  const dots = [];
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'km-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  const goTo = (n) => {
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetAuto();
  };

  if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1));
  if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1));

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (!slider.closest('body')) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* Touch / swipe */
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* Auto-slide */
  let timer = setInterval(() => goTo(current + 1), 4800);
  function resetAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4800);
  }

  /* Pause on hover */
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 4800);
  });
})();

/* ── Scroll Reveal ─────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0, 10);
        setTimeout(() => e.target.classList.add('visible'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── Stagger children ──────────────────────────────────────── */
(function () {
  const groups = document.querySelectorAll('[data-stagger]');
  if (!groups.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Array.from(e.target.children).forEach((child, i) => {
          child.style.transitionDelay = i * 75 + 'ms';
          child.classList.add('visible');
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  groups.forEach(g => {
    Array.from(g.children).forEach(c => c.classList.add('reveal'));
    io.observe(g);
  });
})();

/* ── Gallery Lightbox ──────────────────────────────────────── */
(function () {
  const lightbox = document.querySelector('.lightbox');
  const closeBtn = document.querySelector('.lightbox-close');
  if (!lightbox) return;

  document.querySelectorAll('.gallery-item,.gallery-full-item').forEach(item => {
    item.addEventListener('click', () => {
      const caption = item.querySelector('.gallery-caption,.gallery-full-caption');
      const content = lightbox.querySelector('.lightbox-content');
      if (content && caption) content.textContent = caption.textContent.trim();
      lightbox.classList.add('active');
    });
  });

  const closeLB = () => lightbox.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeLB);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLB(); });
})();

/* ── Hero orb parallax ─────────────────────────────────────── */
(function () {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => { orb.style.transform = `translateY(${y * (i + 1) * 0.1}px)`; });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── Counter animation ─────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const step = target / (1800 / (1000 / 60));
        const tick = () => {
          start += step;
          if (start < target) { el.textContent = Math.floor(start) + suffix; requestAnimationFrame(tick); }
          else { el.textContent = target + suffix; }
        };
        tick();
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
})();

/* ── Smooth anchor scroll ──────────────────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = document.querySelector('.navbar')?.offsetHeight || 76;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      }
    });
  });
})();
