--! Previous: sha1:1bfd2d3842c32fb8018288da0a25da394a4b5f2d
--! Hash: sha1:64b43d9eb0924444aa8c278cbb1070c41e0afeb8
--! Message: localization-snapshot-validation-context-added

INSERT INTO app_public.snapshot_validation_issue_context (value, description)
VALUES ('LOCALIZATION', 'Localization')
ON CONFLICT (value) DO NOTHING;
