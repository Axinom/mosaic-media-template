export const DEFAULT_LOCALE_TAG = 'default';
/**
 * The HTTP Request header key for locale filtering.
 */
export const MOSAIC_LOCALE_HEADER_KEY = 'mosaic-locale';
/**
 * The PostgreSQL settings key for locale filtering. If this ever changes,
 * database migrations that are using this key must be re-applied.
 */
export const MOSAIC_LOCALE_PG_KEY = 'mosaic.locale';
/**
 * A PG notification to keep in-memory array up-to-date in multi-instance scenarios.
 */
export const MOSAIC_LOCALE_NOTIFY = 'notify_locale_inserted';
