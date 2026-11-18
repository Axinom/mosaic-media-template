--! Previous: sha1:34f99009b452394265f4c55ae555f38c71d16400
--! Hash: sha1:7220f5a49f64210b006799e8adadf82d1d24a62a
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
