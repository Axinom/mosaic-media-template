--! Previous: sha1:a220d7bef090e23a63b05215d16a379d80abbb14
--! Hash: sha1:07dccfe45a45745a68b910d30594774debf23731
--! Message: create-tables-with-permissions

-- ##### SECTIONS #####
-- * #general
-- * #setting
-- * #movie
-- * #tvshow
-- * #season
-- * #episode
-- * #collection
-- * #ingest



-------------- #general ---------------
--                                   _
--  __ _  ___  _ _   ___  _ _  __ _ | |
-- / _` |/ -_)| ' \ / -_)| '_|/ _` || |
-- \__. |\___||_||_|\___||_|  \__/_||_|
-- |___/
---------------------------------------

-- NOTE: enum values must all be UPPER CASE!

-- publish_status enum
SELECT ax_define.create_enum_table(
  'publish_status', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"NOT_PUBLISHED","PUBLISH_PROGRESS","PUBLISHED","PUBLISH_ERROR","CHANGED"}',
  '{"Not published","Publish progress","Published","Publish error","Changed"}');

-- movie_image_type enum
SELECT ax_define.create_enum_table(
  'movie_image_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"COVER","TEASER"}',
  '{"Cover","Teaser"}');

-- tvshow_image_type enum
SELECT ax_define.create_enum_table(
  'tvshow_image_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"COVER","TEASER"}',
  '{"Cover","Teaser"}');

-- season_image_type enum
SELECT ax_define.create_enum_table(
  'season_image_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"COVER","TEASER"}',
  '{"Cover","Teaser"}');

-- episode_image_type enum
SELECT ax_define.create_enum_table(
  'episode_image_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"COVER","TEASER"}',
  '{"Cover","Teaser"}');

-- collection_image_type enum
SELECT ax_define.create_enum_table(
  'collection_image_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"COVER"}',
  '{"Cover"}');

-- iso_alpha_three_country_codes enum
SELECT ax_define.create_enum_table(
  'iso_alpha_three_country_codes', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"ABW","AFG","AGO","AIA","ALA","ALB","AND","ARE","ARG","ARM","ASM","ATA","ATF","ATG","AUS","AUT","AZE","BDI","BEL","BEN","BES","BFA","BGD","BGR","BHR","BHS","BIH","BLM","BLR","BLZ","BMU","BOL","BRA","BRB","BRN","BTN","BVT","BWA","CAF","CAN","CCK","CHE","CHL","CHN","CIV","CMR","COD","COG","COK","COL","COM","CPV","CRI","CUB","CUW","CXR","CYM","CYP","CZE","DEU","DJI","DMA","DNK","DOM","DZA","ECU","EGY","ERI","ESH","ESP","EST","ETH","FIN","FJI","FLK","FRA","FRO","FSM","GAB","GBR","GEO","GGY","GHA","GIB","GIN","GLP","GMB","GNB","GNQ","GRC","GRD","GRL","GTM","GUF","GUM","GUY","HKG","HMD","HND","HRV","HTI","HUN","IDN","IMN","IND","IOT","IRL","IRN","IRQ","ISL","ISR","ITA","JAM","JEY","JOR","JPN","KAZ","KEN","KGZ","KHM","KIR","KNA","KOR","KWT","LAO","LBN","LBR","LBY","LCA","LIE","LKA","LSO","LTU","LUX","LVA","MAC","MAF","MAR","MCO","MDA","MDG","MDV","MEX","MHL","MKD","MLI","MLT","MMR","MNE","MNG","MNP","MOZ","MRT","MSR","MTQ","MUS","MWI","MYS","MYT","NAM","NCL","NER","NFK","NGA","NIC","NIU","NLD","NOR","NPL","NRU","NZL","OMN","PAK","PAN","PCN","PER","PHL","PLW","PNG","POL","PRI","PRK","PRT","PRY","PSE","PYF","QAT","REU","ROU","RUS","RWA","SAU","SDN","SEN","SGP","SGS","SHN","SJM","SLB","SLE","SLV","SMR","SOM","SPM","SRB","SSD","STP","SUR","SVK","SVN","SWE","SWZ","SXM","SYC","SYR","TCA","TCD","TGO","THA","TJK","TKL","TKM","TLS","TON","TTO","TUN","TUR","TUV","TWN","TZA","UGA","UKR","UMI","URY","USA","UZB","VAT","VCT","VEN","VGB","VIR","VNM","VUT","WLF","WSM","YEM","ZAF","ZMB","ZWE"}');

-- ingest_status enum
SELECT ax_define.create_enum_table(
  'ingest_status', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"IN_PROGRESS","SUCCESS","PARTIAL_SUCCESS","ERROR"}',
  '{"In Progress","Success","Partial Success","Error"}');

-- ingest_item_status enum
SELECT ax_define.create_enum_table(
  'ingest_item_status', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"IN_PROGRESS","SUCCESS","ERROR"}',
  '{"In Progress","Success","Error"}');

-- ingest_item_type enum
SELECT ax_define.create_enum_table(
  'ingest_item_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"MOVIE","TVSHOW","SEASON","EPISODE"}',
  '{"Movie","Tvshow","Season","Episode"}');

-- ingest_entity_exists_status enum
SELECT ax_define.create_enum_table(
  'ingest_entity_exists_status', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"EXISTED","CREATED","ERROR"}',
  '{"Existed","Created","Error"}');

-- enum table: ingest_item_step_type
SELECT ax_define.create_enum_table(
  'ingest_item_step_type', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"ENTITY","IMAGE","VIDEO"}',
  '{"Entity","Image","Video"}');

-- enum table: ingest_item_step_status
SELECT ax_define.create_enum_table(
  'ingest_item_step_status', 
  'app_public',
  ':DATABASE_LOGIN',
  '{"IN_PROGRESS","SUCCESS","ERROR"}',
  '{"In Progress","Success","Error"}');

-- Type alias for zapatos to be able to map jsonb to a dedicated TypeScript type
DO $do$ BEGIN 
    BEGIN
        CREATE DOMAIN app_public.ingest_document_object AS jsonb;
        CREATE DOMAIN app_public.ingest_item_object AS jsonb;
    EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE 'Domain already exists.';
    END;
END $do$;



-------------- #setting --------------
--  ___       _    _    _
-- / __| ___ | |_ | |_ (_) _ _   __ _
-- \__ \/ -_)|  _||  _|| || ' \ / _` |
-- |___/\___| \__| \__||_||_||_|\__. |
--                              |___/
--------------------------------------

