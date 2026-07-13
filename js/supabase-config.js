/**
 * Supabase client init and auth state.
 *
 * The publishable key is safe to ship — it only grants what row-level
 * security allows. The secret key never appears in this repo; it lives
 * in scripts/seed/.env for local seeding only.
 *
 * Everything else waits on onAuthReady() so the UI renders exactly once
 * with the correct session state (no signed-out flash).
 */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://dosdtqccclkignnqtjmq.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_Kg662jx4XY7yQ0-ahVrA_Q_CjFM4GX2';

  var _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  var _currentUser = null;
  var _currentProfile = null;
  var _authReadyCallbacks = [];
  var _authReady = false;

  window._supabase = _supabase;

  /** Runs cb once the session state is known (immediately if it already is). */
  window.onAuthReady = function (cb) {
    if (_authReady) {
      cb(_currentUser, _currentProfile);
    } else {
      _authReadyCallbacks.push(cb);
    }
  };

  window.getCurrentUser = function () { return _currentUser; };
  window.getCurrentProfile = function () { return _currentProfile; };

  window.getCurrentRole = function () {
    return (_currentProfile && _currentProfile.role) ? _currentProfile.role : 'guest';
  };

  window.hasRole = function (minRole) {
    var hierarchy = { guest: 0, member: 1, moderator: 2, admin: 3 };
    var current = hierarchy[window.getCurrentRole()] || 0;
    var required = hierarchy[minRole] || 0;
    return current >= required;
  };

  window.isBanned = function () {
    return !!(_currentProfile && _currentProfile.banned);
  };

  function fireAuthReady() {
    _authReady = true;
    _authReadyCallbacks.forEach(function (cb) {
      try { cb(_currentUser, _currentProfile); } catch (e) { console.error(e); }
    });
    _authReadyCallbacks = [];
  }

  async function loadProfile(userId) {
    var { data, error } = await _supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      console.error('loadProfile:', error);
      return null;
    }
    return data;
  }

  function initAuth() {
    _supabase.auth.onAuthStateChange(async function (event, session) {
      if (event === 'INITIAL_SESSION') {
        if (session && session.user) {
          _currentUser = session.user;
          _currentProfile = await loadProfile(session.user.id);
          // Await so the online widgets on this page load see it
          if (typeof updateLastSeen === 'function') {
            try { await updateLastSeen(); } catch (e) { /* non-fatal */ }
          }
        }
        if (!_authReady) fireAuthReady();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session && session.user) {
          _currentUser = session.user;
          _currentProfile = await loadProfile(session.user.id);
        }
        if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
      } else if (event === 'SIGNED_OUT') {
        _currentUser = null;
        _currentProfile = null;
        if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
