--! Previous: sha1:d7c481931580f6acf907cf543994742775ae710c
--! Hash: sha1:9e58d9212f8204cc42f4e3b3afd0abe7d343bd12
--! Message: ingest-document-started-count-added

ALTER TABLE app_public.ingest_documents ADD COLUMN IF NOT EXISTS started_count INT NOT NULL DEFAULT 0;
UPDATE app_public.ingest_documents SET started_count = items_count WHERE started_count = 0;
