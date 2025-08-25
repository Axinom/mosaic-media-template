--! Previous: sha1:632ee1795d04a13f38317475b13c5a9835232722
--! Hash: sha1:625354c87657fc0ab375b9d4607c5360e04ccc1a
--! Message: fix-rls-auth-permissions-for-episodes-directors

SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_directors', 'app_public');
