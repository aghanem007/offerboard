/**
 * Pixel Forum - Main JavaScript
 */

(function() {
  'use strict';

  // Run when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initAuthDropdown();
    initSupabaseSignIn();
    initForumCollapse();
    initTabs();
    initSearch();
    initNewTopic();
    initStoreTabs();

    // Update auth UI once Supabase session is resolved
    if (typeof window.onAuthReady === 'function') {
      window.onAuthReady(function() {
        updateAuthUI();
      });
    } else {
      updateAuthUI();
    }
  }

  /**
   * Supabase Authentication — Sign In via dropdown form
   */
  function initSupabaseSignIn() {
    var signinBtns = document.querySelectorAll('.signin-btn');
    signinBtns.forEach(function(btn) {
      btn.addEventListener('click', async function(e) {
        e.preventDefault();
        var form = btn.closest('form');
        var emailInput = form.querySelector('input[type="email"]');
        var passInput = form.querySelector('input[type="password"]');

        if (!emailInput || !emailInput.value || !passInput || !passInput.value) return;

        btn.disabled = true;
        btn.textContent = 'Signing in...';

        try {
          var { data, error } = await window._supabase.auth.signInWithPassword({
            email: emailInput.value,
            password: passInput.value
          });

          if (error) {
            alert('Sign in failed: ' + error.message);
            btn.disabled = false;
            btn.textContent = 'Sign In';
            return;
          }

          // Close dropdown
          var dropdown = document.getElementById('authDropdown');
          if (dropdown) dropdown.classList.remove('open');

          // Reload to reflect auth state everywhere
          location.reload();
        } catch (err) {
          alert('Sign in error: ' + err.message);
          btn.disabled = false;
          btn.textContent = 'Sign In';
        }
      });
    });
  }

  /**
   * Update UI based on auth state
   */
  // Store original auth-links HTML so we can restore it on sign-out
  var _originalAuthLinksHTML = '';

  function updateAuthUI() {
    var user = typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null;
    var profile = typeof window.getCurrentProfile === 'function' ? window.getCurrentProfile() : null;

    var authLinks = document.querySelector('.auth-links');
    if (!authLinks) return;

    // Capture original HTML on first call (before any modification)
    if (!_originalAuthLinksHTML) {
      _originalAuthLinksHTML = authLinks.innerHTML;
    }

    if (user) {
      var username = (profile && profile.username) || user.email.split('@')[0];
      var role = (typeof window.getCurrentRole === 'function') ? window.getCurrentRole() : 'member';
      var roleBadge = '';
      if (role === 'vip') {
        roleBadge = ' <span class="badge badge-role badge-vip">VIP</span>';
      } else if (role === 'moderator') {
        roleBadge = ' <span class="badge badge-role badge-moderator">Moderator</span>';
      } else if (role === 'admin') {
        roleBadge = ' <span class="badge badge-role badge-admin">Admin</span>';
      }
      authLinks.innerHTML = '\
        <span style="color: #a9b4c0; font-size: 0.85rem;">Welcome, <strong style="color: #e7edf4;">' + username + '</strong>' + roleBadge + '</span>\
        <button class="btn small" onclick="signOut()" style="background: #3b6a72;">Sign Out</button>\
      ';

      // Hide "Upgrade to VIP" nav link if user is VIP or admin
      if (typeof window.hasRole === 'function' && window.hasRole('vip')) {
        var navLinks = document.querySelectorAll('.nav-links .accent');
        navLinks.forEach(function(link) {
          if (link.textContent.indexOf('Upgrade to VIP') !== -1) {
            link.style.display = 'none';
          }
        });
      }
    } else {
      // Restore original sign-in / sign-up buttons
      authLinks.innerHTML = _originalAuthLinksHTML;
      // Re-init the dropdown and sign-in form since we replaced the DOM
      initAuthDropdown();
      initSupabaseSignIn();
    }
  }

  // Global sign out function — scope: 'local' so other tabs keep their session
  window.signOut = async function() {
    await window._supabase.auth.signOut({ scope: 'local' });
    location.reload();
  };

  // Global check auth function
  window.isLoggedIn = function() {
    return !!(typeof window.getCurrentUser === 'function' && window.getCurrentUser());
  };

  // Expose updateAuthUI globally
  window.updateAuthUI = updateAuthUI;

  /**
   * Auth Dropdown (Sign In) - Uses class-based toggle
   */
  function initAuthDropdown() {
    var dropdown = document.getElementById('authDropdown');

    if (!dropdown) return;

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
      }
    });
  }

  /**
   * Forum Section Collapse/Expand
   */
  function initForumCollapse() {
    var buttons = document.querySelectorAll('.forum-section .collapse');

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        var section = button.closest('.forum-section');
        var forumList = section.querySelector('.forum-list');

        if (!forumList) return;

        var isCollapsed = forumList.style.display === 'none';

        if (isCollapsed) {
          forumList.style.display = 'grid';
          button.textContent = '\u25BE';
          button.setAttribute('aria-expanded', 'true');
        } else {
          forumList.style.display = 'none';
          button.textContent = '\u25B8';
          button.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /**
   * Tab Switching (Popular Contributors)
   */
  function initTabs() {
    var tabContainers = document.querySelectorAll('.side-card .tabs');

    tabContainers.forEach(function(container) {
      var buttons = container.querySelectorAll('button');

      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          buttons.forEach(function(btn) {
            btn.classList.remove('active');
          });
          button.classList.add('active');
        });
      });
    });
  }

  /**
   * Search Functionality — redirects to index.html?search=query
   */
  function initSearch() {
    var searchContainers = document.querySelectorAll('.search, .guides-search');

    searchContainers.forEach(function(container) {
      var input = container.querySelector('input[type="search"]');
      var button = container.querySelector('button');

      if (!input || !button) return;

      function performSearch() {
        var query = input.value.trim();
        if (query) {
          window.location.href = 'index.html?search=' + encodeURIComponent(query);
        }
      }

      button.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
      });

      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch();
        }
      });
    });

    // Pre-fill search input if on index.html with ?search= param
    var params = new URLSearchParams(window.location.search);
    var searchQuery = params.get('search');
    if (searchQuery) {
      searchContainers.forEach(function(container) {
        var input = container.querySelector('input[type="search"]');
        if (input) input.value = searchQuery;
      });
    }
  }

  /**
   * Start New Topic Button
   */
  function initNewTopic() {
    var newTopicBtn = document.querySelector('.topic-btn');

    if (newTopicBtn) {
      newTopicBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.isLoggedIn && window.isLoggedIn()) {
          if (window.isBanned && window.isBanned()) {
            alert('Your account has been suspended. You cannot create new topics.');
            return;
          }
          if (typeof openTopicModal === 'function') {
            openTopicModal();
          }
        } else {
          alert('Please sign in to create a new topic.');
        }
      });
    }

    // Mark site read
    var links = document.querySelectorAll('.content-bar-right a');
    links.forEach(function(link) {
      if (link.textContent.indexOf('Mark site read') !== -1) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          if (window.isLoggedIn && window.isLoggedIn()) {
            alert('All content marked as read.');
          } else {
            alert('Please sign in to use this feature.');
          }
        });
      }
    });
  }

  /**
   * Store Page Tabs
   */
  function initStoreTabs() {
    var storeTabs = document.querySelector('.store-tabs');
    var storePanel = document.querySelector('.store-panel');

    if (!storeTabs || !storePanel) return;

    var buttons = storeTabs.querySelectorAll('button');

    var tabContent = {
      'Product Information': '<h3>About VIP</h3><p>VIP unlocks member-only downloads, private support, and priority updates.</p><ul><li>Access to private loader downloads</li><li>Premium support channels</li><li>Early access to updates</li><li>Priority troubleshooting</li></ul>',
      'Product Reviews': '<h3>Customer Reviews</h3><p class="muted">No reviews yet. Be the first to review this product!</p>'
    };

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        buttons.forEach(function(btn) {
          btn.classList.remove('active');
        });
        button.classList.add('active');

        var tabName = button.textContent.trim();
        if (tabContent[tabName]) {
          storePanel.innerHTML = tabContent[tabName];
        }
      });
    });
  }

})();
