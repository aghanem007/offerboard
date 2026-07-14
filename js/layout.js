/**
 * Shared page chrome: topbar, nav, and footer.
 *
 * Pages opt in with <div id="chromeTop"></div> at the top of <body> and
 * <div id="chromeBottom"></div> at the end, then load this script before
 * the rest of the bundle. The active nav link comes from
 * <body data-nav="...">.
 *
 * The auth area starts as .auth-pending (visibility hidden) so there is
 * no signed-out flash; main.js reveals it once the session is resolved.
 */
(function () {
  'use strict';

  var NAV = [
    { id: 'browse',  href: 'index.html',                      label: 'Browse' },
    { id: 'grind',   href: 'forum.html?id=the-grind',         label: 'The Grind' },
    { id: 'salary',  href: 'forum.html?id=salary-check',      label: 'Salary Check' },
    { id: 'stories', href: 'forum.html?id=interview-stories', label: 'Interview Stories' },
    { id: 'contact', href: 'contact.html',                    label: 'Contact' }
  ];

  function topbarHTML() {
    return '' +
      '<div class="topbar">' +
        '<div class="container topbar-inner">' +
          '<span class="topbar-stat" id="topbarStat" aria-hidden="true"></span>' +
          '<div class="auth-links auth-pending" id="authArea">' +
            '<button class="auth-trigger" type="button" id="authTrigger">Sign In <span class="caret">&#9662;</span></button>' +
            '<a href="signup.html" class="btn small">Join Offerboard</a>' +
            '<div class="auth-dropdown" id="authDropdown">' +
              '<h4>Welcome back</h4>' +
              '<form id="signinForm" novalidate>' +
                '<label for="loginEmail">Email</label>' +
                '<input type="email" id="loginEmail" name="email" placeholder="you@school.edu" autocomplete="email" required>' +
                '<label for="loginPassword">Password</label>' +
                '<input type="password" id="loginPassword" name="password" placeholder="Your password" autocomplete="current-password" required>' +
                '<p class="form-error" id="signinError" hidden></p>' +
                '<button type="submit" class="btn full signin-btn">Sign In</button>' +
                '<a href="recovery.html" class="forgot-link">Forgot your password?</a>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function navHTML() {
    var active = document.body.getAttribute('data-nav') || '';
    var links = NAV.map(function (item) {
      var cls = item.id === active ? ' class="active"' : '';
      return '<a href="' + item.href + '"' + cls + ' data-nav-id="' + item.id + '">' + item.label + '</a>';
    }).join('');

    return '' +
      '<header class="nav">' +
        '<div class="container nav-inner">' +
          '<a class="brand" href="index.html">' +
            '<img src="assets/logo.svg" alt="" class="brand-mark">' +
            '<span class="brand-word">offerboard</span>' +
          '</a>' +
          '<nav class="nav-links" id="navLinks">' + links + '</nav>' +
          '<form class="search" id="navSearch" role="search">' +
            '<input type="search" placeholder="Search the board..." aria-label="Search">' +
            '<button type="submit" aria-label="Search">&#8981;</button>' +
          '</form>' +
          ghostButtonHTML() +
        '</div>' +
      '</header>';
  }

  function ghostButtonHTML() {
    return '' +
      '<button class="ghost-btn" type="button" onclick="toggleTheme()" title="ghost mode" aria-label="Toggle dark theme">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
          '<path d="M12 2a8 8 0 0 0-8 8v11.2l3-2.4 2.5 2.4 2.5-2.4 2.5 2.4 2.5-2.4 3 2.4V10a8 8 0 0 0-8-8z" fill="currentColor"/>' +
          '<circle cx="9.4" cy="10.2" r="1.4" class="ghost-eye"/>' +
          '<circle cx="14.6" cy="10.2" r="1.4" class="ghost-eye"/>' +
        '</svg>' +
      '</button>';
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return '' +
      '<footer class="footer">' +
        '<div class="container footer-inner">' +
          '<div class="footer-brand">' +
            '<span class="brand-word">offerboard</span>' +
            '<p>Interview prep, salary data, and moral support &mdash; by students, for students.</p>' +
          '</div>' +
          '<nav class="footer-links">' +
            '<a href="index.html">Home</a>' +
            '<a href="terms.html">Terms</a>' +
            '<a href="privacy.html">Privacy</a>' +
            '<a href="contact.html">Contact</a>' +
          '</nav>' +
          '<span class="footer-note">&copy; ' + year + ' Offerboard</span>' +
        '</div>' +
      '</footer>';
  }

  function mount() {
    var top = document.getElementById('chromeTop');
    var bottom = document.getElementById('chromeBottom');
    if (top) top.outerHTML = topbarHTML() + navHTML();
    if (bottom) bottom.outerHTML = footerHTML();
  }

  // ---- Auth dropdown behavior (wired once, here) ----

  window.toggleAuthDropdown = function () {
    var dropdown = document.getElementById('authDropdown');
    if (dropdown) dropdown.classList.toggle('open');
  };

  function wireDropdown() {
    var trigger = document.getElementById('authTrigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleAuthDropdown();
      });
    }

    document.addEventListener('click', function (e) {
      var dropdown = document.getElementById('authDropdown');
      var trig = document.getElementById('authTrigger');
      if (!dropdown || !dropdown.classList.contains('open')) return;
      if (!dropdown.contains(e.target) && (!trig || !trig.contains(e.target))) {
        dropdown.classList.remove('open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var dropdown = document.getElementById('authDropdown');
        if (dropdown) dropdown.classList.remove('open');
      }
    });
  }

  // Staff get a Mod Panel link once their role is known
  function addStaffNav() {
    if (typeof window.onAuthReady !== 'function') return;
    window.onAuthReady(function () {
      if (!(window.hasRole && window.hasRole('moderator'))) return;
      var nav = document.getElementById('navLinks');
      if (!nav || nav.querySelector('[data-nav-id="admin"]')) return;
      var link = document.createElement('a');
      link.href = 'admin.html';
      link.textContent = 'Mod Panel';
      link.setAttribute('data-nav-id', 'admin');
      link.className = 'nav-staff' + (document.body.getAttribute('data-nav') === 'admin' ? ' active' : '');
      nav.appendChild(link);
    });
  }

  mount();
  wireDropdown();
  addStaffNav();
})();
