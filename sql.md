BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  email_hash text,
  name text NOT NULL,
  phone text NOT NULL,
  phone_normalized text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'leader', 'admin')),
  total_xp bigint NOT NULL DEFAULT 0,
  nebula_coins bigint NOT NULL DEFAULT 0,
  current_level integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  leader_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  join_code text NOT NULL,
  member_count integer NOT NULL DEFAULT 0 CHECK (member_count >= 0),
  total_cluster_xp bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_clusters (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  cluster_id uuid NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  contribution_points integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, cluster_id)
);

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  category text NOT NULL DEFAULT 'general',
  category_color text NOT NULL DEFAULT 'cyan',
  read_time integer NOT NULL DEFAULT 5 CHECK (read_time >= 0),
  author text,
  featured_image text,
  views integer NOT NULL DEFAULT 0 CHECK (views >= 0),
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_hash text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_normalized text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_xp bigint NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nebula_coins bigint NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_level integer NOT NULL DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.clusters ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.clusters ADD COLUMN IF NOT EXISTS join_code text NOT NULL DEFAULT '';
ALTER TABLE public.clusters ADD COLUMN IF NOT EXISTS member_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.clusters ADD COLUMN IF NOT EXISTS total_cluster_xp bigint NOT NULL DEFAULT 0;
ALTER TABLE public.clusters ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.user_clusters ADD COLUMN IF NOT EXISTS joined_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.user_clusters ADD COLUMN IF NOT EXISTS contribution_points integer NOT NULL DEFAULT 0;

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'general';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category_color text NOT NULL DEFAULT 'cyan';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS read_time integer NOT NULL DEFAULT 5;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured_image text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.users SET role = 'user' WHERE role IS NULL;
UPDATE public.users SET email = lower(trim(email)) WHERE email IS NOT NULL;
UPDATE public.users SET name = trim(regexp_replace(name, '\s+', ' ', 'g')) WHERE name IS NOT NULL;
UPDATE public.users SET phone = regexp_replace(phone, '[^0-9]', '', 'g') WHERE phone IS NOT NULL;
UPDATE public.users SET phone_normalized = regexp_replace(phone, '[^0-9]', '', 'g') WHERE phone IS NOT NULL;

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'leader', 'admin'));

DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_update_own_profile ON public.users;
DROP POLICY IF EXISTS users_update_roles_by_admin ON public.users;
DROP POLICY IF EXISTS users_registration_select ON public.users;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique ON public.users (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_name_lower_unique ON public.users (lower(name));
CREATE INDEX IF NOT EXISTS users_phone_normalized_idx ON public.users (phone_normalized);
CREATE UNIQUE INDEX IF NOT EXISTS clusters_join_code_unique ON public.clusters (upper(join_code));
CREATE INDEX IF NOT EXISTS clusters_leader_id_idx ON public.clusters (leader_id);
CREATE INDEX IF NOT EXISTS user_clusters_cluster_id_idx ON public.user_clusters (cluster_id);
CREATE INDEX IF NOT EXISTS posts_slug_published_idx ON public.posts (slug, is_published);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_user_rules()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  phone_total integer;
BEGIN
  IF NEW.email IS NULL OR btrim(NEW.email) = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  IF NEW.name IS NULL OR btrim(NEW.name) = '' THEN
    RAISE EXCEPTION 'Name is required';
  END IF;

  IF NEW.phone IS NULL THEN
    RAISE EXCEPTION 'Phone number is required';
  END IF;

  NEW.email := lower(btrim(NEW.email));
  NEW.name := btrim(regexp_replace(NEW.name, '\s+', ' ', 'g'));
  NEW.phone := regexp_replace(NEW.phone::text, '[^0-9]', '', 'g');
  NEW.phone_normalized := NEW.phone;

  IF length(NEW.phone_normalized) < 10 THEN
    RAISE EXCEPTION 'Valid phone number is required';
  END IF;

  IF NEW.role IS NULL THEN
    NEW.role := 'user';
  END IF;

  IF NEW.role NOT IN ('user', 'leader', 'admin') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  SELECT count(*)
  INTO phone_total
  FROM public.users
  WHERE phone_normalized = NEW.phone_normalized
    AND id IS DISTINCT FROM NEW.id;

  IF phone_total >= 2 THEN
    RAISE EXCEPTION 'Maximum 2 accounts allowed per phone number';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_cluster_rules()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  creator_role text;
BEGIN
  IF NEW.name IS NULL OR btrim(NEW.name) = '' THEN
    RAISE EXCEPTION 'Cluster name is required';
  END IF;

  IF NEW.join_code IS NULL OR btrim(NEW.join_code) = '' THEN
    RAISE EXCEPTION 'Join code is required';
  END IF;

  NEW.join_code := upper(btrim(NEW.join_code));

  SELECT role
  INTO creator_role
  FROM public.users
  WHERE id = NEW.leader_id;

  IF creator_role IS NULL THEN
    RAISE EXCEPTION 'Cluster leader not found';
  END IF;

  -- ADAPTIVE IMMUTABLE RE-ROUTING FIX:
  -- If a normal user is creating a cluster, upgrade them to 'leader' directly inside the transaction loop!
  IF creator_role = 'user' THEN
    UPDATE public.users 
    SET role = 'leader' 
    WHERE id = NEW.leader_id;
  ELSIF creator_role NOT IN ('leader', 'admin') THEN
    RAISE EXCEPTION 'Only leaders can create clusters';
  END IF;

  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.sync_cluster_member_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_cluster_id uuid;
  count_delta integer;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_cluster_id := OLD.cluster_id;
    count_delta := -1;
  ELSE
    target_cluster_id := NEW.cluster_id;
    count_delta := 1;
  END IF;

  UPDATE public.clusters
  SET member_count = GREATEST(member_count + count_delta, 0)
  WHERE id = target_cluster_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  metadata jsonb;
  new_role text;
BEGIN
  metadata := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  new_role := COALESCE(metadata ->> 'role', 'user');

  IF new_role NOT IN ('user', 'leader', 'admin') THEN
    new_role := 'user';
  END IF;

  INSERT INTO public.users (
    id,
    email,
    email_hash,
    name,
    phone,
    phone_normalized,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    metadata ->> 'email_hash',
    metadata ->> 'name',
    metadata ->> 'phone',
    metadata ->> 'phone',
    new_role
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    email_hash = COALESCE(EXCLUDED.email_hash, public.users.email_hash),
    name = COALESCE(EXCLUDED.name, public.users.name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    phone_normalized = COALESCE(EXCLUDED.phone_normalized, public.users.phone_normalized),
    role = EXCLUDED.role;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_apply_rules ON public.users;
CREATE TRIGGER users_apply_rules
BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.apply_user_rules();

DROP TRIGGER IF EXISTS users_set_updated_at ON public.users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS clusters_apply_rules ON public.clusters;
CREATE TRIGGER clusters_apply_rules
BEFORE INSERT OR UPDATE ON public.clusters
FOR EACH ROW
EXECUTE FUNCTION public.apply_cluster_rules();

DROP TRIGGER IF EXISTS clusters_set_updated_at ON public.clusters;
CREATE TRIGGER clusters_set_updated_at
BEFORE UPDATE ON public.clusters
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS user_clusters_sync_member_count ON public.user_clusters;
CREATE TRIGGER user_clusters_sync_member_count
AFTER INSERT OR DELETE ON public.user_clusters
FOR EACH ROW
EXECUTE FUNCTION public.sync_cluster_member_count();

DROP TRIGGER IF EXISTS posts_set_updated_at ON public.posts;
CREATE TRIGGER posts_set_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

UPDATE public.users SET role = 'admin' WHERE email = 'admin@androsky.com';
UPDATE public.users SET role = 'leader' WHERE email = 'leader@androsky.com' AND role = 'user';

COMMIT;
