--! Previous: sha1:c9457b917399b9a43ac0fc04d0e130cf728bfcb7
--! Hash: sha1:8d220af7b90bc280a9165f8bcef3ccc38dd0c204
--! Message: channel-localizations-added

CREATE TABLE IF NOT EXISTS app_public.channel_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  channel_id TEXT REFERENCES channel ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  title TEXT NOT NULL,
  description TEXT
);

SELECT ax_define.define_index('channel_id', 'channel_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'channel_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('title', 'channel', 'app_public') THEN
    INSERT INTO app_public.channel_localizations
    (channel_id, title, description, locale, is_default_locale)
    SELECT c.id, c.title, c.description, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.channel c
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.channel DROP COLUMN IF EXISTS title;
ALTER TABLE app_public.channel DROP COLUMN IF EXISTS description;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.channel_localizations TO ":DATABASE_GQL_ROLE";