--! Previous: sha1:bd8d704a797f4f5129748fb2e76477d7ce2f13ad
--! Hash: sha1:bc014f2720e5eea7271713b84d2019ecbd3c8915
--! Message: replication-on-localizable-tables-added

BEGIN;
  SELECT ax_define.define_logical_replication_publication(
    ':PG_LOCALIZATION_PUBLICATION',
    ARRAY['movies', 'movies_images', 'movie_genres'],
    'app_public');
COMMIT;
SELECT ax_define.define_logical_replication_slot(slotName => ':PG_LOCALIZATION_SLOT',
                                                 skipIfMatches => '^.*(_t|_shadow)$');
