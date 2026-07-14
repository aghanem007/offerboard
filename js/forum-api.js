/**
 * Data layer. Every Supabase read/write in the app goes through this
 * file — pages and widgets never touch the client directly. (This is
 * also the seam where a caching API can slot in later without touching
 * any UI code.)
 */

var PAGE_SIZE = 20;

// ---- Sections ----

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
  var s = _sectionsCache.find(function (sec) { return sec.id === sectionId; });
  return s ? s.name : sectionId;
}

// ---- Categories ----

async function getCategory(categoryId) {
  var { data, error } = await window._supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .maybeSingle();
  if (error) { console.error('getCategory:', error); return null; }
  return data;
}

async function getCategoriesWithLatest() {
  var { data, error } = await window._supabase
    .from('categories_with_latest')
    .select('*')
    .order('section_sort_order')
    .order('sort_order');
  if (error) { console.error('getCategoriesWithLatest:', error); return []; }
  return data || [];
}

// ---- Topics ----

async function getTopicsByCategory(categoryId, sortBy, page) {
  var from = ((page || 1) - 1) * PAGE_SIZE;
  var query = window._supabase
    .from('topics_with_authors')
    .select('*', { count: 'exact' })
    .eq('category_id', categoryId)
    .is('deleted_at', null);

  switch (sortBy) {
    case 'newest':
      query = query.order('pinned', { ascending: false })
                   .order('created_at', { ascending: false });
      break;
    case 'replies':
      query = query.order('pinned', { ascending: false })
                   .order('reply_count', { ascending: false });
      break;
    case 'views':
      query = query.order('pinned', { ascending: false })
                   .order('views', { ascending: false });
      break;
    default: // recently updated
      query = query.order('pinned', { ascending: false })
                   .order('last_reply_at', { ascending: false, nullsFirst: false })
                   .order('created_at', { ascending: false });
  }

  var { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) { console.error('getTopicsByCategory:', error); return { topics: [], total: 0 }; }
  return { topics: data || [], total: count || 0 };
}

async function getTopic(topicId) {
  var { data, error } = await window._supabase
    .from('topics_with_authors')
    .select('*')
    .eq('id', topicId)
    .maybeSingle();
  if (error) { console.error('getTopic:', error); return null; }
  return data;
}

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

// ---- Replies ----

async function getReplies(topicId, page) {
  var from = ((page || 1) - 1) * PAGE_SIZE;
  var { data, error, count } = await window._supabase
    .from('replies_with_authors')
    .select('*', { count: 'exact' })
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true })
    .range(from, from + PAGE_SIZE - 1);
  if (error) { console.error('getReplies:', error); return { replies: [], total: 0 }; }
  return { replies: data || [], total: count || 0 };
}

// ---- Mutations ----

async function createTopic(categoryId, title, content) {
  var user = window.getCurrentUser();
  if (!user) throw new Error('Not signed in');

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
  if (!user) throw new Error('Not signed in');

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

async function incrementViews(topicId) {
  var { error } = await window._supabase.rpc('increment_topic_views', { p_topic_id: topicId });
  if (error) console.error('incrementViews:', error);
}

// ---- Moderation ----

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

// ---- Presence ----

async function updateLastSeen() {
  var { error } = await window._supabase.rpc('update_last_seen');
  if (error) console.error('updateLastSeen:', error);
}

async function getPreviouslyActiveUsers() {
  var { data, error } = await window._supabase.rpc('get_previously_active_users');
  if (error) { console.error('getPreviouslyActiveUsers:', error); return []; }
  return data || [];
}

// ---- Community widgets ----

async function getTopContributors(period, limit) {
  var { data, error } = await window._supabase.rpc('get_top_contributors', {
    p_period: period || 'week',
    p_limit: limit || 5
  });
  if (error) { console.error('getTopContributors:', error); return []; }
  return data || [];
}

async function getForumStatistics() {
  var { data, error } = await window._supabase.rpc('get_board_stats');
  if (error || !data || !data.length) {
    if (error) console.error('getForumStatistics:', error);
    return { topics: 0, posts: 0, members: 0 };
  }
  var row = data[0];
  return { topics: row.topics, posts: row.posts, members: row.members };
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

// ---- Follows ----

async function toggleFollow(targetType, targetId) {
  var { data, error } = await window._supabase.rpc('toggle_follow', {
    p_target_type: targetType,
    p_target_id: targetId
  });
  if (error) throw error;
  return data; // true = now following
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
