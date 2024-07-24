--! Previous: sha1:9bdbe7ce3091a2a4eee11d8c0601f7114d59ad50
--! Hash: sha1:9e5086e5e54235c9638166bfa515fcb6c8252849
--! Message: publish-trigger-user-handling-dropped

DROP FUNCTION if exists app_hidden.define_publish_trigger(text, text);
CREATE OR REPLACE FUNCTION app_hidden.define_publish_trigger(tableName text, schemaName text, columnNames text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP TRIGGER IF EXISTS _900__publish_user ON ' || schemaName || '.' || tableName || ';';
  EXECUTE 'CREATE trigger _900__publish_user BEFORE INSERT OR UPDATE OF ' || columnNames || ' ON ' || schemaName || '.' || tableName ||
          ' FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__publish_audit_fields();';
END;
$$;

-- published_user handling removed from the trigger and moved to the parts of
-- the code that handle changing published_date
CREATE OR REPLACE FUNCTION app_hidden.tg__publish_audit_fields() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
DECLARE
	username text = pg_catalog.current_setting('mosaic.auth.subject_name', true);
BEGIN
  -- ensure that published_date is aligned with publication_state
  IF (NEW.publication_state = 'PUBLISHED' OR NEW.publication_state = 'CHANGED') AND NEW.published_date IS NULL THEN
    perform ax_utils.raise_error('published_date must not be null if publication_state is PUBLISHED or CHANGED.', 'PTERR');
  END IF;
  IF NEW.publication_state = 'NOT_PUBLISHED' AND NEW.published_date IS NOT NULL THEN
    perform ax_utils.raise_error('published_date must be null if publication_state is NOT_PUBLISHED.', 'PTERR');
  END IF;

  -- set changed state
  IF NEW.published_date = OLD.published_date AND NEW.updated_date <> OLD.updated_date THEN
    NEW.publication_state = 'CHANGED';
  END IF;
  RETURN NEW;
END;
$$;

SELECT app_hidden.define_publish_trigger('channels', 'app_public', 'title,description,placeholder_video_id,is_drm_protected');
SELECT app_hidden.define_publish_trigger('playlists', 'app_public', 'title,start_date_time,calculated_duration_in_seconds,channel_id');
