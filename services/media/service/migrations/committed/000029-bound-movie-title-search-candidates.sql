--! Previous: sha1:c4c599001d50d7e8d1e5b344c77cae73e500326f
--! Hash: sha1:9a943e3249b57e7b291b915764cd0371239df558
--! Message: bound-movie-title-search-candidates

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
