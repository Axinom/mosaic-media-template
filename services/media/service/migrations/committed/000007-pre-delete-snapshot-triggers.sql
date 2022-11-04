--! Previous: sha1:3e0a3fae12b164197ded54c739dc8ad1af66884d
--! Hash: sha1:a1d53e466561bef7d13d5aab11bd526df2acc616
--! Message: pre-delete-snapshot-triggers

-- Creates a trigger function and a trigger that checks if an entity has an active snapshots. Does not consider active orphaned snapshots.
-- If active snapshot is found - error with ACSNS code is thrown. Exact error message is returned with an error GraphQL response, as it is explicitly handled by mediaPgErrorMapper.
-- @tableName - name of the table for entity that can have snapshots, e.g. 'movies'
-- @relationTableName - many-to-many relation table name between entity and snapshot, e.g. 'movies_snapshots'
-- @relationFkName - name of a FK property that represents an entity id in a relation table, e.g. 'movie_id'
-- @entityTypeName - capitalized human-readable name of the entity to be used in an error message, e.g. 'Movie'
CREATE OR REPLACE FUNCTION app_hidden.create_active_snapshots_before_delete_trigger(tableName text, relationTableName text, relationFkName text, entityTypeName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.tg_' || tableName || '__check_active_snapshots() RETURNS trigger AS $snap$ ' ||
          'BEGIN ' ||
            'IF EXISTS (SELECT '''' ' ||
                       'FROM app_public.snapshots s ' ||
                       'INNER JOIN app_public.' || relationTableName || ' es ON es.snapshot_id = s.id ' ||
                       'WHERE es.' || relationFkName || ' = OLD.id AND s.snapshot_state IN (''INITIALIZATION'', ''VALIDATION'', ''PUBLISHED'')) THEN ' ||
              'perform ax_utils.raise_error(''%s with ID %s cannot be deleted as it has active snapshots.'', ''ACSNS'', ''' || entityTypeName || ''', OLD.id::text); ' ||
            'END IF; ' ||
            'RETURN OLD; ' ||
          'END; ' ||
          '$snap$ LANGUAGE plpgsql STABLE;';

  EXECUTE 'DROP trigger IF EXISTS _100_check_active_snapshots on app_public.' || tableName || ';';
  EXECUTE 'CREATE trigger _100_check_active_snapshots ' ||
          'BEFORE DELETE ON app_public.' || tableName || ' ' ||
          'for each ROW ' ||
          'EXECUTE PROCEDURE app_hidden.tg_' || tableName || '__check_active_snapshots();';
END;
$$;

SELECT app_hidden.create_active_snapshots_before_delete_trigger('movies', 'movies_snapshots', 'movie_id', 'Movie');
SELECT app_hidden.create_active_snapshots_before_delete_trigger('tvshows', 'tvshows_snapshots', 'tvshow_id', 'TV Show');
SELECT app_hidden.create_active_snapshots_before_delete_trigger('seasons', 'seasons_snapshots', 'season_id', 'Season');
SELECT app_hidden.create_active_snapshots_before_delete_trigger('episodes', 'episodes_snapshots', 'episode_id', 'Episode');
SELECT app_hidden.create_active_snapshots_before_delete_trigger('movie_genres', 'movie_genres_snapshots', 'movie_genre_id', 'Movie Genre');
SELECT app_hidden.create_active_snapshots_before_delete_trigger('tvshow_genres', 'tvshow_genres_snapshots', 'tvshow_genre_id', 'TV Show Genre');
SELECT app_hidden.create_active_snapshots_before_delete_trigger('collections', 'collections_snapshots', 'collection_id', 'Collection');

-- Trigger function and a trigger that checks if a snapsot is in an active state.
-- If snapshot is active - error with ACSNS code is thrown. Exact error message is returned with an error GraphQL response, as it is explicitly handled by mediaPgErrorMapper.
CREATE OR REPLACE FUNCTION app_hidden.tg_snapshots__check_active_state() RETURNS trigger AS $snap$
BEGIN
  IF (OLD.snapshot_state IN ('INITIALIZATION', 'VALIDATION', 'PUBLISHED')) THEN
    perform ax_utils.raise_error('Snapshot with ID %s cannot be deleted as it has an active ''%s'' state.', 'ACSNS', OLD.id::text, OLD.snapshot_state);
  END IF;
  RETURN OLD;
END;
$snap$ LANGUAGE plpgsql STABLE;

DROP trigger IF EXISTS _100_check_active_snapshots on app_public.snapshots;
CREATE trigger _100_check_active_snapshots
BEFORE DELETE ON app_public.snapshots
for each ROW
EXECUTE PROCEDURE app_hidden.tg_snapshots__check_active_state();
