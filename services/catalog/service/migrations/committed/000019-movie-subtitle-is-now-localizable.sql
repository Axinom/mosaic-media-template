--! Previous: sha1:3718d885bf006e078110fb255683771f5afb53ff
--! Hash: sha1:97ed7b504c3a6797066c4540a31081a76ab28c8b
--! Message: movie-subtitle-is-now-localizable

ALTER TABLE app_public.movie_localizations
DROP COLUMN IF EXISTS subtitle CASCADE;

ALTER TABLE app_public.movie_localizations 
ADD COLUMN subtitle TEXT;

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('subtitle', 'movie', 'app_public') THEN
    UPDATE app_public.movie_localizations AS ml
    SET subtitle = m.subtitle
    FROM app_public.movie AS m
    WHERE ml.movie_id = m.id AND ml.is_default_locale IS TRUE;
  END IF;
END $$;

DROP VIEW IF EXISTS app_public.movie_view;
ALTER TABLE app_public.movie DROP COLUMN IF EXISTS subtitle;

SELECT app_private.define_localization_view(
  'movie',
  'movie_localizations',
  'movie_id');
