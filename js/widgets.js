/**
 * Sidebar and homepage widgets shared across pages: top contributors,
 * recent topics, board stats, and the who's-online strips. Each widget
 * quietly no-ops when its container isn't on the page.
 */

function initContributorsWidget() {
  var listEl = document.getElementById('contributorsList');
  var tabsEl = document.getElementById('contributorTabs');
  if (!listEl) return;

  function load(period) {
    getTopContributors(period, 5).then(function (contributors) {
      if (!contributors || contributors.length === 0) {
        listEl.innerHTML = '<p class="muted">No posts yet this period.</p>';
        return;
      }
      var html = contributors.map(function (c, i) {
        return '<div class="contributor-item">' +
          '<span class="contributor-rank">' + (i + 1) + '</span>' +
          avatarHTML(c.avatar_letter, c.avatar_color, 'sm') +
          '<span class="contributor-name">' + roleUsername(c.username, c.role) + '</span>' +
          '<span class="contributor-count">' + formatNumber(c.post_total) + '</span>' +
        '</div>';
      }).join('');
      listEl.innerHTML = html;
    });
  }

  if (tabsEl) {
    tabsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-period]');
      if (!btn) return;
      tabsEl.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      load(btn.getAttribute('data-period'));
    });
  }

  load('week');
}

function initRecentTopicsWidget() {
  var el = document.getElementById('recentTopicsList');
  if (!el) return;

  getRecentTopics(5).then(function (topics) {
    if (!topics || topics.length === 0) {
      el.innerHTML = '<p class="muted">Nothing yet. Start something.</p>';
      return;
    }
    var html = topics.map(function (t) {
      return '<a href="topic.html?id=' + encodeURIComponent(t.id) + '" class="recent-topic">' +
        avatarHTML(t.author_avatar, t.author_color, 'sm') +
        '<span class="recent-topic-text">' +
          '<span class="recent-topic-title">' + escapeHTML(truncate(t.title, 48)) + '</span>' +
          '<small>' + formatRelativeDate(t.created_at) + '</small>' +
        '</span>' +
      '</a>';
    }).join('');
    el.innerHTML = html;
  });
}

function initStatsWidget() {
  var el = document.getElementById('boardStats');
  if (!el) return;

  getForumStatistics().then(function (stats) {
    el.innerHTML =
      '<div class="stat-row"><span class="stat-label">Topics</span><span class="stat-value mono">' + formatNumber(stats.topics) + '</span></div>' +
      '<div class="stat-row"><span class="stat-label">Posts</span><span class="stat-value mono">' + formatNumber(stats.posts) + '</span></div>' +
      '<div class="stat-row"><span class="stat-label">Members</span><span class="stat-value mono">' + formatNumber(stats.members) + '</span></div>';
  });
}

/**
 * "Active Today" (last-seen based). The live "Who's Online" strip is
 * rendered by presence.js from the realtime channel instead.
 */
function initOnlineWidgets() {
  var prevEl = document.getElementById('previouslyActive');

  if (prevEl) {
    getPreviouslyActiveUsers().then(function (users) {
      if (!users || users.length === 0) {
        prevEl.innerHTML = '<span class="muted">No activity in the last 24 hours.</span>';
        return;
      }
      prevEl.innerHTML = users.map(function (u) {
        return roleUsername(u.username, u.role);
      }).join('<span class="sep">·</span>');
    });
  }
}
