--! Previous: sha1:c41f34f4b80c9c0659fc00283f9a0341ecb821a0
--! Hash: sha1:dbf6973f239c04e2b9a1f61e353345ee4d03e12d
--! Message: rebuild-all-image-views-with-performance

-- === MOVIE IMAGES VIEW ===
DROP VIEW IF EXISTS app_public.movie_images_view CASCADE;
CREATE VIEW app_public.movie_images_view AS
WITH preferred_images AS (
    SELECT
        id,
        movie_id,
        type,
        path,
        width,
        height,
        ROW_NUMBER() OVER (
            PARTITION BY movie_id, type
            ORDER BY
                CASE
                    WHEN language_tag = current_setting('mosaic.locale', true) THEN 1
                    WHEN COALESCE(language_tag, 'default') = 'default' THEN 2
                    ELSE 3
                END
        ) AS lang_rank
    FROM app_public.movie_images
)
SELECT
    id,
    movie_id,
    type,
    path,
    width,
    height
FROM preferred_images
WHERE lang_rank = 1;

GRANT SELECT ON app_public.movie_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.movie_images IS E'@omit\n@name movie_images_data';
COMMENT ON VIEW app_public.movie_images_view IS E'@name movie_images\n@primaryKey id';

-- === TVSHOW IMAGES VIEW ===
DROP VIEW IF EXISTS app_public.tvshow_images_view CASCADE;
CREATE VIEW app_public.tvshow_images_view AS
WITH preferred_images AS (
    SELECT
        id,
        tvshow_id,
        type,
        path,
        width,
        height,
        ROW_NUMBER() OVER (
            PARTITION BY tvshow_id, type
            ORDER BY
                CASE
                    WHEN language_tag = current_setting('mosaic.locale', true) THEN 1
                    WHEN COALESCE(language_tag, 'default') = 'default' THEN 2
                    ELSE 3
                END
        ) AS lang_rank
    FROM app_public.tvshow_images
)
SELECT
    id,
    tvshow_id,
    type,
    path,
    width,
    height
FROM preferred_images
WHERE lang_rank = 1;

GRANT SELECT ON app_public.tvshow_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.tvshow_images IS E'@omit\n@name tvshow_images_data';
COMMENT ON VIEW app_public.tvshow_images_view IS E'@name tvshow_images\n@primaryKey id';

-- === SEASON IMAGES VIEW ===
DROP VIEW IF EXISTS app_public.season_images_view CASCADE;
CREATE VIEW app_public.season_images_view AS
WITH preferred_images AS (
    SELECT
        id,
        season_id,
        type,
        path,
        width,
        height,
        ROW_NUMBER() OVER (
            PARTITION BY season_id, type
            ORDER BY
                CASE
                    WHEN language_tag = current_setting('mosaic.locale', true) THEN 1
                    WHEN COALESCE(language_tag, 'default') = 'default' THEN 2
                    ELSE 3
                END
        ) AS lang_rank
    FROM app_public.season_images
)
SELECT
    id,
    season_id,
    type,
    path,
    width,
    height
FROM preferred_images
WHERE lang_rank = 1;

GRANT SELECT ON app_public.season_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.season_images IS E'@omit\n@name season_images_data';
COMMENT ON VIEW app_public.season_images_view IS E'@name season_images\n@primaryKey id';

-- === EPISODE IMAGES VIEW ===
DROP VIEW IF EXISTS app_public.episode_images_view CASCADE;
CREATE VIEW app_public.episode_images_view AS
WITH preferred_images AS (
    SELECT
        id,
        episode_id,
        type,
        path,
        width,
        height,
        ROW_NUMBER() OVER (
            PARTITION BY episode_id, type
            ORDER BY
                CASE
                    WHEN language_tag = current_setting('mosaic.locale', true) THEN 1
                    WHEN COALESCE(language_tag, 'default') = 'default' THEN 2
                    ELSE 3
                END
        ) AS lang_rank
    FROM app_public.episode_images
)
SELECT
    id,
    episode_id,
    type,
    path,
    width,
    height
FROM preferred_images
WHERE lang_rank = 1;

GRANT SELECT ON app_public.episode_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.episode_images IS E'@omit\n@name episode_images_data';
COMMENT ON VIEW app_public.episode_images_view IS E'@name episode_images\n@primaryKey id';

-- === COLLECTION IMAGES VIEW ===
DROP VIEW IF EXISTS app_public.collection_images_view CASCADE;
CREATE VIEW app_public.collection_images_view AS
WITH preferred_images AS (
    SELECT
        id,
        collection_id,
        type,
        path,
        width,
        height,
        ROW_NUMBER() OVER (
            PARTITION BY collection_id, type
            ORDER BY
                CASE
                    WHEN language_tag = current_setting('mosaic.locale', true) THEN 1
                    WHEN COALESCE(language_tag, 'default') = 'default' THEN 2
                    ELSE 3
                END
        ) AS lang_rank
    FROM app_public.collection_images
)
SELECT
    id,
    collection_id,
    type,
    path,
    width,
    height
FROM preferred_images
WHERE lang_rank = 1;

GRANT SELECT ON app_public.collection_images_view TO ":DATABASE_GQL_ROLE";

COMMENT ON TABLE app_public.collection_images IS E'@omit\n@name collection_images_data';
COMMENT ON VIEW app_public.collection_images_view IS E'@name collection_images\n@primaryKey id';

-- === MOVIE IMAGES ===
CREATE INDEX IF NOT EXISTS idx_movie_images_movie_type_lang
  ON app_public.movie_images (movie_id, type, language_tag);

CREATE INDEX IF NOT EXISTS idx_movie_images_coalesced_lang
  ON app_public.movie_images ((COALESCE(language_tag, 'default')));

-- === TVSHOW IMAGES ===
CREATE INDEX IF NOT EXISTS idx_tvshow_images_show_type_lang
  ON app_public.tvshow_images (tvshow_id, type, language_tag);

CREATE INDEX IF NOT EXISTS idx_tvshow_images_coalesced_lang
  ON app_public.tvshow_images ((COALESCE(language_tag, 'default')));

-- === SEASON IMAGES ===
CREATE INDEX IF NOT EXISTS idx_season_images_season_type_lang
  ON app_public.season_images (season_id, type, language_tag);

CREATE INDEX IF NOT EXISTS idx_season_images_coalesced_lang
  ON app_public.season_images ((COALESCE(language_tag, 'default')));

-- === EPISODE IMAGES ===
CREATE INDEX IF NOT EXISTS idx_episode_images_episode_type_lang
  ON app_public.episode_images (episode_id, type, language_tag);

CREATE INDEX IF NOT EXISTS idx_episode_images_coalesced_lang
  ON app_public.episode_images ((COALESCE(language_tag, 'default')));

-- === COLLECTION IMAGES ===
CREATE INDEX IF NOT EXISTS idx_collection_images_coll_type_lang
  ON app_public.collection_images (collection_id, type, language_tag);

CREATE INDEX IF NOT EXISTS idx_collection_images_coalesced_lang
  ON app_public.collection_images ((COALESCE(language_tag, 'default')));
