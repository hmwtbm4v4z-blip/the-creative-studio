/* Optional Google Analytics 4 loader. It stays inactive until a real G-... ID is configured. */
(function () {
  'use strict';
  const id = String(window.TCS_GA_MEASUREMENT_ID || '').trim();
  const valid = /^G-[A-Z0-9-]+$/i.test(id);
  function publish(connected) {
    window.TCS_GA_CONNECTED = connected;
    window.TCS_GA_MEASUREMENT_ID_ACTIVE = connected ? id : '';
    window.dispatchEvent(new CustomEvent('tcs:ga-status', { detail: { connected, id: connected ? id : '' } }));
  }
  if (!valid) { publish(false); return; }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true, allow_google_signals: false, send_page_view: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.onload = () => publish(true);
  script.onerror = () => publish(false);
  document.head.appendChild(script);
})();
