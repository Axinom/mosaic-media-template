--! Previous: sha1:97dac4963ec39dceea82c16f86d9d2d7ef9d3497
--! Hash: sha1:055167d5c74f49f62ad19b8bbab08b7ab9dd79d7
--! Message: ingest-document-check-index-added

DROP INDEX IF EXISTS idx_ingest_items_ingest_document_id_and_status CASCADE;
CREATE INDEX idx_ingest_items_ingest_document_id_and_status ON app_public.ingest_items (ingest_document_id, status);
