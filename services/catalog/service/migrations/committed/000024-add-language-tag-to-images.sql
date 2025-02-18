--! Previous: sha1:99526019f2cb59d6ae9c17e3375a90e30d440b56
--! Hash: sha1:3fa6169ec788ec124352e19554cf5e7396657dbf
--! Message: add-language-tag-to-images

ALTER TABLE app_public.movie_images ADD COLUMN IF NOT EXISTS language_tag TEXT;
ALTER TABLE app_public.tvshow_images ADD COLUMN IF NOT EXISTS language_tag TEXT;
ALTER TABLE app_public.season_images ADD COLUMN IF NOT EXISTS language_tag TEXT;
ALTER TABLE app_public.episode_images ADD COLUMN IF NOT EXISTS language_tag TEXT;
ALTER TABLE app_public.collection_images ADD COLUMN IF NOT EXISTS language_tag TEXT;

-- Remove NOT NULL constraint from title column in localizations
ALTER TABLE app_public.movie_localizations ALTER COLUMN title DROP NOT NULL;
ALTER TABLE app_public.tvshow_localizations ALTER COLUMN title DROP NOT NULL;
ALTER TABLE app_public.season_localizations ALTER COLUMN title DROP NOT NULL;
ALTER TABLE app_public.episode_localizations ALTER COLUMN title DROP NOT NULL;
ALTER TABLE app_public.collection_localizations ALTER COLUMN title DROP NOT NULL;
