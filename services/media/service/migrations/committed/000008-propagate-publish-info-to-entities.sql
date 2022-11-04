--! Previous: sha1:a1d53e466561bef7d13d5aab11bd526df2acc616
--! Hash: sha1:a9440aea95a18202588b15ff8d4e9153ecb3143b
--! Message: propagate-publish-info-to-entities

-- drop ingest document triggers
DROP trigger IF EXISTS _250_update_in_progress_count on app_public.ingest_documents;
DROP trigger IF EXISTS _300_check_status on app_public.ingest_documents;

DROP FUNCTION IF EXISTS app_hidden.tg_ingest_documents__update_in_progress_count;
DROP FUNCTION IF EXISTS app_hidden.tg_ingest_documents__check_status;

GRANT INSERT (in_progress_count) ON app_public.ingest_documents TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (in_progress_count) ON app_public.ingest_documents TO ":DATABASE_GQL_ROLE";

-- add title insert grant
GRANT INSERT (entity_title) ON app_public.snapshots TO ":DATABASE_GQL_ROLE";

-- drop obsolete genre snapshot tables
DROP TABLE IF EXISTS app_public.movie_genres_snapshots CASCADE;
DROP TABLE IF EXISTS app_public.tvshow_genres_snapshots CASCADE;

ALTER TABLE app_public.snapshots ADD COLUMN IF NOT EXISTS is_list_snapshot BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_list_snapshot) ON app_public.snapshots TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_list_snapshot) ON app_public.snapshots TO ":DATABASE_GQL_ROLE";

-- propagate publish info to entities
UPDATE app_public.movies SET publish_status = 'PUBLISHED' WHERE publish_status = 'CHANGED';
UPDATE app_public.movies SET publish_status = 'NOT_PUBLISHED' WHERE publish_status = 'PUBLISH_PROGRESS' OR publish_status = 'PUBLISH_ERROR';
UPDATE app_public.tvshows SET publish_status = 'PUBLISHED' WHERE publish_status = 'CHANGED';
UPDATE app_public.tvshows SET publish_status = 'NOT_PUBLISHED' WHERE publish_status = 'PUBLISH_PROGRESS' OR publish_status = 'PUBLISH_ERROR';
UPDATE app_public.seasons SET publish_status = 'PUBLISHED' WHERE publish_status = 'CHANGED';
UPDATE app_public.seasons SET publish_status = 'NOT_PUBLISHED' WHERE publish_status = 'PUBLISH_PROGRESS' OR publish_status = 'PUBLISH_ERROR';
UPDATE app_public.episodes SET publish_status = 'PUBLISHED' WHERE publish_status = 'CHANGED';
UPDATE app_public.episodes SET publish_status = 'NOT_PUBLISHED' WHERE publish_status = 'PUBLISH_PROGRESS' OR publish_status = 'PUBLISH_ERROR';
UPDATE app_public.collections SET publish_status = 'PUBLISHED' WHERE publish_status = 'CHANGED';
UPDATE app_public.collections SET publish_status = 'NOT_PUBLISHED' WHERE publish_status = 'PUBLISH_PROGRESS' OR publish_status = 'PUBLISH_ERROR';

DELETE FROM app_public.publish_status WHERE value = 'CHANGED' OR value = 'PUBLISH_PROGRESS' OR value = 'PUBLISH_ERROR';

-- Creates a trigger function and a trigger that sets publish state, date and user of an entity whenever related snapshot is published or unpublished.
-- Trigger function is created as a SECURITY DEFINER, executing update statements as an OWNER user, because grants for publish columns are not added to GQL role.
-- @tableName - name of the table for which update would be done, e.g. 'movies'
-- @entityType - entity type that maps a snapshot to a relation, e.g. 'MOVIE'
CREATE OR REPLACE FUNCTION app_hidden.create_propagate_publish_state_trigger(tableName text, entityType text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
   EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_' || tableName || '() RETURNS trigger AS $snap$ ' ||
           'BEGIN ' ||
             'IF (NEW.entity_type = ''' || entityType || ''' AND NEW.snapshot_state = ''PUBLISHED'') THEN ' ||
                'UPDATE app_public.' || tableName || ' SET publish_status = ''PUBLISHED'', published_date = NEW.published_date, published_user = NEW.updated_user WHERE id = NEW.entity_id;' ||
             'ELSIF (NEW.entity_type = ''' || entityType || ''' AND NEW.snapshot_state = ''UNPUBLISHED'') THEN ' ||
                'UPDATE app_public.' || tableName || ' SET publish_status = ''NOT_PUBLISHED'', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;' ||
             'END IF; ' ||
             'RETURN NEW; ' ||
           'END; ' ||
           '$snap$ LANGUAGE plpgsql volatile SECURITY DEFINER;';

   EXECUTE 'DROP trigger IF EXISTS _300_propagate_publish_state_to_' || tableName || ' on app_public.snapshots;';
   EXECUTE 'CREATE trigger _300_propagate_publish_state_to_' || tableName || ' ' ||
           'BEFORE UPDATE ON app_public.snapshots ' ||
           'for each ROW ' ||
           'EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_' || tableName || '();';
END;
$$;

SELECT app_hidden.create_propagate_publish_state_trigger('movies', 'MOVIE');
SELECT app_hidden.create_propagate_publish_state_trigger('tvshows', 'TVSHOW');
SELECT app_hidden.create_propagate_publish_state_trigger('seasons', 'SEASON');
SELECT app_hidden.create_propagate_publish_state_trigger('episodes', 'EPISODE');
SELECT app_hidden.create_propagate_publish_state_trigger('collections', 'COLLECTION');
-- Genres are not affected, because they are published as a list and there is no parent entity for a list of genres.
