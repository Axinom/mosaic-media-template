--! Previous: sha1:57662d3b04e97c61102519074dae4ecdd583982d
--! Hash: sha1:49a4a389bfceff106f495988d8e8273775ba2180
--! Message: search-indices-added-for-movie-and-tvshow

-- MOVIE
-- Indices for movie table
SELECT ax_define.define_like_index('title', 'movie', 'app_public');
SELECT ax_define.define_index('movie_cast', 'movie', 'app_public');
SELECT ax_define.define_like_index('extended_field', 'movie', 'app_public');

SELECT ax_define.define_index('tags', 'movie', 'app_public');
SELECT ax_define.define_index('audio_languages', 'movie', 'app_public');
-- End indices for movies table

-- Indices for movie genres table
SELECT ax_define.define_index('movie_genre_id', 'movie_genres_relation', 'app_public');
SELECT ax_define.define_index('movie_id', 'movie_genres_relation', 'app_public');
-- End indices for movie genres table

-- Indices for movie licenses table
SELECT ax_define.define_index('movie_id', 'movie_licenses', 'app_public');
SELECT ax_define.define_index('countries', 'movie_licenses', 'app_public');
SELECT ax_define.define_index('start_time', 'movie_licenses', 'app_public');
SELECT ax_define.define_index('end_time', 'movie_licenses', 'app_public');
-- End indices for movie licenses table


-- TV SHOW
-- Indices for tvshow table
SELECT ax_define.define_like_index('title', 'tvshow', 'app_public');
SELECT ax_define.define_index('tvshow_cast', 'tvshow', 'app_public');
SELECT ax_define.define_like_index('extended_field', 'tvshow', 'app_public');

SELECT ax_define.define_index('tags', 'tvshow', 'app_public');
SELECT ax_define.define_index('audio_languages', 'tvshow', 'app_public');
-- End indices for tvshow table

-- Indices for tvshow genres table
SELECT ax_define.define_index('tvshow_genre_id', 'tvshow_genres_relation', 'app_public');
SELECT ax_define.define_index('tvshow_id', 'tvshow_genres_relation', 'app_public');
-- End indices for tvshow genres table

-- Indices for tvshow licenses table
SELECT ax_define.define_index('tvshow_id', 'tvshow_licenses', 'app_public');
SELECT ax_define.define_index('countries', 'tvshow_licenses', 'app_public');
SELECT ax_define.define_index('start_time', 'tvshow_licenses', 'app_public');
SELECT ax_define.define_index('end_time', 'tvshow_licenses', 'app_public');
-- End indices for tvshow licenses table
