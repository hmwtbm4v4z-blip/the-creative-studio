/* Lightweight, anonymous browser analytics for the public dashboard. */
(function () {
  'use strict';
  const STORAGE_KEY = 'tcs_public_analytics_v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (_) { return {}; } };
  const write = (value) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch (_) {} };
  const now = new Date().toISOString();
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const data = read();
  data.totalViews = Number(data.totalViews || 0) + 1;
  data.pages = data.pages || {};
  data.pages[path] = Number(data.pages[path] || 0) + 1;
  data.lastSeen = now;
  let newSession = false;
  try { newSession = !sessionStorage.getItem('tcsAnalyticsSession'); if (newSession) sessionStorage.setItem('tcsAnalyticsSession', '1'); } catch (_) { newSession = false; }
  if (newSession) data.sessions = Number(data.sessions || 0) + 1;
  data.actions = data.actions || {};
  write(data);

  window.TCSAnalytics = {
    get: read,
    markAction(name) {
      const latest = read();
      latest.actions = latest.actions || {};
      latest.actions[name] = Number(latest.actions[name] || 0) + 1;
      write(latest);
    }
  };

  document.addEventListener('click', (event) => {
    const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link || !window.TCSAnalytics) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('order.html')) window.TCSAnalytics.markAction('project starts');
    else if (href.includes('contact.html')) window.TCSAnalytics.markAction('contact visits');
    else if (href.includes('pricing')) window.TCSAnalytics.markAction('pricing visits');
    else if (href.includes('portfolio')) window.TCSAnalytics.markAction('portfolio visits');
    else if (href.includes('square.link')) window.TCSAnalytics.markAction('payment clicks');
  }, { passive: true });

  function render() {
    if (!document.body.classList.contains('tcs-analytics-page')) return;
    const latest = read();
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
    const pages = latest.pages || {};
    const ranked = Object.entries(pages).sort((a, b) => b[1] - a[1]);
    set('analytics-browser-views', latest.totalViews || 0);
    set('analytics-browser-sessions', latest.sessions || 0);
    set('analytics-last-seen', latest.lastSeen ? new Date(latest.lastSeen).toLocaleString() : '—');
    set('analytics-pages-seen', Object.keys(pages).length);
    set('analytics-load-time', `${Math.round(performance.now())} ms`);
    set('analytics-device', innerWidth < 700 ? 'Mobile' : innerWidth < 1100 ? 'Tablet' : 'Desktop');
    set('analytics-language', navigator.language || 'Unknown');
    set('analytics-connection', navigator.connection?.effectiveType || 'Browser-reported data unavailable');
    set('analytics-js-status', 'Active');
    set('analytics-ga-status', window.TCS_GA_CONNECTED ? 'Connected' : 'Not configured');
    set('analytics-ga-detail', window.TCS_GA_CONNECTED ? `GA4 is receiving page views (${window.TCS_GA_MEASUREMENT_ID_ACTIVE}).` : 'Add a real GA4 Measurement ID in JS/analytics-config.js to begin sending data.');
    const table = document.getElementById('analytics-page-rankings');
    if (table) table.innerHTML = ranked.slice(0, 8).map(([name, count]) => `<li><strong>${name}</strong><span>${count} view${count === 1 ? '' : 's'}</span></li>`).join('') || '<li><strong>No local page history yet</strong><span>Browse the site to begin</span></li>';
    const actions = latest.actions || {};
    set('analytics-project-actions', actions['project starts'] || 0);
    set('analytics-contact-actions', actions['contact visits'] || 0);
    set('analytics-payment-actions', actions['payment clicks'] || 0);
  }
  window.addEventListener('tcs:ga-status', render);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true }); else render();
})();
