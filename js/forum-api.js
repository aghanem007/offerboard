/**
 * Forum API — Supabase-backed data layer
 * Replaces static data/forums.js with real database queries.
 */

// ---- HTML escaping ----

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- Username helpers ----

function roleUsername(name, role) {
  var r = role || 'member';
  return '<span class="username username-' + r + '">' + escapeHTML(name || 'Unknown') + '</span>';
}

// ---- Date formatting helpers ----

function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  var now = new Date();
  var date = new Date(dateStr);
  var diffMs = now - date;
  var diffSec = Math.floor(diffMs / 1000);
  var diffMin = Math.floor(diffSec / 60);
  var diffHr  = Math.floor(diffMin / 60);
  var diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return diffMin + (diffMin === 1 ? ' minute ago' : ' minutes ago');
  if (diffHr < 24) return diffHr + (diffHr === 1 ? ' hour ago' : ' hours ago');
  if (diffDay < 7) return diffDay + (diffDay === 1 ? ' day ago' : ' days ago');

  var months = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function formatJoinDate(dateStr) {
  if (!dateStr) return '';
  var date = new Date(dateStr);
  var months = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  return months[date.getMonth()] + ' ' + date.getFullYear();
}

// ---- Section name lookup ----

var _sectionsCache = null;

async function getSections() {
  if (_sectionsCache) return _sectionsCache;
  var { data, error } = await window._supabase
    .from('sections')
    .select('*')
    .order('sort_order');
  if (error) { console.error('getSections:', error); return []; }
  _sectionsCache = data;
  return data;
}

function getSectionName(sectionId) {
  if (!_sectionsCache) return sectionId;
  var s = _sectionsCache.find(function(sec) { return sec.id === sectionId; });
  return s ? s.name : sectionId;
}

// ---- Category queries ----

async function getCategory(categoryId) {
  var { data, error } = await window._supabase
    .from('categories')
    .select('*, sections(name)')
    .eq('id', categoryId)
    .single();
  if (error) { console.error('getCategory:', error); return null; }
  return data;
}

async function getCategoriesWithLatest() {
  var { data, error } = await window._supabase
    .from('categories_with_latest')
    .select('*');
  if (error) { console.error('getCategoriesWithLatest:', error); return []; }
  return data;
}

// ---- Topic queries ----

async function getTopicsByCategory(categoryId, sortBy) {
  var query = window._supabase
    .from('topics_with_authors')
    .select('*')
    .eq('category_id', categoryId)
    .is('deleted_at', null);

  switch (sortBy) {
    case 'newest':
      query = query.order('pinned', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'replies':
      query = query.order('pinned', { ascending: false }).order('reply_count', { ascending: false });
      break;
    case 'views':
      query = query.order('pinned', { ascending: false }).order('views', { ascending: false });
      break;
    case 'recent':
    default:
      query = query.order('pinned', { ascending: false }).order('last_reply_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
      break;
  }

  var { data, error } = await query;
  if (error) { console.error('getTopicsByCategory:', error); return []; }
  return data || [];
}

async function getTopic(topicId) {
  var { data, error } = await window._supabase
    .from('topics_with_authors')
    .select('*')
    .eq('id', topicId)
    .single();
  if (error) { console.error('getTopic:', error); return null; }
  return data;
}

// ---- Reply queries ----

async function getReplies(topicId) {
  var { data, error } = await window._supabase
    .from('replies_with_authors')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true });
  if (error) { console.error('getReplies:', error); return []; }
  return data || [];
}

// ---- Mutations ----

