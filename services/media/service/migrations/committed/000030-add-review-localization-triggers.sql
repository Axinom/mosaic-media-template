--! Previous: sha1:1cb1a92427ea8c33a0a2cfee663eebe39dc90dac
--! Hash: sha1:6aaad5a4ed395a5cbe818fea84c5360a6988ec9a
--! Message: add-review-localization-triggers

SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'reviews', 'REVIEW', ':REVIEW_LOCALIZABLE_FIELDS',':REVIEW_LOCALIZATION_REQUIRED_FIELDS');
