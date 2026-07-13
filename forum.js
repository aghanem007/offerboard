// Forum JavaScript - Handles dynamic content for forum.html and topic.html
// Uses async Supabase-backed data from data/forum-api.js

window.onAuthReady(function() {
  var path = window.location.pathname;
  var isForumPage = path.includes('forum.html') || path.endsWith('/forum');
  var isTopicPage = path.includes('topic.html') || path.endsWith('/topic');

  if (isForumPage) {
    initForumPage();
  } else if (isTopicPage) {
    initTopicPage();
  }
});

// ============================================
// FORUM PAGE (Category View)
// ============================================

async function initForumPage() {
  var params = new URLSearchParams(window.location.search);
  var categoryId = params.get('id');

  if (!categoryId) {
    showError('No forum specified');
    return;
  }

  // Pre-cache sections for breadcrumb lookup
  await getSections();

  var category = await getCategory(categoryId);
  if (!category) {
    showError('Forum not found');
    return;
  }

  // Update page title
  document.title = category.name + ' - Pixel Forum';

  // Update breadcrumbs
  var elSectionName = document.getElementById('sectionName');
  var elCategoryName = document.getElementById('categoryName');
  if (elSectionName) elSectionName.textContent = getSectionName(category.section_id);
  if (elCategoryName) elCategoryName.textContent = category.name;

  // Update header
  var elCatIcon = document.getElementById('categoryIcon');
  var elCatTitle = document.getElementById('categoryTitle');
  var elCatDesc = document.getElementById('categoryDescription');
  if (elCatIcon) elCatIcon.innerHTML = category.icon;
  if (elCatTitle) elCatTitle.textContent = category.name;
  if (elCatDesc) elCatDesc.textContent = category.description;

  // Show scam alert if configured
  if (category.show_scam_alert) {
    var elScam = document.getElementById('scamAlert');
    if (elScam) elScam.style.display = 'block';
  }

  // Visibility checks
  var vis = category.visibility || 'public';
  if (vis === 'staff' && !(window.hasRole && window.hasRole('moderator'))) {
    showError('This forum is restricted to staff members.');
    return;
  }

  if (vis === 'private' || vis === 'staff') {
    var noticeEl = document.createElement('div');
    noticeEl.className = 'privacy-notice';
    var isStaff = window.hasRole && window.hasRole('moderator');
    var noticeMsg;
    if (isStaff) {
      noticeMsg = '<span class="notice-icon">&#128274;</span> Staff view &mdash; you can see all topics in this private forum.';
    } else if (window.getCurrentUser && window.getCurrentUser()) {
      noticeMsg = '<span class="notice-icon">&#128274;</span> This is a private forum. You can only see topics you created.';
    } else {
      noticeMsg = '<span class="notice-icon">&#128274;</span> This is a private forum. Sign in to create or view your topics.';
    }
    noticeEl.innerHTML = noticeMsg;
    var topicsSection = document.querySelector('.topics-section');
    if (topicsSection) topicsSection.parentNode.insertBefore(noticeEl, topicsSection);
  }

  // Load topics
  await loadTopics(categoryId);

  // Update statistics from category data
  if (vis === 'private' || vis === 'staff') {
    document.getElementById('statTopics').textContent = '\u2014';
    document.getElementById('statReplies').textContent = '\u2014';
  } else {
    updateForumStats(category);
  }
}

async function loadTopics(categoryId, sortBy) {
  var topics = await getTopicsByCategory(categoryId, sortBy || 'recent');
  var list = document.getElementById('topicList');
  var empty = document.getElementById('topicsEmpty');
  var pagination = document.getElementById('pagination');

  if (!topics || topics.length === 0) {
    if (list) list.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    if (pagination) pagination.style.display = 'none';
    return;
  }

  var html = '';
  topics.forEach(function(topic) {
    html += createTopicRow(topic);
  });

  if (list) { list.innerHTML = html; list.style.display = 'block'; }
  if (empty) empty.style.display = 'none';
}

