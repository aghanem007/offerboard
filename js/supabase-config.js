/**
 * Supabase Client Configuration & Auth State
 */
(function() {
  'use strict';

  var SUPABASE_URL = 'https://tppdhakosebdgfiwqzur.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcGRoYWtvc2ViZGdmaXdxenVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NTU5OTUsImV4cCI6MjA4NTIzMTk5NX0.vHBdQqfO29K-WXxbUg3-eLloAUc1vVk5o9oGytRfAY8';

  var _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  var _currentUser = null;
  var _currentProfile = null;
  var _authReadyCallbacks = [];
  var _authReady = false;

  // Expose the Supabase client globally
  window._supabase = _supabase;

  /**
   * Register a callback to fire once auth state is known.
   * If auth is already resolved, fires immediately.
   */
  window.onAuthReady = function(cb) {
    if (_authReady) {
      cb(_currentUser, _currentProfile);
    } else {
      _authReadyCallbacks.push(cb);
    }
  };

  window.getCurrentUser = function() { return _currentUser; };
  window.getCurrentProfile = function() { return _currentProfile; };

  window.getCurrentRole = function() {
    return (_currentProfile && _currentProfile.role) ? _currentProfile.role : 'guest';
  };

  window.hasRole = function(minRole) {
    var hierarchy = { guest: 0, member: 1, vip: 2, moderator: 3, admin: 4 };
    var current = hierarchy[window.getCurrentRole()] || 0;
    var required = hierarchy[minRole] || 0;
    return current >= required;
  };

  window.isBanned = function() {
    return !!(_currentProfile && _currentProfile.banned);
  };

  function _fireAuthReady() {
    _authReady = true;
    _authReadyCallbacks.forEach(function(cb) {
      try { cb(_currentUser, _currentProfile); } catch(e) { console.error(e); }
    });
    _authReadyCallbacks = [];
  }

  async function _loadProfile(userId) {
    var { data, error } = await _supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) {
      console.error('Failed to load profile:', error);
      return null;
    }
    return data;
  }

  async function initSupabaseAuth() {
    // Register auth listener
    _supabase.auth.onAuthStateChange(async function(event, session) {
      if (event === 'INITIAL_SESSION') {
        if (session && session.user) {
          _currentUser = session.user;
          _currentProfile = await _loadProfile(session.user.id);
          // Update last_seen for online tracking (await so getOnlineUsers sees it)
          if (typeof updateLastSeen === 'function') { try { await updateLastSeen(); } catch(e) {} }
        }
        if (!_authReady) _fireAuthReady();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session && session.user) {
          _currentUser = session.user;
          _currentProfile = await _loadProfile(session.user.id);
        }
        if (typeof window.updateAuthUI === 'function') {
          window.updateAuthUI();
        }
      } else if (event === 'SIGNED_OUT') {
        _currentUser = null;
        _currentProfile = null;
        if (typeof window.updateAuthUI === 'function') {
          window.updateAuthUI();
        }
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabaseAuth);
  } else {
    initSupabaseAuth();
  }
})();
