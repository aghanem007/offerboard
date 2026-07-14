-- ============================================================
-- Offerboard — database schema
--
-- Single idempotent migration. Run against a fresh Supabase
-- project via the SQL Editor (or `supabase db push`).
--
-- Design notes:
--   * Post content is stored as plain text with markdown-lite
--     markers. Rendering (and escaping) happens client-side.
--   * Roles live on profiles: member | moderator | admin.
--     "guest" is simply the absence of a session, never stored.
--   * Counts on categories/topics/profiles are denormalized and
--     maintained by triggers so list pages never need aggregates.
--   * Views use security_invoker so RLS applies to the caller.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tables
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT NOT NULL CHECK (char_length(username) BETWEEN 1 AND 40),
  avatar_letter TEXT NOT NULL DEFAULT '?',
  avatar_color  TEXT NOT NULL DEFAULT 'blue',
  role          TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  post_count    INTEGER NOT NULL DEFAULT 0,
  banned        BOOLEAN NOT NULL DEFAULT false,
  ban_reason    TEXT,
  warning_count INTEGER NOT NULL DEFAULT 0,
  last_seen     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sections (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.categories (
  id          TEXT PRIMARY KEY,
  section_id  TEXT NOT NULL REFERENCES public.sections(id),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  visibility  TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'staff')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  topic_count INTEGER NOT NULL DEFAULT 0,
  post_count  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.topics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   TEXT NOT NULL REFERENCES public.categories(id),
  title         TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  content       TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 50000),
  author_id     UUID NOT NULL REFERENCES auth.users(id),
  pinned        BOOLEAN NOT NULL DEFAULT false,
  locked        BOOLEAN NOT NULL DEFAULT false,
  views         INTEGER NOT NULL DEFAULT 0,
  reply_count   INTEGER NOT NULL DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  last_reply_by UUID REFERENCES auth.users(id),
  deleted_at    TIMESTAMPTZ,
  deleted_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.replies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id   UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  content    TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 50000),
  author_id  UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.warnings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id),
  reason     TEXT NOT NULL,
  warned_by  UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mod_actions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('topic', 'reply', 'user')),
  mod_id      UUID NOT NULL REFERENCES auth.users(id),
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.follows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('category', 'topic')),
  target_id   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

-- ------------------------------------------------------------
-- 2. Role helpers
--
-- STABLE + SECURITY DEFINER so RLS policies can call them without
-- recursing into profiles' own policies. search_path is pinned to
-- prevent hijacking via user-created schemas.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 'guest';
  END IF;
  RETURN COALESCE(
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()),
    'guest'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.get_user_role() IN ('moderator', 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.get_user_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_banned()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(
    (SELECT banned FROM public.profiles WHERE user_id = auth.uid()),
    false
  );
$$;

-- ------------------------------------------------------------
-- 3. Row Level Security
-- ------------------------------------------------------------

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warnings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mod_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows     ENABLE ROW LEVEL SECURITY;

-- profiles: readable by everyone (usernames/badges appear all over the UI)
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- profiles: users may update their own row, but not privileged columns
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND role   = public.get_user_role()
    AND banned = public.is_banned()
  );

-- profiles: admins may update anything (role changes, etc.)
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- sections: public read
DROP POLICY IF EXISTS "sections_select_all" ON public.sections;
CREATE POLICY "sections_select_all"
  ON public.sections FOR SELECT
  USING (true);

-- categories: staff-only categories are hidden from everyone else
DROP POLICY IF EXISTS "categories_select" ON public.categories;
CREATE POLICY "categories_select"
  ON public.categories FOR SELECT
  USING (visibility = 'public' OR public.is_staff());

-- topics: visible when their category is
DROP POLICY IF EXISTS "topics_select" ON public.topics;
CREATE POLICY "topics_select"
  ON public.topics FOR SELECT
  USING (
    (SELECT visibility FROM public.categories WHERE id = category_id) = 'public'
    OR public.is_staff()
  );

-- topics: members can post unless banned; staff categories are staff-only
DROP POLICY IF EXISTS "topics_insert" ON public.topics;
CREATE POLICY "topics_insert"
  ON public.topics FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND NOT public.is_banned()
    AND (
      (SELECT visibility FROM public.categories WHERE id = category_id) = 'public'
      OR public.is_staff()
    )
  );

-- topics: authors may edit their own; staff may edit any (pin/lock/soft-delete)
DROP POLICY IF EXISTS "topics_update_own" ON public.topics;
CREATE POLICY "topics_update_own"
  ON public.topics FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "topics_update_staff" ON public.topics;