function createTopicRow(topic) {
  var badges = [];
  if (topic.pinned) badges.push('<span class="badge badge-pinned">Pinned</span>');
  if (topic.locked) badges.push('<span class="badge badge-locked">Locked</span>');

  var pageBadges = '';
  if (topic.reply_count > 10) {
    var pages = Math.ceil(topic.reply_count / 10);
    pageBadges = '<span class="topic-pages">';
    for (var i = 1; i <= Math.min(pages, 3); i++) {
      pageBadges += '<span class="page-badge">' + i + '</span>';
    }
    if (pages > 3) {
      pageBadges += '<span class="page-badge">...</span><span class="page-badge">' + pages + '</span>';
    }
    pageBadges += '</span>';
  }

  var authorAvatar = topic.author_avatar || '?';
  var authorColor = topic.author_color || 'blue';
  var authorName = topic.author_name || 'Unknown';
  var dateStr = formatRelativeDate(topic.created_at);
  var lastPosterName = topic.last_poster_name || authorName;
  var lastPosterAvatar = topic.last_poster_avatar || authorAvatar;
  var lastPosterColor = topic.last_poster_color || authorColor;
  var lastPostDate = topic.last_reply_at ? formatRelativeDate(topic.last_reply_at) : dateStr;

  return '\
    <a href="topic.html?id=' + topic.id + '" class="topic-row ' + (topic.pinned ? 'pinned' : '') + '">\
      <div class="topic-row-icon">\
        <div class="avatar avatar-' + escapeHTML(authorColor) + '">' + escapeHTML(authorAvatar) + '</div>\
      </div>\
      <div class="topic-row-main">\
        <div class="topic-row-title">\
          ' + badges.join('') + '\
          <h3>' + escapeHTML(topic.title) + '</h3>\
          ' + pageBadges + '\
        </div>\
        <div class="topic-row-meta">\
          <span class="topic-author">By ' + roleUsername(authorName, topic.author_role) + '</span>\
          <span class="topic-date">' + dateStr + '</span>\
        </div>\
      </div>\
      <div class="topic-row-stats">\
        <div class="stat">\
          <span class="stat-value">' + topic.reply_count + '</span>\
          <span class="stat-label">replies</span>\
        </div>\
        <div class="stat">\
          <span class="stat-value">' + formatNumber(topic.views) + '</span>\
          <span class="stat-label">views</span>\
        </div>\
      </div>\
      <div class="topic-row-latest">\
        <div class="avatar avatar-sm avatar-' + escapeHTML(lastPosterColor) + '">' + escapeHTML(lastPosterAvatar) + '</div>\
        <div class="topic-latest-text">\
          <p>' + roleUsername(lastPosterName, topic.last_poster_role || topic.author_role) + '</p>\
          <small>' + lastPostDate + '</small>\
        </div>\
      </div>\
    </a>\
  ';
}

function updateForumStats(category) {
  var elTopics = document.getElementById('statTopics');
  var elReplies = document.getElementById('statReplies');
  if (elTopics) elTopics.textContent = category.topic_count || 0;
  if (elReplies) elReplies.textContent = category.post_count || 0;
}

async function sortTopics(sortBy) {
  var params = new URLSearchParams(window.location.search);
  var categoryId = params.get('id');
  await loadTopics(categoryId, sortBy);
}

// ============================================
// TOPIC PAGE (Thread View)
// ============================================

