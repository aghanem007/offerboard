-- =============================================
-- Pixel Forum: Supabase Schema Migration
-- Run this SQL against project: tppdhakosebdgfiwqzur
-- =============================================

-- 1.1 Extend profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_letter TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS avatar_color TEXT DEFAULT 'blue',
  ADD COLUMN IF NOT EXISTS post_count INTEGER DEFAULT 0;

-- 1.2 Create sections table
CREATE TABLE IF NOT EXISTS public.sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sections are viewable by everyone" ON public.sections;
CREATE POLICY "Sections are viewable by everyone"
  ON public.sections FOR SELECT
  USING (true);

-- 1.3 Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES public.sections(id),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  show_scam_alert BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  topic_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- 1.4 Create topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL REFERENCES public.categories(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  pinned BOOLEAN DEFAULT false,
  locked BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  last_reply_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Topics are viewable by everyone" ON public.topics;
CREATE POLICY "Topics are viewable by everyone"
  ON public.topics FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create topics" ON public.topics;
CREATE POLICY "Authenticated users can create topics"
  ON public.topics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update own topics" ON public.topics;
CREATE POLICY "Authors can update own topics"
  ON public.topics FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- 1.5 Create replies table
CREATE TABLE IF NOT EXISTS public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Replies are viewable by everyone" ON public.replies;
CREATE POLICY "Replies are viewable by everyone"
  ON public.replies FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.replies;
CREATE POLICY "Authenticated users can create replies"
  ON public.replies FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.topics WHERE id = topic_id AND locked = true
    )
  );

DROP POLICY IF EXISTS "Authors can update own replies" ON public.replies;
CREATE POLICY "Authors can update own replies"
  ON public.replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- 1.6 Triggers for denormalization

-- on_topic_created trigger
CREATE OR REPLACE FUNCTION public.handle_new_topic()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.categories
    SET topic_count = topic_count + 1
    WHERE id = NEW.category_id;
  UPDATE public.profiles
    SET post_count = post_count + 1
    WHERE user_id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_topic_created ON public.topics;
CREATE TRIGGER on_topic_created
  AFTER INSERT ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_topic();

-- on_topic_deleted trigger
CREATE OR REPLACE FUNCTION public.handle_topic_deleted()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.categories
    SET topic_count = GREATEST(topic_count - 1, 0),
        post_count = GREATEST(post_count - OLD.reply_count, 0)
    WHERE id = OLD.category_id;
  UPDATE public.profiles
    SET post_count = GREATEST(post_count - 1, 0)
    WHERE user_id = OLD.author_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_topic_deleted ON public.topics;
CREATE TRIGGER on_topic_deleted
  AFTER DELETE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_topic_deleted();

