--! Previous: sha1:46d824117e4201a61a7eb6d51245acd74f381e38
--! Hash: sha1:236f1cf5e1574d5eca4d0135835fccd1b61f63e0
--! Message: drop-excessive-relation-update-options

-- movies
REVOKE UPDATE ON app_public.movies_tags FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.movies_tags TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.movies_casts FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.movies_casts TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.movies_production_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.movies_production_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.movies_licenses_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (code) ON app_public.movies_licenses_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.movies_movie_genres FROM ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.movies_trailers FROM ":DATABASE_GQL_ROLE";

-- tvshows
REVOKE UPDATE ON app_public.tvshows_tags FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.tvshows_tags TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.tvshows_casts FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.tvshows_casts TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.tvshows_production_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.tvshows_production_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.tvshows_licenses_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (code) ON app_public.tvshows_licenses_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.tvshows_tvshow_genres FROM ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.tvshows_trailers FROM ":DATABASE_GQL_ROLE";

-- episodes
REVOKE UPDATE ON app_public.seasons_tags FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.seasons_tags TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.seasons_casts FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.seasons_casts TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.seasons_production_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.seasons_production_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.seasons_licenses_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (code) ON app_public.seasons_licenses_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.seasons_tvshow_genres FROM ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.seasons_trailers FROM ":DATABASE_GQL_ROLE";

-- episodes
REVOKE UPDATE ON app_public.episodes_tags FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.episodes_tags TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.episodes_casts FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.episodes_casts TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.episodes_production_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.episodes_production_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.episodes_licenses_countries FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (code) ON app_public.episodes_licenses_countries TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.episodes_tvshow_genres FROM ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.episodes_trailers FROM ":DATABASE_GQL_ROLE";

-- collections
REVOKE UPDATE ON app_public.collections_tags FROM ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.collections_tags TO ":DATABASE_GQL_ROLE";
