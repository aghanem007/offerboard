/**
 * Category and thread pages. Which one to run comes from
 * <body data-page="forum|topic">. All user content renders through
 * render.js (escaped markdown-lite) — never as raw HTML.
 */

window.onAuthReady(function () {
  var page = document.body.getAttribute('data-page');
  if (page === 'forum') initForumPage();
  else if (page === 'topic') initTopicPage();
});

// ============================================
// CATEGORY PAGE
// ============================================

var _forum = { categoryId: null, sortBy: 'recent', page: 1 };

async function initForumPage() {
  var params = new URLSearchParams(window.location.search);
  _forum.categoryId = params.get('id');

  if (!_forum.categoryId) {
    showPageError('That forum link is missing its destination.');
    return;
  }

  await getSections();
  var category = await getCategory(_forum.categoryId);

  // RLS hides staff categories entirely, so non-staff get null here
  if (!category) {
    showPageError("This forum doesn't exist — or you don't have access to it.");
    return;
  }

  document.title = category.name + ' — Offerboard';

  setText('sectionName', getSectionName(category.section_id));
  setText('categoryName', category.name);
  setText('categoryTitle', category.name);
  setText('categoryDescription', category.description);
  var iconEl = document.getElementById('categoryIcon');
  if (iconEl) iconEl.innerHTML = category.icon; // trusted, seeded by us

  if (category.visibility === 'staff') {
    var notice = document.createElement('div');
    notice.className = 'staff-notice';
    notice.innerHTML = '<span>&#128737;</span> Staff-only forum — regular members can\'t see this.';
    var topics = document.querySelector('.topics-section');
    if (topics) topics.parentNode.insertBefore(notice, topics);
  }

  wireSortSelect();
  wireNewTopic();
  wireTopicModal();
  wireFollowButton('category', _forum.categoryId);

  await loadTopics();
}

async function loadTopics() {
  var result = await getTopicsByCategory(_forum.categoryId, _forum.sortBy, _forum.page);
  var list = document.getElementById('topicList');
  var empty = document.getElementById('topicsEmpty');

  if (!result.topics.length) {
    if (list) list.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    renderPagination('forumPagination', 0, _forum.page);
    return;
  }

  if (list) {
    list.innerHTML = result.topics.map(createTopicRow).join('');
    list.style.display = 'block';
  }
  if (empty) empty.style.display = 'none';

  renderPagination('forumPagination', result.total, _forum.page, function (page) {
    _forum.page = page;
    loadTopics();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function createTopicRow(topic) {
  var badges = '';
  if (topic.pinned) badges += '<span class="badge badge-pinned">Pinned</span>';
  if (topic.locked) badges += '<span class="badge badge-locked">Locked</span>';

  var lastName = topic.last_poster_name || topic.author_name;
  var lastAvatar = topic.last_poster_avatar || topic.author_avatar;
  var lastColor = topic.last_poster_color || topic.author_color;
  var lastRole = topic.last_poster_role || topic.author_role;
  var lastDate = topic.last_reply_at ? formatRelativeDate(topic.last_reply_at)
                                     : formatRelativeDate(topic.created_at);

  return '' +
    '<a href="topic.html?id=' + encodeURIComponent(topic.id) + '" class="topic-row' + (topic.pinned ? ' pinned' : '') + '">' +
      '<div class="topic-row-icon">' + avatarHTML(topic.author_avatar, topic.author_color) + '</div>' +
      '<div class="topic-row-main">' +
        '<div class="topic-row-title">' + badges + '<h3>' + escapeHTML(topic.title) + '</h3></div>' +
        '<div class="topic-row-meta">' +
          '<span>by ' + roleUsername(topic.author_name, topic.author_role) + '</span>' +
          '<span class="sep">·</span>' +
          '<span>' + formatRelativeDate(topic.created_at) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="topic-row-stats">' +
        '<span class="stat"><b class="mono">' + formatNumber(topic.reply_count) + '</b> replies</span>' +
        '<span class="stat"><b class="mono">' + formatNumber(topic.views) + '</b> views</span>' +
      '</div>' +
      '<div class="topic-row-latest">' +
        avatarHTML(lastAvatar, lastColor, 'sm') +
        '<div class="topic-latest-text">' +
          '<p>' + roleUsername(lastName, lastRole) + '</p>' +
          '<small>' + lastDate + '</small>' +
        '</div>' +
      '</div>' +
    '</a>';
}

function wireSortSelect() {
  var select = document.getElementById('sortBy');
  if (!select) return;
  select.addEventListener('change', function () {
    _forum.sortBy = select.value;
    _forum.page = 1;
    loadTopics();
  });
}

// ---- New topic modal ----

function wireNewTopic() {
  document.querySelectorAll('[data-action="new-topic"]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!window.isLoggedIn()) {
        showToast('Sign in to start a topic.', 'info');
        window.toggleAuthDropdown();
        return;
      }
      if (window.isBanned && window.isBanned()) {
        showToast('Your account is suspended — you can\'t post right now.', 'error');
        return;
      }
      openTopicModal();
    });
  });
}