async function initTopicPage() {
  var params = new URLSearchParams(window.location.search);
  var topicId = params.get('id');

  if (!topicId) {
    showError('No topic specified');
    return;
  }

  await getSections();

  var topic = await getTopic(topicId);
  if (!topic) {
    showError('Topic not found');
    return;
  }

  var category = await getCategory(topic.category_id);

  // Visibility check — staff-only categories
  if (category && category.visibility === 'staff' && !(window.hasRole && window.hasRole('moderator'))) {
    showError('This topic is in a staff-only forum.');
    return;
  }

  // Update page title
  document.title = topic.title + ' - Pixel Forum';

  // Update breadcrumbs
  var elSN = document.getElementById('sectionName');
  var elCL = document.getElementById('categoryLink');
  var elTT = document.getElementById('topicTitle');
  if (elSN && category) elSN.textContent = getSectionName(category.section_id);
  if (elCL && category) { elCL.textContent = category.name; elCL.href = 'forum.html?id=' + category.id; }
  if (elTT) elTT.textContent = truncate(topic.title, 40);

  // Update topic header
  var elHeading = document.getElementById('topicHeading');
  var elAuthor = document.getElementById('authorLink');
  var elDate = document.getElementById('topicDate');
  var elViews = document.getElementById('viewCount');
  if (elHeading) elHeading.textContent = topic.title;
  if (elAuthor) elAuthor.innerHTML = roleUsername(topic.author_name, topic.author_role);
  if (elDate) elDate.textContent = formatRelativeDate(topic.created_at);
  if (elViews) elViews.textContent = formatNumber(topic.views);

  // Show badges + mod controls
  var badgesContainer = document.getElementById('topicBadges');
  var badges = '';
  if (topic.pinned) badges += '<span class="badge badge-pinned">Pinned</span>';
  if (topic.locked) badges += '<span class="badge badge-locked">Locked</span>';

  if (window.hasRole && window.hasRole('moderator')) {
    badges += '<div class="topic-mod-controls">';
    badges += '<button class="mod-btn" data-mod-action="pin" data-id="' + escapeHTML(topic.id) + '" data-pinned="' + !topic.pinned + '">' + (topic.pinned ? 'Unpin' : 'Pin') + '</button>';
    badges += '<button class="mod-btn" data-mod-action="lock" data-id="' + escapeHTML(topic.id) + '" data-locked="' + !topic.locked + '">' + (topic.locked ? 'Unlock' : 'Lock') + '</button>';
    badges += '</div>';
  }
  if (badgesContainer) {
    badgesContainer.innerHTML = badges;
    badgesContainer.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-mod-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-mod-action');
      if (action === 'pin') handleTogglePin(btn.getAttribute('data-id'), btn.getAttribute('data-pinned') === 'true');
      else if (action === 'lock') handleToggleLock(btn.getAttribute('data-id'), btn.getAttribute('data-locked') === 'true');
    });
  }

  // Update sidebar info
  var elStarted = document.getElementById('infoStarted');
  var elReplies = document.getElementById('infoReplies');
  var elInfoViews = document.getElementById('infoViews');
  var elLastReply = document.getElementById('infoLastReply');
  if (elStarted) elStarted.textContent = formatRelativeDate(topic.created_at);
  if (elReplies) elReplies.textContent = topic.reply_count;
  if (elInfoViews) elInfoViews.textContent = formatNumber(topic.views);
  if (elLastReply) elLastReply.textContent = topic.last_reply_at ? formatRelativeDate(topic.last_reply_at) : '-';

  // Fire-and-forget view increment
  incrementViews(topicId);

  // Load posts
  await loadPosts(topic);

  // Show/hide reply box based on auth, locked, and banned status
  if (window.isLoggedIn && window.isLoggedIn()) {
    if (window.isBanned && window.isBanned()) {
      var replySection = document.getElementById('replySection');
      if (replySection) {
        replySection.innerHTML = '<div class="banned-notice">Your account has been suspended. You cannot post replies.</div>';
      }
    } else if (!topic.locked) {
      var disabled = document.getElementById('replyDisabled');
      var enabled = document.getElementById('replyEnabled');
      if (disabled) disabled.style.display = 'none';
      if (enabled) enabled.style.display = 'block';
    }
  }
}

async function loadPosts(topic) {
  var container = document.getElementById('postsContainer');
  var replies = await getReplies(topic.id);

  // Original post — map topic fields to post-like structure
  var opPost = {
    id: topic.id,
    type: 'topic',
    authorId: topic.author_id,
    author: topic.author_name,
    authorAvatar: topic.author_avatar,
    authorColor: topic.author_color,
    authorJoinDate: formatJoinDate(topic.author_join_date),
    authorPosts: topic.author_posts || 0,
    authorRole: topic.author_role || 'member',
    date: formatRelativeDate(topic.created_at),
    content: topic.content,
    deletedAt: topic.deleted_at,
    categoryId: topic.category_id
  };

  var html = createPostHTML(opPost, true);

  // Replies
  replies.forEach(function(reply) {
    var rPost = {
      id: reply.id,
      type: 'reply',
      authorId: reply.author_id,
      author: reply.author_name,
      authorAvatar: reply.author_avatar,
      authorColor: reply.author_color,
      authorJoinDate: formatJoinDate(reply.author_join_date),
      authorPosts: reply.author_posts || 0,
      authorRole: reply.author_role || 'member',
      date: formatRelativeDate(reply.created_at),
      content: reply.content,
      deletedAt: reply.deleted_at
    };
    html += createPostHTML(rPost, false);
  });

  container.innerHTML = html;

  // Event delegation for mod action buttons
  container.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-mod-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-mod-action');
    if (action === 'delete') {
      handleModDelete(btn.getAttribute('data-type'), btn.getAttribute('data-id'), btn.getAttribute('data-category') || undefined);
    } else if (action === 'warn') {
      handleModWarn(btn.getAttribute('data-author-id'), btn.getAttribute('data-author-name'));
    }
  });
}

