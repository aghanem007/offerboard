/**
 * Global behavior: auth UI in the topbar, nav search, sign in/out.
 * Page-specific logic lives in forum.js and the per-page scripts.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initSignInForm();
    initNavSearch();

    if (typeof window.onAuthReady === 'function') {
      window.onAuthReady(updateAuthUI);
    }
  }

  // ---- Topbar auth area ----
  //
  // The area starts hidden (.auth-pending from layout.js) so guests never
  // see a signed-out flash while the session resolves.

  function updateAuthUI() {
    var authArea = document.getElementById('authArea');
    if (!authArea) return;

    var user = window.getCurrentUser && window.getCurrentUser();
    var profile = window.getCurrentProfile && window.getCurrentProfile();

    if (user) {
      var username = (profile && profile.username) || user.email.split('@')[0];
      var role = window.getCurrentRole ? window.getCurrentRole() : 'member';
      var badge = '';
      if (role === 'moderator') badge = ' <span class="badge badge-role badge-moderator">Mod</span>';
      if (role === 'admin') badge = ' <span class="badge badge-role badge-admin">Admin</span>';

      authArea.innerHTML =
        '<span class="auth-welcome">Hey, <strong>' + escapeHTML(username) + '</strong>' + badge + '</span>' +
        '<button class="btn small ghost" type="button" id="signOutBtn">Sign Out</button>';

      var signOutBtn = document.getElementById('signOutBtn');
      if (signOutBtn) signOutBtn.addEventListener('click', window.signOut);
    }

    authArea.classList.remove('auth-pending');
  }

  window.updateAuthUI = updateAuthUI;

  // ---- Sign in (topbar dropdown) ----

  function initSignInForm() {
    var form = document.getElementById('signinForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var email = form.querySelector('#loginEmail');
      var password = form.querySelector('#loginPassword');
      var errorEl = document.getElementById('signinError');
      var submitBtn = form.querySelector('.signin-btn');

      if (!email.value.trim() || !password.value) {
        showSignInError(errorEl, 'Enter your email and password.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
      if (errorEl) errorEl.hidden = true;

      try {
        var { error } = await window._supabase.auth.signInWithPassword({
          email: email.value.trim(),
          password: password.value
        });

        if (error) {
          showSignInError(errorEl, friendlyAuthError(error));
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
          return;
        }

        location.reload();
      } catch (err) {
        showSignInError(errorEl, 'Something went wrong. Check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    });
  }

  function showSignInError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  function friendlyAuthError(error) {
    var msg = (error && error.message) || '';
    if (/invalid login credentials/i.test(msg)) return 'Wrong email or password.';
    if (/email not confirmed/i.test(msg)) return 'Check your inbox — you need to verify your email first.';
    return msg || 'Sign in failed.';
  }

  window.signOut = async function () {
    // scope:'local' so other tabs keep their session
    await window._supabase.auth.signOut({ scope: 'local' });
    location.reload();
  };

  window.isLoggedIn = function () {
    return !!(window.getCurrentUser && window.getCurrentUser());
  };

  // ---- Nav search ----

  function initNavSearch() {
    var form = document.getElementById('navSearch');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="search"]');
      var query = input ? input.value.trim() : '';
      if (query) {
        window.location.href = 'index.html?search=' + encodeURIComponent(query);
      }
    });

    // Pre-fill when landing on index.html?search=...
    var params = new URLSearchParams(window.location.search);
    var q = params.get('search');
    if (q) {
      var input = form.querySelector('input[type="search"]');
      if (input) input.value = q;
    }
  }
})();
