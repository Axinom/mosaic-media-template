--! Previous: sha1:dbf6973f239c04e2b9a1f61e353345ee4d03e12d
--! Hash: sha1:2868a194c17107ef4a7170f6823463a67e0e0a93
--! Message: add-video-views

-- Indexes to improve performance of movie_videos_view (START)
CREATE INDEX IF NOT EXISTS idx_movie_licenses_movie_id_end_time
ON app_public.movie_licenses(movie_id, end_time);

CREATE INDEX IF NOT EXISTS idx_movie_videos_movie_id_type
ON app_public.movie_videos(movie_id, type);
-- Indexes to improve performance of movie_videos_view (END)

-- movie_videos_view (START)
-- This view takes the licenses for a movie and only returns the MAIN
-- video if the license is valid for the current time
-- If the license is not valid for the current time and if it still has future licenses,
-- it returns the TRAILER videos.
DROP VIEW IF EXISTS app_public.movie_videos_view ;
CREATE OR REPLACE VIEW app_public.movie_videos_view AS
SELECT 	DISTINCT ON (mvc.id)
       	mvc.id,
       	mvc.movie_id,
       	mvc.type,
       	mvc.title,
       	mvc.length_in_seconds,
       	mvc.audio_languages,
       	mvc.subtitle_languages,
       	mvc.caption_languages,
       	mvc.dash_manifest,
       	mvc.hls_manifest,
       	mvc.is_protected,
       	mvc.output_format,
       	mvc.drm_key_id,
       	mvc.file_size_in_bytes,
       	mvc.main_url
FROM (
WITH
  ts AS (
    -- bind NOW() only once
  	SELECT  now() AS current_ts
  ),
	-- Optimize the base license query to only read movie_licenses once
	base_licenses AS (
  	SELECT  ml.movie_id,
  		      ml.countries,
        		ml.start_time,
        		ml.end_time
  	FROM  app_public.movie_licenses ml
  	CROSS JOIN ts
  	WHERE   ts.current_ts < COALESCE(ml.end_time, 'infinity'::timestamp)
  ),
	-- for TRAILER: any license whose end_time > now
	trailer_countries AS (
  	SELECT  DISTINCT bl.movie_id,
        		CASE
       			  -- For country-specific licenses, use the actual country
              WHEN bl.countries IS NOT NULL AND array_length(bl.countries, 1) > 0 THEN
                c.country_code
        			-- For global licenses, use wildcard
        			ELSE '*'
       			END AS country_code
  	FROM  base_licenses bl
    LEFT  JOIN LATERAL (SELECT  UNNEST(bl.countries) AS country_code) c
          ON
         	bl.countries IS NOT NULL
  				AND CARDINALITY(bl.countries) > 0
  ),
	-- for MAIN: only licenses active right now
	main_countries AS (
	SELECT  DISTINCT bl.movie_id,
      		CASE
     			  -- For country-specific licenses, use the actual country
            WHEN bl.countries IS NOT NULL AND array_length(bl.countries, 1) > 0 THEN
              c.country_code
    				-- For global licenses, use wildcard
    				ELSE '*'
     			END AS country_code
		FROM  base_licenses bl
		LEFT  JOIN LATERAL (SELECT UNNEST(bl.countries) AS country_code) c
		      ON bl.countries IS NOT NULL
					AND CARDINALITY(bl.countries) > 0
		CROSS JOIN ts
		WHERE ts.current_ts >= COALESCE(bl.start_time, '-infinity'::timestamp)
  ),
	-- union them, tagging by video type
	license_countries AS (
   	SELECT  movie_id,
  		      country_code,
        		'TRAILER' AS TYPE
  	FROM  trailer_countries
    UNION
  	SELECT  movie_id,
  		      country_code,
        		'MAIN' AS TYPE
  	FROM	main_countries
  )
	SELECT
		mv.id,
		mv.movie_id,
		mv.type,
		mv.title,
		mv.length_in_seconds,
		mv.audio_languages,
		mv.subtitle_languages,
		mv.caption_languages,
		mv.dash_manifest,
		mv.hls_manifest,
		mv.is_protected,
		mv.output_format,
		mv.drm_key_id,
		mv.file_size_in_bytes,
		mv.main_url,
		-- if no matching country row, show "*"
   COALESCE(lc.country_code, '*') AS country_code
	FROM app_public.movie_videos mv
	INNER JOIN license_countries lc
  ON lc.movie_id = mv.movie_id
	AND lc.type = mv.TYPE) mvc
WHERE (mvc.country_code = COALESCE(NULLIF((SELECT current_setting('mosaic.country_code'::text, true) as current_country_code), ''), '*')
OR mvc.country_code = '*');

