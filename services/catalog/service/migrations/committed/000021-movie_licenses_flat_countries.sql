--! Previous: sha1:55199ee79f615a416f99e828f400242248d78eff
--! Hash: sha1:ca30cd20ed52e47996a3d00b11791d65c0387771
--! Message: movie_licenses_flat_countries

-- Drop function if it already exists

DROP FUNCTION IF EXISTS app_public.movie_licenses_flat_countries;
CREATE FUNCTION app_public.movie_licenses_flat_countries(movie_licenses app_public.movie_licenses) RETURNS TEXT AS $$
  SELECT array_to_string(ARRAY(SELECT LOWER(country) FROM unnest(movie_licenses.countries) AS country), ',')
$$ LANGUAGE sql STABLE;
