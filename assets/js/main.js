const trackingEnabled = !!(window.ADS_ID && !window.ADS_ID.includes('X') && window.ADS_LABEL && !window.ADS_LABEL.includes('X'));

function fireTracking(type, buttonName) {
  if (!window.gtag && !trackingEnabled) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'ambulance_click', {
      event_category: 'cta',
      event_label: buttonName,
      click_type: type
    });
  }

  if (type === 'tel' && trackingEnabled && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: `${window.ADS_ID}/${window.ADS_LABEL}`,
      value: 1.0,
      currency: 'INR'
    });
  }
}

function installTracking() {
  if (window.ADS_ID && window.ADS_ID !== 'AW-XXXXXXXXXX' && window.GA4_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA4_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', window.GA4_ID);
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const cta = link.dataset.cta || 'unknown';
    if (href.startsWith('tel:')) {
      fireTracking('tel', cta);
    }
    if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
      fireTracking('wa', cta);
    }
  });
}

function setupForm() {
  const form = document.querySelector('form[action*="web3forms"]');
  if (!form) return;

  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      status.textContent = 'Message rejected.';
      return;
    }

    const data = new FormData(form);
    status.textContent = 'Sending message...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        status.textContent = 'Your request has been sent. Our team will contact you soon.';
        form.reset();
      } else {
        status.textContent = 'Could not send. Please call directly on +91 90001 47902.';
      }
    } catch (error) {
      status.textContent = 'Could not send. Please call directly on +91 90001 47902.';
    }
  });
}

installTracking();
setupForm();
setupScrollReveal();
setupCounters();
setupHeaderScroll();
setupImageFade();

function setupScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el, index) => {
    if (!el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 0.08}s`);
    }
    observer.observe(el);
  });
}

function setupCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el) {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.counter.includes('.') ? 1 : 0;
    if (reduceMotion) {
      el.textContent = `${target.toFixed(decimals)}${suffix}`;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => observer.observe(el));
}

function setupHeaderScroll() {
  const header = document.querySelector('.topbar');
  if (!header) return;
  let ticking = false;
  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  }
  document.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

function setupImageFade() {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
      return;
    }
    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
  });
}
