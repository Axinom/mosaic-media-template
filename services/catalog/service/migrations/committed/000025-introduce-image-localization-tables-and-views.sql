--! Previous: sha1:3fa6169ec788ec124352e19554cf5e7396657dbf
--! Hash: sha1:c41f34f4b80c9c0659fc00283f9a0341ecb821a0
--! Message: introduce-image-localization-tables-and-views

-- movie_images_view
DROP VIEW IF EXISTS app_public.movie_images_view CASCADE;
CREATE OR REPLACE VIEW app_public.movie_images_view AS 
WITH preferred_images AS (
        SELECT *
        FROM app_public.movie_images 
        WHERE language_tag = (SELECT pg_catalog.current_setting('mosaic.locale', true))
    ),
    default_images AS (
        SELECT *
        FROM app_public.movie_images 
        WHERE COALESCE(language_tag, 'default')  = 'default'
    )
    SELECT 
        COALESCE(p.id, d.id) AS id,
        COALESCE(p.movie_id, d.movie_id) AS movie_id,
        COALESCE(p.type, d.type) AS type, 
        COALESCE(p.path, d.path) AS path, 
        COALESCE(p.width, d.width) AS width, 
        COALESCE(p.height, d.height) AS height
    FROM default_images d
    LEFT JOIN preferred_images p 
        ON d.movie_id = p.movie_id 
        AND d.type = p.type;

GRANT SELECT ON app_public.movie_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.movie_images IS E'@omit\n@name movie_images_data';
COMMENT ON VIEW app_public.movie_images_view IS E'@name movie_images\n@primaryKey id';

-- tvshow_images_view
DROP VIEW IF EXISTS app_public.tvshow_images_view CASCADE;
CREATE OR REPLACE VIEW app_public.tvshow_images_view AS 
WITH preferred_images AS (
        SELECT *
        FROM app_public.tvshow_images 
        WHERE language_tag = (SELECT pg_catalog.current_setting('mosaic.locale', true))
    ),
    default_images AS (
        SELECT *
        FROM app_public.tvshow_images 
        WHERE COALESCE(language_tag, 'default')  = 'default'
    )
    SELECT 
        COALESCE(p.id, d.id) AS id,
        COALESCE(p.tvshow_id, d.tvshow_id) AS tvshow_id,
        COALESCE(p.type, d.type) AS type, 
        COALESCE(p.path, d.path) AS path, 
        COALESCE(p.width, d.width) AS width, 
        COALESCE(p.height, d.height) AS height
    FROM default_images d
    LEFT JOIN preferred_images p 
        ON d.tvshow_id = p.tvshow_id 
        AND d.type = p.type;

GRANT SELECT ON app_public.tvshow_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.tvshow_images IS E'@omit\n@name tvshow_images_data';
COMMENT ON VIEW app_public.tvshow_images_view IS E'@name tvshow_images\n@primaryKey id';

-- season_images_view
DROP VIEW IF EXISTS app_public.season_images_view CASCADE;
CREATE OR REPLACE VIEW app_public.season_images_view AS 
WITH preferred_images AS (
        SELECT *
        FROM app_public.season_images 
        WHERE language_tag = (SELECT pg_catalog.current_setting('mosaic.locale', true))
    ),
    default_images AS (
        SELECT *
        FROM app_public.season_images 
        WHERE COALESCE(language_tag, 'default')  = 'default'
    )
    SELECT 
        COALESCE(p.id, d.id) AS id,
        COALESCE(p.season_id, d.season_id) AS season_id,
        COALESCE(p.type, d.type) AS type, 
        COALESCE(p.path, d.path) AS path, 
        COALESCE(p.width, d.width) AS width, 
        COALESCE(p.height, d.height) AS height
    FROM default_images d
    LEFT JOIN preferred_images p 
        ON d.season_id = p.season_id 
        AND d.type = p.type;

GRANT SELECT ON app_public.season_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.season_images IS E'@omit\n@name season_images_data';
COMMENT ON VIEW app_public.season_images_view IS E'@name season_images\n@primaryKey id';

-- episode_images_view
DROP VIEW IF EXISTS app_public.episode_images_view CASCADE;
CREATE OR REPLACE VIEW app_public.episode_images_view AS 
WITH preferred_images AS (
        SELECT *
        FROM app_public.episode_images 
        WHERE language_tag = (SELECT pg_catalog.current_setting('mosaic.locale', true))
    ),
    default_images AS (
        SELECT *
        FROM app_public.episode_images 
        WHERE COALESCE(language_tag, 'default')  = 'default'
    )
    SELECT 
        COALESCE(p.id, d.id) AS id,
        COALESCE(p.episode_id, d.episode_id) AS episode_id,
        COALESCE(p.type, d.type) AS type, 
        COALESCE(p.path, d.path) AS path, 
        COALESCE(p.width, d.width) AS width, 
        COALESCE(p.height, d.height) AS height
    FROM default_images d
    LEFT JOIN preferred_images p 
        ON d.episode_id = p.episode_id 
        AND d.type = p.type;

GRANT SELECT ON app_public.episode_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.episode_images IS E'@omit\n@name episode_images_data';
COMMENT ON VIEW app_public.episode_images_view IS E'@name episode_images\n@primaryKey id';

-- collection_images_view
DROP VIEW IF EXISTS app_public.collection_images_view CASCADE;
CREATE OR REPLACE VIEW app_public.collection_images_view AS 
WITH preferred_images AS (
        SELECT *
        FROM app_public.collection_images 
        WHERE language_tag = (SELECT pg_catalog.current_setting('mosaic.locale', true))
    ),
    default_images AS (
        SELECT *
        FROM app_public.collection_images 
        WHERE COALESCE(language_tag, 'default')  = 'default'
    )
    SELECT 
        COALESCE(p.id, d.id) AS id,
        COALESCE(p.collection_id, d.collection_id) AS collection_id,
        COALESCE(p.type, d.type) AS type, 
        COALESCE(p.path, d.path) AS path, 
        COALESCE(p.width, d.width) AS width, 
        COALESCE(p.height, d.height) AS height
    FROM default_images d
    LEFT JOIN preferred_images p 
        ON d.collection_id = p.collection_id 
        AND d.type = p.type;

GRANT SELECT ON app_public.collection_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.collection_images IS E'@omit\n@name collection_images_data';
COMMENT ON VIEW app_public.collection_images_view IS E'@name collection_images\n@primaryKey id';
