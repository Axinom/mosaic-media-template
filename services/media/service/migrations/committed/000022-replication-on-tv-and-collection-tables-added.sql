--! Previous: sha1:437eaf7ef6543cbc4a21589e44ffa0ad29019b96
--! Hash: sha1:ddf18974172dc0b642d1172ea37b2aced3c4f01e
--! Message: replication-on-tv-and-collection-tables-added

BEGIN;
  SELECT ax_define.define_logical_replication_publication(
    ':PG_LOCALIZATION_PUBLICATION',
    ARRAY['movies', 
          'movies_images', 
          'movie_genres',
          'tvshows', 
          'tvshows_images', 
          'tvshow_genres',
          'seasons', 
          'seasons_images',
          'episodes', 
          'episodes_images',
          'collections', 
          'collections_images'],
    'app_public');
COMMIT;
SELECT ax_define.define_logical_replication_slot(slotName => ':PG_LOCALIZATION_SLOT',
                                                 skipIfMatches => '^.*(_t|_shadow)$');
