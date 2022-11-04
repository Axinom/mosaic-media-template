--! Previous: sha1:236f1cf5e1574d5eca4d0135835fccd1b61f63e0
--! Hash: sha1:3e0a3fae12b164197ded54c739dc8ad1af66884d
--! Message: snapshots-finalization

-- create the messaging counter table
SELECT ax_define.create_messaging_counter_table();


-- #### define snapshot rls helper functions ####

-- drop snapsot rls authentication based on entity type
CREATE OR REPLACE FUNCTION app_hidden.drop_snapshot_authentication(entityType text) RETURNS void
  LANGUAGE plpgsql
  AS $$
BEGIN
  EXECUTE 'ALTER TABLE app_public.snapshots DISABLE ROW LEVEL SECURITY;';
  EXECUTE 'ALTER TABLE app_public.snapshot_validation_results DISABLE ROW LEVEL SECURITY;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_select ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_insert ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_update ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_delete ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_select ON app_public.snapshot_validation_results;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_insert ON app_public.snapshot_validation_results;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_update ON app_public.snapshot_validation_results;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_delete ON app_public.snapshot_validation_results;';
END;
$$;

-- create authentication for a snapshots table via row level security based on permissions and snapshot entity type
-- usage: SELECT app_hidden.define_snapshot_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'MOVIE');
-- readPermissions: comma separated list of permission names to grant read permissions.
-- modifyPermissions: comma separated list of permission names to grant write permissions. If this is an empty string, only read permissions are granted.
-- entityType: snapshots of which entity type shall be accessible by specified permissions
CREATE OR REPLACE FUNCTION app_hidden.define_snapshot_authentication(readPermissions text, modifyPermissions text, entityType text) RETURNS void
  LANGUAGE plpgsql
  AS $$
