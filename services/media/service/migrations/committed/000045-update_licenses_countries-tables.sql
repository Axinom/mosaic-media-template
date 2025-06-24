--! Previous: sha1:b8084b4bb5c8acf1554a0919ec0bf3ffd6dc6738
--! Hash: sha1:f9260110ed6c3dfff2d9622eab7f8b2749c5ac09
--! Message: update_licenses_countries-tables

-- table: movies_licenses_countries
DROP TABLE IF EXISTS app_public.movies_licenses_countries CASCADE;
CREATE TABLE app_public.movies_licenses_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movies_license_id integer NOT NULL REFERENCES app_public.movies_licenses(id) ON DELETE CASCADE,
  country_group_id UUID REFERENCES app_public.country_groups(id),
  country_code TEXT REFERENCES app_public.iso_alpha_two_country_codes(value)
);

GRANT SELECT, DELETE, INSERT, UPDATE ON app_public.movies_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('movies_license_id', 'movies_licenses_countries', 'app_public', 'movies_licenses', 'MovieLicensesCountry');
SELECT ax_define.define_index('movies_license_id', 'movies_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_licenses_countries', 'app_public');

-- table: tvshows_licenses_countries
DROP TABLE IF EXISTS app_public.tvshows_licenses_countries CASCADE;
CREATE TABLE app_public.tvshows_licenses_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tvshows_license_id integer NOT NULL REFERENCES app_public.tvshows_licenses(id) ON DELETE CASCADE,
  country_group_id UUID REFERENCES app_public.country_groups(id),
  country_code TEXT REFERENCES app_public.iso_alpha_two_country_codes(value)
);

GRANT SELECT, DELETE, INSERT, UPDATE ON app_public.tvshows_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('tvshows_license_id', 'tvshows_licenses_countries', 'app_public', 'tvshows_licenses', 'MovieLicensesCountry');
SELECT ax_define.define_index('tvshows_license_id', 'tvshows_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_licenses_countries', 'app_public');

-- table: seasons_licenses_countries
DROP TABLE IF EXISTS app_public.seasons_licenses_countries CASCADE;
CREATE TABLE app_public.seasons_licenses_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seasons_license_id integer NOT NULL REFERENCES app_public.seasons_licenses(id) ON DELETE CASCADE,
  country_group_id UUID REFERENCES app_public.country_groups(id),
  country_code TEXT REFERENCES app_public.iso_alpha_two_country_codes(value)
);

GRANT SELECT, DELETE, INSERT, UPDATE ON app_public.seasons_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('seasons_license_id', 'seasons_licenses_countries', 'app_public', 'seasons_licenses', 'MovieLicensesCountry');
SELECT ax_define.define_index('seasons_license_id', 'seasons_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_licenses_countries', 'app_public');

-- table: episodes_licenses_countries
DROP TABLE IF EXISTS app_public.episodes_licenses_countries CASCADE;
CREATE TABLE app_public.episodes_licenses_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episodes_license_id integer NOT NULL REFERENCES app_public.episodes_licenses(id) ON DELETE CASCADE,
  country_group_id UUID REFERENCES app_public.country_groups(id),
  country_code TEXT REFERENCES app_public.iso_alpha_two_country_codes(value)
);

GRANT SELECT, DELETE, INSERT, UPDATE ON app_public.episodes_licenses_countries TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_subscription_triggers('episodes_license_id', 'episodes_licenses_countries', 'app_public', 'episodes_licenses', 'MovieLicensesCountry');
SELECT ax_define.define_index('episodes_license_id', 'episodes_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_licenses_countries', 'app_public');
