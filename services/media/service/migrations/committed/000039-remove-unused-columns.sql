--! Previous: sha1:3441b4c0ec81d4f4d2bac47a8aa021d34ac064d7
--! Hash: sha1:98c7759a2b7ada0a4a081ed3e167a859f7ed2134
--! Message: remove-unused-columns

-- Movies table
ALTER TABLE app_public.movies DROP COLUMN IF EXISTS custom_rating;
ALTER TABLE app_public.movies DROP COLUMN IF EXISTS credits_start_time;
ALTER TABLE app_public.movies DROP COLUMN IF EXISTS length_in_seconds;
ALTER TABLE app_public.movies DROP COLUMN IF EXISTS dynamic_field;
ALTER TABLE app_public.movies DROP COLUMN IF EXISTS audio_languages;
ALTER TABLE app_public.movies DROP COLUMN IF EXISTS subtitle_languages;
ALTER TABLE app_public.movies DROP COLUMN IF EXISTS caption_languages;

-- TV Shows Table
ALTER TABLE app_public.tvshows DROP COLUMN IF EXISTS custom_rating;
ALTER TABLE app_public.tvshows DROP COLUMN IF EXISTS credits_start_time;
ALTER TABLE app_public.tvshows DROP COLUMN IF EXISTS length_in_seconds;
ALTER TABLE app_public.tvshows DROP COLUMN IF EXISTS dynamic_field;
ALTER TABLE app_public.tvshows DROP COLUMN IF EXISTS audio_languages;
ALTER TABLE app_public.tvshows DROP COLUMN IF EXISTS subtitle_languages;
ALTER TABLE app_public.tvshows DROP COLUMN IF EXISTS caption_languages;

-- Seasons Table
ALTER TABLE app_public.seasons DROP COLUMN IF EXISTS custom_rating;
ALTER TABLE app_public.seasons DROP COLUMN IF EXISTS credits_start_time;
ALTER TABLE app_public.seasons DROP COLUMN IF EXISTS length_in_seconds;
ALTER TABLE app_public.seasons DROP COLUMN IF EXISTS dynamic_field;

-- Episodes Table
ALTER TABLE app_public.episodes DROP COLUMN IF EXISTS custom_rating;
ALTER TABLE app_public.episodes DROP COLUMN IF EXISTS credits_start_time;
ALTER TABLE app_public.episodes DROP COLUMN IF EXISTS length_in_seconds;
ALTER TABLE app_public.episodes DROP COLUMN IF EXISTS dynamic_field;

-- Modify default value for business_type
ALTER TABLE app_public.movies ALTER COLUMN business_type SET DEFAULT 'premium';
ALTER TABLE app_public.tvshows ALTER COLUMN business_type SET DEFAULT 'premium';
ALTER TABLE app_public.seasons ALTER COLUMN business_type SET DEFAULT 'premium';
ALTER TABLE app_public.episodes ALTER COLUMN business_type SET DEFAULT 'premium';