CREATE POLICY "topics_update_staff"
  ON public.topics FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- replies: visible when their topic's category is
DROP POLICY IF EXISTS "replies_select" ON public.replies;
CREATE POLICY "replies_select"
  ON public.replies FOR SELECT
  USING (
    (SELECT c.visibility
       FROM public.categories c
       JOIN public.topics t ON t.category_id = c.id
      WHERE t.id = topic_id) = 'public'
    OR public.is_staff()
  );

-- replies: members can reply unless banned or the topic is locked
DROP POLICY IF EXISTS "replies_insert" ON public.replies;
CREATE POLICY "replies_insert"
  ON public.replies FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND NOT public.is_banned()
    AND NOT EXISTS (
      SELECT 1 FROM public.topics WHERE id = topic_id AND locked = true
    )
    AND (
      (SELECT c.visibility
         FROM public.categories c
         JOIN public.topics t ON t.category_id = c.id
        WHERE t.id = topic_id) = 'public'
      OR public.is_staff()
    )
  );

DROP POLICY IF EXISTS "replies_update_own" ON public.replies;
CREATE POLICY "replies_update_own"
  ON public.replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "replies_update_staff" ON public.replies;
CREATE POLICY "replies_update_staff"
  ON public.replies FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- warnings + mod_actions: staff only
DROP POLICY IF EXISTS "warnings_select_staff" ON public.warnings;
CREATE POLICY "warnings_select_staff"
  ON public.warnings FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS "warnings_insert_staff" ON public.warnings;
CREATE POLICY "warnings_insert_staff"
  ON public.warnings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "mod_actions_select_staff" ON public.mod_actions;
CREATE POLICY "mod_actions_select_staff"
  ON public.mod_actions FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS "mod_actions_insert_staff" ON public.mod_actions;
CREATE POLICY "mod_actions_insert_staff"
  ON public.mod_actions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff() AND mod_id = auth.uid());

-- follows: counts are public, rows are user-owned
DROP POLICY IF EXISTS "follows_select_all" ON public.follows;
CREATE POLICY "follows_select_all"
  ON public.follows FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "follows_insert_own" ON public.follows;
CREATE POLICY "follows_insert_own"
  ON public.follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "follows_delete_own" ON public.follows;
CREATE POLICY "follows_delete_own"
  ON public.follows FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. Triggers
-- ------------------------------------------------------------

-- Create a profile whenever an auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _name   TEXT;
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
    LEFT(_name, 40),
    UPPER(LEFT(_name, 1)),
    _colors[1 + floor(random() * 8)::int]
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Denormalized counters
CREATE OR REPLACE FUNCTION public.handle_new_topic()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.categories
     SET topic_count = topic_count + 1
   WHERE id = NEW.category_id;
  UPDATE public.profiles
     SET post_count = post_count + 1
   WHERE user_id = NEW.author_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_topic_created ON public.topics;
CREATE TRIGGER on_topic_created
  AFTER INSERT ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_topic();

CREATE OR REPLACE FUNCTION public.handle_topic_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.categories
     SET topic_count = GREATEST(topic_count - 1, 0),
         post_count  = GREATEST(post_count - OLD.reply_count, 0)
   WHERE id = OLD.category_id;
  UPDATE public.profiles
     SET post_count = GREATEST(post_count - 1, 0)
   WHERE user_id = OLD.author_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_topic_deleted ON public.topics;
CREATE TRIGGER on_topic_deleted
  AFTER DELETE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_topic_deleted();

CREATE OR REPLACE FUNCTION public.handle_new_reply()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.topics
     SET reply_count   = reply_count + 1,
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
$$;

DROP TRIGGER IF EXISTS on_reply_created ON public.replies;
CREATE TRIGGER on_reply_created
  AFTER INSERT ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_reply();

CREATE OR REPLACE FUNCTION public.handle_reply_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _last_reply RECORD;
BEGIN
  UPDATE public.topics
     SET reply_count = GREATEST(reply_count - 1, 0)
   WHERE id = OLD.topic_id;

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
$$;

DROP TRIGGER IF EXISTS on_reply_deleted ON public.replies;
CREATE TRIGGER on_reply_deleted
  AFTER DELETE ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_reply_deleted();

-- Keep updated_at current
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_topics_updated_at ON public.topics;
CREATE TRIGGER set_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_replies_updated_at ON public.replies;
CREATE TRIGGER set_replies_updated_at
  BEFORE UPDATE ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------
-- 5. Views (security_invoker: RLS applies to the querying user)
-- ------------------------------------------------------------

DROP VIEW IF EXISTS public.topics_with_authors;
CREATE VIEW public.topics_with_authors
  WITH (security_invoker = on)
