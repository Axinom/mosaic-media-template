--! Previous: sha1:6ef7379103826822eaf8e561cee86cf39421fbed
--! Hash: sha1:987b04fc38fc965459a21a96509e90cd3dc67cc1
--! Message: changed-status

-- Add CHANGED to publish_status enum
INSERT INTO app_public.publish_status (value, description) VALUES ('CHANGED', 'Changed') ON CONFLICT DO NOTHING;

-- Generic trigger function to update publish status when updated_date changes
CREATE OR REPLACE FUNCTION app_hidden.tg__update_publish_state() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Don't change updated date due to publication changes. Publishing some old snapshot is not a change.
    -- We must be able to compare real changes with snapshot creation date.
    IF COALESCE(NEW.published_date, to_timestamp(0)) <> COALESCE(OLD.published_date, to_timestamp(0)) THEN
      NEW.updated_date = OLD.updated_date;

    -- A published entity always become changed on subsequent changes
    ELSIF NEW.publish_status = 'PUBLISHED' THEN
        NEW.publish_status = 'CHANGED';
    END IF;
    RETURN NEW;
END;
$$;

-- Update publish propagation to support CHANGED status

-- Creates a trigger function and a trigger that sets publish state, date and user of an entity whenever related snapshot is published or unpublished.
-- Trigger function is created as a SECURITY DEFINER, executing update statements as an OWNER user, because grants for publish columns are not added to GQL role.
-- Also creates a trigger that updates publish status to CHANGED on changes to a published entity. Combine with timestamp propagation to track changes across a 
-- tree of related entities.
-- @tableName - name of the table for which update would be done, e.g. 'movies'
-- @entityType - entity type that maps a snapshot to a relation, e.g. 'MOVIE'
CREATE OR REPLACE FUNCTION app_hidden.create_propagate_publish_state_trigger(tableName text, entityType text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_' || tableName || '() RETURNS trigger AS $snap$ ' ||
            'BEGIN ' ||
              'IF (NEW.snapshot_state = ''PUBLISHED'') THEN ' ||
                'UPDATE app_public.' || tableName || ' SET published_date = NEW.published_date, published_user = NEW.updated_user, ' ||
                -- if entity was changed after snapshot was created then is has unpublished changes.. so the correct status is CHANGED
                'publish_status = CASE WHEN updated_date > NEW.created_date THEN ''CHANGED'' ELSE ''PUBLISHED'' END ' ||
                'WHERE id = NEW.entity_id;'
              'ELSIF (NEW.snapshot_state = ''UNPUBLISHED'') THEN ' ||
                'UPDATE app_public.' || tableName || ' SET publish_status = ''NOT_PUBLISHED'', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;' ||
              'END IF; ' ||
              'RETURN NEW; ' ||
            'END; ' ||
            '$snap$ LANGUAGE plpgsql volatile SECURITY DEFINER;';

    EXECUTE 'DROP trigger IF EXISTS _300_propagate_publish_state_to_' || tableName || ' on app_public.snapshots;';
    EXECUTE 'CREATE trigger _300_propagate_publish_state_to_' || tableName || ' ' ||
            'BEFORE UPDATE ON app_public.snapshots ' ||
            'for each ROW WHEN (NEW.entity_type = ''' || entityType || ''') ' ||
            'EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_' || tableName || '();';

    EXECUTE 'DROP TRIGGER IF EXISTS _300_publish_state_changed' || ' ON app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _300_publish_state_changed 
             BEFORE UPDATE ON app_public.' || tableName || '
             FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__update_publish_state();';
END;
$$;

-- Re-apply publish propagation triggers to support CHANGED status
SELECT app_hidden.create_propagate_publish_state_trigger('movies', 'MOVIE');
SELECT app_hidden.create_propagate_publish_state_trigger('tvshows', 'TVSHOW');
SELECT app_hidden.create_propagate_publish_state_trigger('seasons', 'SEASON');
SELECT app_hidden.create_propagate_publish_state_trigger('episodes', 'EPISODE');
SELECT app_hidden.create_propagate_publish_state_trigger('collections', 'COLLECTION');
