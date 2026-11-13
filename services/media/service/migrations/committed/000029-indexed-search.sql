--! Previous: sha1:3058d690f862192f9f689af52b7996307fd6875b
--! Hash: sha1:8df4f45f1c1511e335e8c9bf879940f86141a36f
--! Message: indexed-search

-- Lets the trigram indexes of searchable columns be used by 'includesInsensitive' filters
-- under row level security. The columns are registered with the 'IndexedSearchPluginFactory'.
SELECT ax_define.define_indexed_search('title', 'movies', 'app_public', 'MOVIES_VIEW,MOVIES_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('original_title', 'movies', 'app_public', 'MOVIES_VIEW,MOVIES_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'movies_tags', 'app_public', 'MOVIES_VIEW,MOVIES_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'movies_casts', 'app_public', 'MOVIES_VIEW,MOVIES_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'movies_production_countries', 'app_public', 'MOVIES_VIEW,MOVIES_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('title', 'tvshows', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('original_title', 'tvshows', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'tvshows_tags', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'tvshows_casts', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'tvshows_production_countries', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'seasons_tags', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'seasons_casts', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'seasons_production_countries', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('title', 'episodes', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('original_title', 'episodes', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'episodes_tags', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'episodes_casts', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'episodes_production_countries', 'app_public', 'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('title', 'collections', 'app_public', 'COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
SELECT ax_define.define_indexed_search('name', 'collections_tags', 'app_public', 'COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', ':DATABASE_GQL_ROLE');
