--! Previous: sha1:95f2cb8f12acd7bc84f7438f981092e254f74973
--! Hash: sha1:8c2406bddb2aec8bcab649daf4039e6f830e4bf1
--! Message: localization-enum-values-and-ingest-correlation-id-added

INSERT INTO app_public.snapshot_validation_issue_context (value, description)
VALUES ('LOCALIZATION', 'Localization')
ON CONFLICT (value) DO NOTHING;

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
