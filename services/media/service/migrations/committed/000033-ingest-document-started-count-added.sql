--! Previous: sha1:33dd6526e51e4c02a562908f22a359a30cb65668
--! Hash: sha1:97dac4963ec39dceea82c16f86d9d2d7ef9d3497
--! Message: ingest-document-started-count-added

ALTER TABLE app_public.ingest_documents ADD COLUMN IF NOT EXISTS started_count INT NOT NULL DEFAULT 0;
UPDATE app_public.ingest_documents SET started_count = items_count WHERE started_count = 0;
