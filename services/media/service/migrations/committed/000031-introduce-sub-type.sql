--! Previous: sha1:6f5aff0dd82afacff25fb930518391d684bdd997
--! Hash: sha1:97414ab5b38903fb0a0d6698a39f4a8b20d552f7
--! Message: introduce-sub-type

-- sub-type enum
SELECT ax_define.create_enum_table(
  'asset_subtype',
  'app_public',
  ':DATABASE_LOGIN',
  '{"MOVIE","TV_SHOW", "SEASON", "EPISODE", "COLLECTION","ALBUM", "AUDIO_TRACK","SUBSCRIPTION_PLAN","FILE","PROMOTION","CUSTOM","CONTENT_SET","UNKNOWN"}',
  '{"Movie","TV Show", "Season", "Episode", "Collection","Album", "Audio Track","Subscription Plan","File","Promotion","Custom","Content Set","Unknown"}');

-- add sub-type column to movies and link it to enum table
SELECT ax_define.set_enum_as_column_type('asset_subtype', 'movies', 'app_public', 'asset_subtype', 'app_public', 'MOVIE');
SELECT ax_define.set_enum_domain('asset_subtype', 'movies', 'app_public', 'asset_subtype_enum', 'app_public');
GRANT INSERT (asset_subtype) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_subtype) ON app_public.movies TO ":DATABASE_GQL_ROLE";

-- add business-type column to tvshows and link it to enum table
SELECT ax_define.set_enum_as_column_type('asset_subtype', 'tvshows', 'app_public', 'asset_subtype', 'app_public', 'TV_SHOW');
SELECT ax_define.set_enum_domain('asset_subtype', 'tvshows', 'app_public', 'asset_subtype_enum', 'app_public');
GRANT INSERT (asset_subtype) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_subtype) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";

-- add business-type column to seasons and link it to enum table
SELECT ax_define.set_enum_as_column_type('asset_subtype', 'seasons', 'app_public', 'asset_subtype', 'app_public', 'SEASON');
SELECT ax_define.set_enum_domain('asset_subtype', 'seasons', 'app_public', 'asset_subtype_enum', 'app_public');
GRANT INSERT (asset_subtype) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_subtype) ON app_public.seasons TO ":DATABASE_GQL_ROLE";

-- add business-type column to episodes and link it to enum table
SELECT ax_define.set_enum_as_column_type('asset_subtype', 'episodes', 'app_public', 'asset_subtype', 'app_public', 'EPISODE');
SELECT ax_define.set_enum_domain('asset_subtype', 'episodes', 'app_public', 'asset_subtype_enum', 'app_public');
GRANT INSERT (asset_subtype) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_subtype) ON app_public.episodes TO ":DATABASE_GQL_ROLE";

-- add business-type column to collections and link it to enum table
SELECT ax_define.set_enum_as_column_type('asset_subtype', 'collections', 'app_public', 'asset_subtype', 'app_public', 'COLLECTION');
SELECT ax_define.set_enum_domain('asset_subtype', 'collections', 'app_public', 'asset_subtype_enum', 'app_public');
GRANT INSERT (asset_subtype) ON app_public.collections TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_subtype) ON app_public.collections TO ":DATABASE_GQL_ROLE";
