--! Previous: sha1:dfaef66888758c6069e1046fa16ccf260d3949d7
--! Hash: sha1:9e95c84d3da67cc99a97bd12bfa598291d9a7050
--! Message: video-stream-columns-updated

-- movie_video_streams START

-- Migrate existing columns
DO $$ BEGIN
  IF ax_define.column_exists('drm_key_id', 'movie_video_streams', 'app_public') THEN
    ALTER TABLE app_public.movie_video_streams RENAME COLUMN drm_key_id TO key_id;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('bandwidth_in_bps', 'movie_video_streams', 'app_public') THEN
    UPDATE app_public.movie_video_streams SET bandwidth_in_bps = bandwidth_in_bps/1000 WHERE bandwidth_in_bps IS NOT NULL;
    ALTER TABLE app_public.movie_video_streams RENAME COLUMN bandwidth_in_bps TO bitrate_in_kbps;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('initial_file', 'movie_video_streams', 'app_public') THEN
    UPDATE app_public.movie_video_streams
    SET initial_file =
    (
        CASE
            WHEN format = 'DASH'           THEN FORMAT('dash/%s', initial_file)
            -- Previous implementation was incorrect, no _init.mp4 ending was necessary
            WHEN format = 'DASH_ON_DEMAND' THEN FORMAT('dash/%s', REPLACE(initial_file, '_init.mp4', '.mp4'))
            WHEN format = 'CMAF'           THEN FORMAT('cmaf/%s', initial_file)
            WHEN format = 'HLS'            THEN FORMAT('hls/%s', initial_file)
        END
    )
    WHERE initial_file IS NOT NULL;
    ALTER TABLE app_public.movie_video_streams RENAME COLUMN initial_file TO file;
  END IF;
END $$;

SELECT ax_define.create_enum_table(
  'video_stream_type',
  'app_public',
  ':DATABASE_LOGIN',
  '{"VIDEO","AUDIO","SUBTITLE","CLOSED_CAPTION"}',
  '{"Video","Audio","Subtitle","Closed caption"}');

SELECT ax_define.set_enum_as_column_type('type', 'movie_video_streams', 'app_public', 'video_stream_type', 'app_public', 'VIDEO', 'NULL');
SELECT ax_define.set_enum_domain('type', 'movie_video_streams', 'app_public', 'video_stream_type_enum', 'app_public');

UPDATE app_public.movie_video_streams SET type = 'AUDIO' WHERE LOWER(label) = 'audio';
UPDATE app_public.movie_video_streams SET type = 'SUBTITLE' WHERE LOWER(label) = 'subtitle';
UPDATE app_public.movie_video_streams SET type = 'CLOSED_CAPTION' WHERE LOWER(label) = 'closed-caption';
ALTER TABLE app_public.movie_video_streams ALTER COLUMN type DROP DEFAULT;

SELECT ax_define.define_index('type', 'movie_video_streams', 'app_public');

-- Add new columns
ALTER TABLE app_public.movie_video_streams
   ADD COLUMN IF NOT EXISTS file_template TEXT,
   ADD COLUMN IF NOT EXISTS codecs TEXT,
   ADD COLUMN IF NOT EXISTS frame_rate NUMERIC(8, 5),
   ADD COLUMN IF NOT EXISTS height INT,
   ADD COLUMN IF NOT EXISTS width INT,
   ADD COLUMN IF NOT EXISTS display_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS pixel_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS sampling_rate INT,
   ADD COLUMN IF NOT EXISTS language_name TEXT;

-- movie_video_streams END

-- episode_video_streams START

-- Migrate existing columns
DO $$ BEGIN
  IF ax_define.column_exists('drm_key_id', 'episode_video_streams', 'app_public') THEN
    ALTER TABLE app_public.episode_video_streams RENAME COLUMN drm_key_id TO key_id;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('bandwidth_in_bps', 'episode_video_streams', 'app_public') THEN
    UPDATE app_public.episode_video_streams SET bandwidth_in_bps = bandwidth_in_bps/1000 WHERE bandwidth_in_bps IS NOT NULL;
    ALTER TABLE app_public.episode_video_streams RENAME COLUMN bandwidth_in_bps TO bitrate_in_kbps;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('initial_file', 'episode_video_streams', 'app_public') THEN
    UPDATE app_public.episode_video_streams
    SET initial_file =
    (
        CASE
            WHEN format = 'DASH'           THEN FORMAT('dash/%s', initial_file)
            -- Previous implementation was incorrect, no _init.mp4 ending was necessary
            WHEN format = 'DASH_ON_DEMAND' THEN FORMAT('dash/%s', REPLACE(initial_file, '_init.mp4', '.mp4'))
            WHEN format = 'CMAF'           THEN FORMAT('cmaf/%s', initial_file)
            WHEN format = 'HLS'            THEN FORMAT('hls/%s', initial_file)
        END
    )
    WHERE initial_file IS NOT NULL;
    ALTER TABLE app_public.episode_video_streams RENAME COLUMN initial_file TO file;
  END IF;
