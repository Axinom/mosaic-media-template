/**
 * **N.B!** If this value ever changes -
 * Publication must be re-created in db migrations to continue working as before.
 * See 000020-replication-on-localizable-tables-added.sql for original definition.
 */
export const PG_LOCALIZATION_PUBLICATION = 'pg_localization_publication';

export const LOCALIZATION_IS_DEFAULT_LOCALE = '@isDefaultLocale';
export const LOCALIZATION_LANGUAGE_TAG = '@languageTag';
