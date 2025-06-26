--! Previous: sha1:325a214ebdc0644e877a85c179a09e735a54ab7f
--! Hash: sha1:632ee1795d04a13f38317475b13c5a9835232722
--! Message: fix-rls-auth-permissions

SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collection_relations', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_directors', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_directors', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_directors', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_licenses_countries', 'app_public');
