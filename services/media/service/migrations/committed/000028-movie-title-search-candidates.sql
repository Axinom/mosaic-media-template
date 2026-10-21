--! Previous: sha1:ed29a209c0cda142f10ecec524ea11c0f209d8bf
--! Hash: sha1:b95f369c24359ddd36a0a1ec58e0e679c5c599d0
--! Message: movie-title-search-candidates

-- Candidate retrieval is an optional optimization, not the final authorization.
-- Keep this STABLE so the candidates and the outer RLS query share a snapshot.
-- A single NULL is a fallback marker; it must never be mixed with real IDs.
CREATE OR REPLACE FUNCTION app_hidden.movie_ids_matching_title(title_pattern text) RETURNS SETOF integer
  LANGUAGE plpgsql STABLE SECURITY DEFINER
  SET search_path = pg_catalog, pg_temp
  AS $$
DECLARE
  candidate_ids integer[];
BEGIN
  PERFORM ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN');
  -- This is a conservative check for the literal contains patterns produced by
  -- the GraphQL filter. A fallback changes performance, never matching semantics.
  IF title_pattern !~ '[[:alnum:]]{3}' THEN
    RETURN NEXT NULL;
    RETURN;
  END IF;
  EXECUTE 'SELECT array_agg(id) FROM (SELECT id FROM app_public.movies WHERE title ILIKE $1 LIMIT 1001) AS candidates'
    INTO candidate_ids USING title_pattern;
  IF candidate_ids IS NULL THEN
    RETURN;
  ELSIF cardinality(candidate_ids) > 1000 THEN
    RETURN NEXT NULL;
  ELSE
    RETURN QUERY SELECT unnest(candidate_ids);
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION app_hidden.movie_ids_matching_title(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_hidden.movie_ids_matching_title(text) TO ":DATABASE_GQL_ROLE";
