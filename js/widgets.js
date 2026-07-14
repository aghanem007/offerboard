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