function openTopicModal() {
  var modal = document.getElementById('newTopicModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  var title = document.getElementById('topicTitle');
  if (title) title.focus();
}

function closeTopicModal() {
  var modal = document.getElementById('newTopicModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function wireTopicModal() {
  var modal = document.getElementById('newTopicModal');
  var form = document.getElementById('newTopicForm');
  if (!modal || !form) return;

  modal.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close')) {
      closeTopicModal();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeTopicModal();
  });

  wireComposerToolbar(form);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var title = document.getElementById('topicTitle').value.trim();
    var content = document.getElementById('topicContent').value.trim();
    var errorEl = document.getElementById('topicFormError');
    if (!title || !content) {
      if (errorEl) { errorEl.textContent = 'Both a title and some content are required.'; errorEl.hidden = false; }
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    if (errorEl) errorEl.hidden = true;

    try {
      var topic = await createTopic(_forum.categoryId, title, content);
      window.location.href = 'topic.html?id=' + topic.id;
    } catch (err) {
      if (errorEl) { errorEl.textContent = 'Couldn\'t post: ' + err.message; errorEl.hidden = false; }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Topic';
    }
  });
}

/** Toolbar buttons wrap the current selection in markdown-lite markers. */
function wireComposerToolbar(scope) {
  var toolbar = scope.querySelector('.editor-toolbar');
  var textarea = scope.querySelector('textarea');
  if (!toolbar || !textarea) return;

  var MARKERS = {
    bold: ['**', '**'], italic: ['*', '*'], strike: ['~~', '~~'],
    code: ['`', '`'], codeblock: ['\n```\n', '\n```\n'],
    link: ['[', '](https://)'], quote: ['\n> ', ''],
    ul: ['\n- ', ''], ol: ['\n1. ', '']
  };

  toolbar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-format]');
    if (!btn) return;
    e.preventDefault();
    var marker = MARKERS[btn.getAttribute('data-format')];
    if (!marker) return;

    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var value = textarea.value;
    var selected = value.substring(start, end);

    textarea.value = value.substring(0, start) + marker[0] + selected + marker[1] + value.substring(end);
    textarea.focus();
    textarea.selectionStart = start + marker[0].length;
    textarea.selectionEnd = start + marker[0].length + selected.length;
  });
}

// ============================================
// THREAD PAGE
// ============================================

var _thread = {
  topicId: null,
  topic: null,
  replyPage: 1,
  replyTotal: 0,
  rawContent: {} // post id -> raw markdown, for quoting
};

