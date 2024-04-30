--! Previous: sha1:9e58d9212f8204cc42f4e3b3afd0abe7d343bd12
--! Hash: sha1:b74cde38f51e59d36d33923a186339559759f757
--! Message: ingest-document-check-index-added

DROP INDEX IF EXISTS idx_ingest_items_ingest_document_id_and_status CASCADE;
CREATE INDEX idx_ingest_items_ingest_document_id_and_status ON app_public.ingest_items (ingest_document_id, status);
