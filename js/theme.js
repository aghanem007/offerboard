/**
 * Ghost mode. Loaded blocking in <head> so the saved theme applies
 * before first paint — no flash of the wrong palette.
 */
(function () {
  'use strict';

  var KEY = 'ob:theme';

  try {
    var saved = localStorage.getItem(KEY);
    // Saved choice wins; otherwise follow the OS preference on first visit.
    var dark = saved === 'dark' ||
      (saved === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) { /* private browsing — default to light */ }

  window.toggleTheme = function () {
    var root = document.documentElement;
    var dark = root.getAttribute('data-theme') === 'dark';
    if (dark) root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', 'dark');
    try { localStorage.setItem(KEY, dark ? 'light' : 'dark'); } catch (e) { /* fine */ }

    // little "boo" on whoever got clicked
    document.querySelectorAll('.ghost-btn').forEach(function (btn) {
      btn.classList.remove('boo');
      void btn.offsetWidth; // restart the animation
      btn.classList.add('boo');
    });
  };
})();
