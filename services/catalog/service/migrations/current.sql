--! Message: add-missing-columns
ALTER TABLE app_public.collection ADD COLUMN IF NOT EXISTS asset_type int;
ALTER TABLE app_public.collection ADD COLUMN IF NOT EXISTS countries TEXT[];
ALTER TABLE app_public.collection ADD COLUMN IF NOT EXISTS languages TEXT[];
ALTER TABLE app_public.collection ADD COLUMN IF NOT EXISTS dynamic_field TEXT;
ALTER TABLE app_public.collection ADD COLUMN IF NOT EXISTS extended_field TEXT;
ALTER TABLE app_public.collection ADD COLUMN IF NOT EXISTS original_title TEXT;

ALTER TABLE app_public.season ADD COLUMN IF NOT EXISTS original_title TEXT;
ALTER TABLE app_public.season ADD COLUMN IF NOT EXISTS title TEXT;


GRANT INSERT (asset_type) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_type) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT INSERT (countries) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (countries) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT INSERT (languages) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (languages) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT INSERT (dynamic_field) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (dynamic_field) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT INSERT (extended_field) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (extended_field) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT INSERT (original_title) ON app_public.collection TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (original_title) ON app_public.collection TO ":DATABASE_GQL_ROLE";

GRANT INSERT (original_title) ON app_public.season TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (original_title) ON app_public.season TO ":DATABASE_GQL_ROLE";
GRANT INSERT (title) ON app_public.season TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (title) ON app_public.season TO ":DATABASE_GQL_ROLE";