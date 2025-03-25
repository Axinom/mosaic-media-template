--! Previous: sha1:b74cde38f51e59d36d33923a186339559759f757
--! Hash: sha1:fe332928048c237c42e5b84d0b9c94767f467613
--! Message: subtitle-added

ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS subtitle TEXT;

GRANT INSERT (subtitle) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (subtitle) ON app_public.movies TO ":DATABASE_GQL_ROLE";
