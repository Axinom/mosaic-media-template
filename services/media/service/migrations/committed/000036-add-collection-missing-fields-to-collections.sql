--! Previous: sha1:b05881780901d16912aa491b36b956a0e884dc7b
--! Hash: sha1:4f6e88a3de6454ca1b2b623179dfda7c427916cf
--! Message: add-collection-missing-fields-to collections

-- table: collection_relations
ALTER TABLE app_public.collection_relations ADD COLUMN IF NOT EXISTS child_collection_id integer null REFERENCES app_public.collections(id) ON DELETE CASCADE;

ALTER TABLE app_public.collection_relations DROP CONSTRAINT IF EXISTS exactly_one_relation;
ALTER TABLE app_public.collection_relations ADD CONSTRAINT exactly_one_relation CHECK(num_nonnulls(movie_id, tvshow_id, season_id, episode_id,child_collection_id) = 1);

ALTER TABLE app_public.collection_relations DROP CONSTRAINT IF EXISTS unique_child_collection_per_collection;

ALTER TABLE app_public.collection_relations ADD CONSTRAINT unique_child_collection_per_collection UNIQUE(collection_id, child_collection_id);

GRANT INSERT, UPDATE (child_collection_id) ON app_public.collection_relations TO ":DATABASE_GQL_ROLE";
SELECT ax_define.define_index('child_collection_id', 'collection_relations', 'app_public');
SELECT ax_define.define_authentication('COLLECTION_READER,COLLECTION_EDITOR,ADMIN', 'COLLECTION_EDITOR,ADMIN', 'collection_relations', 'app_public');

-- add new image types to collection_image_type table
INSERT INTO app_public.collection_image_type (value, description)
VALUES 
    ('COVER_1x1', 'Cover 1x1'),
    ('COVER_4x1', 'Cover 4x1'),
    ('CLEAN_COVER_1x1', 'Clean Cover 1x1'),
    ('CLEAN_COVER_4x1', 'Clean Cover 4x1'),
    ('LIST_1x1', 'List 1x1'),
    ('LIST_15x16', 'List 15x16')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.collections_images SET image_type = 'COVER_1x1' WHERE image_type = 'COVER';
DELETE FROM app_public.collection_image_type WHERE value = 'COVER';

-- add extended_field to collection table
ALTER TABLE app_public.collections ADD COLUMN IF NOT EXISTS extended_field TEXT;
GRANT INSERT (extended_field) ON app_public.collections TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (extended_field) ON app_public.collections TO ":DATABASE_GQL_ROLE";

-- country-groups table
DROP TABLE IF EXISTS app_public.country CASCADE;
DROP TABLE IF EXISTS app_public.collections_countries CASCADE;

DROP TABLE IF EXISTS app_public.country_groups CASCADE;
CREATE TABLE app_public.country_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL

  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.')),
  CONSTRAINT name_max_length CHECK(ax_utils.constraint_max_length(name, 200, 'The name can only be %2$s characters long.'))
);
SELECT ax_define.define_audit_date_fields_on_table('country_groups', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('country_groups', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_unique_index('name', 'country_groups', 'app_public');

GRANT SELECT,DELETE ON app_public.country_groups TO ":DATABASE_GQL_ROLE";
GRANT INSERT (name) ON app_public.country_groups TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (name) ON app_public.country_groups TO ":DATABASE_GQL_ROLE";

-- country_groups_countries table
DROP TABLE IF EXISTS app_public.country_groups_countries CASCADE;
CREATE TABLE app_public.country_groups_countries (
  group_id UUID NOT NULL REFERENCES app_public.country_groups(id) ON DELETE CASCADE,
  country_id TEXT NOT NULL REFERENCES app_public.iso_alpha_two_country_codes(value)
  );
SELECT ax_define.define_audit_date_fields_on_table('country_groups_countries', 'app_public');
SELECT ax_define.define_audit_user_fields_on_table('country_groups_countries', 'app_public', ':DEFAULT_USERNAME');
SELECT ax_define.define_unique_index('country_id', 'country_groups_countries', 'app_public');

ALTER TABLE app_public.country_groups_countries ADD PRIMARY KEY (group_id, country_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.country_groups_countries TO ":DATABASE_GQL_ROLE";

-- all_country_types view to show countries and country groups
CREATE OR REPLACE VIEW app_public.all_country_types AS
SELECT 
  id::text,
  name
 FROM 
  app_public.country_groups
UNION ALL
SELECT 
  value AS id,
  description AS name
FROM 
  app_public.iso_alpha_two_country_codes;

GRANT SELECT ON app_public.all_country_types TO ":DATABASE_GQL_ROLE";

-- collection_countries table
DROP TABLE IF EXISTS app_public.collection_countries CASCADE;
CREATE TABLE app_public.collection_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id integer NOT NULL REFERENCES app_public.collections(id) ON DELETE CASCADE,
  country_group_id UUID REFERENCES app_public.country_groups(id),
  country_id TEXT REFERENCES app_public.iso_alpha_two_country_codes(value)
);
GRANT SELECT, INSERT, DELETE ON app_public.collection_countries TO ":DATABASE_GQL_ROLE";