AS
SELECT
  t.*,
  p.username       AS author_name,
  p.avatar_letter  AS author_avatar,
  p.avatar_color   AS author_color,
  p.created_at     AS author_join_date,
  p.post_count     AS author_posts,
  p.role           AS author_role,
  lp.username      AS last_poster_name,
  lp.avatar_letter AS last_poster_avatar,
  lp.avatar_color  AS last_poster_color,
  lp.role          AS last_poster_role
FROM public.topics t
LEFT JOIN public.profiles p  ON t.author_id = p.user_id
LEFT JOIN public.profiles lp ON t.last_reply_by = lp.user_id;

DROP VIEW IF EXISTS public.replies_with_authors;
CREATE VIEW public.replies_with_authors
  WITH (security_invoker = on)
AS
SELECT
  r.*,
  p.username      AS author_name,
  p.avatar_letter AS author_avatar,
  p.avatar_color  AS author_color,
  p.created_at    AS author_join_date,
  p.post_count    AS author_posts,
  p.role          AS author_role
FROM public.replies r
LEFT JOIN public.profiles p ON r.author_id = p.user_id;

DROP VIEW IF EXISTS public.categories_with_latest;
CREATE VIEW public.categories_with_latest
  WITH (security_invoker = on)
AS
SELECT
  c.*,
  s.name       AS section_name,
  s.sort_order AS section_sort_order,
  lt.id         AS latest_topic_id,
  lt.title      AS latest_topic_title,
  lt.created_at AS latest_topic_date,
  COALESCE(lt_last.username, lt_author.username)           AS latest_poster_name,
  COALESCE(lt_last.avatar_letter, lt_author.avatar_letter) AS latest_poster_avatar,
  COALESCE(lt_last.avatar_color, lt_author.avatar_color)   AS latest_poster_color,
  COALESCE(lt_last.role, lt_author.role)                   AS latest_poster_role,
  COALESCE(lt.last_reply_at, lt.created_at)                AS latest_activity_at
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
LEFT JOIN public.profiles lt_last   ON lt.last_reply_by = lt_last.user_id;

-- ------------------------------------------------------------
-- 6. RPC functions
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.increment_topic_views(p_topic_id UUID)
RETURNS VOID
LANGUAGE sql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  UPDATE public.topics SET views = views + 1 WHERE id = p_topic_id;
$$;

CREATE OR REPLACE FUNCTION public.update_last_seen()
RETURNS VOID
LANGUAGE sql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  UPDATE public.profiles SET last_seen = now() WHERE user_id = auth.uid();
$$;