function createPostHTML(post, isOriginal) {
  var isMod = window.hasRole && window.hasRole('moderator');
  var isDeleted = !!post.deletedAt;
  var postClass = (isOriginal ? 'original-post' : 'reply-post') + (isDeleted ? ' post-deleted' : '');

  // Content: show deletion notice for regular users, faded content for mods
  var contentHTML;
  if (isDeleted && !isMod) {
    contentHTML = '<p class="deleted-notice"><em>This post was removed by a moderator.</em></p>';
  } else {
    contentHTML = post.content || '';
  }

  // Mod action buttons
  var modButtons = '';
  if (isMod && !isDeleted) {
    modButtons = '\
            <button class="post-action mod-action" title="Delete" data-mod-action="delete" data-type="' + escapeHTML(post.type) + '" data-id="' + escapeHTML(post.id) + '" data-category="' + escapeHTML(post.categoryId || '') + '">&#128465; Delete</button>\
            <button class="post-action mod-action" title="Warn" data-mod-action="warn" data-author-id="' + escapeHTML(post.authorId) + '" data-author-name="' + escapeHTML(post.author || 'Unknown') + '">&#9888; Warn</button>\
    ';
  }

  return '\
    <article class="post-container ' + postClass + '">\
      <div class="post-author-sidebar">\
        <div class="avatar avatar-lg avatar-' + escapeHTML(post.authorColor || 'blue') + '">' + escapeHTML(post.authorAvatar || '?') + '</div>\
        <div class="post-author-name">' + roleUsername(post.author, post.authorRole) + '</div>\
        <div class="post-author-role"><span class="badge badge-role badge-' + (post.authorRole || 'member') + '">' + (post.authorRole || 'member') + '</span></div>\
        <div class="post-author-meta">\
          <div class="author-stat">\
            <span class="stat-label">Joined</span>\
            <span class="stat-value">' + (post.authorJoinDate || '') + '</span>\
          </div>\
          <div class="author-stat">\
            <span class="stat-label">Posts</span>\
            <span class="stat-value">' + (post.authorPosts || 0) + '</span>\
          </div>\
        </div>\
      </div>\
      <div class="post-main">\
        <div class="post-header">\
          <span class="post-date">' + (post.date || '') + (isDeleted ? ' <span class="deleted-notice">[Deleted]</span>' : '') + '</span>\
          <div class="post-actions">\
            <button class="post-action" title="Share" onclick="alert(\'Sign in to share\')">&#128279;</button>\
            <button class="post-action" title="Quote" onclick="alert(\'Sign in to quote\')">&#128172;</button>\
            ' + modButtons + '\
          </div>\
        </div>\
        <div class="post-content">\
          ' + contentHTML + '\
        </div>\
        <div class="post-footer">\
          <div class="post-reactions">\
            <button class="reaction-btn" onclick="alert(\'Sign in to react\')">\
              <span>&#128077;</span> Like\
            </button>\
          </div>\
        </div>\
      </div>\
    </article>\
  ';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function truncate(str, length) {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function showError(message) {
  var el = document.querySelector('.forum');
  if (!el) return;
  el.innerHTML = '\
    <div class="error-state">\
      <div class="error-icon">&#9888;</div>\
      <h2>Error</h2>\
      <p>' + escapeHTML(message) + '</p>\
      <a href="index.html" class="btn">Back to Home</a>\
    </div>\
  ';
}
