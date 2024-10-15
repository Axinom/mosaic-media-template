--! Previous: sha1:d7c481931580f6acf907cf543994742775ae710c
--! Hash: sha1:a178c831db3d4ffd837307bb142e59bcfbef7fa5
--! Message: introduce-ageRatings

DROP TABLE IF EXISTS app_public.age_ratings;
CREATE TABLE app_public.age_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sort_order integer NOT NULL,

  CONSTRAINT name_max_length CHECK(ax_utils.constraint_max_length(name, 50, 'The name can only be %2$s characters long.')),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.')),
  CONSTRAINT name_is_trimmed CHECK(ax_utils.constraint_is_trimmed(name, 'The name must not start or end with whitespace value.'))
);

SELECT ax_define.define_audit_date_fields_on_table('age_ratings', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('age_ratings', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_indexes_with_id('name', 'age_ratings', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'age_ratings', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'age_ratings', 'app_public');
SELECT ax_define.define_unique_index('sort_order', 'age_ratings', 'app_public');
SELECT ax_define.define_unique_index('name', 'age_ratings', 'app_public');
SELECT ax_define.define_like_index('name', 'age_ratings', 'app_public');

GRANT SELECT, DELETE ON app_public.age_ratings TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  name,
  sort_order
) ON app_public.age_ratings TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  name,
  sort_order
) ON app_public.age_ratings TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS age_rating TEXT;
ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS age_rating TEXT;
ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS age_rating TEXT;
ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS age_rating TEXT;

GRANT INSERT (age_rating) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (age_rating) ON app_public.movies TO ":DATABASE_GQL_ROLE";

GRANT INSERT (age_rating) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (age_rating) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";

GRANT INSERT (age_rating) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (age_rating) ON app_public.seasons TO ":DATABASE_GQL_ROLE";

GRANT INSERT (age_rating) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (age_rating) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
