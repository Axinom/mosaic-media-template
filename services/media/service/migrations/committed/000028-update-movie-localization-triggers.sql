--! Previous: sha1:fe332928048c237c42e5b84d0b9c94767f467613
--! Hash: sha1:ff6b1de5f2fa5953c23261600eb5c1b955fab7a2
--! Message: update-movie-localization-triggers

SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'movies', 'MOVIE', ':MOVIE_LOCALIZABLE_FIELDS',':MOVIE_LOCALIZATION_REQUIRED_FIELDS');