-- on_reply_created trigger
CREATE OR REPLACE FUNCTION public.handle_new_reply()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.topics
    SET reply_count = reply_count + 1,
        last_reply_at = NEW.created_at,
        last_reply_by = NEW.author_id
    WHERE id = NEW.topic_id;
  UPDATE public.profiles
    SET post_count = post_count + 1
    WHERE user_id = NEW.author_id;
  UPDATE public.categories
    SET post_count = post_count + 1
    WHERE id = (SELECT category_id FROM public.topics WHERE id = NEW.topic_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_reply_created ON public.replies;
CREATE TRIGGER on_reply_created
  AFTER INSERT ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_reply();

-- on_reply_deleted trigger
CREATE OR REPLACE FUNCTION public.handle_reply_deleted()
RETURNS TRIGGER AS $$
DECLARE
  _last_reply RECORD;
BEGIN
  UPDATE public.topics
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE id = OLD.topic_id;

  -- Recalculate last reply
  SELECT created_at, author_id INTO _last_reply
    FROM public.replies
    WHERE topic_id = OLD.topic_id
    ORDER BY created_at DESC
    LIMIT 1;

  IF FOUND THEN
    UPDATE public.topics
      SET last_reply_at = _last_reply.created_at,
          last_reply_by = _last_reply.author_id
      WHERE id = OLD.topic_id;
  ELSE
    UPDATE public.topics
      SET last_reply_at = NULL,
          last_reply_by = NULL
      WHERE id = OLD.topic_id;
  END IF;

  UPDATE public.profiles
    SET post_count = GREATEST(post_count - 1, 0)
    WHERE user_id = OLD.author_id;
  UPDATE public.categories
    SET post_count = GREATEST(post_count - 1, 0)
    WHERE id = (SELECT category_id FROM public.topics WHERE id = OLD.topic_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_reply_deleted ON public.replies;
CREATE TRIGGER on_reply_deleted
  AFTER DELETE ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_reply_deleted();

-- 1.7 Update handle_new_user() trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _name TEXT;
  _colors TEXT[] := ARRAY['red','blue','green','purple','orange','teal','pink','yellow'];
BEGIN
  _name := COALESCE(
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'name',
    split_part(NEW.email, '@', 1)
  );
  INSERT INTO public.profiles (user_id, username, avatar_letter, avatar_color)
  VALUES (
    NEW.id,
    _name,
    UPPER(LEFT(_name, 1)),
    _colors[1 + floor(random() * 8)::int]
  )
  ON CONFLICT (user_id) DO UPDATE SET
    username = EXCLUDED.username,
    avatar_letter = EXCLUDED.avatar_letter,
    avatar_color = EXCLUDED.avatar_color;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.8 Database views

-- topics_with_authors
CREATE OR REPLACE VIEW public.topics_with_authors AS
SELECT
  t.*,
  p.username AS author_name,
  p.avatar_letter AS author_avatar,
  p.avatar_color AS author_color,
  p.created_at AS author_join_date,
  p.post_count AS author_posts,
  lp.username AS last_poster_name,
  lp.avatar_letter AS last_poster_avatar,
  lp.avatar_color AS last_poster_color
FROM public.topics t
LEFT JOIN public.profiles p ON t.author_id = p.user_id
LEFT JOIN public.profiles lp ON t.last_reply_by = lp.user_id;

-- replies_with_authors
CREATE OR REPLACE VIEW public.replies_with_authors AS
SELECT
  r.*,
  p.username AS author_name,
  p.avatar_letter AS author_avatar,
  p.avatar_color AS author_color,
  p.created_at AS author_join_date,
  p.post_count AS author_posts
FROM public.replies r
LEFT JOIN public.profiles p ON r.author_id = p.user_id;

-- categories_with_latest
CREATE OR REPLACE VIEW public.categories_with_latest AS
SELECT
  c.*,
  s.name AS section_name,
  s.sort_order AS section_sort_order,
  lt.id AS latest_topic_id,
  lt.title AS latest_topic_title,
  lt.created_at AS latest_topic_date,
  lt_author.username AS latest_topic_author,
  lt_author.avatar_letter AS latest_topic_avatar,
  lt_author.avatar_color AS latest_topic_color,
  COALESCE(lt_last.username, lt_author.username) AS latest_poster_name,
  COALESCE(lt_last.avatar_letter, lt_author.avatar_letter) AS latest_poster_avatar,
  COALESCE(lt_last.avatar_color, lt_author.avatar_color) AS latest_poster_color,
  COALESCE(lt.last_reply_at, lt.created_at) AS latest_activity_at
FROM public.categories c
JOIN public.sections s ON c.section_id = s.id
LEFT JOIN LATERAL (
  SELECT t.id, t.title, t.created_at, t.author_id, t.last_reply_by, t.last_reply_at
  FROM public.topics t
  WHERE t.category_id = c.id
  ORDER BY COALESCE(t.last_reply_at, t.created_at) DESC
  LIMIT 1
) lt ON true
LEFT JOIN public.profiles lt_author ON lt.author_id = lt_author.user_id
LEFT JOIN public.profiles lt_last ON lt.last_reply_by = lt_last.user_id
ORDER BY s.sort_order, c.sort_order;

-- 1.9 RPC function for incrementing views
CREATE OR REPLACE FUNCTION public.increment_topic_views(p_topic_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.topics SET views = views + 1 WHERE id = p_topic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.10 Seed data

-- Sections
INSERT INTO public.sections (id, name, sort_order) VALUES
  ('pixel', 'Pixel', 1),
  ('guides', 'Guides', 2),
  ('safety', 'Safety & Policy', 3),
  ('community', 'Community', 4),
  ('development', 'Development', 5),
  ('management', 'Management', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Categories
INSERT INTO public.categories (id, section_id, name, description, icon, show_scam_alert, sort_order) VALUES
  ('announcements',    'pixel',       'Announcements',         'Client updates, site news, development blog',  '&#128226;', true,  1),
  ('client-support',   'pixel',       'Client Support',        'Errors, bugs, setup help, suggestions',        '&#128736;', false, 2),
  ('site-support',     'pixel',       'Site Support',          'Billing, account access, refunds',             '&#128179;', false, 3),
  ('getting-started',  'guides',      'Getting Started',       'Install, first run, quick setup',              '&#128216;', false, 1),
  ('calibration',      'guides',      'Calibration & Anchors', 'ROI setup and anchor capture',                 '&#127919;', false, 2),
  ('detection',        'guides',      'Detection & Templates', 'Template packs, detection configs',            '&#129513;', false, 3),
  ('safety-gates',     'safety',      'Safety Gates',          'Commit thresholds, cooldown, hysteresis',      '&#128737;', false, 1),
  ('input-safeguards', 'safety',      'Input Safeguards',      'Assist mode, rate limits, kill switch',        '&#9000;',   false, 2),
  ('acceptable-use',   'safety',      'Acceptable Use',        'Rules and usage boundaries',                   '&#9989;',   false, 3),
  ('general',          'community',   'General Discussion',    'Introductions, tech, ideas',                   '&#128172;', false, 1),
  ('requests',         'community',   'Requests',              'Feature and plugin requests',                  '&#129514;', false, 2),
  ('ui-console',       'development', 'UI Console',            'Runtime UI, status, logs',                     '&#129504;', false, 1),
  ('telemetry',        'development', 'Telemetry & Replay',    'Audit logs, replay tools',                     '&#128200;', false, 2),
  ('disputes',         'management',  'Disputes',              'Resolved cases',                               '&#9878;',   false, 1),
  ('appeals',          'management',  'Appeals',               'Resolved cases',                               '&#128221;', false, 2)
ON CONFLICT (id) DO UPDATE SET
  section_id = EXCLUDED.section_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  show_scam_alert = EXCLUDED.show_scam_alert,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- 2.0 Role-Based Access Control Migration
-- =============================================

-- 2.1 Add role column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member';

-- 2.2 Recreate topics_with_authors view to include author_role
-- (DROP required because CREATE OR REPLACE can't insert columns in the middle)
DROP VIEW IF EXISTS public.topics_with_authors;
CREATE VIEW public.topics_with_authors AS
SELECT
  t.*,
  p.username AS author_name,
  p.avatar_letter AS author_avatar,
  p.avatar_color AS author_color,
  p.created_at AS author_join_date,
  p.post_count AS author_posts,
  p.role AS author_role,
  lp.username AS last_poster_name,
  lp.avatar_letter AS last_poster_avatar,
  lp.avatar_color AS last_poster_color
FROM public.topics t
LEFT JOIN public.profiles p ON t.author_id = p.user_id
LEFT JOIN public.profiles lp ON t.last_reply_by = lp.user_id;

-- 2.3 Update replies_with_authors view to include author_role
CREATE OR REPLACE VIEW public.replies_with_authors AS
SELECT
  r.*,
  p.username AS author_name,
  p.avatar_letter AS author_avatar,
  p.avatar_color AS author_color,
  p.created_at AS author_join_date,
  p.post_count AS author_posts,
  p.role AS author_role
FROM public.replies r
LEFT JOIN public.profiles p ON r.author_id = p.user_id;

-- 2.4 RLS policies for profiles

-- Everyone can read profiles (needed for views/badges)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update own profile but NOT change their role
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()));

-- Admins can update any profile (including role)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- 3.0 Forum Moderation System
-- =============================================

-- 3.1 Add moderation columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ban_reason TEXT,
  ADD COLUMN IF NOT EXISTS warning_count INTEGER DEFAULT 0;

-- 3.2 Add soft-delete columns to topics and replies
ALTER TABLE public.topics
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

ALTER TABLE public.replies
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- 3.3 Warnings table
CREATE TABLE IF NOT EXISTS public.warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  warned_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can read warnings" ON public.warnings;
CREATE POLICY "Staff can read warnings"
  ON public.warnings FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

DROP POLICY IF EXISTS "Staff can insert warnings" ON public.warnings;
CREATE POLICY "Staff can insert warnings"
  ON public.warnings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- 3.4 Mod actions log table
CREATE TABLE IF NOT EXISTS public.mod_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  mod_id UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mod_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can read mod actions" ON public.mod_actions;
CREATE POLICY "Staff can read mod actions"
  ON public.mod_actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

DROP POLICY IF EXISTS "Staff can insert mod actions" ON public.mod_actions;
CREATE POLICY "Staff can insert mod actions"
  ON public.mod_actions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- 3.5 RLS: Mod/admin can update any topic (for lock/pin/soft-delete)
DROP POLICY IF EXISTS "Staff can update any topic" ON public.topics;
CREATE POLICY "Staff can update any topic"
  ON public.topics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- 3.6 RLS: Mod/admin can update any reply (for soft-delete)
DROP POLICY IF EXISTS "Staff can update any reply" ON public.replies;
CREATE POLICY "Staff can update any reply"
  ON public.replies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- 3.7 RLS: Block banned users from creating topics
DROP POLICY IF EXISTS "Authenticated users can create topics" ON public.topics;
CREATE POLICY "Authenticated users can create topics"
  ON public.topics FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND banned = true
    )
  );

-- 3.8 RLS: Block banned users from creating replies
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.replies;
CREATE POLICY "Authenticated users can create replies"
  ON public.replies FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.topics WHERE id = topic_id AND locked = true
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND banned = true
    )
  );

