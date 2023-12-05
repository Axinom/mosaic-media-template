--! Previous: sha1:6a3a69a353cda197823704f1f392400ea09f5a3e
--! Hash: sha1:c5fbc30c9342e8df584cc3a54160ac2384e3f6d1
--! Message: ingest-localization-added

INSERT INTO app_public.ingest_item_step_type (value, description)
VALUES ('LOCALIZATIONS', 'Localizations')
ON CONFLICT (value) DO NOTHING;

ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.movies TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.movies.ingest_correlation_id is E'@omit';

ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.episodes.ingest_correlation_id is E'@omit';

ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.seasons.ingest_correlation_id is E'@omit';

ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.tvshows.ingest_correlation_id is E'@omit';