-- Staff guard used by the moderation RPCs below. Moderators may only
-- act on members; admins may act on anyone but other admins.
CREATE OR REPLACE FUNCTION public.assert_can_moderate(p_target UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _caller_role TEXT := public.get_user_role();
  _target_role TEXT;
BEGIN
  IF _caller_role NOT IN ('moderator', 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT role INTO _target_role FROM public.profiles WHERE user_id = p_target;
  IF _target_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF _target_role = 'admin' THEN
    RAISE EXCEPTION 'Administrators cannot be moderated';
  END IF;
  IF _caller_role = 'moderator' AND _target_role = 'moderator' THEN
    RAISE EXCEPTION 'Moderators cannot moderate each other';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.soft_delete_topic(p_topic_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _topic RECORD;
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO _topic FROM public.topics WHERE id = p_topic_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Topic not found';
  END IF;

  UPDATE public.topics
     SET deleted_at = now(), deleted_by = auth.uid()
   WHERE id = p_topic_id;

  UPDATE public.categories
     SET topic_count = GREATEST(topic_count - 1, 0),
         post_count  = GREATEST(post_count - _topic.reply_count, 0)
   WHERE id = _topic.category_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.soft_delete_reply(p_reply_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _reply      RECORD;
  _last_reply RECORD;
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO _reply FROM public.replies WHERE id = p_reply_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reply not found';
  END IF;

  UPDATE public.replies
     SET deleted_at = now(), deleted_by = auth.uid()
   WHERE id = p_reply_id;

  UPDATE public.topics
     SET reply_count = GREATEST(reply_count - 1, 0)
   WHERE id = _reply.topic_id;

  UPDATE public.categories
     SET post_count = GREATEST(post_count - 1, 0)
   WHERE id = (SELECT category_id FROM public.topics WHERE id = _reply.topic_id);

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
$$;

CREATE OR REPLACE FUNCTION public.warn_user(p_user_id UUID, p_reason TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _new_count INTEGER;
BEGIN
  PERFORM public.assert_can_moderate(p_user_id);

  INSERT INTO public.warnings (user_id, reason, warned_by)
  VALUES (p_user_id, p_reason, auth.uid());

  UPDATE public.profiles
     SET warning_count = warning_count + 1
   WHERE user_id = p_user_id
  RETURNING warning_count INTO _new_count;

  IF _new_count >= 3 THEN
    UPDATE public.profiles
       SET banned = true,
           ban_reason = 'Automatically banned after 3 warnings'
     WHERE user_id = p_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.ban_user(p_user_id UUID, p_reason TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.assert_can_moderate(p_user_id);
  UPDATE public.profiles
     SET banned = true, ban_reason = p_reason
   WHERE user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.unban_user(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE public.profiles
     SET banned = false, ban_reason = NULL
   WHERE user_id = p_user_id;
END;
$$;

-- Presence widgets
CREATE OR REPLACE FUNCTION public.get_online_users()
RETURNS TABLE (user_id UUID, username TEXT, avatar_letter TEXT, avatar_color TEXT, role TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT p.user_id, p.username, p.avatar_letter, p.avatar_color, p.role
    FROM public.profiles p
   WHERE p.last_seen > now() - interval '5 minutes'
   ORDER BY p.last_seen DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_previously_active_users()
RETURNS TABLE (user_id UUID, username TEXT, avatar_letter TEXT, avatar_color TEXT, role TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT p.user_id, p.username, p.avatar_letter, p.avatar_color, p.role
    FROM public.profiles p
   WHERE p.last_seen <= now() - interval '5 minutes'
     AND p.last_seen >  now() - interval '24 hours'
   ORDER BY p.last_seen DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_top_contributors(p_period TEXT DEFAULT 'week', p_limit INTEGER DEFAULT 5)
RETURNS TABLE (user_id UUID, username TEXT, avatar_letter TEXT, avatar_color TEXT, role TEXT, post_total BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _since TIMESTAMPTZ;
BEGIN
  CASE p_period
    WHEN 'week'  THEN _since := now() - interval '7 days';
    WHEN 'month' THEN _since := now() - interval '30 days';
    WHEN 'year'  THEN _since := now() - interval '365 days';
    ELSE _since := '1970-01-01'::TIMESTAMPTZ;
  END CASE;

  RETURN QUERY
    SELECT p.user_id, p.username, p.avatar_letter, p.avatar_color, p.role,
           COALESCE(t.cnt, 0) + COALESCE(r.cnt, 0) AS post_total
      FROM public.profiles p
      LEFT JOIN (
        SELECT author_id, COUNT(*) AS cnt
          FROM public.topics
         WHERE created_at >= _since AND deleted_at IS NULL
         GROUP BY author_id
      ) t ON t.author_id = p.user_id
      LEFT JOIN (
        SELECT author_id, COUNT(*) AS cnt
          FROM public.replies
         WHERE created_at >= _since AND deleted_at IS NULL
         GROUP BY author_id
      ) r ON r.author_id = p.user_id
     WHERE COALESCE(t.cnt, 0) + COALESCE(r.cnt, 0) > 0
     ORDER BY post_total DESC
     LIMIT p_limit;
END;
$$;

-- Search. SECURITY DEFINER bypasses RLS, so visibility is enforced
-- inline: non-staff only ever see public categories.
CREATE OR REPLACE FUNCTION public.search_forum(p_query TEXT, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  result_type   TEXT,
  id            UUID,
  title         TEXT,
  snippet       TEXT,
  category_id   TEXT,
  topic_id      UUID,
  author_name   TEXT,
  author_avatar TEXT,
  author_color  TEXT,
  author_role   TEXT,
  created_at    TIMESTAMPTZ
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _pattern  TEXT := '%' || p_query || '%';
  _is_staff BOOLEAN := public.is_staff();
BEGIN
  RETURN QUERY
    (
      SELECT
        'topic'::TEXT,
        t.id,
        t.title,
        LEFT(t.content, 200),
        t.category_id,
        NULL::UUID,
        p.username,
        p.avatar_letter,
        p.avatar_color,
        p.role,
        t.created_at
      FROM public.topics t
      LEFT JOIN public.profiles p ON t.author_id = p.user_id
      JOIN public.categories c ON t.category_id = c.id
      WHERE t.deleted_at IS NULL
        AND (t.title ILIKE _pattern OR t.content ILIKE _pattern)
        AND (c.visibility = 'public' OR _is_staff)
      ORDER BY t.created_at DESC
      LIMIT p_limit
    )
    UNION ALL
    (
      SELECT
        'reply'::TEXT,
        r.id,
        t.title,
        LEFT(r.content, 200),
        t.category_id,
        r.topic_id,
        p.username,
        p.avatar_letter,
        p.avatar_color,
        p.role,
        r.created_at
      FROM public.replies r
      JOIN public.topics t ON r.topic_id = t.id
      LEFT JOIN public.profiles p ON r.author_id = p.user_id
      JOIN public.categories c ON t.category_id = c.id
      WHERE r.deleted_at IS NULL
        AND t.deleted_at IS NULL
        AND r.content ILIKE _pattern
        AND (c.visibility = 'public' OR _is_staff)
      ORDER BY r.created_at DESC
      LIMIT p_limit
    )
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$;

-- Follows
CREATE OR REPLACE FUNCTION public.toggle_follow(p_target_type TEXT, p_target_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  _exists BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT EXISTS (
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
$$;

CREATE OR REPLACE FUNCTION public.get_follow_count(p_target_type TEXT, p_target_id TEXT)
RETURNS INTEGER
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COUNT(*)::INTEGER
    FROM public.follows
   WHERE target_type = p_target_type AND target_id = p_target_id;
$$;

CREATE OR REPLACE FUNCTION public.is_following(p_target_type TEXT, p_target_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.follows
     WHERE user_id = auth.uid() AND target_type = p_target_type AND target_id = p_target_id
  );
$$;

-- ------------------------------------------------------------
-- 7. Indexes
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_topics_category_id   ON public.topics(category_id);
CREATE INDEX IF NOT EXISTS idx_topics_author_id     ON public.topics(author_id);
CREATE INDEX IF NOT EXISTS idx_topics_live          ON public.topics(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_topics_created_at    ON public.topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_last_reply_at ON public.topics(last_reply_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_replies_topic_id  ON public.replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_replies_author_id ON public.replies(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_live      ON public.replies(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON public.profiles(last_seen DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_follows_target ON public.follows(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_warnings_user  ON public.warnings(user_id);

-- ------------------------------------------------------------
-- 8. Grants
--
-- Privileges say which verbs a role may use at all; RLS decides
-- which rows they apply to. Writes go only to the tables the app
-- actually writes, always through RLS.
-- ------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

GRANT INSERT, UPDATE ON public.topics      TO authenticated;
GRANT INSERT, UPDATE ON public.replies     TO authenticated;
GRANT UPDATE         ON public.profiles    TO authenticated;
GRANT INSERT         ON public.warnings    TO authenticated;
GRANT INSERT         ON public.mod_actions TO authenticated;
GRANT INSERT, DELETE ON public.follows     TO authenticated;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- The service role (secret key) bypasses RLS but still needs table
-- privileges; the seed script and any future backend run as this role.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ------------------------------------------------------------
-- 9. Seed: sections and categories
-- ------------------------------------------------------------

INSERT INTO public.sections (id, name, sort_order) VALUES
  ('prep',      'The Prep',  1),
  ('hunt',      'The Hunt',  2),
  ('bag',       'The Bag',   3),
  ('community', 'Community', 4),
  ('staff',     'Staff',     5)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (id, section_id, name, description, icon, visibility, sort_order) VALUES
  ('the-grind',         'prep',      'The Grind',         'LeetCode discussion, study plans, and pattern debates. Misery loves company.', '&#128170;', 'public', 1),
  ('resume-roast',      'prep',      'Resume Roast',      'Post it. We''ll be honest. Your resume will thank you later.',                  '&#128293;', 'public', 2),
  ('interview-stories', 'hunt',      'Interview Stories', 'War stories, rants, chokes, and comebacks from the loop.',                      '&#127908;', 'public', 1),
  ('company-reviews',   'hunt',      'Company Reviews',   'The real day-to-day from interns and new grads. Is it actually worth it?',      '&#127970;', 'public', 2),
  ('salary-check',      'bag',       'Salary Check',      'Offer numbers, negotiation, and TC breakdowns. No judgment, just data.',        '&#128176;', 'public', 1),
  ('finally-got-one',   'bag',       'Finally Got One',   'You got the offer. Tell us everything.',                                        '&#127881;', 'public', 2),
  ('general',           'community', 'General',           'Everything else - classes, co-ops, imposter syndrome, decent memes.',           '&#128172;', 'public', 1),
  ('mod-lounge',        'staff',     'Mod Lounge',        'Staff coordination. If you can see this, you''re on the team.',                 '&#128737;', 'staff',  1)
ON CONFLICT (id) DO UPDATE SET
  section_id  = EXCLUDED.section_id,
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  icon        = EXCLUDED.icon,
  visibility  = EXCLUDED.visibility,
  sort_order  = EXCLUDED.sort_order;