async function createTopic(categoryId, title, content) {
  var user = window.getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  var { data, error } = await window._supabase
    .from('topics')
    .insert({
      category_id: categoryId,
      title: title,
      content: content,
      author_id: user.id
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function createReply(topicId, content) {
  var user = window.getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  var { data, error } = await window._supabase
    .from('replies')
    .insert({
      topic_id: topicId,
      content: content,
      author_id: user.id
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- View counter ----

async function incrementViews(topicId) {
  var { error } = await window._supabase.rpc('increment_topic_views', { p_topic_id: topicId });
  if (error) console.error('incrementViews:', error);
}

// ---- Moderation functions ----

async function toggleTopicPin(topicId, pinned) {
  var { error } = await window._supabase
    .from('topics')
    .update({ pinned: pinned })
    .eq('id', topicId);
  if (error) throw error;
}

async function toggleTopicLock(topicId, locked) {
  var { error } = await window._supabase
    .from('topics')
    .update({ locked: locked })
    .eq('id', topicId);
  if (error) throw error;
}

async function softDeleteTopic(topicId) {
  var { error } = await window._supabase.rpc('soft_delete_topic', { p_topic_id: topicId });
  if (error) throw error;
}

async function softDeleteReply(replyId) {
  var { error } = await window._supabase.rpc('soft_delete_reply', { p_reply_id: replyId });
  if (error) throw error;
}

async function warnUser(userId, reason) {
  var { error } = await window._supabase.rpc('warn_user', { p_user_id: userId, p_reason: reason });
  if (error) throw error;
}

async function banUser(userId, reason) {
  var { error } = await window._supabase.rpc('ban_user', { p_user_id: userId, p_reason: reason });
  if (error) throw error;
}

async function unbanUser(userId) {
  var { error } = await window._supabase.rpc('unban_user', { p_user_id: userId });
  if (error) throw error;
}

async function logModAction(actionType, targetId, targetType, reason) {
  var user = window.getCurrentUser();
  if (!user) return;
  var { error } = await window._supabase.from('mod_actions').insert({
    action_type: actionType,
    target_id: targetId,
    target_type: targetType,
    mod_id: user.id,
    reason: reason || null
  });
  if (error) console.error('logModAction:', error);
}

async function getModActions() {
  var { data, error } = await window._supabase
    .from('mod_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error('getModActions:', error); return []; }
  return data || [];
}

// ---- Online / Activity ----

async function updateLastSeen() {
  var { error } = await window._supabase.rpc('update_last_seen');
  if (error) console.error('updateLastSeen:', error);
}

async function getOnlineUsers() {
  var { data, error } = await window._supabase.rpc('get_online_users');
  if (error) { console.error('getOnlineUsers:', error); return []; }
  return data || [];
}

async function getPreviouslyActiveUsers() {
  var { data, error } = await window._supabase.rpc('get_previously_active_users');
  if (error) { console.error('getPreviouslyActiveUsers:', error); return []; }
  return data || [];
}

// ---- Contributors ----

async function getTopContributors(period, limit) {
  var { data, error } = await window._supabase.rpc('get_top_contributors', {
    p_period: period || 'week',
    p_limit: limit || 5
  });
  if (error) { console.error('getTopContributors:', error); return []; }
  return data || [];
}

// ---- Sidebar widgets ----

async function getRecentTopics(limit) {
  var { data, error } = await window._supabase
    .from('topics_with_authors')
    .select('id, title, author_name, author_avatar, author_color, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit || 5);
  if (error) { console.error('getRecentTopics:', error); return []; }
  return data || [];
}

async function getForumStatistics() {
  var stats = { topics: 0, posts: 0, members: 0 };
  var results = await Promise.all([
    window._supabase.from('topics').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    window._supabase.from('replies').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    window._supabase.from('profiles').select('user_id', { count: 'exact', head: true })
  ]);
  stats.topics = results[0].count || 0;
  stats.posts = (results[0].count || 0) + (results[1].count || 0);
  stats.members = results[2].count || 0;
  return stats;
}

// ---- Search ----

async function searchForum(query) {
  var { data, error } = await window._supabase.rpc('search_forum', {
    p_query: query,
    p_limit: 20
  });
  if (error) { console.error('searchForum:', error); return []; }
  return data || [];
}

// ---- Support tickets ----

async function createTicket(title, department, details) {
  var user = window.getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  var isPriority = window.hasRole && window.hasRole('vip');
  var { data, error } = await window._supabase
    .from('support_tickets')
    .insert({
      user_id: user.id,
      title: title,
      department: department,
      details: details,
      is_priority: isPriority
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getMyTickets() {
  var user = window.getCurrentUser();
  if (!user) return [];
  var { data, error } = await window._supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) { console.error('getMyTickets:', error); return []; }
  return data || [];
}

// ---- Releases ----

async function getLatestRelease() {
  var { data, error } = await window._supabase
    .from('releases')
    .select('*')
    .eq('is_latest', true)
    .single();
  if (error) { console.error('getLatestRelease:', error); return null; }
  return data;
}

async function getAllReleases() {
  var { data, error } = await window._supabase
    .from('releases')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getAllReleases:', error); return []; }
  return data || [];
}

// ---- Follows ----

async function toggleFollow(targetType, targetId) {
  var { data, error } = await window._supabase.rpc('toggle_follow', {
    p_target_type: targetType,
    p_target_id: targetId
  });
  if (error) throw error;
  return data; // true = now following, false = unfollowed
}

async function getFollowCount(targetType, targetId) {
  var { data, error } = await window._supabase.rpc('get_follow_count', {
    p_target_type: targetType,
    p_target_id: targetId
  });
  if (error) { console.error('getFollowCount:', error); return 0; }
  return data || 0;
}

async function isFollowing(targetType, targetId) {
  var { data, error } = await window._supabase.rpc('is_following', {
    p_target_type: targetType,
    p_target_id: targetId
  });
  if (error) { console.error('isFollowing:', error); return false; }
  return !!data;
}