-- 3.9 RPC: Soft delete topic
CREATE OR REPLACE FUNCTION public.soft_delete_topic(p_topic_id UUID)
RETURNS VOID AS $$
DECLARE
  _caller_role TEXT;
  _topic RECORD;
BEGIN
  SELECT role INTO _caller_role FROM public.profiles WHERE user_id = auth.uid();
  IF _caller_role NOT IN ('moderator', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO _topic FROM public.topics WHERE id = p_topic_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Topic not found';
  END IF;

  UPDATE public.topics SET deleted_at = now(), deleted_by = auth.uid() WHERE id = p_topic_id;

  -- Adjust category counters
  UPDATE public.categories
    SET topic_count = GREATEST(topic_count - 1, 0),
        post_count = GREATEST(post_count - _topic.reply_count, 0)
    WHERE id = _topic.category_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.10 RPC: Soft delete reply
CREATE OR REPLACE FUNCTION public.soft_delete_reply(p_reply_id UUID)
RETURNS VOID AS $$
DECLARE
  _caller_role TEXT;
  _reply RECORD;
  _last_reply RECORD;
BEGIN
  SELECT role INTO _caller_role FROM public.profiles WHERE user_id = auth.uid();
  IF _caller_role NOT IN ('moderator', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO _reply FROM public.replies WHERE id = p_reply_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reply not found';
  END IF;

  UPDATE public.replies SET deleted_at = now(), deleted_by = auth.uid() WHERE id = p_reply_id;

  -- Adjust topic reply count
  UPDATE public.topics
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE id = _reply.topic_id;

  -- Adjust category post count
  UPDATE public.categories
    SET post_count = GREATEST(post_count - 1, 0)
    WHERE id = (SELECT category_id FROM public.topics WHERE id = _reply.topic_id);

  -- Recalculate last reply (exclude soft-deleted)
  SELECT created_at, author_id INTO _last_reply
    FROM public.replies
    WHERE topic_id = _reply.topic_id AND deleted_at IS NULL AND id != p_reply_id
    ORDER BY created_at DESC
    LIMIT 1;

  IF FOUND THEN
    UPDATE public.topics
      SET last_reply_at = _last_reply.created_at,
          last_reply_by = _last_reply.author_id
      WHERE id = _reply.topic_id;
  ELSE
    UPDATE public.topics
      SET last_reply_at = NULL,
          last_reply_by = NULL
      WHERE id = _reply.topic_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.11 RPC: Warn user (auto-ban at 3)
CREATE OR REPLACE FUNCTION public.warn_user(p_user_id UUID, p_reason TEXT)
RETURNS VOID AS $$
DECLARE
  _caller_role TEXT;
  _new_count INTEGER;
BEGIN
  SELECT role INTO _caller_role FROM public.profiles WHERE user_id = auth.uid();
  IF _caller_role NOT IN ('moderator', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.warnings (user_id, reason, warned_by)
  VALUES (p_user_id, p_reason, auth.uid());

  UPDATE public.profiles
    SET warning_count = warning_count + 1
    WHERE user_id = p_user_id
    RETURNING warning_count INTO _new_count;

  -- Auto-ban at 3 warnings
  IF _new_count >= 3 THEN
    UPDATE public.profiles
      SET banned = true, ban_reason = 'Automatically banned after 3 warnings'
      WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.12 RPC: Ban user
CREATE OR REPLACE FUNCTION public.ban_user(p_user_id UUID, p_reason TEXT)
RETURNS VOID AS $$
DECLARE
  _caller_role TEXT;
BEGIN
  SELECT role INTO _caller_role FROM public.profiles WHERE user_id = auth.uid();
  IF _caller_role NOT IN ('moderator', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.profiles
    SET banned = true, ban_reason = p_reason
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.13 RPC: Unban user
CREATE OR REPLACE FUNCTION public.unban_user(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  _caller_role TEXT;
BEGIN
  SELECT role INTO _caller_role FROM public.profiles WHERE user_id = auth.uid();
  IF _caller_role NOT IN ('moderator', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.profiles
    SET banned = false, ban_reason = NULL
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.14 Recreate views to include moderation fields

-- topics_with_authors: add deleted_at, deleted_by, author_banned, author_warning_count
DROP VIEW IF EXISTS public.topics_with_authors;
CREATE VIEW public.topics_with_authors AS
SELECT
  t.*,
  p.username AS author_name,
  p.avatar_letter AS author_avatar,
  p.avatar_color AS author_color,
  p.created_at AS author_join_date,
  p.post_count AS author_posts,
  p.role AS author_role,
  p.banned AS author_banned,
  p.warning_count AS author_warning_count,
  lp.username AS last_poster_name,
  lp.avatar_letter AS last_poster_avatar,
  lp.avatar_color AS last_poster_color,
  lp.role AS last_poster_role
FROM public.topics t
LEFT JOIN public.profiles p ON t.author_id = p.user_id
LEFT JOIN public.profiles lp ON t.last_reply_by = lp.user_id;

-- replies_with_authors: add deleted_at, deleted_by, author_banned, author_warning_count
DROP VIEW IF EXISTS public.replies_with_authors;
CREATE VIEW public.replies_with_authors AS
SELECT
  r.*,
  p.username AS author_name,
  p.avatar_letter AS author_avatar,
  p.avatar_color AS author_color,
  p.created_at AS author_join_date,
  p.post_count AS author_posts,
  p.role AS author_role,
  p.banned AS author_banned,
  p.warning_count AS author_warning_count
FROM public.replies r
LEFT JOIN public.profiles p ON r.author_id = p.user_id;

-- categories_with_latest: filter out soft-deleted topics
DROP VIEW IF EXISTS public.categories_with_latest;
CREATE VIEW public.categories_with_latest AS
SELECT
  c.*,
  s.name AS section_name,
  s.sort_order AS section_sort_order,
  lt.id AS latest_topic_id,
  lt.title AS latest_topic_title,
  lt.created_at AS latest_topic_date,
  lt_author.username AS latest_topic_author,
  lt_author.avatar_letter AS latest_topic_avatar,
  lt_author.avatar_color AS latest_topic_color,
  COALESCE(lt_last.username, lt_author.username) AS latest_poster_name,
  COALESCE(lt_last.avatar_letter, lt_author.avatar_letter) AS latest_poster_avatar,
  COALESCE(lt_last.avatar_color, lt_author.avatar_color) AS latest_poster_color,
  COALESCE(lt_last.role, lt_author.role) AS latest_poster_role,
  COALESCE(lt.last_reply_at, lt.created_at) AS latest_activity_at
FROM public.categories c
JOIN public.sections s ON c.section_id = s.id
LEFT JOIN LATERAL (
  SELECT t.id, t.title, t.created_at, t.author_id, t.last_reply_by, t.last_reply_at
  FROM public.topics t
  WHERE t.category_id = c.id AND t.deleted_at IS NULL
  ORDER BY COALESCE(t.last_reply_at, t.created_at) DESC
  LIMIT 1
) lt ON true
LEFT JOIN public.profiles lt_author ON lt.author_id = lt_author.user_id
LEFT JOIN public.profiles lt_last ON lt.last_reply_by = lt_last.user_id
ORDER BY s.sort_order, c.sort_order;

-- =============================================
-- 4.0 Dynamic Content Migration
-- =============================================

-- 4.1 Add last_seen column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ;

-- 4.2 RPC: update_last_seen (fire-and-forget, called on auth)
CREATE OR REPLACE FUNCTION public.update_last_seen()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles SET last_seen = now() WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.3 RPC: get_online_users (last 5 minutes)
CREATE OR REPLACE FUNCTION public.get_online_users()
RETURNS TABLE(user_id UUID, username TEXT, avatar_letter TEXT, avatar_color TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
    SELECT p.user_id, p.username, p.avatar_letter, p.avatar_color, p.role
    FROM public.profiles p
    WHERE p.last_seen > now() - interval '5 minutes'
    ORDER BY p.last_seen DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.4 RPC: get_previously_active_users (5 min to 24 hrs)
CREATE OR REPLACE FUNCTION public.get_previously_active_users()
RETURNS TABLE(user_id UUID, username TEXT, avatar_letter TEXT, avatar_color TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
    SELECT p.user_id, p.username, p.avatar_letter, p.avatar_color, p.role
    FROM public.profiles p
    WHERE p.last_seen <= now() - interval '5 minutes'
      AND p.last_seen > now() - interval '24 hours'
    ORDER BY p.last_seen DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.5 RPC: get_top_contributors (topics + replies in period)
CREATE OR REPLACE FUNCTION public.get_top_contributors(p_period TEXT DEFAULT 'week', p_limit INTEGER DEFAULT 5)
RETURNS TABLE(user_id UUID, username TEXT, avatar_letter TEXT, avatar_color TEXT, role TEXT, post_total BIGINT) AS $$
DECLARE
  _since TIMESTAMPTZ;
BEGIN
  CASE p_period
    WHEN 'week' THEN _since := now() - interval '7 days';
    WHEN 'month' THEN _since := now() - interval '30 days';
    WHEN 'year' THEN _since := now() - interval '365 days';
    ELSE _since := '1970-01-01'::TIMESTAMPTZ;
  END CASE;

  RETURN QUERY
    SELECT p.user_id, p.username, p.avatar_letter, p.avatar_color, p.role,
           COALESCE(t.cnt, 0) + COALESCE(r.cnt, 0) AS post_total
    FROM public.profiles p
    LEFT JOIN (
      SELECT author_id, COUNT(*) AS cnt FROM public.topics
      WHERE created_at >= _since AND deleted_at IS NULL
      GROUP BY author_id
    ) t ON t.author_id = p.user_id
    LEFT JOIN (
      SELECT author_id, COUNT(*) AS cnt FROM public.replies
      WHERE created_at >= _since AND deleted_at IS NULL
      GROUP BY author_id
    ) r ON r.author_id = p.user_id
    WHERE COALESCE(t.cnt, 0) + COALESCE(r.cnt, 0) > 0
    ORDER BY post_total DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.6 RPC: search_forum (ILIKE on topics + replies)
CREATE OR REPLACE FUNCTION public.search_forum(p_query TEXT, p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
  result_type TEXT,
  id UUID,
  title TEXT,
  snippet TEXT,
  category_id TEXT,
  topic_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  author_color TEXT,
  author_role TEXT,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  _pattern TEXT := '%' || p_query || '%';
BEGIN
  RETURN QUERY
    (
      SELECT
        'topic'::TEXT AS result_type,
        t.id,
        t.title,
        LEFT(t.content, 200) AS snippet,
        t.category_id,
        NULL::UUID AS topic_id,
        p.username AS author_name,
        p.avatar_letter AS author_avatar,
        p.avatar_color AS author_color,
        p.role AS author_role,
        t.created_at
      FROM public.topics t
      LEFT JOIN public.profiles p ON t.author_id = p.user_id
      WHERE t.deleted_at IS NULL
        AND (t.title ILIKE _pattern OR t.content ILIKE _pattern)
      ORDER BY t.created_at DESC
      LIMIT p_limit
    )
    UNION ALL
    (
      SELECT
        'reply'::TEXT AS result_type,
        r.id,
        t.title,
        LEFT(r.content, 200) AS snippet,
        t.category_id,
        r.topic_id,
        p.username AS author_name,
        p.avatar_letter AS author_avatar,
        p.avatar_color AS author_color,
        p.role AS author_role,
        r.created_at
      FROM public.replies r
      LEFT JOIN public.topics t ON r.topic_id = t.id
      LEFT JOIN public.profiles p ON r.author_id = p.user_id
      WHERE r.deleted_at IS NULL AND t.deleted_at IS NULL
        AND r.content ILIKE _pattern
      ORDER BY r.created_at DESC
      LIMIT p_limit
    )
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.7 Support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Support',
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  is_priority BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own tickets" ON public.support_tickets;
CREATE POLICY "Users can read own tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create tickets" ON public.support_tickets;
CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can read all tickets" ON public.support_tickets;
CREATE POLICY "Staff can read all tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

DROP POLICY IF EXISTS "Staff can update tickets" ON public.support_tickets;
CREATE POLICY "Staff can update tickets"
  ON public.support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- 4.8 Releases table
CREATE TABLE IF NOT EXISTS public.releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  filename TEXT NOT NULL,
  download_url TEXT DEFAULT '',
  release_notes TEXT DEFAULT '',
  is_latest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Releases are viewable by everyone" ON public.releases;
CREATE POLICY "Releases are viewable by everyone"
  ON public.releases FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage releases" ON public.releases;
CREATE POLICY "Admins can manage releases"
  ON public.releases FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Seed releases
INSERT INTO public.releases (version, filename, download_url, release_notes, is_latest, created_at) VALUES
  ('2.4.1', 'pixel-loader-2.4.1.exe', '', 'Bug fixes and stability improvements', true, '2026-02-01T00:00:00Z'),
  ('2.4.0', 'pixel-loader-2.4.0.exe', '', 'New safety gate UI, improved detection', false, '2026-01-15T00:00:00Z'),
  ('2.3.2', 'pixel-loader-2.3.2.exe', '', 'Hotfix for calibration regression', false, '2025-12-20T00:00:00Z'),
  ('2.3.1', 'pixel-loader-2.3.1.exe', '', 'Template pack support, telemetry updates', false, '2025-12-05T00:00:00Z')
ON CONFLICT DO NOTHING;

-- 4.9 Follows table
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can count follows" ON public.follows;
CREATE POLICY "Anyone can count follows"
  ON public.follows FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create follows" ON public.follows;
CREATE POLICY "Users can create follows"
  ON public.follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own follows" ON public.follows;
CREATE POLICY "Users can delete own follows"
  ON public.follows FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4.10 RPC: toggle_follow (insert or delete)
CREATE OR REPLACE FUNCTION public.toggle_follow(p_target_type TEXT, p_target_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  _exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.follows
    WHERE user_id = auth.uid() AND target_type = p_target_type AND target_id = p_target_id
  ) INTO _exists;

  IF _exists THEN
    DELETE FROM public.follows
    WHERE user_id = auth.uid() AND target_type = p_target_type AND target_id = p_target_id;
    RETURN false;
  ELSE
    INSERT INTO public.follows (user_id, target_type, target_id)
    VALUES (auth.uid(), p_target_type, p_target_id);
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.11 RPC: get_follow_count
CREATE OR REPLACE FUNCTION public.get_follow_count(p_target_type TEXT, p_target_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  _count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO _count
  FROM public.follows
  WHERE target_type = p_target_type AND target_id = p_target_id;
  RETURN _count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.12 RPC: is_following
CREATE OR REPLACE FUNCTION public.is_following(p_target_type TEXT, p_target_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.follows
    WHERE user_id = auth.uid() AND target_type = p_target_type AND target_id = p_target_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5.0 Private Category Visibility
-- =============================================

-- 5.1 Add visibility column to categories
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public';

-- Mark disputes and appeals as private
UPDATE public.categories SET visibility = 'private' WHERE id IN ('disputes', 'appeals');

-- 5.2 Helper functions for role checks (STABLE SECURITY DEFINER for performance)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN 'guest'; END IF;
  RETURN COALESCE(
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()),
    'guest'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role() IN ('moderator', 'admin');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 5.3 Update categories SELECT RLS — hide staff categories from non-staff
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (
    visibility IN ('public', 'private')
    OR public.is_staff()
  );

-- 5.4 Update topics SELECT RLS — public=all, private=own+staff, staff=staff-only
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON public.topics;
CREATE POLICY "Topics are viewable by everyone"
  ON public.topics FOR SELECT
  USING (
    CASE (SELECT visibility FROM public.categories WHERE id = category_id)
      WHEN 'public' THEN true
      WHEN 'private' THEN (auth.uid() = author_id OR public.is_staff())
      WHEN 'staff' THEN public.is_staff()
      ELSE true
    END
  );

-- 5.5 Update replies SELECT RLS — same logic, plus topic-author can see all replies on their topic
DROP POLICY IF EXISTS "Replies are viewable by everyone" ON public.replies;
CREATE POLICY "Replies are viewable by everyone"
  ON public.replies FOR SELECT
  USING (
    CASE (SELECT c.visibility FROM public.categories c JOIN public.topics t ON t.category_id = c.id WHERE t.id = topic_id)
      WHEN 'public' THEN true
      WHEN 'private' THEN (
        auth.uid() = author_id
        OR auth.uid() = (SELECT author_id FROM public.topics WHERE id = topic_id)
        OR public.is_staff()
      )
      WHEN 'staff' THEN public.is_staff()
      ELSE true
    END
  );

-- 5.6 Update topics INSERT RLS — staff categories restricted to staff
DROP POLICY IF EXISTS "Authenticated users can create topics" ON public.topics;
CREATE POLICY "Authenticated users can create topics"
  ON public.topics FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND banned = true
    )
    AND (
      (SELECT visibility FROM public.categories WHERE id = category_id) != 'staff'
      OR public.is_staff()
    )
  );

-- 5.7 Update replies INSERT RLS — staff categories restricted to staff
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.replies;
CREATE POLICY "Authenticated users can create replies"
  ON public.replies FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM public.topics WHERE id = topic_id AND locked = true
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND banned = true
    )
    AND (
      (SELECT c.visibility FROM public.categories c JOIN public.topics t ON t.category_id = c.id WHERE t.id = topic_id) != 'staff'
      OR public.is_staff()
    )
  );

-- 5.8 Enable security_invoker on views so they respect calling user's RLS
ALTER VIEW public.topics_with_authors SET (security_invoker = on);
ALTER VIEW public.replies_with_authors SET (security_invoker = on);

-- 5.9 Recreate categories_with_latest with security_invoker
-- (Must DROP + CREATE because ALTER VIEW doesn't support security_invoker on views with LATERAL joins)
DROP VIEW IF EXISTS public.categories_with_latest;
CREATE VIEW public.categories_with_latest
  WITH (security_invoker = on)
AS
SELECT
  c.*,
  s.name AS section_name,
  s.sort_order AS section_sort_order,
  lt.id AS latest_topic_id,
  lt.title AS latest_topic_title,
  lt.created_at AS latest_topic_date,
  lt_author.username AS latest_topic_author,
  lt_author.avatar_letter AS latest_topic_avatar,
  lt_author.avatar_color AS latest_topic_color,
  COALESCE(lt_last.username, lt_author.username) AS latest_poster_name,
  COALESCE(lt_last.avatar_letter, lt_author.avatar_letter) AS latest_poster_avatar,
  COALESCE(lt_last.avatar_color, lt_author.avatar_color) AS latest_poster_color,
  COALESCE(lt_last.role, lt_author.role) AS latest_poster_role,
  COALESCE(lt.last_reply_at, lt.created_at) AS latest_activity_at
FROM public.categories c
JOIN public.sections s ON c.section_id = s.id
LEFT JOIN LATERAL (
  SELECT t.id, t.title, t.created_at, t.author_id, t.last_reply_by, t.last_reply_at
  FROM public.topics t
  WHERE t.category_id = c.id AND t.deleted_at IS NULL
  ORDER BY COALESCE(t.last_reply_at, t.created_at) DESC
  LIMIT 1
) lt ON true
LEFT JOIN public.profiles lt_author ON lt.author_id = lt_author.user_id
LEFT JOIN public.profiles lt_last ON lt.last_reply_by = lt_last.user_id
ORDER BY s.sort_order, c.sort_order;

-- 5.10 Update search_forum RPC — add inline visibility filtering
CREATE OR REPLACE FUNCTION public.search_forum(p_query TEXT, p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
  result_type TEXT,
  id UUID,
  title TEXT,
  snippet TEXT,
  category_id TEXT,
  topic_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  author_color TEXT,
  author_role TEXT,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  _pattern TEXT := '%' || p_query || '%';
  _uid UUID := auth.uid();
  _is_staff BOOLEAN := public.is_staff();
BEGIN
  RETURN QUERY
    (
      SELECT
        'topic'::TEXT AS result_type,
        t.id,
        t.title,
        LEFT(t.content, 200) AS snippet,
        t.category_id,
        NULL::UUID AS topic_id,
        p.username AS author_name,
        p.avatar_letter AS author_avatar,
        p.avatar_color AS author_color,
        p.role AS author_role,
        t.created_at
      FROM public.topics t
      LEFT JOIN public.profiles p ON t.author_id = p.user_id
      LEFT JOIN public.categories c ON t.category_id = c.id
      WHERE t.deleted_at IS NULL
        AND (t.title ILIKE _pattern OR t.content ILIKE _pattern)
        AND (
          c.visibility = 'public'
          OR (c.visibility = 'private' AND (_uid = t.author_id OR _is_staff))
          OR (c.visibility = 'staff' AND _is_staff)
        )
      ORDER BY t.created_at DESC
      LIMIT p_limit
    )
    UNION ALL
    (
      SELECT
        'reply'::TEXT AS result_type,
        r.id,
        t.title,
        LEFT(r.content, 200) AS snippet,
        t.category_id,
        r.topic_id,
        p.username AS author_name,
        p.avatar_letter AS author_avatar,
        p.avatar_color AS author_color,
        p.role AS author_role,
        r.created_at
      FROM public.replies r
      LEFT JOIN public.topics t ON r.topic_id = t.id
      LEFT JOIN public.profiles p ON r.author_id = p.user_id
      LEFT JOIN public.categories c ON t.category_id = c.id
      WHERE r.deleted_at IS NULL AND t.deleted_at IS NULL
        AND r.content ILIKE _pattern
        AND (
          c.visibility = 'public'
          OR (c.visibility = 'private' AND (_uid = t.author_id OR _uid = r.author_id OR _is_staff))
          OR (c.visibility = 'staff' AND _is_staff)
        )
      ORDER BY r.created_at DESC
      LIMIT p_limit
    )
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Performance Indexes
-- =============================================

CREATE INDEX IF NOT EXISTS idx_topics_category_id ON public.topics(category_id);
CREATE INDEX IF NOT EXISTS idx_topics_author_id ON public.topics(author_id);
CREATE INDEX IF NOT EXISTS idx_topics_deleted_at ON public.topics(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON public.topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_last_reply_at ON public.topics(last_reply_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_replies_topic_id ON public.replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_replies_author_id ON public.replies(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_deleted_at ON public.replies(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_follows_user_target ON public.follows(user_id, target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

CREATE INDEX IF NOT EXISTS idx_warnings_user_id ON public.warnings(user_id);

-- =============================================
-- Auto-update updated_at trigger
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_topics_updated_at ON public.topics;
CREATE TRIGGER set_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_replies_updated_at ON public.replies;
CREATE TRIGGER set_replies_updated_at
  BEFORE UPDATE ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
