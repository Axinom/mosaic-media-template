--! Previous: sha1:586165918b2f3a24e754f0641fc750c40492c508
--! Hash: sha1:9851a1af4f103e96e085e41f08b5a661399acde2
--! Message: adjust-snapshot-rls-filtering

-- The function ax_utils.user_has_permission used to filter rows via row-level security (RLS) checks. 
-- But it got adjusted to throw an error when insufficient permissions were present. Therefore, we have to implement filtering based on RLS with our own function.

-- This function checks if a user has the required permissions. 
-- This function can be used in policies to verify that the required USING and WITH CHECK checks are implemented.
create or replace function app_hidden.user_has_filter_permission(required_permissions text) returns boolean
	LANGUAGE plpgsql	
	as $$
BEGIN
   return ax_utils.user_has_setting(required_permissions, 'mosaic.auth.permissions');
END;
$$;

DROP FUNCTION IF EXISTS app_hidden.define_snapshot_authentication(text, text, text); -- drop old version

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
      USING (' || type_rls_string || ' AND app_hidden.user_has_filter_permission(''' || filterReadPermissions || ''') AND ax_utils.user_has_permission(''' || allowedReadPermissions || '''));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_insert ON app_public.snapshots FOR INSERT
      WITH CHECK (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_update ON app_public.snapshots FOR UPDATE
      USING (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''))
      WITH CHECK (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_delete ON app_public.snapshots FOR DELETE
      USING (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_select ON app_public.snapshot_validation_results FOR SELECT 
      USING (' || type_rls_string || ' AND app_hidden.user_has_filter_permission(''' || filterReadPermissions || ''') AND ax_utils.user_has_permission(''' || allowedReadPermissions || '''));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_insert ON app_public.snapshot_validation_results FOR INSERT
      WITH CHECK (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_update ON app_public.snapshot_validation_results FOR UPDATE
      USING (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''))
      WITH CHECK (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_delete ON app_public.snapshot_validation_results FOR DELETE
      USING (' || type_rls_string || ' AND ax_utils.user_has_permission(''' || allowedModifyPermissions || '''));';
  else
    perform ax_utils.raise_error('Invalid parameters provided to "ax_utils.define_snapshot_authentication".', 'SETUP');
  end if;
END;
$$;

-- define rls authentication for snapshot tables based on entity_type column
SELECT app_hidden.define_snapshot_authentication(
  'MOVIE',
  'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
  'MOVIE_READER,MOVIE_EDITOR,ADMIN', 
  'MOVIE_EDITOR,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW',
  'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
  'TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 
  'TVSHOW_EDITOR,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'SEASON',
  'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
  'TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 
  'TVSHOW_EDITOR,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'EPISODE',
  'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
  'TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 
  'TVSHOW_EDITOR,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'MOVIE_GENRE',
  'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
  'SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 
  'SETTINGS_EDITOR,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW_GENRE',
  'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
  'SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 
  'SETTINGS_EDITOR,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'COLLECTION',
  'MOVIE_READER,MOVIE_EDITOR,TVSHOW_READER,TVSHOW_EDITOR,SETTINGS_READER,SETTINGS_EDITOR,COLLECTION_READER,COLLECTION_EDITOR,ADMIN',
  'COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 
  'COLLECTION_EDITOR,ADMIN');
