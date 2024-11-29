--! Previous: sha1:10f63e534bd7698f73c7252d270f5f07f3e2544b
--! Hash: sha1:99526019f2cb59d6ae9c17e3375a90e30d440b56
--! Message: add-title-to-season-localizations

ALTER TABLE app_public.season_localizations
ADD COLUMN IF NOT EXISTS title TEXT;

-- We set the original_title as the title for the season_localizations
UPDATE app_public.season_localizations sl 
SET title = (SELECT original_title
			FROM app_public.season s
			WHERE s.id = sl.season_id);

ALTER TABLE app_public.season_localizations
ALTER COLUMN title SET NOT NULL;

ALTER TABLE app_public.season DROP COLUMN IF EXISTS title CASCADE;

SELECT app_private.define_localization_view(
  'season',
  'season_localizations',
  'season_id');
