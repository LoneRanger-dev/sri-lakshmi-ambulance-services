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
