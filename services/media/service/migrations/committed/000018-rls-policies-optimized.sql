--! Previous: sha1:3d5edb6b496271bcc8c8ffd6cf237913a12ce1ce
--! Hash: sha1:1bfd2d3842c32fb8018288da0a25da394a4b5f2d
--! Message: rls-policies-optimized

SELECT ax_define.define_authentication('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 'SETTINGS_EDIT,ADMIN', 'movie_genres', 'app_public');
SELECT ax_define.define_authentication('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 'SETTINGS_EDIT,ADMIN', 'tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_tags', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_casts', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_licenses', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_production_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_movie_genres', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_images', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_trailers', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collection_relations', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections_tags', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections_images', 'app_public');
SELECT ax_define.define_authentication('INGESTS_VIEW,INGESTS_EDIT,ADMIN', 'INGESTS_EDIT,ADMIN', 'ingest_documents', 'app_public');
SELECT ax_define.define_authentication('INGESTS_VIEW,INGESTS_EDIT,ADMIN', 'INGESTS_EDIT,ADMIN', 'ingest_items', 'app_public');
SELECT ax_define.define_authentication('INGESTS_VIEW,INGESTS_EDIT,ADMIN', 'INGESTS_EDIT,ADMIN', 'ingest_item_steps', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_snapshots', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections_snapshots', 'app_public');

-- create authentication for a snapshots and snapshot_validation_results tables via row level security based on permissions and snapshot entity type
-- usage: SELECT app_hidden.define_snapshot_authentication(
--          'MOVIE',
--          'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
--          'MOVIE_READER,MOVIE_EDITOR,ADMIN',
--          'MOVIE_EDITOR,ADMIN');
-- entityType: the type of the entity for which permissions are defined.
-- allowedReadPermissions: a comma-separated list of all permissions that would generally allow reading some entity (not restricted to the one defined in the entityType) from that table. An error is thrown if the user has no permission from this list.
-- filterReadPermissions: this lists the specific permissions that allow reading the entityType entries. This is used for RLS filtering.
-- allowedModifyPermissions: a comma-separated list of permission names to grant modify permissions. An error is thrown if the user has no permission from this list.
CREATE OR REPLACE FUNCTION app_hidden.define_snapshot_authentication( 
  entityType text,
  allowedReadPermissions text, 
  filterReadPermissions text, 
  allowedModifyPermissions text) RETURNS void
  LANGUAGE plpgsql
  AS $$
DECLARE
  type_rls_string TEXT = '(entity_type = ''' || entityType || ''')';
BEGIN
  PERFORM app_hidden.drop_snapshot_authentication(entityType);
  EXECUTE 'ALTER TABLE app_public.snapshots ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'ALTER TABLE app_public.snapshot_validation_results ENABLE ROW LEVEL SECURITY;';

  if (filterReadPermissions <> '' and allowedModifyPermissions <> '' and allowedReadPermissions <> '') then
    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_select ON app_public.snapshots FOR SELECT 
      USING (' || type_rls_string || ' AND (SELECT app_hidden.user_has_filter_permission(''' || filterReadPermissions || ''')) AND (SELECT ax_utils.user_has_permission(''' || allowedReadPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_insert ON app_public.snapshots FOR INSERT
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_update ON app_public.snapshots FOR UPDATE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')))
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_delete ON app_public.snapshots FOR DELETE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_select ON app_public.snapshot_validation_results FOR SELECT 
      USING (' || type_rls_string || ' AND (SELECT app_hidden.user_has_filter_permission(''' || filterReadPermissions || ''')) AND (SELECT ax_utils.user_has_permission(''' || allowedReadPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_insert ON app_public.snapshot_validation_results FOR INSERT
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_update ON app_public.snapshot_validation_results FOR UPDATE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')))
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_delete ON app_public.snapshot_validation_results FOR DELETE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';
  else
    perform ax_utils.raise_error('Invalid parameters provided to "ax_utils.define_snapshot_authentication".', 'SETUP');
  end if;
END;
$$;

SELECT app_hidden.define_snapshot_authentication(
  'MOVIE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'MOVIES_VIEW,MOVIES_EDIT,ADMIN', 
  'MOVIES_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'SEASON',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'EPISODE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'MOVIE_GENRE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 
  'SETTINGS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW_GENRE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 
  'SETTINGS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'COLLECTION',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 
  'COLLECTIONS_EDIT,ADMIN');
