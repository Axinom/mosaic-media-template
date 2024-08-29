--! Previous: sha1:d7c481931580f6acf907cf543994742775ae710c
--! Hash: sha1:212e2d2399c4bd449c936294bbf8fc5ca895903b
--! Message: add-business-type-enum-and-fields

-- business-type enum
SELECT ax_define.create_enum_table(
  'business_type',
  'app_public',
  ':DATABASE_LOGIN',
  '{"free","advertisement", "premium", "free_downloadable", "advertisement_downloadable", "premium_downloadable", "free_authenticated", "advertisement_authenticated"}',
  '{"Free","Advertisement", "Premium", "Free downloadable", "Advertisement downloadable", "Premium downloadable", "Free authenticated", "Advertisement authenticated"}');

-- add business-type column to movies and link it to enum table
SELECT ax_define.set_enum_as_column_type('business_type', 'movies', 'app_public', 'business_type', 'app_public', 'premium_downloadable');
SELECT ax_define.set_enum_domain('business_type', 'movies', 'app_public', 'business_type_enum', 'app_public');
GRANT INSERT (business_type) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (business_type) ON app_public.movies TO ":DATABASE_GQL_ROLE";

-- add business-type column to tvshows and link it to enum table
SELECT ax_define.set_enum_as_column_type('business_type', 'tvshows', 'app_public', 'business_type', 'app_public', 'premium_downloadable');
SELECT ax_define.set_enum_domain('business_type', 'tvshows', 'app_public', 'business_type_enum', 'app_public');
GRANT INSERT (business_type) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (business_type) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";

-- add business-type column to seasons and link it to enum table
SELECT ax_define.set_enum_as_column_type('business_type', 'seasons', 'app_public', 'business_type', 'app_public', 'premium_downloadable');
SELECT ax_define.set_enum_domain('business_type', 'seasons', 'app_public', 'business_type_enum', 'app_public');
GRANT INSERT (business_type) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (business_type) ON app_public.seasons TO ":DATABASE_GQL_ROLE";

-- add business-type column to seasons and link it to enum table
SELECT ax_define.set_enum_as_column_type('business_type', 'episodes', 'app_public', 'business_type', 'app_public', 'premium_downloadable');
SELECT ax_define.set_enum_domain('business_type', 'episodes', 'app_public', 'business_type_enum', 'app_public');
GRANT INSERT (business_type) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (business_type) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
