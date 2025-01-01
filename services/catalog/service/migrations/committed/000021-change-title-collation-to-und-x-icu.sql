--! Previous: sha1:55199ee79f615a416f99e828f400242248d78eff
--! Hash: sha1:b435c8f8592d3829683853f3d4ec57b438b63324
--! Message: change-title-collation-to-und-x-icu

-- Change the collation of title columns to und-x-icu
DO $$
DECLARE
  base_tables_ TEXT[] = ARRAY[
    'movie',
    'movie_genre',
    'tvshow',
    'tvshow_genre',
    'episode',
    'collection'
  ];
  localization_tables_ TEXT[] = ARRAY[
    'movie_localizations',
    'movie_genre_localizations',
    'tvshow_localizations',
    'tvshow_genre_localizations',
    'episode_localizations',
    'collection_localizations'
  ];
  id_columns_ TEXT[] = ARRAY[
    'movie_id',
    'movie_genre_id',
    'tvshow_id',
    'tvshow_genre_id',
    'episode_id',
    'collection_id'
  ];

  drop_view_sql_ TEXT;
  alter_table_sql_ TEXT;
  
BEGIN
  FOR i_ IN 1..array_length(localization_tables_, 1) LOOP
    drop_view_sql_ := '';
    alter_table_sql_ := '';

    -- Drop existing indexes related to title in _localizations tables
    PERFORM ax_define.drop_like_index('title', localization_tables_[i_]);
    PERFORM ax_define.drop_indexes_with_id('title', localization_tables_[i_]);

    -- Drop existing view
    drop_view_sql_ := format('DROP VIEW IF EXISTS app_public.%s_view;', base_tables_[i_]);
    EXECUTE drop_view_sql_;

    -- Alter the collation for title column
    alter_table_sql_ := format('ALTER TABLE app_public.%s ALTER COLUMN title TYPE TEXT COLLATE "und-x-icu";', localization_tables_[i_]);
    EXECUTE alter_table_sql_;

    -- Recreate indexes
    PERFORM ax_define.define_like_index('title', localization_tables_[i_], 'app_public');
    PERFORM ax_define.define_indexes_with_id(
      fieldName => 'title', 
      tableName => localization_tables_[i_], 
      schemaName => 'app_public', 
      idFieldName => id_columns_[i_]);

    -- Recreate the localization view
    PERFORM app_private.define_localization_view(
      base_tables_[i_],
      localization_tables_[i_],
      id_columns_[i_]);
  END LOOP;
END $$;
