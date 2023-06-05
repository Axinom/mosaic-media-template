/**
 * **N.B!** If this value ever changes -
 * Replication slot must be re-created in db migrations to continue working as before.
 * See 000020-replication-on-localizable-tables-added.sql for original definition.
 *
 * The replication slot is created on Postgres Server level and has a unique
 * name, meaning it can conflict with replication slots for other databases.
 */
export const PG_LOCALIZATION_SLOT = 'pg_media_localization_slot';

/**
 * **N.B!** If this value ever changes -
 * Publication must be re-created in db migrations to continue working as before.
 * See 000020-replication-on-localizable-tables-added.sql for original definition.
 */
export const PG_LOCALIZATION_PUBLICATION = 'pg_localization_publication';
