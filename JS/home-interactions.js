(function () {
  'use strict';
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  ready(() => {
    const root = document.documentElement;
    const hero = document.querySelector('.tcs-home #hero');
    const showcase = document.querySelector('.tcs-home .tcs-showcase');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionOn = () => root.dataset.tcsMotion === 'on' && !reduce.matches && !document.hidden;
    if (showcase && fine.matches) {
      showcase.addEventListener('pointermove', (event) => {
        if (!motionOn()) return;
        const box = showcase.getBoundingClientRect();
        const x = (event.clientX - box.left) / Math.max(box.width, 1) - .5;
        const y = (event.clientY - box.top) / Math.max(box.height, 1) - .5;
        showcase.style.setProperty('--home-tilt-x', `${(-y * 3).toFixed(2)}deg`);
        showcase.style.setProperty('--home-tilt-y', `${(x * 4).toFixed(2)}deg`);
        showcase.classList.add('tcs-tilting');
      }, {passive:true});
      showcase.addEventListener('pointerleave', () => { showcase.classList.remove('tcs-tilting'); showcase.style.removeProperty('--home-tilt-x'); showcase.style.removeProperty('--home-tilt-y'); });
    }
    if (hero && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && motionOn()) hero.classList.add('tcs-hero-seen');
      }, {threshold:.35});
      observer.observe(hero);
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden && showcase) showcase.classList.remove('tcs-tilting'); });
  });
})();
