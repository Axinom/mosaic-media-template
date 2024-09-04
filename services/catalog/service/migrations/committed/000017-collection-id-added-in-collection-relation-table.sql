--! Previous: sha1:271e69ca264cfe2d44a45a95aa7e103e73cca16e
--! Hash: sha1:085f8e7247129b485177087615270bc46409011b
--! Message: collection-id-added-in-collection-relation-table

ALTER TABLE app_public.collection_items_relation DROP COLUMN IF EXISTS collection_id;

ALTER TABLE app_public.collection_items_relation ADD COLUMN IF NOT EXISTS collection_fk_id TEXT REFERENCES collection ON DELETE CASCADE;

GRANT INSERT (collection_fk_id) ON app_public.collection_items_relation TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (collection_fk_id) ON app_public.collection_items_relation TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.collection_items_relation ADD COLUMN IF NOT EXISTS collection_id TEXT;

GRANT INSERT (collection_id) ON app_public.collection_items_relation TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (collection_id) ON app_public.collection_items_relation TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_index('collection_fk_id', 'collection_items_relation', 'app_public');
SELECT ax_define.define_index('collection_id', 'collection_items_relation', 'app_public');
