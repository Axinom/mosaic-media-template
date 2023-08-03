--! Previous: sha1:bc014f2720e5eea7271713b84d2019ecbd3c8915
--! Hash: sha1:437eaf7ef6543cbc4a21589e44ffa0ad29019b96
--! Message: localization-snapshot-validation-context-added

INSERT INTO app_public.snapshot_validation_issue_context (value, description)
VALUES ('LOCALIZATION', 'Localization')
ON CONFLICT (value) DO NOTHING;
