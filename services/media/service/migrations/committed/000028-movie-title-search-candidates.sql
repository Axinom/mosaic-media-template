--! Previous: sha1:ed29a209c0cda142f10ecec524ea11c0f209d8bf
--! Hash: sha1:c4c599001d50d7e8d1e5b344c77cae73e500326f
--! Message: movie-title-search-candidates

-- Returns the IDs of all movies whose title matches the ILIKE pattern. It runs
-- as the table owner, so row level security does not prevent the use of the
-- trigram index on the title even when ILIKE is not LEAKPROOF. The IDs are only
-- meant to narrow down a movies query, which applies row level security.
-- Additional row level security policies are not applied to the IDs.
-- The dynamic query is planned for each pattern, as a cached generic plan
-- cannot judge how selective a pattern is.
DROP FUNCTION IF EXISTS app_hidden.movie_ids_matching_title(text);
CREATE FUNCTION app_hidden.movie_ids_matching_title(title_pattern text) RETURNS SETOF integer
  LANGUAGE plpgsql STABLE SECURITY DEFINER
  SET search_path = pg_catalog, pg_temp
  AS $$
BEGIN
  PERFORM ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN');
  RETURN QUERY EXECUTE 'SELECT id FROM app_public.movies WHERE title ILIKE $1' USING title_pattern;
END;
$$;
REVOKE ALL ON FUNCTION app_hidden.movie_ids_matching_title(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_hidden.movie_ids_matching_title(text) TO ":DATABASE_GQL_ROLE";
