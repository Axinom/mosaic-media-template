--! Message: added initial tables

-- ##### SECTIONS #####
-- * #general
-- * #channel
-- * #playlist
-- * #program
-- * #program-cue-point
-- * #program-cue-point-schedule

-------------- #general ---------------
--   ___                             _ 
--  / __| ___  _ _   ___  _ _  __ _ | |
-- | (_ |/ -_)| ' \ / -_)| '_|/ _` || |
--  \___|\___||_||_|\___||_|  \__/_||_|
--
---------------------------------------

-- NOTE: enum values must all be SCREAMING_SNAKE_CASE!

-- enum table: program_break_type
SELECT ax_define.create_enum_table(
  'program_break_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"PRE","MID","POST"}',
  '{"Pre","Mid","Post"}');

-- enum table: cue_point_schedule_type
SELECT ax_define.create_enum_table(
  'cue_point_schedule_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"AD_POD","VIDEO"}',
  '{"Ad pod","Video"}');

-- enum table: channel_image_type
SELECT ax_define.create_enum_table(
  'channel_image_type',
  'app_public',
  ':DATABASE_LOGIN',
  '{"LOGO"}',
  '{"Logo"}');

-- enum table: publication_state
SELECT ax_define.create_enum_table(
  'publication_state',
  'app_public',
  ':DATABASE_LOGIN',
  '{"PUBLISHED","NOT_PUBLISHED","CHANGED"}',
  '{"Published","Not Published","Changed"}');

-- enum table: entity_type
SELECT ax_define.create_enum_table(
  'entity_type',
  'app_public',
  ':DATABASE_LOGIN',
  '{"MOVIE","EPISODE"}',
  '{"Movie","Episode"}');  

-- generic trigger function to update and validate publish audit fields
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

  -- set published_user when published_date changes 
  IF NEW.published_date IS NULL THEN
    NEW.published_user = NULL;
  ELSIF OLD.published_date IS NULL OR NEW.published_date <> OLD.published_date THEN
    IF username IS NULL OR username !~* '.*\S.*' THEN -- if username is null or empty string
      NEW.published_user = ':DEFAULT_USERNAME';
    ELSE
      NEW.published_user = username;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- creation method to create publish audit field triggers
CREATE OR REPLACE FUNCTION app_hidden.define_publish_trigger(tableName text, schemaName text, columnNames text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP TRIGGER IF EXISTS _900__publish_user ON ' || schemaName || '.' || tableName || ';';
  EXECUTE 'CREATE trigger _900__publish_user BEFORE INSERT OR UPDATE OF ' || columnNames || ' ON ' || schemaName || '.' || tableName ||
          ' FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__publish_audit_fields();';
END;
$$;

---------------------- #localization ----------------------
--  _                    _  _            _    _            
-- | |    ___  __  __ _ | |(_) ___ __ _ | |_ (_) ___  _ _  
-- | |__ / _ \/ _|/ _` || || ||_ // _` ||  _|| |/ _ \| ' \ 
-- |____|\___/\__|\__/_||_||_|/__|\__/_| \__||_|\___/|_||_|
--
-----------------------------------------------------------

-- Localizable trigger helpers
CREATE OR REPLACE FUNCTION app_hidden.to_pascal_case(input_value text) RETURNS TEXT  AS $$
BEGIN
  RETURN replace(initcap(replace(input_value, '_', ' ')), ' ', '');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION app_hidden.to_kebab_case(input_value text) RETURNS TEXT  AS $$
BEGIN
  RETURN lower(replace(input_value, '_', '-'));
END;
$$ LANGUAGE plpgsql;

-- This function is called to check if localization is enabled in the Channel Service
-- Use `setIsLocalizationEnabledDbFunction` in your service to change the returned value
CREATE OR REPLACE FUNCTION app_hidden.is_localization_enabled()
  RETURNS boolean AS
  $f$SELECT FALSE $f$ LANGUAGE sql IMMUTABLE;

