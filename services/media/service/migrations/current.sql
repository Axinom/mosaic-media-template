--! Message: replace-with-migration-name

DROP TABLE IF EXISTS app_public.movies_directors CASCADE;
CREATE TABLE app_public.movies_directors (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(movie_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_directors TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_index('movie_id', 'movies_directors', 'app_public');
SELECT ax_define.define_like_index('name', 'movies_directors', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'movies_directors', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_directors', 'app_public');