async function initTopicPage() {
  var params = new URLSearchParams(window.location.search);
  _thread.topicId = params.get('id');

  if (!_thread.topicId) {
    showPageError('That topic link is missing its destination.');
    return;
  }

  await getSections();
  var topic = await getTopic(_thread.topicId);

  if (!topic || (topic.deleted_at && !(window.hasRole && window.hasRole('moderator')))) {
    showPageError("This topic doesn't exist, was removed, or is out of reach.");
    return;
  }
  _thread.topic = topic;

  var category = await getCategory(topic.category_id);

  document.title = topic.title + ' — Offerboard';

  setText('sectionName', category ? getSectionName(category.section_id) : '');
  var catLink = document.getElementById('categoryLink');
  if (catLink && category) {
    catLink.textContent = category.name;
    catLink.href = 'forum.html?id=' + encodeURIComponent(category.id);
  }
  setText('topicCrumb', truncate(topic.title, 40));
  setText('topicHeading', topic.title);
  var authorEl = document.getElementById('topicAuthor');
  if (authorEl) authorEl.innerHTML = roleUsername(topic.author_name, topic.author_role);
  setText('topicDate', formatRelativeDate(topic.created_at));
  setText('viewCount', formatNumber(topic.views));

  renderTopicBadges();
  renderTopicSidebar();
  wireFollowButton('topic', _thread.topicId);
  wirePostActions();
  wireReplyBox();

  incrementViews(_thread.topicId);
  await loadPosts(1);
  updateReplyBoxState();
}

function renderTopicBadges() {
  var el = document.getElementById('topicBadges');
  if (!el) return;
  var topic = _thread.topic;
  var html = '';
  if (topic.pinned) html += '<span class="badge badge-pinned">Pinned</span>';
  if (topic.locked) html += '<span class="badge badge-locked">Locked</span>';
  if (topic.deleted_at) html += '<span class="badge badge-deleted">Removed</span>';

  if (window.hasRole && window.hasRole('moderator')) {
    html += '<span class="mod-controls">' +
      '<button class="mod-btn" data-mod="pin">' + (topic.pinned ? 'Unpin' : 'Pin') + '</button>' +
      '<button class="mod-btn" data-mod="lock">' + (topic.locked ? 'Unlock' : 'Lock') + '</button>' +
      '<button class="mod-btn danger" data-mod="delete-topic">Remove</button>' +
    '</span>';
  }
  el.innerHTML = html;
}

function renderTopicSidebar() {
  var topic = _thread.topic;
  setText('infoStarted', formatRelativeDate(topic.created_at));
  setText('infoReplies', formatNumber(topic.reply_count));
  setText('infoViews', formatNumber(topic.views));
  setText('infoLastReply', topic.last_reply_at ? formatRelativeDate(topic.last_reply_at) : '—');
}