-- Creates DB triggers on tables that contain localizable data. If a row is inserted, 
-- relevant fields were changed, or a row is deleted this will create a new message
-- in the inbox table.
CREATE OR REPLACE FUNCTION app_hidden.create_localizable_entity_triggers(aggregateId text, tableName text, entityType text, localizable_fields text, required_fields text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_insert() RETURNS TRIGGER AS $body$' || E'\n' ||
            'DECLARE' || E'\n' ||
              E'\t' || '_jsonb_new jsonb := row_to_json(NEW.*);' || E'\n' ||
              E'\t' || '_fields text[] := string_to_array(''' || localizable_fields || ''', '','') || string_to_array(''' || required_fields || ''', '','');' || E'\n' ||
              E'\t' || '_payload jsonb := ''{}''::jsonb;' || E'\n' ||
              E'\t' || '_field text;' || E'\n' ||
            'BEGIN' || E'\n' ||
              E'\t' || 'FOREACH _field IN ARRAY _fields' || E'\n' ||
              E'\t' || 'LOOP' || E'\n' ||
                E'\t\t' || 'IF coalesce(_jsonb_new ->> _field, '''') != '''' THEN' || E'\n' ||
                  E'\t\t\t' || '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field);' || E'\n' ||
                E'\t\t' || 'END IF;' || E'\n' ||
              E'\t' || 'END LOOP;' || E'\n' ||
              E'\t' || 'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at)' || E'\n' ||
              E'\t' || 'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Created'', ''parallel'', _payload, NOW());' || E'\n' ||
              E'\t' || 'RETURN NEW;' || E'\n' ||
            'END;' || E'\n' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_insert on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_insert ' ||
            'AFTER INSERT ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_insert();';

    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_update() RETURNS TRIGGER AS $body$' || E'\n' ||
            'DECLARE' || E'\n' ||
              E'\t' || '_jsonb_old jsonb := row_to_json(OLD.*);' || E'\n' ||
              E'\t' || '_jsonb_new jsonb := row_to_json(NEW.*);' || E'\n' ||
              E'\t' || '_required_fields text[] := string_to_array(''' || required_fields || ''', '','');' || E'\n' ||
              E'\t' || '_localizable_fields text[] := string_to_array(''' || localizable_fields || ''', '','');' || E'\n' ||
              E'\t' || '_payload jsonb := ''{}''::jsonb;' || E'\n' ||
              E'\t' || '_metadata jsonb;' || E'\n' ||
              E'\t' || '_field text;' || E'\n' ||
            'BEGIN' || E'\n' ||
              E'\t' || 'FOREACH _field IN ARRAY _localizable_fields' || E'\n' ||
              E'\t' || 'LOOP' || E'\n' ||
                E'\t\t' || 'IF coalesce(_jsonb_old ->> _field, '''') != coalesce(_jsonb_new ->> _field, '''') THEN' || E'\n' ||
                  E'\t\t\t' || '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field);' || E'\n' ||
                E'\t\t' || 'END IF;' || E'\n' ||
              E'\t' || 'END LOOP;' || E'\n' ||
              E'\t' || 'IF _jsonb_new ->> ''ingest_correlation_id'' IS NOT NULL THEN' || E'\n' ||
                  E'\t\t\t' || '_metadata := jsonb_build_object(''messageContext'', jsonb_build_object(''ingestItemId'', _jsonb_new -> ''ingest_correlation_id''));' || E'\n' ||
              E'\t' || 'END IF;' || E'\n' ||
              E'\t' || 'IF _payload != ''{}''::jsonb OR _metadata IS NOT NULL THEN' ||  E'\n' ||        
                E'\t\t' || 'FOREACH _field IN ARRAY _required_fields' || E'\n' ||
                E'\t\t' || 'LOOP' || E'\n' ||
                  E'\t\t\t' || '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field);' || E'\n' ||
                E'\t\t' || 'END LOOP;' || E'\n' ||
                E'\t\t' || 'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at)' || E'\n' ||
                E'\t\t' || 'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Updated'', ''parallel'', _payload, _metadata, NOW());' || E'\n' ||
              E'\t' || 'END IF;' || E'\n' ||
              E'\t' || 'RETURN NEW;' || E'\n' ||
            'END;' || E'\n' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_update on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_update ' ||
            'AFTER UPDATE ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_update();';

    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_delete() RETURNS TRIGGER AS $body$' || E'\n' ||
            'DECLARE' || E'\n' ||
              E'\t' || '_jsonb_old jsonb := row_to_json(OLD.*);' || E'\n' ||
              E'\t' || '_fields text[] := string_to_array(''' || required_fields || ''', '','');' || E'\n' ||
              E'\t' || '_payload jsonb := ''{}''::jsonb;' || E'\n' ||
            'BEGIN' || E'\n' ||
              E'\t' || 'SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field)' || E'\n' ||
              E'\t' || 'FROM (SELECT unnest(_fields) AS field) as f INTO _payload;' || E'\n' ||
              E'\t' || 'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at)' || E'\n' ||
              E'\t' || 'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), OLD.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Deleted'', ''parallel'', _payload, NOW());' || E'\n' ||
              E'\t' || 'RETURN OLD;' || E'\n' ||
            'END;' || E'\n' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_delete on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_delete ' ||
            'AFTER DELETE ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_delete();';
END;
$$;

-- messaging related tables
SELECT ax_define.create_messaging_counter_table();
SELECT ax_define.create_messaging_health_monitoring();

-------------- #channel -----------------
--   ___  _                            _ 
--  / __|| |_   __ _  _ _   _ _   ___ | |
-- | (__ |   \ / _` || ' \ | ' \ / -_)| |
--  \___||_||_|\__/_||_||_||_||_|\___||_|
-- 
-----------------------------------------

-- table: channels
DROP TABLE IF EXISTS app_public.channels CASCADE;
CREATE TABLE app_public.channels(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  is_drm_protected BOOLEAN NOT NULL DEFAULT FALSE,
  placeholder_video_id UUID,
  dash_stream_url TEXT,
  hls_stream_url TEXT,
  key_id TEXT,
  published_date TIMESTAMPTZ,
  published_user TEXT
);

SELECT ax_define.define_audit_date_fields_on_table('channels', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('channels', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_authentication('ADMIN,CHANNELS_EDIT,CHANNELS_VIEW', 'ADMIN,CHANNELS_EDIT', 'channels', 'app_public');

SELECT ax_define.set_enum_as_column_type('publication_state', 'channels', 'app_public', 'publication_state', 'app_public', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publication_state', 'channels', 'app_public', 'publication_state_enum', 'app_public');
SELECT app_hidden.define_publish_trigger('channels', 'app_public', 'title,description,placeholder_video_id');
SELECT ax_define.define_subscription_triggers('id', 'channels', 'app_public', 'channels', 'CHANNEL');
SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'channels', 'CHANNEL', 'title,description','id');

SELECT ax_define.define_indexes_with_id('title', 'channels', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'channels', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'channels', 'app_public');
SELECT ax_define.define_indexes_with_id('published_date', 'channels', 'app_public');

GRANT SELECT, DELETE ON app_public.channels TO ":DATABASE_GQL_ROLE";
GRANT INSERT (title, description, placeholder_video_id, is_drm_protected) ON app_public.channels TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (title, description, placeholder_video_id, is_drm_protected) ON app_public.channels TO ":DATABASE_GQL_ROLE";

-- table: channel_images
DROP TABLE IF EXISTS app_public.channel_images CASCADE;
CREATE TABLE app_public.channel_images (
  channel_id UUID NOT NULL REFERENCES app_public.channels(id) ON DELETE CASCADE,
  image_id UUID NOT NULL,
  PRIMARY KEY(channel_id, image_id)
);
SELECT ax_define.define_audit_date_fields_on_table('channel_images', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('channel_images', 'app_public', ':DEFAULT_USERNAME');

SELECT ax_define.set_enum_as_column_type('image_type', 'channel_images', 'app_public', 'channel_image_type', 'app_public', 'LOGO', 'NOT NULL');
SELECT ax_define.set_enum_domain('image_type', 'channel_images', 'app_public', 'channel_image_type_enum', 'app_public');
ALTER TABLE app_public.channel_images ADD CONSTRAINT channel_id_image_type_are_unique UNIQUE(channel_id, image_type);
SELECT app_hidden.create_localizable_entity_triggers(
  'image_id', 'channel_images', 'CHANNEL_IMAGE', 'image_id','channel_id,image_id,image_type');

SELECT ax_define.define_authentication('ADMIN,CHANNELS_EDIT,CHANNELS_VIEW', 'ADMIN,CHANNELS_EDIT', 'channel_images', 'app_public');
SELECT ax_define.define_timestamp_propagation('channel_id', 'channel_images', 'app_public', 'id', 'channels', 'app_public', 'tg__sp_images_channels_mt_ts_propagation');
SELECT ax_define.define_subscription_triggers('channel_id', 'channel_images', 'app_public', 'channels', 'CHANNEL_IMAGE');

GRANT SELECT, DELETE ON app_public.channel_images TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  channel_id,
  image_type,
  image_id
) ON app_public.channel_images TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  image_id
) ON app_public.channel_images TO ":DATABASE_GQL_ROLE";

-------------- #playlist -------------
--  ___  _              _  _      _   
-- | _ \| | __ _  _  _ | |(_) ___| |_ 
-- |  _/| |/ _` || || || || |(_-/|  _|
-- |_|  |_|\__/_| \_. ||_||_|/__/ \__|
--                |__/ 
--------------------------------------

-- table: playlists
DROP TABLE IF EXISTS app_public.playlists CASCADE;
CREATE TABLE app_public.playlists(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES app_public.channels(id) ON DELETE CASCADE,
  start_date_time TIMESTAMPTZ NOT NULL,
  calculated_duration_in_seconds NUMERIC(13, 5) NOT NULL,
  published_date TIMESTAMPTZ,
  published_user TEXT
);

SELECT ax_define.define_audit_date_fields_on_table('playlists', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('playlists', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_authentication('ADMIN,CHANNELS_EDIT,CHANNELS_VIEW', 'ADMIN,CHANNELS_EDIT', 'playlists', 'app_public');

SELECT ax_define.set_enum_as_column_type('publication_state', 'playlists', 'app_public', 'publication_state', 'app_public', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publication_state', 'playlists', 'app_public', 'publication_state_enum', 'app_public');
SELECT app_hidden.define_publish_trigger('playlists', 'app_public', 'start_date_time,calculated_duration_in_seconds,channel_id');
SELECT ax_define.define_subscription_triggers('id', 'playlists', 'app_public', 'playlists', 'PLAYLIST');

SELECT ax_define.define_indexes_with_id('start_date_time', 'playlists', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'playlists', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'playlists', 'app_public');
SELECT ax_define.define_indexes_with_id('published_date', 'playlists', 'app_public');
SELECT ax_define.define_index('channel_id', 'playlists', 'app_public');

GRANT SELECT, DELETE ON app_public.playlists TO ":DATABASE_GQL_ROLE";
GRANT INSERT (channel_id, start_date_time, calculated_duration_in_seconds) ON app_public.playlists TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (start_date_time, calculated_duration_in_seconds) ON app_public.playlists TO ":DATABASE_GQL_ROLE";

DROP FUNCTION IF EXISTS app_public.playlists_calculated_end_date_time;
CREATE FUNCTION app_public.playlists_calculated_end_date_time(playlists playlists) RETURNS TIMESTAMPTZ AS $$
  SELECT playlists.start_date_time + playlists.calculated_duration_in_seconds * INTERVAL '1 seconds'
$$ LANGUAGE sql STABLE;

-------------- #program ------------------
--  ___                             
-- | _ \ _ _  ___  __ _  _ _  __ _  _ __  
-- |  _/| '_|/ _ \/ _` || '_|/ _` || '  \ 
-- |_|  |_|  \___/\__. ||_|  \__/_||_|_|_|
--                |___/           
------------------------------------------

DROP TABLE IF EXISTS app_public.programs CASCADE;
CREATE TABLE app_public.programs(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES app_public.playlists(id) ON DELETE CASCADE,
  sort_index INT NOT NULL,
  title TEXT NOT NULL,
  image_id UUID,
  video_id UUID NOT NULL,
  video_duration_in_seconds NUMERIC(13, 5) NOT NULL,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL  
);

SELECT ax_define.define_audit_date_fields_on_table('programs', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('programs', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_authentication('ADMIN,CHANNELS_EDIT,CHANNELS_VIEW', 'ADMIN,CHANNELS_EDIT', 'programs', 'app_public');

SELECT ax_define.set_enum_as_column_type('entity_type', 'programs', 'app_public', 'entity_type', 'app_public');
SELECT ax_define.set_enum_domain('entity_type', 'programs', 'app_public', 'entity_type_enum', 'app_public');
SELECT ax_define.define_subscription_triggers('playlist_id', 'programs', 'app_public', 'playlists', 'PLAYLIST_PROGRAM');
SELECT ax_define.define_timestamp_propagation('playlist_id', 'programs', 'app_public', 'id', 'playlists', 'app_public');
SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'programs', 'PROGRAM', 'title,image_id','id,title,image_id');

SELECT ax_define.define_indexes_with_id('sort_index', 'programs', 'app_public');
SELECT ax_define.define_index('playlist_id', 'programs', 'app_public');

ALTER TABLE app_public.programs DROP CONSTRAINT IF EXISTS programs_sort_index_is_unique;
ALTER TABLE app_public.programs ADD CONSTRAINT programs_sort_index_is_unique UNIQUE (playlist_id, sort_index) DEFERRABLE INITIALLY DEFERRED;

GRANT SELECT, DELETE ON app_public.programs TO ":DATABASE_GQL_ROLE";
GRANT INSERT (sort_index,
  title,
  image_id,
  video_id,
  video_duration_in_seconds,
  entity_id,
  entity_type,
  playlist_id) ON app_public.programs TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (title, sort_index) ON app_public.programs TO ":DATABASE_GQL_ROLE";

----------------------------------------- #cue-point ------------------------------------------
--  ___                                           ___                   ___       _        _   
-- | _ \ _ _  ___  __ _  _ _  __ _  _ __         / __| _  _  ___       | _ \ ___ (_) _ _  | |_ 
-- |  _/| '_|/ _ \/ _` || '_|/ _` || '  \       | (__ | || |/ -_)      |  _// _ \| || ' \ |  _|
-- |_|  |_|  \___/\__. ||_|  \__/_||_|_|_|       \___| \_._|\___|      |_|  \___/|_||_||_| \__|
--                |___/                                                                        
-----------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS app_public.program_cue_points CASCADE;
CREATE TABLE app_public.program_cue_points(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES app_public.programs(id) ON DELETE CASCADE,
  time_in_seconds NUMERIC(13, 5),
  value TEXT,
  video_cue_point_id UUID, -- reference to the cue point id in the Video Service

  CONSTRAINT time_in_seconds_min_value CHECK(ax_utils.constraint_min_value(time_in_seconds, 0, 'The value of the time in seconds cannot be a negative number.'))
);

SELECT ax_define.define_audit_date_fields_on_table('program_cue_points', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('program_cue_points', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_authentication('ADMIN,CHANNELS_EDIT,CHANNELS_VIEW', 'ADMIN,CHANNELS_EDIT', 'program_cue_points', 'app_public');

SELECT ax_define.set_enum_as_column_type('type', 'program_cue_points', 'app_public', 'program_break_type', 'app_public');
SELECT ax_define.set_enum_domain('type', 'program_cue_points', 'app_public', 'program_break_type_enum', 'app_public');

SELECT ax_define.define_indexes_with_id('time_in_seconds', 'program_cue_points', 'app_public');
SELECT ax_define.define_index('program_id', 'program_cue_points', 'app_public');
SELECT ax_define.define_timestamp_propagation('program_id', 'program_cue_points', 'app_public', 'id', 'programs', 'app_public');

GRANT SELECT, DELETE ON app_public.program_cue_points TO ":DATABASE_GQL_ROLE";

GRANT INSERT(
  time_in_seconds,
  value,
  video_cue_point_id,
  program_id,
  type
) ON app_public.program_cue_points TO ":DATABASE_GQL_ROLE";

GRANT UPDATE(
  time_in_seconds,
  value,
  video_cue_point_id,
  program_id,
  type
) ON app_public.program_cue_points TO ":DATABASE_GQL_ROLE";

-- Trigger to validate that the cue point time_in_seconds is set only for MID cue points
CREATE OR REPLACE FUNCTION app_hidden.tg__program_cue_points_time_must_be_set_only_for_mid() RETURNS trigger AS $$
BEGIN
  IF NEW.type = 'MID' THEN
    IF NEW.time_in_seconds IS NULL THEN
      PERFORM ax_utils.raise_error('The time must be set for the program cue point with type "%s".', 'CCERR', NEW.type);
    END IF;
  ELSE
    IF NEW.time_in_seconds IS NOT NULL THEN
      PERFORM ax_utils.raise_error('The time must not be set for the program cue point with type "%s".', 'CCERR', NEW.type);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql volatile;

DROP trigger IF EXISTS _300_time_must_set_only_for_mid on app_public.program_cue_points;
CREATE trigger _300_time_must_set_only_for_mid
  BEFORE INSERT OR UPDATE ON app_public.program_cue_points
  FOR EACH ROW
  EXECUTE PROCEDURE app_hidden.tg__program_cue_points_time_must_be_set_only_for_mid();

-- Trigger to validate that the video cue point id is set only for MID cue points
CREATE OR REPLACE FUNCTION app_hidden.tg__program_cue_points_video_cue_point_id_must_set_only_for_mid() RETURNS trigger AS $$
BEGIN
  IF NEW.type = 'MID' THEN
    IF NEW.video_cue_point_id IS NULL THEN
      PERFORM ax_utils.raise_error('The video cue point id must be set for the program cue point with type "%s".', 'CCERR', NEW.type);
    END IF;
  ELSE
    IF NEW.video_cue_point_id IS NOT NULL THEN
      PERFORM ax_utils.raise_error('The video cue point id must not be set for the program cue point with type "%s".', 'CCERR', NEW.type);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql volatile;

DROP trigger IF EXISTS _300_video_cue_point_id_must_set_only_for_mid on app_public.program_cue_points;
CREATE trigger _300_video_cue_point_id_must_set_only_for_mid
  BEFORE INSERT OR UPDATE ON app_public.program_cue_points
  FOR EACH ROW
  EXECUTE PROCEDURE app_hidden.tg__program_cue_points_video_cue_point_id_must_set_only_for_mid();

-- Trigger to validate the program cue point time against the associated program video duration
CREATE OR REPLACE FUNCTION app_hidden.tg__program_cue_points_time_must_be_within_duration() RETURNS trigger AS $$
DECLARE
  program_video_duration INT;
BEGIN
  SELECT video_duration_in_seconds INTO program_video_duration FROM app_public.programs WHERE id = NEW.program_id;
  IF NEW.time_in_seconds > program_video_duration THEN
     PERFORM ax_utils.raise_error('The program cue point time must be within the duration of the program.', 'CCERR'); 
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql volatile;

DROP trigger IF EXISTS _300_time_must_be_within_duration on app_public.program_cue_points;
CREATE trigger _300_time_must_be_within_duration
  BEFORE INSERT OR UPDATE ON app_public.program_cue_points
  FOR EACH ROW
  EXECUTE PROCEDURE app_hidden.tg__program_cue_points_time_must_be_within_duration();

-- there must be only one PRE cue point and one POST cue point
DROP INDEX IF EXISTS idx_program_cue_points_type_mt_unique;
CREATE UNIQUE INDEX idx_program_cue_points_type_mt_unique 
  ON app_public.program_cue_points (program_id, type) 
  WHERE (type <> 'MID');

-------------- #cue-point-schedule --------------------------------------------------------------
---   ___                   ___       _        _          ___      _             _        _      
---  / __| _  _  ___       | _ \ ___ (_) _ _  | |_       / __| __ | |_   ___  __| | _  _ | | ___ 
--- | (__ | || |/ -_)      |  _// _ \| || ' \ |  _|      \__ \/ _||   \ / -_)/ _` || || || |/ -_)
---  \___| \_._|\___|      |_|  \___/|_||_||_| \__|      |___/\__||_||_|\___|\__/_| \_._||_|\___|
---  
-------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS app_public.cue_point_schedules CASCADE;
CREATE TABLE app_public.cue_point_schedules(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_cue_point_id UUID NOT NULL REFERENCES app_public.program_cue_points(id) ON DELETE CASCADE,
  sort_index INT NOT NULL,
  video_id UUID, -- mandatory, if type is video
  duration_in_seconds NUMERIC(13, 5) NOT NULL  
);

SELECT ax_define.define_audit_date_fields_on_table('cue_point_schedules', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('cue_point_schedules', 'app_public', ':DEFAULT_USERNAME');

SELECT ax_define.set_enum_as_column_type('type', 'cue_point_schedules', 'app_public', 'cue_point_schedule_type', 'app_public','NOT NULL');
SELECT ax_define.set_enum_domain('type', 'cue_point_schedules', 'app_public', 'cue_point_schedule_type_enum', 'app_public');
SELECT ax_define.define_authentication('ADMIN,CHANNELS_EDIT,CHANNELS_VIEW', 'ADMIN,CHANNELS_EDIT', 'cue_point_schedules', 'app_public');

SELECT ax_define.define_indexes_with_id('sort_index', 'cue_point_schedules', 'app_public');
SELECT ax_define.define_index('program_cue_point_id', 'cue_point_schedules', 'app_public');
SELECT ax_define.define_timestamp_propagation('program_cue_point_id', 'cue_point_schedules', 'app_public', 'id', 'program_cue_points', 'app_public');

ALTER TABLE app_public.cue_point_schedules DROP CONSTRAINT IF EXISTS cue_point_schedules_sort_index_is_unique;
ALTER TABLE app_public.cue_point_schedules ADD CONSTRAINT cue_point_schedules_sort_index_is_unique UNIQUE (program_cue_point_id, sort_index) DEFERRABLE INITIALLY DEFERRED;

-- The cue point schedule sort index cannot be a negative number
ALTER TABLE app_public.cue_point_schedules DROP CONSTRAINT IF EXISTS sort_index_min_value;
ALTER TABLE app_public.cue_point_schedules ADD CONSTRAINT sort_index_min_value CHECK(ax_utils.constraint_min_value(sort_index, 0, 'Cue point schedule sort index cannot be less than zero.'));

-- The cue point schedule duration cannot be zero or a negative number
ALTER TABLE app_public.cue_point_schedules DROP CONSTRAINT IF EXISTS duration_in_seconds_min_value;
ALTER TABLE app_public.cue_point_schedules ADD CONSTRAINT duration_in_seconds_min_value CHECK(ax_utils.constraint_min_value(duration_in_seconds, 0.00001, 'Cue point schedule duration cannot be less or equal to zero.'));

-- Column `video_id` is required (only) for 'VIDEO' cue point schedules
CREATE OR REPLACE FUNCTION app_hidden.tg__cue_point_schedules_video_id_must_be_set_only_for_video_schedule() RETURNS trigger AS $$
BEGIN
  IF NEW.type = 'VIDEO' THEN
    IF NEW.video_id IS NULL THEN
      PERFORM ax_utils.raise_error('The video id must be set for the cue point schedule with type "%s".', 'CCERR', NEW.type);
    END IF;
  ELSE
    IF NEW.video_id IS NOT NULL THEN
      PERFORM ax_utils.raise_error('The video id must not be set for the cue point schedule with type "%s".', 'CCERR', NEW.type);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql volatile;

DROP trigger IF EXISTS _300_video_id_must_set_only_for_video_schedule on app_public.cue_point_schedules;
CREATE trigger _300_video_id_must_set_only_for_video_schedule
  BEFORE INSERT OR UPDATE ON app_public.cue_point_schedules
  FOR EACH ROW
  EXECUTE PROCEDURE app_hidden.tg__cue_point_schedules_video_id_must_be_set_only_for_video_schedule();

-- create new cue point schedule for 'AD_POD'
DROP FUNCTION IF EXISTS app_public.create_ad_cue_point_schedule;
CREATE OR REPLACE FUNCTION app_public.create_ad_cue_point_schedule(
  sort_index INT,
  duration_in_seconds NUMERIC(13,5),
  program_cue_point_id UUID
)
  RETURNS app_public.cue_point_schedules AS $$
    INSERT INTO app_public.cue_point_schedules AS s (sort_index, duration_in_seconds, program_cue_point_id, type)
      VALUES ($1, $2, $3, 'AD_POD')
    RETURNING *
  $$ LANGUAGE SQL VOLATILE;

-- create new cue point schedule for 'VIDEO'
DROP FUNCTION IF EXISTS app_public.create_video_cue_point_schedule;
CREATE OR REPLACE FUNCTION app_public.create_video_cue_point_schedule(
  sort_index INT,
  duration_in_seconds NUMERIC(13,5),
  video_id UUID,
  program_cue_point_id UUID
)
  RETURNS app_public.cue_point_schedules AS $$
    INSERT INTO app_public.cue_point_schedules AS s (sort_index, duration_in_seconds, video_id, program_cue_point_id, type)
      VALUES ($1, $2, $3, $4, 'VIDEO')
    RETURNING *
  $$ LANGUAGE SQL VOLATILE;

-- update existing cue point schedule for 'AD_POD'
DROP FUNCTION IF EXISTS app_public.update_ad_cue_point_schedule;
CREATE OR REPLACE FUNCTION app_public.update_ad_cue_point_schedule(
  id UUID,
  sort_index INT,
  duration_in_seconds NUMERIC(13,5),
  program_cue_point_id UUID
)
  RETURNS app_public.cue_point_schedules AS $$
    UPDATE app_public.cue_point_schedules
    SET
      sort_index = COALESCE($2,sort_index),
      duration_in_seconds = COALESCE($3, duration_in_seconds),
      program_cue_point_id = COALESCE($4, program_cue_point_id)
    WHERE id = $1 AND type = 'AD_POD'
    RETURNING *
  $$ LANGUAGE SQL VOLATILE;

-- update existing cue point schedule for 'VIDEO'
DROP FUNCTION IF EXISTS app_public.update_video_cue_point_schedule;
CREATE OR REPLACE FUNCTION app_public.update_video_cue_point_schedule(
  id UUID,
  sort_index INT,
  program_cue_point_id UUID
)
  RETURNS app_public.cue_point_schedules AS $$
    UPDATE app_public.cue_point_schedules
    SET
      sort_index = COALESCE($2,sort_index),
      program_cue_point_id = COALESCE($3, program_cue_point_id)
    WHERE id = $1 AND type = 'VIDEO'
    RETURNING *
  $$ LANGUAGE SQL VOLATILE;

GRANT SELECT, DELETE ON app_public.cue_point_schedules TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  sort_index,
  duration_in_seconds,
  video_id,
  program_cue_point_id,
  type
) ON app_public.cue_point_schedules TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  sort_index,
  duration_in_seconds,
  program_cue_point_id
) ON app_public.cue_point_schedules TO ":DATABASE_GQL_ROLE";

----------------- #outbox ----------------
--   ___   _   _  _____  ___   ___  __  __
--  / _ \ | | | ||_   _|| _ ) / _ \ \ \/ /
-- | (_) || |_| |  | |  | _ \| (_) | >  < 
--  \___/  \___/   |_|  |___/ \___/ /_/\_\
------------------------------------------
 
DROP TABLE IF EXISTS app_hidden.outbox CASCADE;
CREATE TABLE app_hidden.outbox (
  id uuid PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  segment TEXT,
  concurrency TEXT NOT NULL DEFAULT 'sequential',
  payload JSONB NOT NULL,
  metadata JSONB,
  locked_until TIMESTAMPTZ NOT NULL DEFAULT to_timestamp(0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  processed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  started_attempts smallint NOT NULL DEFAULT 0,
  finished_attempts smallint NOT NULL DEFAULT 0
);
ALTER TABLE app_hidden.outbox ADD CONSTRAINT outbox_concurrency_check
  CHECK (concurrency IN ('sequential', 'parallel'));

GRANT SELECT, INSERT, DELETE ON app_hidden.outbox TO :DATABASE_GQL_ROLE;
GRANT UPDATE (locked_until, processed_at, abandoned_at, started_attempts, finished_attempts) ON app_hidden.outbox TO :DATABASE_GQL_ROLE;
GRANT SELECT, INSERT, UPDATE, DELETE ON app_hidden.outbox TO :DB_OWNER;

-- Create the function to get the next batch of messages from the outbox table.
DROP FUNCTION IF EXISTS app_hidden.next_outbox_messages(integer, integer);
CREATE OR REPLACE FUNCTION app_hidden.next_outbox_messages(
  max_size integer, lock_ms integer)
    RETURNS SETOF app_hidden.outbox 
    LANGUAGE 'plpgsql'

AS $BODY$
DECLARE 
  loop_row app_hidden.outbox%ROWTYPE;
  message_row app_hidden.outbox%ROWTYPE;
  ids uuid[] := '{}';
BEGIN

  IF max_size < 1 THEN
    RAISE EXCEPTION 'The max_size for the next messages batch must be at least one.' using errcode = 'MAXNR';
  END IF;

  -- get (only) the oldest message of every segment but only return it if it is not locked
  FOR loop_row IN
    SELECT * FROM app_hidden.outbox m WHERE m.id in (SELECT DISTINCT ON (segment) id
      FROM app_hidden.outbox
      WHERE processed_at IS NULL AND abandoned_at IS NULL
      ORDER BY segment, created_at) order by created_at
  LOOP
    BEGIN
      EXIT WHEN cardinality(ids) >= max_size;
    
      SELECT *
        INTO message_row
        FROM app_hidden.outbox
        WHERE id = loop_row.id
        FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked
      
      IF message_row.locked_until > NOW() THEN
        CONTINUE;
      END IF;
      
      ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
    END;
  END LOOP;
  
  -- if max_size not reached: get the oldest parallelizable message independent of segment
  IF cardinality(ids) < max_size THEN
    FOR loop_row IN
      SELECT * FROM app_hidden.outbox
        WHERE concurrency = 'parallel' AND processed_at IS NULL AND abandoned_at IS NULL AND locked_until < NOW() 
          AND id NOT IN (SELECT UNNEST(ids))
        order by created_at
    LOOP
      BEGIN
        EXIT WHEN cardinality(ids) >= max_size;

        SELECT *
          INTO message_row
          FROM app_hidden.outbox
          WHERE id = loop_row.id
          FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked

        ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
      END;
    END LOOP;
  END IF;
  
  -- set a short lock value so the the workers can each process a message
  IF cardinality(ids) > 0 THEN

    RETURN QUERY 
      UPDATE app_hidden.outbox
        SET locked_until = clock_timestamp() + (lock_ms || ' milliseconds')::INTERVAL, started_attempts = started_attempts + 1
        WHERE ID = ANY(ids)
        RETURNING *;

  END IF;
END;
$BODY$;

SELECT ax_define.define_index('segment', 'outbox', 'app_hidden');
SELECT ax_define.define_index('created_at', 'outbox', 'app_hidden');
SELECT ax_define.define_index('processed_at', 'outbox', 'app_hidden');
SELECT ax_define.define_index('abandoned_at', 'outbox', 'app_hidden');
SELECT ax_define.define_index('locked_until', 'outbox', 'app_hidden');

------------ #inbox ------------
-- ____  _  _  ___   ___  __  __
-- |_ _|| \| || _ ) / _ \ \ \/ /
--  | | | .  || _ \| (_) | >  < 
-- |___||_|\_||___/ \___/ /_/\_\
--------------------------------
 
DROP TABLE IF EXISTS app_hidden.inbox CASCADE;
CREATE TABLE app_hidden.inbox (
  id uuid PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  segment TEXT,
  concurrency TEXT NOT NULL DEFAULT 'sequential',
  payload JSONB NOT NULL,
  metadata JSONB,
  locked_until TIMESTAMPTZ NOT NULL DEFAULT to_timestamp(0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  processed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  started_attempts smallint NOT NULL DEFAULT 0,
  finished_attempts smallint NOT NULL DEFAULT 0
);
ALTER TABLE app_hidden.inbox ADD CONSTRAINT inbox_concurrency_check
  CHECK (concurrency IN ('sequential', 'parallel'));

GRANT SELECT, INSERT, DELETE ON app_hidden.inbox TO :DATABASE_GQL_ROLE;
GRANT UPDATE (locked_until, processed_at, abandoned_at, started_attempts, finished_attempts) ON app_hidden.inbox TO :DATABASE_GQL_ROLE;
GRANT SELECT, INSERT, UPDATE, DELETE ON app_hidden.inbox TO :DB_OWNER;


-- Create the function to get the next batch of messages from the inbox table.
DROP FUNCTION IF EXISTS app_hidden.next_inbox_messages(integer, integer);
CREATE OR REPLACE FUNCTION app_hidden.next_inbox_messages(
  max_size integer, lock_ms integer)
    RETURNS SETOF app_hidden.inbox 
    LANGUAGE 'plpgsql'

AS $BODY$
DECLARE 
  loop_row app_hidden.inbox%ROWTYPE;
  message_row app_hidden.inbox%ROWTYPE;
  ids uuid[] := '{}';
BEGIN

  IF max_size < 1 THEN
    RAISE EXCEPTION 'The max_size for the next messages batch must be at least one.' using errcode = 'MAXNR';
  END IF;

  -- get (only) the oldest message of every segment but only return it if it is not locked
  FOR loop_row IN
    SELECT * FROM app_hidden.inbox m WHERE m.id in (SELECT DISTINCT ON (segment) id
      FROM app_hidden.inbox
      WHERE processed_at IS NULL AND abandoned_at IS NULL
      ORDER BY segment, created_at) order by created_at
  LOOP
    BEGIN
      EXIT WHEN cardinality(ids) >= max_size;
    
      SELECT *
        INTO message_row
        FROM app_hidden.inbox
        WHERE id = loop_row.id
        FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked
      
      IF message_row.locked_until > NOW() THEN
        CONTINUE;
      END IF;
      
      ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
    END;
  END LOOP;
  
  -- if max_size not reached: get the oldest parallelizable message independent of segment
  IF cardinality(ids) < max_size THEN
    FOR loop_row IN
      SELECT * FROM app_hidden.inbox
        WHERE concurrency = 'parallel' AND processed_at IS NULL AND abandoned_at IS NULL AND locked_until < NOW() 
          AND id NOT IN (SELECT UNNEST(ids))
        order by created_at
    LOOP
      BEGIN
        EXIT WHEN cardinality(ids) >= max_size;

        SELECT *
          INTO message_row
          FROM app_hidden.inbox
          WHERE id = loop_row.id
          FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked

        ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
      END;
    END LOOP;
  END IF;
  
  -- set a short lock value so the the workers can each process a message
  IF cardinality(ids) > 0 THEN

    RETURN QUERY 
      UPDATE app_hidden.inbox
        SET locked_until = clock_timestamp() + (lock_ms || ' milliseconds')::INTERVAL, started_attempts = started_attempts + 1
        WHERE ID = ANY(ids)
        RETURNING *;

  END IF;
END;
$BODY$;

SELECT ax_define.define_index('segment', 'inbox', 'app_hidden');
SELECT ax_define.define_index('created_at', 'inbox', 'app_hidden');
SELECT ax_define.define_index('processed_at', 'inbox', 'app_hidden');
SELECT ax_define.define_index('abandoned_at', 'inbox', 'app_hidden');
SELECT ax_define.define_index('locked_until', 'inbox', 'app_hidden');
