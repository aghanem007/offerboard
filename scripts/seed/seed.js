/**
 * Offerboard seeder. Wipes previous seed data and rebuilds the board:
 * users -> topics -> replies (chronological, so the last-reply triggers
 * land correctly) -> views -> a little moderation history.
 *
 * Idempotent: seed users live on a reserved email domain, so re-running
 * finds and removes exactly what it created. Run with `npm run seed`.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { users, emailFor, SEED_DOMAIN } from './users.js';
import { prepTopics } from './content-prep.js';
import { huntTopics } from './content-hunt.js';
import { bagTopics } from './content-bag.js';
import { communityTopics } from './content-community.js';

const { SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL } = process.env;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY — copy .env.example to .env and fill it in.');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const allTopics = [...prepTopics, ...huntTopics, ...bagTopics, ...communityTopics];

// Deterministic PRNG so re-seeds produce the same jitter
let rngState = 0x0ffe12b0;
function rand() {
  rngState |= 0; rngState = (rngState + 0x6d2b79f5) | 0;
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const between = (min, max) => min + rand() * (max - min);

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const daysAgoDate = (days, jitterHours = 8) =>
  new Date(Date.now() - days * DAY - between(0, jitterHours) * HOUR);

function fail(step, error) {
  console.error(`\n[seed] ${step} failed:`, error.message || error);
  process.exit(1);
}

// ---------------------------------------------------------------
// 1. Wipe previous seed data
// ---------------------------------------------------------------

async function wipe() {
  console.log('Wiping previous seed data...');

  for (const table of ['follows', 'warnings', 'mod_actions', 'replies', 'topics']) {
    const { error } = await db.from(table).delete().not('created_at', 'is', null);
    if (error) fail(`wipe ${table}`, error);
  }

  // Remove seed auth users (profiles cascade with them)
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 500 });
  if (error) fail('list users', error);

  const seedUsers = data.users.filter((u) => u.email && u.email.endsWith('@' + SEED_DOMAIN));
  for (const u of seedUsers) {
    const { error: delErr } = await db.auth.admin.deleteUser(u.id);
    if (delErr) fail(`delete user ${u.email}`, delErr);
  }
  console.log(`  removed ${seedUsers.length} seed users and all board content`);

  // Counters drift during bulk deletes; start clean
  const { error: resetErr } = await db
    .from('categories')
    .update({ topic_count: 0, post_count: 0 })
    .not('id', 'is', null);
  if (resetErr) fail('reset counters', resetErr);
}

// ---------------------------------------------------------------
// 2. Users
// ---------------------------------------------------------------

async function createUsers() {
  console.log('Creating users...');
  const idByHandle = {};

  for (const u of users) {
    const { data, error } = await db.auth.admin.createUser({
      email: emailFor(u.handle),
      password: randomBytes(24).toString('base64url'), // never used; accounts aren't meant to log in
      email_confirm: true,
      user_metadata: { display_name: u.handle },
    });
    if (error) fail(`create ${u.handle}`, error);
    idByHandle[u.handle] = data.user.id;

    // Backdate the join, set role/color, and give the presence widgets life
    const lastSeen = u.online
      ? new Date(Date.now() - between(0.5, 4) * 60 * 1000)
      : rand() < 0.5
        ? new Date(Date.now() - between(1, 20) * HOUR)
        : new Date(Date.now() - between(2, 12) * DAY);

    const { error: profErr } = await db
      .from('profiles')
      .update({
        role: u.role,
        avatar_color: u.color,
        created_at: daysAgoDate(u.daysAgo).toISOString(),
        last_seen: lastSeen.toISOString(),
      })
      .eq('user_id', data.user.id);
    if (profErr) fail(`profile ${u.handle}`, profErr);
  }

  console.log(`  created ${users.length} users (2 moderators)`);
  return idByHandle;
}

// ---------------------------------------------------------------
// 3. Topics + replies (replies inserted in order so triggers set
//    last_reply_at/by correctly)
// ---------------------------------------------------------------

async function createContent(idByHandle) {
  console.log('Posting topics and replies...');
  let topicCount = 0;
  let replyCount = 0;

  for (const t of allTopics) {
    const authorId = idByHandle[t.author];
    if (!authorId) fail(`topic "${t.title}"`, new Error(`unknown author ${t.author}`));

    const topicTime = daysAgoDate(t.daysAgo);
    const { data: topic, error } = await db
      .from('topics')
      .insert({
        category_id: t.category,
        title: t.title,
        content: t.content,
        author_id: authorId,
        pinned: !!t.pinned,
        locked: !!t.locked,
        created_at: topicTime.toISOString(),
      })
      .select('id')
      .single();
    if (error) fail(`topic "${t.title}"`, error);
    topicCount++;

    // Replies trickle in over hours/days after the topic, never in the future
    let cursor = topicTime.getTime() + between(0.5, 6) * HOUR;
    for (const r of t.replies || []) {
      const replyAuthor = idByHandle[r.author];
      if (!replyAuthor) fail(`reply on "${t.title}"`, new Error(`unknown author ${r.author}`));

      cursor += between(1, 30) * HOUR;
      const replyTime = Math.min(cursor, Date.now() - 30 * 60 * 1000);

      const { error: replyErr } = await db.from('replies').insert({
        topic_id: topic.id,
        content: r.content,
        author_id: replyAuthor,
        created_at: new Date(replyTime).toISOString(),
      });
      if (replyErr) fail(`reply on "${t.title}"`, replyErr);
      replyCount++;
    }

    // Views scale with age and engagement
    const replies = (t.replies || []).length;
    const views = Math.round(replies * between(25, 60) + t.daysAgo * between(3, 14) + between(10, 40));
    const { error: viewErr } = await db.from('topics').update({ views }).eq('id', topic.id);
    if (viewErr) fail(`views on "${t.title}"`, viewErr);
  }

  console.log(`  posted ${topicCount} topics, ${replyCount} replies`);
}

// ---------------------------------------------------------------
// 4. Moderation history (matches the mod-lounge sync notes)
// ---------------------------------------------------------------

async function createModHistory(idByHandle) {
  console.log('Writing moderation history...');
  const ogIntern = idByHandle['og_intern'];
  const lena = idByHandle['lockedin_lena'];

  const warned = [
    {
      user: idByHandle['topofstack'],
      by: lena,
      reason: 'Personal jab in a Resume Roast thread — roast the resume, not the person. First warning.',
      daysAgo: 26,
    },
    {
      user: idByHandle['caffeine_overflow'],
      by: ogIntern,
      reason: 'Drive-by self-promo link in the 847-applications thread. Removed, first warning.',
      daysAgo: 1,
    },
  ];

  for (const w of warned) {
    const at = daysAgoDate(w.daysAgo).toISOString();
    const { error } = await db.from('warnings').insert({
      user_id: w.user,
      reason: w.reason,
      warned_by: w.by,
      created_at: at,
    });
    if (error) fail('insert warning', error);

    const { error: countErr } = await db
      .from('profiles')
      .update({ warning_count: 1 })
      .eq('user_id', w.user);
    if (countErr) fail('warning count', countErr);

    const { error: logErr } = await db.from('mod_actions').insert({
      action_type: 'warn_user',
      target_id: w.user,
      target_type: 'user',
      mod_id: w.by,
      reason: w.reason,
      created_at: at,
    });
    if (logErr) fail('mod action log', logErr);
  }

  console.log(`  issued ${warned.length} warnings with matching log entries`);
}

// ---------------------------------------------------------------
// 5. Promote the real admin account, if present
// ---------------------------------------------------------------

async function promoteAdmin() {
  if (!ADMIN_EMAIL) return;

  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 500 });
  if (error) fail('admin lookup', error);

  const admin = data.users.find((u) => u.email === ADMIN_EMAIL.toLowerCase());
  if (!admin) {
    console.log(`Admin promotion: no account for ${ADMIN_EMAIL} yet — sign up on the site, then re-run.`);
    return;
  }

  const { error: roleErr } = await db
    .from('profiles')
    .update({ role: 'admin' })
    .eq('user_id', admin.id);
  if (roleErr) fail('promote admin', roleErr);
  console.log(`Promoted ${ADMIN_EMAIL} to admin.`);
}

// ---------------------------------------------------------------

async function main() {
  console.log(`Seeding ${SUPABASE_URL}\n`);
  await wipe();
  const idByHandle = await createUsers();
  await createContent(idByHandle);
  await createModHistory(idByHandle);
  await promoteAdmin();

  const [{ count: topics }, { count: replies }, { count: profiles }] = await Promise.all([
    db.from('topics').select('id', { count: 'exact', head: true }),
    db.from('replies').select('id', { count: 'exact', head: true }),
    db.from('profiles').select('user_id', { count: 'exact', head: true }),
  ]);
  console.log(`\nDone. Board now has ${topics} topics, ${replies} replies, ${profiles} members.`);
}

main().catch((err) => fail('seed', err));