async function loadPosts(page) {
  _thread.replyPage = page;
  var container = document.getElementById('postsContainer');
  if (!container) return;

  var result = await getReplies(_thread.topicId, page);
  _thread.replyTotal = result.total;
  _thread.rawContent = {};

  var html = '';
  if (page === 1) {
    _thread.rawContent[_thread.topic.id] = _thread.topic.content;
    html += createPostHTML(topicAsPost(_thread.topic), true);
  }
  result.replies.forEach(function (reply) {
    _thread.rawContent[reply.id] = reply.content;
    html += createPostHTML(replyAsPost(reply), false);
  });

  container.innerHTML = html || '<p class="muted">Nothing here.</p>';

  renderPagination('threadPagination', result.total, page, function (p) {
    loadPosts(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function topicAsPost(topic) {
  return {
    id: topic.id, type: 'topic',
    authorId: topic.author_id, author: topic.author_name,
    avatar: topic.author_avatar, color: topic.author_color,
    joinDate: topic.author_join_date, posts: topic.author_posts,
    role: topic.author_role, date: topic.created_at,
    content: topic.content, deleted: !!topic.deleted_at,
    categoryId: topic.category_id
  };
}

function replyAsPost(reply) {
  return {
    id: reply.id, type: 'reply',
    authorId: reply.author_id, author: reply.author_name,
    avatar: reply.author_avatar, color: reply.author_color,
    joinDate: reply.author_join_date, posts: reply.author_posts,
    role: reply.author_role, date: reply.created_at,
    content: reply.content, deleted: !!reply.deleted_at
  };
}

function createPostHTML(post, isOriginal) {
  var isMod = window.hasRole && window.hasRole('moderator');
  var classes = 'post' + (isOriginal ? ' post-original' : '') + (post.deleted ? ' post-deleted' : '');

  var contentHTML;
  if (post.deleted && !isMod) {
    contentHTML = '<p class="deleted-notice">This post was removed by a moderator.</p>';
  } else {
    contentHTML = renderMarkdown(post.content);
  }

  var actions = '';
  if (!post.deleted) {
    actions += '<button class="post-action" data-action="quote" data-id="' + escapeHTML(post.id) + '" data-author="' + escapeHTML(post.author || '') + '">Quote</button>';
    if (isMod) {
      if (post.type === 'reply') {
        actions += '<button class="post-action mod" data-action="delete-reply" data-id="' + escapeHTML(post.id) + '">Remove</button>';
      }
      if (post.role !== 'admin' && post.authorId !== (window.getCurrentUser() && window.getCurrentUser().id)) {
        actions += '<button class="post-action mod" data-action="warn" data-author-id="' + escapeHTML(post.authorId) + '" data-author="' + escapeHTML(post.author || '') + '">Warn</button>';
      }
    }
  }

  return '' +
    '<article class="' + classes + '">' +
      '<div class="post-sidebar">' +
        avatarHTML(post.avatar, post.color, 'lg') +
        '<div class="post-author">' + roleUsername(post.author, post.role) + '</div>' +
        roleBadge(post.role) +
        '<div class="post-author-meta">' +
          '<span>Joined ' + escapeHTML(formatJoinDate(post.joinDate)) + '</span>' +
          '<span class="mono">' + formatNumber(post.posts) + ' posts</span>' +
        '</div>' +
      '</div>' +
      '<div class="post-main">' +
        '<div class="post-header">' +
          '<span class="post-date">' + formatRelativeDate(post.date) +
            (post.deleted ? ' <span class="deleted-tag">[removed]</span>' : '') + '</span>' +
          '<div class="post-actions">' + actions + '</div>' +
        '</div>' +
        '<div class="post-content">' + contentHTML + '</div>' +
      '</div>' +
    '</article>';
}

// ---- Post actions (bound once, delegated) ----

function wirePostActions() {
  var container = document.getElementById('postsContainer');
  if (container) {
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'quote') handleQuote(btn.getAttribute('data-id'), btn.getAttribute('data-author'));
      else if (action === 'delete-reply') handleDeleteReply(btn.getAttribute('data-id'));
      else if (action === 'warn') handleWarn(btn.getAttribute('data-author-id'), btn.getAttribute('data-author'));
    });
  }

  var badges = document.getElementById('topicBadges');
  if (badges) {
    badges.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-mod]');
      if (!btn) return;
      var action = btn.getAttribute('data-mod');
      if (action === 'pin') handleTogglePin();
      else if (action === 'lock') handleToggleLock();
      else if (action === 'delete-topic') handleDeleteTopic();
    });
  }
}