-- table: movie_genres
DROP TABLE IF EXISTS app_public.movie_genres CASCADE;
CREATE TABLE app_public.movie_genres (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title text NOT NULL,
  sort_order integer NOT NULL,

  CONSTRAINT title_max_length CHECK(ax_utils.constraint_max_length(title, 50, 'The title can only be %2$s characters long.')),
  CONSTRAINT title_not_empty CHECK(ax_utils.constraint_not_empty(title, 'The title cannot be empty.')),
  CONSTRAINT title_is_trimmed CHECK(ax_utils.constraint_is_trimmed(title, 'The title must not start or end with whitespace value.'))
);
SELECT ax_define.define_audit_date_fields_on_table('movie_genres', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('movie_genres', 'app_public', ':DEFAULT_USERNAME');

GRANT SELECT, DELETE ON app_public.movie_genres TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  title,
  sort_order
) ON app_public.movie_genres TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  title,
  sort_order
) ON app_public.movie_genres TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'movie_genres', 'app_public', 'movie_genres', 'MovieGenre');
SELECT ax_define.define_indexes_with_id('title', 'movie_genres', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'movie_genres', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'movie_genres', 'app_public');
SELECT ax_define.define_unique_index('sort_order', 'movie_genres', 'app_public');
SELECT ax_define.define_unique_index('title', 'movie_genres', 'app_public');
SELECT ax_define.define_like_index('title', 'movie_genres', 'app_public');
SELECT ax_define.define_timestamps_trigger('movie_genres', 'app_public');
SELECT ax_define.define_users_trigger('movie_genres', 'app_public');
SELECT ax_define.define_authentication('SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 'SETTINGS_EDITOR,ADMIN', 'movie_genres', 'app_public');

-- table: tvshow_genres
DROP TABLE IF EXISTS app_public.tvshow_genres CASCADE;
CREATE TABLE app_public.tvshow_genres (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title text NOT NULL,
  sort_order integer NOT NULL,

  CONSTRAINT title_max_length CHECK(ax_utils.constraint_max_length(title, 50, 'The title can only be %2$s characters long.')),
  CONSTRAINT title_not_empty CHECK(ax_utils.constraint_not_empty(title, 'The title cannot be empty.')),
  CONSTRAINT title_is_trimmed CHECK(ax_utils.constraint_is_trimmed(title, 'The title must not start or end with whitespace value.'))
);
SELECT ax_define.define_audit_date_fields_on_table('tvshow_genres', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('tvshow_genres', 'app_public', ':DEFAULT_USERNAME');

GRANT SELECT, DELETE ON app_public.tvshow_genres TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  title,
  sort_order
) ON app_public.tvshow_genres TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  title,
  sort_order
) ON app_public.tvshow_genres TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'tvshow_genres', 'app_public', 'tvshow_genres', 'TvshowGenre');
SELECT ax_define.define_indexes_with_id('title', 'tvshow_genres', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'tvshow_genres', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'tvshow_genres', 'app_public');
SELECT ax_define.define_unique_index('sort_order', 'tvshow_genres', 'app_public');
SELECT ax_define.define_unique_index('title', 'tvshow_genres', 'app_public');
SELECT ax_define.define_like_index('title', 'tvshow_genres', 'app_public');
SELECT ax_define.define_timestamps_trigger('tvshow_genres', 'app_public');
SELECT ax_define.define_users_trigger('tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 'SETTINGS_EDITOR,ADMIN', 'tvshow_genres', 'app_public');



---------- #movie -----------
--  __  __            _
-- |  \/  | ___ __ __(_) ___
-- | |\/| |/ _ \\ V /| |/ -_)
-- |_|  |_|\___/ \_/ |_|\___|
-----------------------------

