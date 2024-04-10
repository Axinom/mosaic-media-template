--! Previous: sha1:50966f45912651069b92071e3c73262b023ad48e
--! Hash: sha1:d7c481931580f6acf907cf543994742775ae710c
--! Message: update-localization-required-fields

SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'episodes', 'EPISODE', ':EPISODE_LOCALIZABLE_FIELDS',':EPISODE_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'seasons', 'SEASON', ':SEASON_LOCALIZABLE_FIELDS',':SEASON_LOCALIZATION_REQUIRED_FIELDS');
