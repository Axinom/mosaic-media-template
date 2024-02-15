import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { raw, sql } from 'zapatos/db';

/**
 * Overrides the `app_hidden.is_localization_enabled()` function by making it
 * return the value of `IS_LOCALIZATION_ENABLED` variable, enabling or disabling
 * the localizable entity triggers. Call this on every service startup to align
 * with the latest config value.
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
