--! Previous: sha1:035a2ed9bc2b4421de935f14596c3a8f50bf2743
--! Hash: sha1:6a3a69a353cda197823704f1f392400ea09f5a3e
--! Message: localization-snapshot-validation-context-added

INSERT INTO app_public.snapshot_validation_issue_context (value, description)
VALUES ('LOCALIZATION', 'Localization')
ON CONFLICT (value) DO NOTHING;
