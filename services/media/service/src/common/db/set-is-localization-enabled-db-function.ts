import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { raw, sql } from 'zapatos/db';

/**
 * Overrides the `app_hidden.is_localization_enabled()` function by making it
 * return the value of `IS_LOCALIZATION_ENABLED` variable, enabling or disabling
 * the localizable entity triggers. Call this on every service startup to align
 * with the latest config value.
 *
 * Alternatively, if there is no intention to enable or disable localization
 * dynamically, this function call can be removed from startup logic and an
 * explicit database migration can be added to set
 * app_hidden.is_localization_enabled() to return either true or false.
 */
export const setIsLocalizationEnabledDbFunction = async (
  isLocalizationEnabled: boolean,
  pool: OwnerPgPool,
): Promise<void> => {
  const value = raw(isLocalizationEnabled.toString());
  await sql`DO $$ BEGIN
    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.is_localization_enabled() RETURNS boolean AS $f$ SELECT ${value} $f$ LANGUAGE sql IMMUTABLE;'; 
  END $$;`.run(pool);
};
