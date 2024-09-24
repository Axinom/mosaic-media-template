--! Previous: sha1:61cb809618133aa2ad96ff019cfcf16c844a95b7
--! Hash: sha1:21814d0401fb1de058b31f328da5c9ab873591f6
--! Message: add-content-owners

DROP TABLE IF EXISTS app_public.content_owners;
CREATE TABLE app_public.content_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sort_order integer NOT NULL,

  CONSTRAINT name_max_length CHECK(ax_utils.constraint_max_length(name, 50, 'The name can only be %2$s characters long.')),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.')),
  CONSTRAINT name_is_trimmed CHECK(ax_utils.constraint_is_trimmed(name, 'The name must not start or end with whitespace value.'))
);

SELECT ax_define.define_audit_date_fields_on_table('content_owners', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('content_owners', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_indexes_with_id('name', 'content_owners', 'app_public');
SELECT ax_define.define_indexes_with_id('created_date', 'content_owners', 'app_public');
SELECT ax_define.define_indexes_with_id('updated_date', 'content_owners', 'app_public');
SELECT ax_define.define_unique_index('sort_order', 'content_owners', 'app_public');
SELECT ax_define.define_unique_index('name', 'content_owners', 'app_public');
SELECT ax_define.define_like_index('name', 'content_owners', 'app_public');

GRANT SELECT, DELETE ON app_public.content_owners TO ":DATABASE_GQL_ROLE";
GRANT INSERT (
  name,
  sort_order
) ON app_public.content_owners TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (
  name,
  sort_order
) ON app_public.content_owners TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.movies_licenses DROP COLUMN IF EXISTS contentOwner;
ALTER TABLE app_public.tvshows_licenses DROP COLUMN IF EXISTS contentOwner;
ALTER TABLE app_public.seasons_licenses DROP COLUMN IF EXISTS contentOwner;
ALTER TABLE app_public.episodes_licenses DROP COLUMN IF EXISTS contentOwner;

ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS content_owner TEXT;
GRANT INSERT (content_owner) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (content_owner) ON app_public.movies TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS content_owner TEXT;
GRANT INSERT (content_owner) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (content_owner) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS content_owner TEXT;
GRANT INSERT (content_owner) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (content_owner) ON app_public.seasons TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS content_owner TEXT;
GRANT INSERT (content_owner) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (content_owner) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