DECLARE
  type_rls_string TEXT = '(entity_type = ''' || entityType || ''')';
BEGIN
  PERFORM app_hidden.drop_snapshot_authentication(entityType);
  EXECUTE 'ALTER TABLE app_public.snapshots ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'ALTER TABLE app_public.snapshot_validation_results ENABLE ROW LEVEL SECURITY;';

  if (readPermissions <> '' and modifyPermissions <> '') then
    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_select ON app_public.snapshots FOR SELECT 
      USING (ax_utils.user_has_permission(''' || readPermissions || ''') AND ' || type_rls_string || ');';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_insert ON app_public.snapshots FOR INSERT
      WITH CHECK (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ');';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_update ON app_public.snapshots FOR UPDATE
      USING (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ')
      WITH CHECK (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ');';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_delete ON app_public.snapshots FOR DELETE
      USING (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ');';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_select ON app_public.snapshot_validation_results FOR SELECT 
      USING (ax_utils.user_has_permission(''' || readPermissions || ''') AND ' || type_rls_string || ');';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_insert ON app_public.snapshot_validation_results FOR INSERT
      WITH CHECK (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ');';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_update ON app_public.snapshot_validation_results FOR UPDATE
      USING (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ')
      WITH CHECK (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ');';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_delete ON app_public.snapshot_validation_results FOR DELETE
      USING (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || type_rls_string || ');';
  else
    perform ax_utils.raise_error('Invalid parameters provided to "ax_define.define_snapshot_authentication".', 'SETUP');
  end if;
END;
$$;

-- drop snapshot rls policies to support migration idempotency, otherwise error is thrown when migrating entity_type enum, since it's used in policy definition
SELECT app_hidden.drop_snapshot_authentication('MOVIE');
SELECT app_hidden.drop_snapshot_authentication('TVSHOW');
SELECT app_hidden.drop_snapshot_authentication('SEASON');
SELECT app_hidden.drop_snapshot_authentication('EPISODE');
SELECT app_hidden.drop_snapshot_authentication('COLLECTION');
SELECT app_hidden.drop_snapshot_authentication('MOVIE_GENRE');
SELECT app_hidden.drop_snapshot_authentication('TVSHOW_GENRE');

-- enum migration to tables approach
SELECT ax_define.unbind_enum_type_from_table('snapshot_state', 'snapshots', 'app_public', 'INITIALIZATION');
SELECT ax_define.drop_enum_type_and_create_enum_table(
  'snapshot_state',
  'app_public',
  ':DATABASE_LOGIN',
  '{"INITIALIZATION","VALIDATION","INVALID","READY","SCHEDULED","PUBLISHED","UNPUBLISHED","VERSION_MISMATCH","ERROR"}',
  '{"Initialization","Validation","Invalid","Ready","Scheduled","Published","Unpublished","Version Mismatch","Error"}');
SELECT ax_define.bind_enum_table_to_table('snapshot_state', 'snapshots', 'app_public', 'snapshot_state');
SELECT ax_define.set_enum_domain('snapshot_state', 'snapshots', 'app_public', 'snapshot_state_enum', 'app_public');

SELECT ax_define.unbind_enum_type_from_table('entity_type', 'snapshots', 'app_public');
SELECT ax_define.drop_enum_type_and_create_enum_table(
  'entity_type',
  'app_public',
  ':DATABASE_LOGIN',
  '{"MOVIE","MOVIE_GENRE","TVSHOW","TVSHOW_GENRE","SEASON","EPISODE","COLLECTION"}',
  '{"Movie","Movie Genre","Tvshow","Tvshow Genre","Season","Episode","Collection"}');
SELECT ax_define.bind_enum_table_to_table('entity_type', 'snapshots', 'app_public', 'entity_type');
SELECT ax_define.set_enum_domain('entity_type', 'snapshots', 'app_public', 'entity_type_enum', 'app_public');

SELECT ax_define.unbind_enum_type_from_table('validation_status', 'snapshots', 'app_public');
SELECT ax_define.drop_enum_type_and_create_enum_table(
  'snapshot_validation_status',
  'app_public',
  ':DATABASE_LOGIN',
  '{"OK","WARNINGS","ERRORS"}',
  '{"OK","Warnings","Errors"}');
SELECT ax_define.bind_enum_table_to_table('validation_status', 'snapshots', 'app_public', 'snapshot_validation_status');
SELECT ax_define.set_enum_domain('validation_status', 'snapshots', 'app_public', 'snapshot_validation_status_enum', 'app_public');

SELECT ax_define.unbind_enum_type_from_table('context', 'snapshot_validation_results', 'app_public');
UPDATE app_public.snapshot_validation_results SET context = 'IMAGE' WHERE context = 'IMAGES';
SELECT ax_define.drop_enum_type_and_create_enum_table(
  'snapshot_validation_issue_context',
  'app_public',
  ':DATABASE_LOGIN',
  '{"METADATA","LICENSING","IMAGE","VIDEO"}',
  '{"Metadata","Licensing","Image","Video"}');
SELECT ax_define.bind_enum_table_to_table('context', 'snapshot_validation_results', 'app_public', 'snapshot_validation_issue_context');
SELECT ax_define.set_enum_domain('context', 'snapshot_validation_results', 'app_public', 'snapshot_validation_issue_context_enum', 'app_public');

SELECT ax_define.unbind_enum_type_from_table('severity', 'snapshot_validation_results', 'app_public');
SELECT ax_define.drop_enum_type_and_create_enum_table(
  'snapshot_validation_issue_severity',
  'app_public',
  ':DATABASE_LOGIN',
  '{"WARNING","ERROR"}',
  '{"Warning","Error"}');
SELECT ax_define.bind_enum_table_to_table('severity', 'snapshot_validation_results', 'app_public', 'snapshot_validation_issue_severity');
SELECT ax_define.set_enum_domain('severity', 'snapshot_validation_results', 'app_public', 'snapshot_validation_issue_severity_enum', 'app_public');

-- audit triggers
SELECT ax_define.define_timestamps_trigger('snapshots', 'app_public');
SELECT ax_define.define_users_trigger('snapshots', 'app_public');

-- additional indexes for explorer visible columns
SELECT ax_define.define_indexes_with_id('entity_title', 'snapshots', 'app_public');
SELECT ax_define.define_indexes_with_id('job_id', 'snapshots', 'app_public');
SELECT ax_define.define_indexes_with_id('created_user', 'snapshots', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_user', 'snapshots', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'snapshots', 'app_public');

-- Adjusted indexes for filtering/querying
SELECT ax_define.drop_indexes_with_id('entity_id', 'snapshots');
SELECT ax_define.define_index('entity_id', 'snapshots', 'app_public');
SELECT ax_define.drop_indexes_with_id('scheduled_date', 'snapshots');
SELECT ax_define.define_index('scheduled_date', 'snapshots', 'app_public');
SELECT ax_define.drop_indexes_with_id('published_date', 'snapshots');
SELECT ax_define.define_index('published_date', 'snapshots', 'app_public');
SELECT ax_define.define_index('unpublished_date', 'snapshots', 'app_public');

-- subscriptions added
SELECT ax_define.define_subscription_triggers('id', 'snapshots', 'app_public', 'snapshots', 'Snapshot');
SELECT ax_define.define_subscription_triggers('snapshot_id', 'snapshot_validation_results', 'app_public', 'snapshots', 'SnapshotValidationResult');

-- add entity_type column to snapshot_validation_results to support easier RLS authentication
ALTER TABLE app_public.snapshot_validation_results ADD COLUMN IF NOT EXISTS entity_type TEXT NULL;
UPDATE app_public.snapshot_validation_results SET entity_type = p.entity_type FROM app_public.snapshots p WHERE snapshot_id = p.id;
ALTER TABLE app_public.snapshot_validation_results ALTER COLUMN entity_type SET NOT NULL;
SELECT ax_define.bind_enum_table_to_table('entity_type', 'snapshot_validation_results', 'app_public', 'entity_type');
SELECT ax_define.set_enum_domain('entity_type', 'snapshot_validation_results', 'app_public', 'entity_type_enum', 'app_public');

-- grants adjusted for GQL role to support RLS policies, since owner role bypasses RLS, so it should not be used for snapshots. Smart tags are used to hide endpoints
REVOKE INSERT, UPDATE ON app_public.snapshots FROM ":DATABASE_GQL_ROLE";
GRANT INSERT (
  entity_type,
  entity_id,
  publish_id,
  job_id,
  snapshot_no
) ON app_public.snapshots TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  entity_title,
  snapshot_state,
  validation_status,
  snapshot_json,
  scheduled_date,
  published_date,
  unpublished_date
) ON app_public.snapshots TO ":DATABASE_GQL_ROLE";

REVOKE INSERT, UPDATE ON app_public.snapshot_validation_results FROM ":DATABASE_GQL_ROLE";
GRANT INSERT (
  snapshot_id,
  severity,
  message,
  context,
  entity_type
) ON app_public.snapshot_validation_results TO ":DATABASE_GQL_ROLE";

REVOKE UPDATE ON app_public.movies_snapshots FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE ON app_public.movie_genres_snapshots FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE ON app_public.tvshows_snapshots FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE ON app_public.tvshow_genres_snapshots FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE ON app_public.seasons_snapshots FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE ON app_public.episodes_snapshots FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE ON app_public.collections_snapshots FROM ":DATABASE_GQL_ROLE";

REVOKE UPDATE (publish_status) ON app_public.movies FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE (publish_status) ON app_public.tvshows FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE (publish_status) ON app_public.seasons FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE (publish_status) ON app_public.episodes FROM ":DATABASE_GQL_ROLE";
REVOKE UPDATE (publish_status) ON app_public.collections FROM ":DATABASE_GQL_ROLE";

-- define rls authentication for snapshot tables based on entity_type column
SELECT app_hidden.define_snapshot_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'MOVIE');
SELECT app_hidden.define_snapshot_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'TVSHOW');
SELECT app_hidden.define_snapshot_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'SEASON');
SELECT app_hidden.define_snapshot_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'EPISODE');
SELECT app_hidden.define_snapshot_authentication('SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 'SETTINGS_EDITOR,ADMIN', 'MOVIE_GENRE');
SELECT app_hidden.define_snapshot_authentication('SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 'SETTINGS_EDITOR,ADMIN', 'TVSHOW_GENRE');
SELECT app_hidden.define_snapshot_authentication('COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 'COLLECTION_EDITOR,ADMIN', 'COLLECTION');

SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_snapshots', 'app_public');
SELECT ax_define.define_authentication('SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 'SETTINGS_EDITOR,ADMIN', 'movie_genres_snapshots', 'app_public');
SELECT ax_define.define_authentication('SETTINGS_READER,SETTINGS_EDITOR,ADMIN', 'SETTINGS_EDITOR,ADMIN', 'tvshow_genres_snapshots', 'app_public');
SELECT ax_define.define_authentication('COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 'COLLECTION_EDITOR,ADMIN', 'collections_snapshots', 'app_public');

-- make snapshot_id required
ALTER TABLE app_public.snapshot_validation_results ALTER COLUMN snapshot_id SET NOT NULL;