function handleQuote(postId, author) {
  if (!window.isLoggedIn()) {
    showToast('Sign in to quote and reply.', 'info');
    window.toggleAuthDropdown();
    return;
  }
  var raw = _thread.rawContent[postId] || '';
  var quoted = raw.split('\n').slice(0, 6).map(function (line) { return '> ' + line; }).join('\n');
  var textarea = document.querySelector('.reply-textarea');
  if (!textarea) return;
  var attribution = author ? '> **' + author + '** wrote:\n' : '';
  textarea.value = (textarea.value ? textarea.value + '\n\n' : '') + attribution + quoted + '\n\n';
  textarea.focus();
  textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function handleTogglePin() {
  var next = !_thread.topic.pinned;
  try {
    await toggleTopicPin(_thread.topicId, next);
    await logModAction(next ? 'pin_topic' : 'unpin_topic', _thread.topicId, 'topic');
    _thread.topic.pinned = next;
    renderTopicBadges();
    showToast(next ? 'Topic pinned.' : 'Topic unpinned.', 'success');
  } catch (err) {
    showToast('Pin failed: ' + err.message, 'error');
  }
}

async function handleToggleLock() {
  var next = !_thread.topic.locked;
  try {
    await toggleTopicLock(_thread.topicId, next);
    await logModAction(next ? 'lock_topic' : 'unlock_topic', _thread.topicId, 'topic');
    _thread.topic.locked = next;
    renderTopicBadges();
    updateReplyBoxState();
    showToast(next ? 'Topic locked.' : 'Topic unlocked.', 'success');
  } catch (err) {
    showToast('Lock failed: ' + err.message, 'error');
  }
}

async function handleDeleteTopic() {
  var confirmed = await openDialog({
    title: 'Remove this topic?',
    message: 'The topic and its replies will be hidden from members. This is a soft delete — moderators can still see it.',
    confirmText: 'Remove Topic',
    danger: true
  });
  if (!confirmed) return;

  try {
    await softDeleteTopic(_thread.topicId);
    await logModAction('delete_topic', _thread.topicId, 'topic');
    window.location.href = 'forum.html?id=' + encodeURIComponent(_thread.topic.category_id);
  } catch (err) {
    showToast('Remove failed: ' + err.message, 'error');
  }
}

async function handleDeleteReply(replyId) {
  var confirmed = await openDialog({
    title: 'Remove this reply?',
    message: 'Members will see a removal notice instead of the content.',
    confirmText: 'Remove Reply',
    danger: true
  });
  if (!confirmed) return;

  try {
    await softDeleteReply(replyId);
    await logModAction('delete_reply', replyId, 'reply');
    showToast('Reply removed.', 'success');
    loadPosts(_thread.replyPage);
  } catch (err) {
    showToast('Remove failed: ' + err.message, 'error');
  }
}

async function handleWarn(userId, username) {
  var reason = await openDialog({
    title: 'Warn ' + (username || 'user'),
    inputLabel: 'Reason (visible to staff)',
    note: 'Three warnings triggers an automatic ban.',
    confirmText: 'Issue Warning',
    danger: true
  });
  if (!reason) return;

  try {
    await warnUser(userId, reason);
    await logModAction('warn_user', userId, 'user', reason);
    showToast('Warning issued to ' + username + '.', 'success');
  } catch (err) {
    showToast('Warn failed: ' + err.message, 'error');
  }
}

// ---- Reply box ----

function updateReplyBoxState() {
  var disabled = document.getElementById('replyDisabled');
  var enabled = document.getElementById('replyEnabled');
  var lockedNote = document.getElementById('replyLocked');
  var bannedNote = document.getElementById('replyBanned');
  if (!disabled || !enabled) return;

  [disabled, enabled, lockedNote, bannedNote].forEach(function (el) {
    if (el) el.style.display = 'none';
  });

  if (!window.isLoggedIn()) {
    disabled.style.display = 'block';
  } else if (window.isBanned && window.isBanned()) {
    if (bannedNote) bannedNote.style.display = 'block';
  } else if (_thread.topic && _thread.topic.locked) {
    if (lockedNote) lockedNote.style.display = 'block';
  } else {
    enabled.style.display = 'block';
  }
}

function wireReplyBox() {
  var btn = document.getElementById('postReplyBtn');
  var scope = document.getElementById('replyEnabled');
  if (scope) wireComposerToolbar(scope);
  if (!btn) return;

  btn.addEventListener('click', async function () {
    var textarea = document.querySelector('.reply-textarea');
    var errorEl = document.getElementById('replyError');
    var content = textarea ? textarea.value.trim() : '';

    if (!content) {
      if (errorEl) { errorEl.textContent = 'Write something first.'; errorEl.hidden = false; }
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Posting...';
    if (errorEl) errorEl.hidden = true;

    try {
      await createReply(_thread.topicId, content);
      textarea.value = '';
      _thread.topic.reply_count++;
      _thread.topic.last_reply_at = new Date().toISOString();
      renderTopicSidebar();

      // Jump to wherever the new reply landed
      var lastPage = Math.max(1, Math.ceil(_thread.topic.reply_count / PAGE_SIZE));
      await loadPosts(lastPage);
      showToast('Reply posted.', 'success');
    } catch (err) {
      if (errorEl) { errorEl.textContent = 'Couldn\'t post: ' + err.message; errorEl.hidden = false; }
    } finally {
      btn.disabled = false;
      btn.textContent = 'Post Reply';
    }
  });
}

// ============================================
// SHARED
// ============================================

function wireFollowButton(targetType, targetId) {
  var btn = document.getElementById('followBtn');
  if (!btn || !targetId) return;

  var icon = document.getElementById('followIcon');
  var text = document.getElementById('followText');
  var count = document.getElementById('followCount');

  function paint(following) {
    if (icon) icon.innerHTML = following ? '&#9733;' : '&#9734;';
    if (text) text.textContent = following ? 'Following' : 'Follow';
  }

  getFollowCount(targetType, targetId).then(function (n) {
    if (count) count.textContent = n;
  });
  if (window.isLoggedIn()) {
    isFollowing(targetType, targetId).then(paint);
  }

  btn.addEventListener('click', async function () {
    if (!window.isLoggedIn()) {
      showToast('Sign in to follow.', 'info');
      window.toggleAuthDropdown();
      return;
    }
    try {
      var following = await toggleFollow(targetType, targetId);
      paint(following);
      var n = await getFollowCount(targetType, targetId);
      if (count) count.textContent = n;
    } catch (err) {
      showToast('Follow failed: ' + err.message, 'error');
    }
  });
}

/** Numbered pagination with collapsed middle ranges. */
function renderPagination(containerId, total, current, onChange) {
  var el = document.getElementById(containerId);
  if (!el) return;

  var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pages <= 1) {
    el.innerHTML = '';
    return;
  }

  var parts = ['<button class="page-btn" data-page="' + (current - 1) + '"' + (current === 1 ? ' disabled' : '') + '>&larr;</button>'];
  var lastShown = 0;
  for (var p = 1; p <= pages; p++) {
    var show = pages <= 7 || p <= 2 || p > pages - 2 || Math.abs(p - current) <= 1;
    if (!show) continue;
    if (lastShown && p - lastShown > 1) parts.push('<span class="page-gap">…</span>');
    parts.push('<button class="page-btn' + (p === current ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>');
    lastShown = p;
  }
  parts.push('<button class="page-btn" data-page="' + (current + 1) + '"' + (current === pages ? ' disabled' : '') + '>&rarr;</button>');
  el.innerHTML = parts.join('');

  if (!el._wired && onChange) {
    el._wired = true;
    el.addEventListener('click', function (e) {
      var btn = e.target.closest('.page-btn[data-page]');
      if (!btn || btn.disabled || btn.classList.contains('active')) return;
      onChange(parseInt(btn.getAttribute('data-page'), 10));
    });
  }
  el._onChange = onChange;
}

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showPageError(message) {
  var el = document.querySelector('.forum');
  if (!el) return;
  el.innerHTML =
    '<div class="error-state">' +
      '<div class="error-mark">404</div>' +
      '<h2>Not here.</h2>' +
      '<p>' + escapeHTML(message) + '</p>' +
      '<a href="index.html" class="btn">Back to the board</a>' +
    '</div>';
}
