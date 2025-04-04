--! Previous: sha1:8ce6ef0bff665ea7c4ba78e76f08818a585b2d07
--! Hash: sha1:325a214ebdc0644e877a85c179a09e735a54ab7f
--! Message: add-is_republish_allowed-to-snapshots

ALTER TABLE app_public.snapshots
ADD COLUMN IF NOT EXISTS is_republish_allowed BOOLEAN DEFAULT TRUE;

GRANT INSERT (is_republish_allowed) ON app_public.snapshots TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_republish_allowed) ON app_public.snapshots TO ":DATABASE_GQL_ROLE";

UPDATE app_public.snapshots
SET is_republish_allowed = TRUE
WHERE is_republish_allowed IS NULL;
