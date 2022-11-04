--! Previous: sha1:a9440aea95a18202588b15ff8d4e9153ecb3143b
--! Hash: sha1:e66ba6e5592b8ffb61ca76d5e71caff9e9eac3b4
--! Message: drop-obsolete-triggers--store-entity-id-on-ingest--defer-sort-order-constraints

-- drop obsolete genre triggers
DROP trigger IF EXISTS _100_check_active_snapshots on app_public.movie_genres;
DROP trigger IF EXISTS _100_check_active_snapshots on app_public.tvshow_genres;

DROP FUNCTION IF EXISTS app_hidden.tg_movie_genres__check_active_snapshots;
DROP FUNCTION IF EXISTS app_hidden.tg_tvshow_genres__check_active_snapshots;

-- added entity ID to ingest item steps
ALTER TABLE app_public.ingest_item_steps ADD COLUMN IF NOT EXISTS entity_id TEXT;

GRANT INSERT (entity_id) ON app_public.ingest_item_steps TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (entity_id) ON app_public.ingest_item_steps TO ":DATABASE_GQL_ROLE";

-- set sort order constraints as deferred
SELECT ax_define.drop_index('sort_order', 'movie_genres');
SELECT ax_define.define_deferred_unique_constraint('sort_order', 'movie_genres', 'app_public');

SELECT ax_define.drop_index('sort_order', 'tvshow_genres');
SELECT ax_define.define_deferred_unique_constraint('sort_order', 'tvshow_genres', 'app_public');

SELECT ax_define.drop_index('sort_order', 'collection_relations'); -- This one was originally not a unique index

ALTER TABLE app_public.collection_relations DROP CONSTRAINT IF EXISTS collection_relations_sort_order_is_unique;
ALTER TABLE app_public.collection_relations ADD CONSTRAINT collection_relations_sort_order_is_unique UNIQUE (collection_id, sort_order) DEFERRABLE INITIALLY DEFERRED;