GRANT SELECT ON app_public.movie_videos_view TO ":DATABASE_GQL_ROLE";
-- movie_videos_view (END)

-- Indexes to improve performance of episode_videos_view (START)
CREATE INDEX IF NOT EXISTS idx_episode_licenses_episode_id_end_time
ON app_public.episode_licenses(episode_id, end_time);

CREATE INDEX IF NOT EXISTS idx_episode_videos_episode_id_type
ON app_public.episode_videos(episode_id, type);
-- Indexes to improve performance of episode_videos_view (END)

-- episode_videos_view (START)
-- This view takes the licenses for an episode and only returns the MAIN
-- video if the license is valid for the current time
-- If the license is not valid for the current time and if it still has future licenses,
-- it returns the TRAILER videos.
DROP VIEW IF EXISTS app_public.episode_videos_view ;
CREATE OR REPLACE VIEW app_public.episode_videos_view AS
SELECT 	DISTINCT ON (evc.id)
       	evc.id,
       	evc.episode_id,
       	evc.type,
       	evc.title,
       	evc.length_in_seconds,
       	evc.audio_languages,
       	evc.subtitle_languages,
       	evc.caption_languages,
       	evc.dash_manifest,
       	evc.hls_manifest,
       	evc.is_protected,
       	evc.output_format,
       	evc.drm_key_id,
       	evc.file_size_in_bytes,
       	evc.main_url
FROM (
WITH
  ts AS (
    -- bind NOW() only once
  	SELECT  now() AS current_ts
  ),
	-- Optimize the base license query to only read episode_licenses once
	base_licenses AS (
  	SELECT  el.episode_id,
  		      el.countries,
        		el.start_time,
        		el.end_time
  	FROM  app_public.episode_licenses el
  	CROSS JOIN ts
  	WHERE   ts.current_ts < COALESCE(el.end_time, 'infinity'::timestamp)
  ),
	-- for TRAILER: any license whose end_time > now
	trailer_countries AS (
  	SELECT  DISTINCT bl.episode_id,
        		CASE
       			  -- For country-specific licenses, use the actual country
              WHEN bl.countries IS NOT NULL AND array_length(bl.countries, 1) > 0 THEN
                c.country_code
        			-- For global licenses, use wildcard
        			ELSE '*'
       			END AS country_code
  	FROM  base_licenses bl
    LEFT  JOIN LATERAL (SELECT  UNNEST(bl.countries) AS country_code) c
          ON
         	bl.countries IS NOT NULL
  				AND CARDINALITY(bl.countries) > 0
  ),
	-- for MAIN: only licenses active right now
	main_countries AS (
	SELECT  DISTINCT bl.episode_id,
      		CASE
     			  -- For country-specific licenses, use the actual country
            WHEN bl.countries IS NOT NULL AND array_length(bl.countries, 1) > 0 THEN
              c.country_code
    				-- For global licenses, use wildcard
    				ELSE '*'
     			END AS country_code
		FROM  base_licenses bl
		LEFT  JOIN LATERAL (SELECT UNNEST(bl.countries) AS country_code) c
		      ON bl.countries IS NOT NULL
					AND CARDINALITY(bl.countries) > 0
		CROSS JOIN ts
		WHERE ts.current_ts >= COALESCE(bl.start_time, '-infinity'::timestamp)
  ),
	-- union them, tagging by video type
	license_countries AS (
   	SELECT  episode_id,
  		      country_code,
        		'TRAILER' AS type
  	FROM  trailer_countries
    UNION
  	SELECT  episode_id,
  		      country_code,
        		'MAIN' AS type
  	FROM	main_countries
  )
	SELECT
		ev.id,
		ev.episode_id,
		ev.type,
		ev.title,
		ev.length_in_seconds,
		ev.audio_languages,
		ev.subtitle_languages,
		ev.caption_languages,
		ev.dash_manifest,
		ev.hls_manifest,
		ev.is_protected,
		ev.output_format,
		ev.drm_key_id,
		ev.file_size_in_bytes,
		ev.main_url,
		-- if no matching country row, show "*"
   COALESCE(lc.country_code, '*') AS country_code
	FROM app_public.episode_videos ev
	INNER JOIN license_countries lc
  ON lc.episode_id = ev.episode_id
	AND ev.type = lc.type ) evc
WHERE (evc.country_code = COALESCE(NULLIF((SELECT current_setting('mosaic.country_code'::text, true) as current_country_code), ''), '*')
OR evc.country_code = '*');

GRANT SELECT ON app_public.episode_videos_view TO ":DATABASE_GQL_ROLE";
-- episode_videos_view (END)