END $$;

SELECT ax_define.set_enum_as_column_type('type', 'episode_video_streams', 'app_public', 'video_stream_type', 'app_public', 'VIDEO', 'NULL');
SELECT ax_define.set_enum_domain('type', 'episode_video_streams', 'app_public', 'video_stream_type_enum', 'app_public');

UPDATE app_public.episode_video_streams SET type = 'AUDIO' WHERE LOWER(label) = 'audio';
UPDATE app_public.episode_video_streams SET type = 'SUBTITLE' WHERE LOWER(label) = 'subtitle';
UPDATE app_public.episode_video_streams SET type = 'CLOSED_CAPTION' WHERE LOWER(label) = 'closed-caption';
ALTER TABLE app_public.episode_video_streams ALTER COLUMN type DROP DEFAULT;

SELECT ax_define.define_index('type', 'episode_video_streams', 'app_public');

-- Add new columns
ALTER TABLE app_public.episode_video_streams
   ADD COLUMN IF NOT EXISTS file_template TEXT,
   ADD COLUMN IF NOT EXISTS codecs TEXT,
   ADD COLUMN IF NOT EXISTS frame_rate NUMERIC(8, 5),
   ADD COLUMN IF NOT EXISTS height INT,
   ADD COLUMN IF NOT EXISTS width INT,
   ADD COLUMN IF NOT EXISTS display_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS pixel_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS sampling_rate INT,
   ADD COLUMN IF NOT EXISTS language_name TEXT;

-- episode_video_streams END

-- season_video_streams START

-- Migrate existing columns
DO $$ BEGIN
  IF ax_define.column_exists('drm_key_id', 'season_video_streams', 'app_public') THEN
    ALTER TABLE app_public.season_video_streams RENAME COLUMN drm_key_id TO key_id;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('bandwidth_in_bps', 'season_video_streams', 'app_public') THEN
    UPDATE app_public.season_video_streams SET bandwidth_in_bps = bandwidth_in_bps/1000 WHERE bandwidth_in_bps IS NOT NULL;
    ALTER TABLE app_public.season_video_streams RENAME COLUMN bandwidth_in_bps TO bitrate_in_kbps;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('initial_file', 'season_video_streams', 'app_public') THEN
    UPDATE app_public.season_video_streams
    SET initial_file =
    (
        CASE
            WHEN format = 'DASH'           THEN FORMAT('dash/%s', initial_file)
            -- Previous implementation was incorrect, no _init.mp4 ending was necessary
            WHEN format = 'DASH_ON_DEMAND' THEN FORMAT('dash/%s', REPLACE(initial_file, '_init.mp4', '.mp4'))
            WHEN format = 'CMAF'           THEN FORMAT('cmaf/%s', initial_file)
            WHEN format = 'HLS'            THEN FORMAT('hls/%s', initial_file)
        END
    )
    WHERE initial_file IS NOT NULL;
    ALTER TABLE app_public.season_video_streams RENAME COLUMN initial_file TO file;
  END IF;
END $$;

SELECT ax_define.set_enum_as_column_type('type', 'season_video_streams', 'app_public', 'video_stream_type', 'app_public', 'VIDEO', 'NULL');
SELECT ax_define.set_enum_domain('type', 'season_video_streams', 'app_public', 'video_stream_type_enum', 'app_public');

UPDATE app_public.season_video_streams SET type = 'AUDIO' WHERE LOWER(label) = 'audio';
UPDATE app_public.season_video_streams SET type = 'SUBTITLE' WHERE LOWER(label) = 'subtitle';
UPDATE app_public.season_video_streams SET type = 'CLOSED_CAPTION' WHERE LOWER(label) = 'closed-caption';
ALTER TABLE app_public.season_video_streams ALTER COLUMN type DROP DEFAULT;

SELECT ax_define.define_index('type', 'season_video_streams', 'app_public');

-- Add new columns
ALTER TABLE app_public.season_video_streams
   ADD COLUMN IF NOT EXISTS file_template TEXT,
   ADD COLUMN IF NOT EXISTS codecs TEXT,
   ADD COLUMN IF NOT EXISTS frame_rate NUMERIC(8, 5),
   ADD COLUMN IF NOT EXISTS height INT,
   ADD COLUMN IF NOT EXISTS width INT,
   ADD COLUMN IF NOT EXISTS display_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS pixel_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS sampling_rate INT,
   ADD COLUMN IF NOT EXISTS language_name TEXT;

-- season_video_streams END

-- tvshow_video_streams START

