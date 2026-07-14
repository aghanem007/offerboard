/**
 * Live presence over Supabase Realtime. Every open tab joins the
 * "online" channel: members are tracked by user id (so multiple tabs
 * collapse into one person), guests by a per-tab key. The Who's Online
 * widget renders from channel state — actual live visitors, not
 * last-seen guesses.
 */
(function () {
  'use strict';

  var HEARTBEAT_MS = 3 * 60 * 1000;

  // Presence isn't critical-path, so let first paint and the board
  // render settle before opening the realtime websocket.
  window.onAuthReady(function (user, profile) {
    var start = function () {
      joinPresence(user, profile);
      if (user) startHeartbeat();
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(start, { timeout: 2000 });
    } else {
      setTimeout(start, 600);
    }
  });

  function joinPresence(user, profile) {
    var key = user ? user.id : 'guest-' + Math.random().toString(36).slice(2);

    var channel = window._supabase.channel('online', {
      config: { presence: { key: key } },
    });

    channel
      .on('presence', { event: 'sync' }, function () {
        renderOnline(channel.presenceState());
      })
      .subscribe(function (status) {
        if (status !== 'SUBSCRIBED') return;
        channel.track({
          guest: !user,
          username: profile ? profile.username : null,
          role: profile ? profile.role : null,
        });
      });
  }

  function renderOnline(state) {
    var el = document.getElementById('onlineUsers');
    var countEl = document.getElementById('onlineCount');
    if (!el && !countEl) return;

    var members = [];
    var guests = 0;
    Object.keys(state).forEach(function (key) {
      var meta = state[key][0];
      if (!meta) return;
      if (meta.guest || !meta.username) guests++;
      else members.push(meta);
    });
    members.sort(function (a, b) { return a.username.localeCompare(b.username); });

    if (countEl) {
      countEl.textContent =
        members.length + (members.length === 1 ? ' member' : ' members') +
        ', ' + guests + (guests === 1 ? ' guest' : ' guests');
    }

    if (el) {
      if (!members.length) {
        el.innerHTML = '<span class="muted">' +
          (guests > 0
            ? guests + (guests === 1 ? ' guest is' : ' guests are') + ' browsing. Sign in to be seen.'
            : 'Nobody around right now. The grind never sleeps, but apparently people do.') +
          '</span>';
      } else {
        el.innerHTML = members.map(function (m) {
          return roleUsername(m.username, m.role);
        }).join('<span class="sep">·</span>');
      }
    }
  }

  // Keeps "Active Today" honest while a member has the site open
  function startHeartbeat() {
    if (typeof updateLastSeen !== 'function') return;
    setInterval(function () {
      if (document.visibilityState === 'visible') updateLastSeen();
    }, HEARTBEAT_MS);
  }
})();
