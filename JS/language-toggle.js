/* Shared in-page language selector powered by Google Translate. */
(function () {
  'use strict';

  const languages = [
    ['en', 'English'], ['es', 'Español'], ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'],
    ['tl', 'Tagalog'], ['vi', 'Tiếng Việt'], ['ar', 'العربية'], ['fr', 'Français'],
    ['ko', '한국어'], ['ru', 'Русский'], ['de', 'Deutsch'], ['ht', 'Kreyòl Ayisyen'],
    ['pt', 'Português'], ['hi', 'हिन्दी'], ['ur', 'اردو'], ['ja', '日本語'],
    ['it', 'Italiano'], ['fa', 'فارسی'], ['gu', 'ગુજરાતી'], ['pa', 'ਪੰਜਾਬੀ'],
    ['bn', 'বাংলা'], ['pl', 'Polski'], ['el', 'Ελληνικά'], ['te', 'తెలుగు'],
    ['ta', 'தமிழ்'], ['hy', 'Հայերեն'], ['he', 'עברית'], ['so', 'Soomaali'],
    ['sw', 'Kiswahili'], ['tr', 'Türkçe'], ['th', 'ไทย'], ['nl', 'Nederlands'],
    ['uk', 'Українська'], ['ro', 'Română'], ['am', 'አማርኛ'], ['cs', 'Čeština'],
    ['hu', 'Magyar'], ['hr', 'Hrvatski'], ['km', 'ខ្មែរ'], ['lo', 'ລາວ'],
    ['id', 'Bahasa Indonesia'], ['yi', 'יידיש'], ['ml', 'മലയാളം'], ['mr', 'मराठी'],
    ['kn', 'ಕನ್ನಡ'], ['ne', 'नेपाली'], ['my', 'မြန်မာ'], ['ps', 'پښتو'],
    ['sr', 'Српски'], ['sv', 'Svenska']
  ];

  const codes = languages.map(([code]) => code).join(',');
  let translateReady;

  function loadGoogleTranslate() {
    if (window.google?.translate?.TranslateElement) return Promise.resolve();
    if (translateReady) return translateReady;
    translateReady = new Promise((resolve) => {
      window.googleTranslateElementInit = function () {
        if (window.google?.translate?.TranslateElement && document.getElementById('google_translate_element')) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: codes,
            autoDisplay: false
          }, 'google_translate_element');
        }
        resolve();
      };
      const script = document.createElement('script');
      script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&languages=${encodeURIComponent(codes)}`;
      script.async = true;
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
    return translateReady;
  }

  function getGoogleSelect() {
    return document.querySelector('.goog-te-combo');
  }

  function setLanguage(code) {
    if (code === 'en') {
      document.cookie = 'googtrans=/en/en;path=/;max-age=0';
      window.location.reload();
      return;
    }
    loadGoogleTranslate().then(() => {
      applyGoogleLanguage(code);
    });
  }

  function applyGoogleLanguage(code, attempt = 0) {
      const select = getGoogleSelect();
      if (!select) {
        if (attempt < 20) window.setTimeout(() => applyGoogleLanguage(code, attempt + 1), 150);
        return;
      }
      select.value = code;
      select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function init() {
    const bar = document.querySelector('.tcs-pay-ribbon');
    if (!bar || bar.querySelector('.tcs-language-item')) return;

    const item = document.createElement('li');
    item.className = 'tcs-language-item';
    item.innerHTML = '<span class="tcs-language-caption" aria-hidden="true">Language</span><label class="tcs-language-label" for="tcsLanguage">Choose page language</label><select id="tcsLanguage" class="tcs-language-select" aria-label="Choose page language"></select><span id="google_translate_element" class="tcs-google-translate" aria-hidden="true"></span>';
    const select = item.querySelector('select');
    languages.forEach(([code, label]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = label;
      select.appendChild(option);
    });
    select.addEventListener('change', () => setLanguage(select.value));
    bar.appendChild(item);
    loadGoogleTranslate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
