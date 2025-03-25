--! Previous: sha1:6aaad5a4ed395a5cbe818fea84c5360a6988ec9a
--! Hash: sha1:1be209b7ec2d8619088c4c6f087a53ffb1532d64
--! Message: reviews-are-ingestable

-- Ingest
INSERT INTO app_public.ingest_item_type (value, description)
VALUES ('REVIEW', 'Review')
ON CONFLICT (value) DO NOTHING;


-- Reviews
ALTER TABLE app_public.reviews ALTER COLUMN description DROP NOT NULL;

ALTER TABLE app_public.reviews ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.reviews TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.reviews.ingest_correlation_id is E'@omit';

ALTER TABLE app_public.reviews ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;
GRANT INSERT (external_id) ON app_public.reviews TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (external_id) ON app_public.reviews TO ":DATABASE_GQL_ROLE";
SELECT ax_define.define_indexes_with_id('external_id', 'reviews', 'app_public');