-- table: movies
DROP TABLE IF EXISTS app_public.movies CASCADE;
CREATE TABLE app_public.movies (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title text NOT NULL,
  external_id text unique,
  original_title text,
  synopsis text,
  description text,
  studio text,
  released date,
  main_video_id uuid,

  published_date timestamptz,
  published_user text,

  CONSTRAINT title_max_length CHECK(ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.')),
  CONSTRAINT title_not_empty CHECK(ax_utils.constraint_not_empty(title, 'The title cannot be empty.'))
);
SELECT ax_define.define_audit_date_fields_on_table('movies', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('movies', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.bind_enum_table_to_table('publish_status', 'movies', 'app_public', 'publish_status', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publish_status', 'movies', 'app_public', 'publish_status_enum', 'app_public');

GRANT SELECT, DELETE ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  title,
  external_id,
  original_title,
  synopsis,
  description,
  studio,
  released,
  main_video_id
) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  title,
  external_id,
  original_title,
  synopsis,
  description,
  studio,
  released,
  main_video_id,
  publish_status
) ON app_public.movies TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'movies', 'app_public', 'movies', 'Movie');
SELECT ax_define.define_indexes_with_id('title', 'movies', 'app_public');
SELECT ax_define.define_indexes_with_id('original_title', 'movies', 'app_public');
SELECT ax_define.define_indexes_with_id('external_id', 'movies', 'app_public');
SELECT ax_define.define_indexes_with_id('released', 'movies', 'app_public');
SELECT ax_define.define_index('publish_status', 'movies', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'movies', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'movies', 'app_public');
SELECT ax_define.define_like_index('title', 'movies', 'app_public');
SELECT ax_define.define_like_index('original_title', 'movies', 'app_public');
SELECT ax_define.define_timestamps_trigger('movies', 'app_public');
SELECT ax_define.define_users_trigger('movies', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies', 'app_public');

-- table: movies_tags
DROP TABLE IF EXISTS app_public.movies_tags CASCADE;
CREATE TABLE app_public.movies_tags (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(movie_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_tags TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movie_id', 'movies_tags', 'app_public', 'movies', 'MovieTag');
SELECT ax_define.define_index('movie_id', 'movies_tags', 'app_public');
SELECT ax_define.define_like_index('name', 'movies_tags', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'movies_tags', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_tags', 'app_public');

-- table: movies_casts
DROP TABLE IF EXISTS app_public.movies_casts CASCADE;
CREATE TABLE app_public.movies_casts (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(movie_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_casts TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movie_id', 'movies_casts', 'app_public', 'movies', 'MovieCast');
SELECT ax_define.define_index('movie_id', 'movies_casts', 'app_public');
SELECT ax_define.define_like_index('name', 'movies_casts', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'movies_casts', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_casts', 'app_public');

-- table: movies_licenses
DROP TABLE IF EXISTS app_public.movies_licenses CASCADE;
CREATE TABLE app_public.movies_licenses (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  license_start timestamptz,
  license_end timestamptz
);

GRANT SELECT, DELETE ON app_public.movies_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  movie_id,
  license_start,
  license_end
) ON app_public.movies_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  movie_id,
  license_start,
  license_end
) ON app_public.movies_licenses TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movie_id', 'movies_licenses', 'app_public', 'movies', 'MovieLicense');
SELECT ax_define.define_index('movie_id', 'movies_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_start', 'movies_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_end', 'movies_licenses', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_licenses', 'app_public');

-- table: movies_licenses_countries
DROP TABLE IF EXISTS app_public.movies_licenses_countries CASCADE;
CREATE TABLE app_public.movies_licenses_countries (
  movies_license_id integer NOT NULL REFERENCES app_public.movies_licenses(id) ON DELETE CASCADE
);
SELECT ax_define.bind_enum_table_to_table('code', 'movies_licenses_countries', 'app_public', 'iso_alpha_three_country_codes');
SELECT ax_define.set_enum_domain('code', 'movies_licenses_countries', 'app_public', 'iso_alpha_three_country_codes_enum', 'app_public');
ALTER TABLE app_public.movies_licenses_countries ADD PRIMARY KEY (movies_license_id, code);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movies_license_id', 'movies_licenses_countries', 'app_public', 'movies_licenses', 'MovieLicensesCountry');
SELECT ax_define.define_index('movies_license_id', 'movies_licenses_countries', 'app_public');
SELECT ax_define.define_index('code', 'movies_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_licenses_countries', 'app_public');


-- table: movies_production_countries
DROP TABLE IF EXISTS app_public.movies_production_countries CASCADE;
CREATE TABLE app_public.movies_production_countries (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(movie_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_production_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movie_id', 'movies_production_countries', 'app_public', 'movies', 'MovieProductionCountry');
SELECT ax_define.define_index('movie_id', 'movies_production_countries', 'app_public');
SELECT ax_define.define_like_index('name', 'movies_production_countries', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'movies_production_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_production_countries', 'app_public');

-- table: movies_movie_genres
DROP TABLE IF EXISTS app_public.movies_movie_genres CASCADE;
CREATE TABLE app_public.movies_movie_genres (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  movie_genres_id integer NOT NULL REFERENCES app_public.movie_genres(id) ON DELETE CASCADE,

  PRIMARY KEY(movie_id, movie_genres_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_movie_genres TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movie_id', 'movies_movie_genres', 'app_public', 'movies', 'MovieGenre');
SELECT ax_define.define_index('movie_id', 'movies_movie_genres', 'app_public');
SELECT ax_define.define_index('movie_genres_id', 'movies_movie_genres', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_movie_genres', 'app_public');

-- table: movies_images
DROP TABLE IF EXISTS app_public.movies_images CASCADE;
CREATE TABLE app_public.movies_images (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  image_id UUID NOT NULL
);
SELECT ax_define.bind_enum_table_to_table('image_type', 'movies_images', 'app_public', 'movie_image_type');
SELECT ax_define.set_enum_domain('image_type', 'movies_images', 'app_public', 'movie_image_type_enum', 'app_public');
ALTER TABLE app_public.movies_images ADD CONSTRAINT movie_id_image_type_are_unique UNIQUE(movie_id, image_type);
ALTER TABLE app_public.movies_images ADD PRIMARY KEY(movie_id, image_id, image_type);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_images TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movie_id', 'movies_images', 'app_public', 'movies', 'MovieImage');
SELECT ax_define.define_index('movie_id', 'movies_images', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_images', 'app_public');


-- table: movies_trailers
DROP TABLE IF EXISTS app_public.movies_trailers CASCADE;
CREATE TABLE app_public.movies_trailers (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  video_id uuid NOT NULL,

  PRIMARY KEY(movie_id, video_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_trailers TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movie_id', 'movies_trailers', 'app_public', 'movies', 'MovieTrailer');
SELECT ax_define.define_index('movie_id', 'movies_trailers', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_trailers', 'app_public');



-------------------- #tvshow -------------------
--  _____ __   __       ___  _
-- |_   _|\ \ / /      / __|| |_   ___  _ __ __
--   | |   \   /       \__ \|   \ / _ \ \ V  V /
--   |_|    \_/        |___/|_||_|\___/  \_/\_/
------------------------------------------------

-- table: tvshows
DROP TABLE IF EXISTS app_public.tvshows CASCADE;
CREATE TABLE app_public.tvshows (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title text NOT NULL,
  external_id text unique,
  original_title text,
  synopsis text,
  description text,
  studio text,
  released date,
  published_date timestamptz,
  published_user text,

  CONSTRAINT title_max_length CHECK(ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.')),
  CONSTRAINT title_not_empty CHECK(ax_utils.constraint_not_empty(title, 'The title cannot be empty.'))
);
SELECT ax_define.define_audit_date_fields_on_table('tvshows', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('tvshows', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.bind_enum_table_to_table('publish_status', 'tvshows', 'app_public', 'publish_status', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publish_status', 'tvshows', 'app_public', 'publish_status_enum', 'app_public');

GRANT SELECT, DELETE ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  title,
  external_id,
  original_title,
  synopsis,
  description,
  studio,
  released
) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  title,
  external_id,
  original_title,
  synopsis,
  description,
  studio,
  released,
  publish_status
) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'tvshows', 'app_public', 'tvshows', 'Tvshow');
SELECT ax_define.define_indexes_with_id('title', 'tvshows', 'app_public');
SELECT ax_define.define_indexes_with_id('original_title', 'tvshows', 'app_public');
SELECT ax_define.define_indexes_with_id('external_id', 'tvshows', 'app_public');
SELECT ax_define.define_indexes_with_id('released', 'tvshows', 'app_public');
SELECT ax_define.define_index('publish_status', 'tvshows', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'tvshows', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'tvshows', 'app_public');
SELECT ax_define.define_like_index('title', 'tvshows', 'app_public');
SELECT ax_define.define_like_index('original_title', 'tvshows', 'app_public');
SELECT ax_define.define_timestamps_trigger('tvshows', 'app_public');
SELECT ax_define.define_users_trigger('tvshows', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows', 'app_public');

-- table: tvshows_tags
DROP TABLE IF EXISTS app_public.tvshows_tags CASCADE;
CREATE TABLE app_public.tvshows_tags (
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(tvshow_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_tags TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_tags', 'app_public', 'tvshows', 'TvshowTag');
SELECT ax_define.define_index('tvshow_id', 'tvshows_tags', 'app_public');
SELECT ax_define.define_like_index('name', 'tvshows_tags', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'tvshows_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_tags', 'app_public');

-- table: tvshows_casts
DROP TABLE IF EXISTS app_public.tvshows_casts CASCADE;
CREATE TABLE app_public.tvshows_casts (
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(tvshow_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_casts TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_casts', 'app_public', 'tvshows', 'TvshowCast');
SELECT ax_define.define_index('tvshow_id', 'tvshows_casts', 'app_public');
SELECT ax_define.define_like_index('name', 'tvshows_casts', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'tvshows_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_casts', 'app_public');

-- table: tvshows_licenses
DROP TABLE IF EXISTS app_public.tvshows_licenses CASCADE;
CREATE TABLE app_public.tvshows_licenses (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  license_start timestamptz,
  license_end timestamptz
);

GRANT SELECT, DELETE ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  tvshow_id,
  license_start,
  license_end
) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  tvshow_id,
  license_start,
  license_end
) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_licenses', 'app_public', 'tvshows', 'TvshowLicense');
SELECT ax_define.define_index('tvshow_id', 'tvshows_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_start', 'tvshows_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_end', 'tvshows_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_licenses', 'app_public');

-- table: tvshows_licenses_countries
DROP TABLE IF EXISTS app_public.tvshows_licenses_countries CASCADE;
CREATE TABLE app_public.tvshows_licenses_countries (
  tvshows_license_id integer NOT NULL REFERENCES app_public.tvshows_licenses(id) ON DELETE CASCADE
);
SELECT ax_define.bind_enum_table_to_table('code', 'tvshows_licenses_countries', 'app_public', 'iso_alpha_three_country_codes');
SELECT ax_define.set_enum_domain('code', 'tvshows_licenses_countries', 'app_public', 'iso_alpha_three_country_codes_enum', 'app_public');
ALTER TABLE app_public.tvshows_licenses_countries ADD PRIMARY KEY (tvshows_license_id, code);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshows_license_id', 'tvshows_licenses_countries', 'app_public', 'tvshows_licenses', 'TvshowLicensesCountry');
SELECT ax_define.define_index('tvshows_license_id', 'tvshows_licenses_countries', 'app_public');
SELECT ax_define.define_index('code', 'tvshows_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_licenses_countries', 'app_public');

-- table: tvshows_production_countries
DROP TABLE IF EXISTS app_public.tvshows_production_countries CASCADE;
CREATE TABLE app_public.tvshows_production_countries (
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(tvshow_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_production_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_production_countries', 'app_public', 'tvshows', 'TvshowProductionCountry');
SELECT ax_define.define_index('tvshow_id', 'tvshows_production_countries', 'app_public');
SELECT ax_define.define_like_index('name', 'tvshows_production_countries', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'tvshows_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_production_countries', 'app_public');

-- table: tvshows_tvshow_genres
DROP TABLE IF EXISTS app_public.tvshows_tvshow_genres CASCADE;
CREATE TABLE app_public.tvshows_tvshow_genres (
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  tvshow_genres_id integer NOT NULL REFERENCES app_public.tvshow_genres(id) ON DELETE CASCADE,

  PRIMARY KEY(tvshow_id, tvshow_genres_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_tvshow_genres TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_tvshow_genres', 'app_public', 'tvshows', 'TvshowGenre');
SELECT ax_define.define_index('tvshow_id', 'tvshows_tvshow_genres', 'app_public');
SELECT ax_define.define_index('tvshow_genres_id', 'tvshows_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_tvshow_genres', 'app_public');

-- table: tvshows_images
DROP TABLE IF EXISTS app_public.tvshows_images CASCADE;
CREATE TABLE app_public.tvshows_images (
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  image_id UUID NOT NULL
);
SELECT ax_define.bind_enum_table_to_table('image_type', 'tvshows_images', 'app_public', 'tvshow_image_type');
SELECT ax_define.set_enum_domain('image_type', 'tvshows_images', 'app_public', 'tvshow_image_type_enum', 'app_public');
ALTER TABLE app_public.tvshows_images ADD CONSTRAINT tvshow_id_image_type_are_unique UNIQUE(tvshow_id, image_type);
ALTER TABLE app_public.tvshows_images ADD PRIMARY KEY(tvshow_id, image_id, image_type);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_images TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_images', 'app_public', 'tvshows', 'TvshowImage');
SELECT ax_define.define_index('tvshow_id', 'tvshows_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_images', 'app_public');

-- table: tvshows_trailers
DROP TABLE IF EXISTS app_public.tvshows_trailers CASCADE;
CREATE TABLE app_public.tvshows_trailers (
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  video_id uuid NOT NULL,

  PRIMARY KEY(tvshow_id, video_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_trailers TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_trailers', 'app_public', 'tvshows', 'TvshowTrailer');
SELECT ax_define.define_index('tvshow_id', 'tvshows_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_trailers', 'app_public');



------------ #season -------------
--  ___
-- / __| ___  __ _  ___ ___  _ _
-- \__ \/ -_)/ _` |(_-// _ \| ' \
-- |___/\___|\__/_|/__/\___/|_||_|
----------------------------------

-- table: seasons
DROP TABLE IF EXISTS app_public.seasons CASCADE;
CREATE TABLE app_public.seasons (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_id integer REFERENCES app_public.tvshows(id) ON DELETE SET NULL,
  index integer NOT NULL,
  external_id text unique,
  synopsis text,
  description text,
  studio text,
  released date,
  published_date timestamptz,
  published_user text
);
SELECT ax_define.define_audit_date_fields_on_table('seasons', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('seasons', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.bind_enum_table_to_table('publish_status', 'seasons', 'app_public', 'publish_status', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publish_status', 'seasons', 'app_public', 'publish_status_enum', 'app_public');

GRANT SELECT, DELETE ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  tvshow_id,
  index,
  external_id,
  synopsis,
  description,
  studio,
  released
) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  tvshow_id,
  index,
  external_id,
  synopsis,
  description,
  studio,
  released,
  publish_status
) ON app_public.seasons TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'seasons', 'app_public', 'seasons', 'Season');
SELECT ax_define.define_index('tvshow_id', 'seasons', 'app_public');
SELECT ax_define.define_indexes_with_id('index', 'seasons', 'app_public');
SELECT ax_define.define_indexes_with_id('external_id', 'seasons', 'app_public');
SELECT ax_define.define_indexes_with_id('released', 'seasons', 'app_public');
SELECT ax_define.define_index('publish_status', 'seasons', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'seasons', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'seasons', 'app_public');
SELECT ax_define.define_timestamps_trigger('seasons', 'app_public');
SELECT ax_define.define_users_trigger('seasons', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons', 'app_public');

-- table: seasons_tags
DROP TABLE IF EXISTS app_public.seasons_tags CASCADE;
CREATE TABLE app_public.seasons_tags (
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(season_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_tags TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('season_id', 'seasons_tags', 'app_public', 'seasons', 'SeasonTag');
SELECT ax_define.define_index('season_id', 'seasons_tags', 'app_public');
SELECT ax_define.define_like_index('name', 'seasons_tags', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'seasons_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_tags', 'app_public');

-- table: seasons_casts
DROP TABLE IF EXISTS app_public.seasons_casts CASCADE;
CREATE TABLE app_public.seasons_casts (
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(season_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_casts TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('season_id', 'seasons_casts', 'app_public', 'seasons', 'SeasonCast');
SELECT ax_define.define_index('season_id', 'seasons_casts', 'app_public');
SELECT ax_define.define_like_index('name', 'seasons_casts', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'seasons_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_casts', 'app_public');

-- table: seasons_licenses
DROP TABLE IF EXISTS app_public.seasons_licenses CASCADE;
CREATE TABLE app_public.seasons_licenses (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  license_start timestamptz,
  license_end timestamptz
);

GRANT SELECT, DELETE ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  season_id,
  license_start,
  license_end
) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  season_id,
  license_start,
  license_end
) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('season_id', 'seasons_licenses', 'app_public', 'seasons', 'SeasonLicense');
SELECT ax_define.define_index('season_id', 'seasons_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_start', 'seasons_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_end', 'seasons_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_licenses', 'app_public');

-- table: seasons_licenses_countries
DROP TABLE IF EXISTS app_public.seasons_licenses_countries CASCADE;
CREATE TABLE app_public.seasons_licenses_countries (
  seasons_license_id integer NOT NULL REFERENCES app_public.seasons_licenses(id) ON DELETE CASCADE
);
SELECT ax_define.bind_enum_table_to_table('code', 'seasons_licenses_countries', 'app_public', 'iso_alpha_three_country_codes');
SELECT ax_define.set_enum_domain('code', 'seasons_licenses_countries', 'app_public', 'iso_alpha_three_country_codes_enum', 'app_public');
ALTER TABLE app_public.seasons_licenses_countries ADD PRIMARY KEY (seasons_license_id, code);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('seasons_license_id', 'seasons_licenses_countries', 'app_public', 'seasons_licenses', 'SeasonLicensesCountry');
SELECT ax_define.define_index('seasons_license_id', 'seasons_licenses_countries', 'app_public');
SELECT ax_define.define_index('code', 'seasons_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_licenses_countries', 'app_public');

-- table: seasons_production_countries
DROP TABLE IF EXISTS app_public.seasons_production_countries CASCADE;
CREATE TABLE app_public.seasons_production_countries (
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(season_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_production_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('season_id', 'seasons_production_countries', 'app_public', 'seasons', 'SeasonProductionCountry');
SELECT ax_define.define_index('season_id', 'seasons_production_countries', 'app_public');
SELECT ax_define.define_like_index('name', 'seasons_production_countries', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'seasons_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_production_countries', 'app_public');

-- table: seasons_tvshow_genres
DROP TABLE IF EXISTS app_public.seasons_tvshow_genres CASCADE;
CREATE TABLE app_public.seasons_tvshow_genres (
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  tvshow_genres_id integer NOT NULL REFERENCES app_public.tvshow_genres(id) ON DELETE CASCADE,
  
  PRIMARY KEY(season_id, tvshow_genres_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_tvshow_genres TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('season_id', 'seasons_tvshow_genres', 'app_public', 'seasons', 'SeasonGenre');
SELECT ax_define.define_index('season_id', 'seasons_tvshow_genres', 'app_public');
SELECT ax_define.define_index('tvshow_genres_id', 'seasons_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_tvshow_genres', 'app_public');

-- table: seasons_images
DROP TABLE IF EXISTS app_public.seasons_images CASCADE;
CREATE TABLE app_public.seasons_images (
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  image_id UUID NOT NULL
);
SELECT ax_define.bind_enum_table_to_table('image_type', 'seasons_images', 'app_public', 'season_image_type');
SELECT ax_define.set_enum_domain('image_type', 'seasons_images', 'app_public', 'season_image_type_enum', 'app_public');
ALTER TABLE app_public.seasons_images ADD CONSTRAINT season_id_image_type_are_unique UNIQUE(season_id, image_type);
ALTER TABLE app_public.seasons_images ADD PRIMARY KEY(season_id, image_id, image_type);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_images TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('season_id', 'seasons_images', 'app_public', 'seasons', 'SeasonImage');
SELECT ax_define.define_index('season_id', 'seasons_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_images', 'app_public');

-- table: seasons_trailers
DROP TABLE IF EXISTS app_public.seasons_trailers CASCADE;
CREATE TABLE app_public.seasons_trailers (
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  video_id uuid NOT NULL,

  PRIMARY KEY(season_id, video_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_trailers TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('season_id', 'seasons_trailers', 'app_public', 'seasons', 'SeasonTrailer');
SELECT ax_define.define_index('season_id', 'seasons_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_trailers', 'app_public');



------------ #episode -------------
--  ___       _             _
-- | __] ___ [_] ___ ___  _| | ___
-- | _] | . \| |[_-[/ . \/ . |/ ._]
-- |___]|  _/|_|/__/\___/\___|\___.
--      |_|
-----------------------------------

-- table: episodes
DROP TABLE IF EXISTS app_public.episodes CASCADE;
CREATE TABLE app_public.episodes (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  season_id integer REFERENCES app_public.seasons(id) ON DELETE SET NULL,
  index integer NOT NULL,
  title text NOT NULL,
  external_id text unique,
  original_title text,
  synopsis text,
  description text,
  studio text,
  released date,
  main_video_id uuid,
  published_date timestamptz,
  published_user text,

  CONSTRAINT title_max_length CHECK(ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.')),
  CONSTRAINT title_not_empty CHECK(ax_utils.constraint_not_empty(title, 'The title cannot be empty.'))
);
SELECT ax_define.define_audit_date_fields_on_table('episodes', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('episodes', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.bind_enum_table_to_table('publish_status', 'episodes', 'app_public', 'publish_status', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publish_status', 'episodes', 'app_public', 'publish_status_enum', 'app_public');

GRANT SELECT, DELETE ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  season_id,
  index,
  title,
  external_id,
  original_title,
  synopsis,
  description,
  studio,
  released,
  main_video_id
) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  season_id,
  index,
  title,
  external_id,
  original_title,
  synopsis,
  description,
  studio,
  released,
  main_video_id,
  publish_status
) ON app_public.episodes TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'episodes', 'app_public', 'episodes', 'Episode');
SELECT ax_define.define_index('season_id', 'episodes', 'app_public');
SELECT ax_define.define_indexes_with_id('index', 'episodes', 'app_public');
SELECT ax_define.define_indexes_with_id('title', 'episodes', 'app_public');
SELECT ax_define.define_indexes_with_id('original_title', 'episodes', 'app_public');
SELECT ax_define.define_indexes_with_id('external_id', 'episodes', 'app_public');
SELECT ax_define.define_indexes_with_id('released', 'episodes', 'app_public');
SELECT ax_define.define_index('publish_status', 'episodes', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'episodes', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'episodes', 'app_public');
SELECT ax_define.define_like_index('title', 'episodes', 'app_public');
SELECT ax_define.define_like_index('original_title', 'episodes', 'app_public');
SELECT ax_define.define_timestamps_trigger('episodes', 'app_public');
SELECT ax_define.define_users_trigger('episodes', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes', 'app_public');

-- table: episodes_tags
DROP TABLE IF EXISTS app_public.episodes_tags CASCADE;
CREATE TABLE app_public.episodes_tags (
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(episode_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_tags TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_tags', 'app_public', 'episodes', 'EpisodeTag');
SELECT ax_define.define_index('episode_id', 'episodes_tags', 'app_public');
SELECT ax_define.define_like_index('name', 'episodes_tags', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'episodes_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_tags', 'app_public');

-- table: episodes_casts
DROP TABLE IF EXISTS app_public.episodes_casts CASCADE;
CREATE TABLE app_public.episodes_casts (
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(episode_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_casts TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_casts', 'app_public', 'episodes', 'EpisodeCast');
SELECT ax_define.define_index('episode_id', 'episodes_casts', 'app_public');
SELECT ax_define.define_like_index('name', 'episodes_casts', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'episodes_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_casts', 'app_public');

-- table: episodes_licenses
DROP TABLE IF EXISTS app_public.episodes_licenses CASCADE;
CREATE TABLE app_public.episodes_licenses (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  license_start timestamptz,
  license_end timestamptz
);

GRANT SELECT, DELETE ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  episode_id,
  license_start,
  license_end
) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  episode_id,
  license_start,
  license_end
) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_licenses', 'app_public', 'episodes', 'EpisodeLicense');
SELECT ax_define.define_index('episode_id', 'episodes_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_start', 'episodes_licenses', 'app_public');
SELECT ax_define.define_indexes_with_id('license_end', 'episodes_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_licenses', 'app_public');

-- table: episodes_licenses_countries
DROP TABLE IF EXISTS app_public.episodes_licenses_countries CASCADE;
CREATE TABLE app_public.episodes_licenses_countries (
  episodes_license_id integer NOT NULL REFERENCES app_public.episodes_licenses(id) ON DELETE CASCADE
);
SELECT ax_define.bind_enum_table_to_table('code', 'episodes_licenses_countries', 'app_public', 'iso_alpha_three_country_codes');
SELECT ax_define.set_enum_domain('code', 'episodes_licenses_countries', 'app_public', 'iso_alpha_three_country_codes_enum', 'app_public');
ALTER TABLE app_public.episodes_licenses_countries ADD PRIMARY KEY (episodes_license_id, code);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episodes_license_id', 'episodes_licenses_countries', 'app_public', 'episodes_licenses', 'EpisodeLicensesCountry');
SELECT ax_define.define_index('episodes_license_id', 'episodes_licenses_countries', 'app_public');
SELECT ax_define.define_index('code', 'episodes_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_licenses_countries', 'app_public');


-- table: episodes_production_countries
DROP TABLE IF EXISTS app_public.episodes_production_countries CASCADE;
CREATE TABLE app_public.episodes_production_countries (
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(episode_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_production_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_production_countries', 'app_public', 'episodes', 'EpisodeProductionCountry');
SELECT ax_define.define_index('episode_id', 'episodes_production_countries', 'app_public');
SELECT ax_define.define_like_index('name', 'episodes_production_countries', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'episodes_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_production_countries', 'app_public');

-- table: episodes_tvshow_genres
DROP TABLE IF EXISTS app_public.episodes_tvshow_genres CASCADE;
CREATE TABLE app_public.episodes_tvshow_genres (
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  tvshow_genres_id integer NOT NULL REFERENCES app_public.tvshow_genres(id) ON DELETE CASCADE,

  PRIMARY KEY(episode_id, tvshow_genres_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_tvshow_genres TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_tvshow_genres', 'app_public', 'episodes', 'EpisodeGenre');
SELECT ax_define.define_index('episode_id', 'episodes_tvshow_genres', 'app_public');
SELECT ax_define.define_index('tvshow_genres_id', 'episodes_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_tvshow_genres', 'app_public');

-- table: episodes_images
DROP TABLE IF EXISTS app_public.episodes_images CASCADE;
CREATE TABLE app_public.episodes_images (
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  image_id UUID NOT NULL
);
SELECT ax_define.bind_enum_table_to_table('image_type', 'episodes_images', 'app_public', 'episode_image_type');
SELECT ax_define.set_enum_domain('image_type', 'episodes_images', 'app_public', 'episode_image_type_enum', 'app_public');
ALTER TABLE app_public.episodes_images ADD CONSTRAINT episode_id_image_type_are_unique UNIQUE(episode_id, image_type);
ALTER TABLE app_public.episodes_images ADD PRIMARY KEY(episode_id, image_id, image_type);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_images TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_images', 'app_public', 'episodes', 'EpisodeImage');
SELECT ax_define.define_index('episode_id', 'episodes_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_images', 'app_public');

-- table: episodes_trailers
DROP TABLE IF EXISTS app_public.episodes_trailers CASCADE;
CREATE TABLE app_public.episodes_trailers (
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  video_id uuid NOT NULL,

  PRIMARY KEY(episode_id, video_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_trailers TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_trailers', 'app_public', 'episodes', 'EpisodeTrailer');
SELECT ax_define.define_index('episode_id', 'episodes_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_trailers', 'app_public');



----------------- #collection ------------------
--   ___       _  _           _    _
--  / __| ___ | || | ___  __ | |_ (_) ___  _ _
-- | (__ / _ \| || |/ -_)/ _||  _|| |/ _ \| ' \
--  \___|\___/|_||_|\___|\__| \__||_|\___/|_||_|
------------------------------------------------

-- table: collections
DROP TABLE IF EXISTS app_public.collections CASCADE;
CREATE TABLE app_public.collections (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title text NOT NULL,
  external_id text unique,
  synopsis text,
  description text,
  published_date timestamptz,
  published_user text,

  CONSTRAINT title_max_length CHECK(ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.')),
  CONSTRAINT title_not_empty CHECK(ax_utils.constraint_not_empty(title, 'The title cannot be empty.'))
);
SELECT ax_define.define_audit_date_fields_on_table('collections', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('collections', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.bind_enum_table_to_table('publish_status', 'collections', 'app_public', 'publish_status', 'NOT_PUBLISHED');
SELECT ax_define.set_enum_domain('publish_status', 'collections', 'app_public', 'publish_status_enum', 'app_public');

GRANT SELECT, DELETE ON app_public.collections TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  title,
  external_id,
  synopsis,
  description
) ON app_public.collections TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  title,
  external_id,
  synopsis,
  description,
  publish_status
) ON app_public.collections TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'collections', 'app_public', 'collections', 'Collection');
SELECT ax_define.define_indexes_with_id('title', 'collections', 'app_public');
SELECT ax_define.define_indexes_with_id('external_id', 'collections', 'app_public');
SELECT ax_define.define_index('publish_status', 'collections', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'collections', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'collections', 'app_public');
SELECT ax_define.define_like_index('title', 'collections', 'app_public');
SELECT ax_define.define_timestamps_trigger('collections', 'app_public');
SELECT ax_define.define_users_trigger('collections', 'app_public');
SELECT ax_define.define_authentication('COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 'COLLECTION_EDITOR,ADMIN', 'collections', 'app_public');

-- table: collection_relations
DROP TABLE IF EXISTS app_public.collection_relations CASCADE; 
CREATE TABLE app_public.collection_relations (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  collection_id integer NOT NULL REFERENCES app_public.collections(id) ON DELETE CASCADE,
  sort_order INT NOT NULL,

  movie_id integer null REFERENCES app_public.movies(id) ON DELETE CASCADE,
  tvshow_id integer null REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  season_id integer null REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  episode_id integer null REFERENCES app_public.episodes(id) ON DELETE CASCADE,

  -- check that there is exactly one related item for each row
  CONSTRAINT exactly_one_relation CHECK(num_nonnulls(movie_id, tvshow_id, season_id, episode_id) = 1),
  -- check that each combination from collection to any other element is unique
  CONSTRAINT unique_movie_per_collection UNIQUE(collection_id, movie_id),
  CONSTRAINT unique_tvshow_per_collection UNIQUE(collection_id, tvshow_id),
  CONSTRAINT unique_season_per_collection UNIQUE(collection_id, season_id),
  CONSTRAINT unique_episode_per_collection UNIQUE(collection_id, episode_id)
);

GRANT SELECT, DELETE ON app_public.collection_relations TO ":DATABASE_GQL_ROLE";
GRANT INSERT, UPDATE (
  collection_id,
  sort_order,
  movie_id,
  tvshow_id,
  season_id,
  episode_id
) ON app_public.collection_relations TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('collection_id', 'collection_relations', 'app_public', 'collections', 'CollectionRelation');
SELECT ax_define.define_index('sort_order', 'collection_relations', 'app_public');
SELECT ax_define.define_index('movie_id', 'collection_relations', 'app_public');
SELECT ax_define.define_index('tvshow_id', 'collection_relations', 'app_public');
SELECT ax_define.define_index('season_id', 'collection_relations', 'app_public');
SELECT ax_define.define_index('episode_id', 'collection_relations', 'app_public');
SELECT ax_define.define_authentication('COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 'COLLECTION_EDITOR,ADMIN', 'collection_relations', 'app_public');

-- table: collections_tags
DROP TABLE IF EXISTS app_public.collections_tags CASCADE;
CREATE TABLE app_public.collections_tags (
  collection_id integer NOT NULL REFERENCES app_public.collections(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(collection_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.collections_tags TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('collection_id', 'collections_tags', 'app_public', 'collections', 'CollectionTag');
SELECT ax_define.define_index('collection_id', 'collections_tags', 'app_public');
SELECT ax_define.define_like_index('name', 'collections_tags', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'collections_tags', 'app_public');
SELECT ax_define.define_authentication('COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 'COLLECTION_EDITOR,ADMIN', 'collections_tags', 'app_public');

-- table: collections_images
DROP TABLE IF EXISTS app_public.collections_images CASCADE;
CREATE TABLE app_public.collections_images (
  collection_id integer NOT NULL REFERENCES app_public.collections(id) ON DELETE CASCADE,
  image_id UUID NOT NULL
);
SELECT ax_define.bind_enum_table_to_table('image_type', 'collections_images', 'app_public', 'collection_image_type');
SELECT ax_define.set_enum_domain('image_type', 'collections_images', 'app_public', 'collection_image_type_enum', 'app_public');
ALTER TABLE app_public.collections_images ADD CONSTRAINT collection_id_image_type_are_unique UNIQUE(collection_id, image_type);
ALTER TABLE app_public.collections_images ADD PRIMARY KEY(collection_id, image_id, image_type);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.collections_images TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('collection_id', 'collections_images', 'app_public', 'collections', 'CollectionImage');
SELECT ax_define.define_index('collection_id', 'collections_images', 'app_public');
SELECT ax_define.define_authentication('COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 'COLLECTION_EDITOR,ADMIN', 'collections_images', 'app_public');



------------ #ingest--------------
--  ___                       _   
-- |_ _| _ _   __ _  ___  ___| |_ 
--  | | | ' \ / _` |/ -_)(_-/|  _|
-- |___||_||_|\__. |\___|/__/ \__|
---           |___/ 
----------------------------------

-- table: ingest_documents
DROP TABLE IF EXISTS app_public.ingest_documents CASCADE;
CREATE TABLE app_public.ingest_documents (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name text NOT NULL,
  document_created timestamptz,
  document app_public.ingest_document_object NOT NULL,
  title text NOT NULL,
  items_count integer NOT NULL,
  error_count integer NOT NULL DEFAULT 0,
  success_count integer NOT NULL DEFAULT 0,
  in_progress_count integer NOT NULL DEFAULT 0,
  errors jsonb[] NOT NULL DEFAULT '{}'::jsonb[],

  CONSTRAINT title_max_length CHECK(ax_utils.constraint_max_length(title, 50, 'The title can only be %2$s characters long.')),
  CONSTRAINT title_not_empty CHECK(ax_utils.constraint_not_empty(title, 'The title cannot be empty.'))
);
SELECT ax_define.define_audit_date_fields_on_table('ingest_documents', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('ingest_documents', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.bind_enum_table_to_table('status', 'ingest_documents', 'app_public', 'ingest_status', 'IN_PROGRESS');
SELECT ax_define.set_enum_domain('status', 'ingest_documents', 'app_public', 'ingest_status_enum', 'app_public');

GRANT SELECT ON app_public.ingest_documents TO ":DATABASE_GQL_ROLE";
GRANT INSERT (name, document_created, document, title, items_count, status) ON app_public.ingest_documents TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (title, error_count, success_count, status, errors) ON app_public.ingest_documents TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('id', 'ingest_documents', 'app_public', 'ingest_documents', 'IngestDocument');
SELECT ax_define.define_indexes_with_id('name', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('title', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('status', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('items_count', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('error_count', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('success_count', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('in_progress_count', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'ingest_documents', 'app_public');
SELECT ax_define.define_like_index('name', 'ingest_documents', 'app_public');
SELECT ax_define.define_like_index('title', 'ingest_documents', 'app_public');
SELECT ax_define.define_timestamps_trigger('ingest_documents', 'app_public');
SELECT ax_define.define_users_trigger('ingest_documents', 'app_public');
SELECT ax_define.define_authentication('INGEST_READER,INGEST_EDITOR,ADMIN', 'INGEST_EDITOR,ADMIN', 'ingest_documents', 'app_public');

CREATE OR REPLACE FUNCTION app_hidden.tg_ingest_documents__update_in_progress_count() RETURNS trigger AS $$
BEGIN
  NEW.in_progress_count = (
    CASE WHEN TG_OP = 'INSERT' THEN NEW.items_count
         WHEN NEW.error_count = OLD.error_count AND NEW.success_count = OLD.success_count THEN OLD.in_progress_count 
         ELSE NEW.items_count - NEW.error_count - NEW.success_count
    END);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql volatile SET search_path TO pg_catalog, public, pg_temp;

DROP trigger IF EXISTS _250_update_in_progress_count on app_public.ingest_documents;
CREATE trigger _250_update_in_progress_count
BEFORE INSERT OR UPDATE ON app_public.ingest_documents
for each ROW
EXECUTE PROCEDURE app_hidden.tg_ingest_documents__update_in_progress_count();

CREATE OR REPLACE FUNCTION app_hidden.tg_ingest_documents__check_status() RETURNS trigger AS $$
BEGIN
  NEW.status = (
    CASE WHEN NEW.status = 'ERROR' OR NEW.status = 'SUCCESS' THEN NEW.status
         WHEN NEW.error_count = OLD.error_count AND NEW.success_count = OLD.success_count THEN OLD.status 
         WHEN (NEW.error_count + NEW.success_count) < NEW.items_count THEN OLD.status 
         WHEN NEW.error_count = 0 THEN 'SUCCESS' 
         WHEN NEW.error_count = NEW.items_count THEN 'ERROR' 
         ELSE 'PARTIAL_SUCCESS'
    END);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql volatile SET search_path TO pg_catalog, public, pg_temp;

DROP trigger IF EXISTS _300_check_status on app_public.ingest_documents;
CREATE trigger _300_check_status
BEFORE UPDATE ON app_public.ingest_documents
for each ROW
EXECUTE PROCEDURE app_hidden.tg_ingest_documents__check_status();

-- table: ingest_items
DROP TABLE IF EXISTS app_public.ingest_items CASCADE;
CREATE TABLE app_public.ingest_items (
  id INT NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  ingest_document_id integer NOT NULL REFERENCES app_public.ingest_documents(id) ON DELETE CASCADE,
  external_id text NOT NULL,
  entity_id integer NOT NULL,
  item app_public.ingest_item_object NOT NULL,
  display_title text NOT NULL,
  processed_trailer_ids uuid[] DEFAULT '{}'::uuid[] NOT NULL,
  errors jsonb[] NOT NULL DEFAULT '{}'::jsonb[]
);
SELECT ax_define.define_audit_date_fields_on_table('ingest_items', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('ingest_items', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.bind_enum_table_to_table('status', 'ingest_items', 'app_public', 'ingest_item_status', 'IN_PROGRESS');
SELECT ax_define.set_enum_domain('status', 'ingest_items', 'app_public', 'ingest_item_status_enum', 'app_public');
SELECT ax_define.bind_enum_table_to_table('exists_status', 'ingest_items', 'app_public', 'ingest_entity_exists_status');
SELECT ax_define.set_enum_domain('exists_status', 'ingest_items', 'app_public', 'ingest_entity_exists_status_enum', 'app_public');
SELECT ax_define.bind_enum_table_to_table('type', 'ingest_items', 'app_public', 'ingest_item_type');
SELECT ax_define.set_enum_domain('type', 'ingest_items', 'app_public', 'ingest_item_type_enum', 'app_public');

GRANT SELECT ON app_public.ingest_items TO ":DATABASE_GQL_ROLE";
GRANT INSERT (ingest_document_id, external_id, type, entity_id, exists_status, item, display_title) ON app_public.ingest_items TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (processed_trailer_ids, status, errors) ON app_public.ingest_items TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('ingest_document_id', 'ingest_items', 'app_public', 'ingest_documents', 'IngestItem');
SELECT ax_define.define_index('ingest_document_id', 'ingest_items', 'app_public');
SELECT ax_define.define_indexes_with_id('external_id', 'ingest_items', 'app_public');
SELECT ax_define.define_indexes_with_id('type', 'ingest_items', 'app_public');
SELECT ax_define.define_indexes_with_id('exists_status', 'ingest_items', 'app_public');
SELECT ax_define.define_indexes_with_id('status', 'ingest_items', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'ingest_documents', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'ingest_documents', 'app_public');
SELECT ax_define.define_like_index('external_id', 'ingest_items', 'app_public');
SELECT ax_define.define_timestamps_trigger('ingest_items', 'app_public');
SELECT ax_define.define_users_trigger('ingest_items', 'app_public');
SELECT ax_define.define_authentication('INGEST_READER,INGEST_EDITOR,ADMIN', 'INGEST_EDITOR,ADMIN', 'ingest_items', 'app_public');

-- table: ingest_item_steps
DROP TABLE IF EXISTS app_public.ingest_item_steps CASCADE;
CREATE TABLE app_public.ingest_item_steps (
  id UUID PRIMARY KEY, -- generated in code
  ingest_item_id integer NOT NULL REFERENCES app_public.ingest_items(id) ON DELETE CASCADE,
  sub_type text NOT NULL,
  response_message text
);

SELECT ax_define.bind_enum_table_to_table('type', 'ingest_item_steps', 'app_public', 'ingest_item_step_type');
SELECT ax_define.bind_enum_table_to_table('status', 'ingest_item_steps', 'app_public', 'ingest_item_step_status', 'IN_PROGRESS');
SELECT ax_define.define_audit_date_fields_on_table('ingest_item_steps', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('ingest_item_steps', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_timestamps_trigger('ingest_item_steps', 'app_public');
SELECT ax_define.define_users_trigger('ingest_item_steps', 'app_public');

SELECT ax_define.set_enum_domain('type', 'ingest_item_steps', 'app_public', 'ingest_item_step_type_enum', 'app_public');
SELECT ax_define.set_enum_domain('status', 'ingest_item_steps', 'app_public', 'ingest_item_step_status_enum', 'app_public');

SELECT ax_define.define_index('ingest_item_id', 'ingest_item_steps', 'app_public');
SELECT ax_define.define_index('sub_type', 'ingest_item_steps', 'app_public');
SELECT ax_define.define_index('type', 'ingest_item_steps', 'app_public');
SELECT ax_define.define_index('status', 'ingest_item_steps', 'app_public');
SELECT ax_define.define_authentication('INGEST_READER,INGEST_EDITOR,ADMIN', 'INGEST_EDITOR,ADMIN', 'ingest_item_steps', 'app_public');

GRANT SELECT ON app_public.ingest_item_steps TO ":DATABASE_GQL_ROLE";
GRANT INSERT (id, ingest_item_id, sub_type, type, status) ON app_public.ingest_item_steps TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (status, response_message) ON app_public.ingest_item_steps TO ":DATABASE_GQL_ROLE";
