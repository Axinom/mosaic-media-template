--! Previous: sha1:677b5e78a2bfb199af4c633568e2c80a8aebc78b
--! Hash: sha1:3718d885bf006e078110fb255683771f5afb53ff
--! Message: movie-subtitle-added

ALTER TABLE app_public.movie
DROP COLUMN IF EXISTS subtitle CASCADE;

ALTER TABLE app_public.movie 
ADD COLUMN subtitle TEXT;

SELECT app_private.define_localization_view(
  'movie',
  'movie_localizations',
  'movie_id');
