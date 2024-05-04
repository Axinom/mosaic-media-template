--! Previous: sha1:1bfd2d3842c32fb8018288da0a25da394a4b5f2d
--! Hash: sha1:035a2ed9bc2b4421de935f14596c3a8f50bf2743
--! Message: genre-view-permissions-updated

SELECT ax_define.define_authentication('MOVIES_VIEW,SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 'SETTINGS_EDIT,ADMIN', 'movie_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 'SETTINGS_EDIT,ADMIN', 'tvshow_genres', 'app_public');