-- Migrate existing columns
DO $$ BEGIN
  IF ax_define.column_exists('drm_key_id', 'tvshow_video_streams', 'app_public') THEN
    ALTER TABLE app_public.tvshow_video_streams RENAME COLUMN drm_key_id TO key_id;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('bandwidth_in_bps', 'tvshow_video_streams', 'app_public') THEN
    UPDATE app_public.tvshow_video_streams SET bandwidth_in_bps = bandwidth_in_bps/1000 WHERE bandwidth_in_bps IS NOT NULL;
    ALTER TABLE app_public.tvshow_video_streams RENAME COLUMN bandwidth_in_bps TO bitrate_in_kbps;
  END IF;
END $$;

DO $$ BEGIN
  IF ax_define.column_exists('initial_file', 'tvshow_video_streams', 'app_public') THEN
    UPDATE app_public.tvshow_video_streams
    SET initial_file =
    (
        CASE
            WHEN format = 'DASH'           THEN FORMAT('dash/%s', initial_file)
            -- Previous implementation was incorrect, no _init.mp4 ending was necessary
            WHEN format = 'DASH_ON_DEMAND' THEN FORMAT('dash/%s', REPLACE(initial_file, '_init.mp4', '.mp4'))
            WHEN format = 'CMAF'           THEN FORMAT('cmaf/%s', initial_file)
            WHEN format = 'HLS'            THEN FORMAT('hls/%s', initial_file)
        END
    )
    WHERE initial_file IS NOT NULL;
    ALTER TABLE app_public.tvshow_video_streams RENAME COLUMN initial_file TO file;
  END IF;
END $$;

SELECT ax_define.set_enum_as_column_type('type', 'tvshow_video_streams', 'app_public', 'video_stream_type', 'app_public', 'VIDEO', 'NULL');
SELECT ax_define.set_enum_domain('type', 'tvshow_video_streams', 'app_public', 'video_stream_type_enum', 'app_public');

UPDATE app_public.tvshow_video_streams SET type = 'AUDIO' WHERE LOWER(label) = 'audio';
UPDATE app_public.tvshow_video_streams SET type = 'SUBTITLE' WHERE LOWER(label) = 'subtitle';
UPDATE app_public.tvshow_video_streams SET type = 'CLOSED_CAPTION' WHERE LOWER(label) = 'closed-caption';
ALTER TABLE app_public.tvshow_video_streams ALTER COLUMN type DROP DEFAULT;

SELECT ax_define.define_index('type', 'tvshow_video_streams', 'app_public');

-- Add new columns
ALTER TABLE app_public.tvshow_video_streams
   ADD COLUMN IF NOT EXISTS file_template TEXT,
   ADD COLUMN IF NOT EXISTS codecs TEXT,
   ADD COLUMN IF NOT EXISTS frame_rate NUMERIC(8, 5),
   ADD COLUMN IF NOT EXISTS height INT,
   ADD COLUMN IF NOT EXISTS width INT,
   ADD COLUMN IF NOT EXISTS display_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS pixel_aspect_ratio TEXT,
   ADD COLUMN IF NOT EXISTS sampling_rate INT,
   ADD COLUMN IF NOT EXISTS language_name TEXT;

-- tvshow_video_streams END

-- rename duration to length_in_seconds

DO $do$ BEGIN
  IF EXISTS (SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'app_public' AND table_name = 'movie_videos' AND column_name = 'duration' AND data_type = 'integer')
  THEN
    ALTER TABLE app_public.movie_videos ALTER COLUMN duration TYPE NUMERIC(13,5) USING duration;
    ALTER TABLE app_public.movie_videos RENAME COLUMN duration TO length_in_seconds;
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'app_public' AND table_name = 'tvshow_videos' AND column_name = 'duration' AND data_type = 'integer')
  THEN
    ALTER TABLE app_public.tvshow_videos ALTER COLUMN duration TYPE NUMERIC(13,5) USING duration;
    ALTER TABLE app_public.tvshow_videos RENAME COLUMN duration TO length_in_seconds;
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'app_public' AND table_name = 'season_videos' AND column_name = 'duration' AND data_type = 'integer')
  THEN
    ALTER TABLE app_public.season_videos ALTER COLUMN duration TYPE NUMERIC(13,5) USING duration;
    ALTER TABLE app_public.season_videos RENAME COLUMN duration TO length_in_seconds;
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'app_public' AND table_name = 'episode_videos' AND column_name = 'duration' AND data_type = 'integer')
  THEN
    ALTER TABLE app_public.episode_videos ALTER COLUMN duration TYPE NUMERIC(13,5) USING duration;
    ALTER TABLE app_public.episode_videos RENAME COLUMN duration TO length_in_seconds;
  END IF;
END $do$;
