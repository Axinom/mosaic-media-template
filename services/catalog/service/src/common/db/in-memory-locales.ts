import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { difference } from '@axinom/mosaic-service-common';
import { all, deletes, insert, Queryable, select, SQL, sql } from 'zapatos/db';

let inMemoryLocales: string[] = [];

/**
 * Returns a list of locales that currently exist in the system.
 * If an API request is made for a specific locale and it is not in this array -
 * default locale would be used instead.
 */
export const getInMemoryLocales = (): string[] => inMemoryLocales;

/**
 * Expects a list of all available locales as a parameter. Updates the in-memory
 * array if its contents are different from the passed array. If current array
 * and passed array are different - update the `app_public.locales` as well.
 *
 * Returns false if no changes were made and true if local `app_public.locales`
 * table was updated
 */
export const syncInMemoryLocales = async (
  input: { language_tag: string; is_default_locale: boolean }[],
  queryable: Queryable,
): Promise<boolean> => {
  const locales = input.map((l) => l.language_tag);
  if (locales.length === 0) {
    return false;
  }

  const localesToAdd = difference(locales, inMemoryLocales);
  const localesToDrop = difference(inMemoryLocales, locales);
  if (localesToDrop.length === 0 && localesToAdd.length === 0) {
    return false;
  }
  inMemoryLocales = locales;

  await deletes('locales', {}).run(queryable);
  await insert(
    'locales',
    input.map((i) => ({
      locale: i.language_tag,
      is_default: i.is_default_locale,
    })),
  ).run(queryable);
  return true;
};

/**
 * Loads locales from `app_public.locales` table into the in-memory array to be
 * used during service runtime. If no locales are found - attempt to populate
 * the `app_public.locales` using contents of `*_localizations` tables.
 */
export const loadInMemoryLocales = async (
  ownerPool: OwnerPgPool,
): Promise<void> => {
  inMemoryLocales = (await select('locales', all).run(ownerPool)).map(
    (l) => l.locale,
  );

  if (inMemoryLocales.length === 0) {
    const [result] = await sql<
      SQL,
      { set_initial_locales: string[] }[]
    >`select app_private.set_initial_locales();`.run(ownerPool);
    inMemoryLocales = result.set_initial_locales;
  }
};

export const exportedForTesting = {
  clearInMemoryLocales: (): void => {
    inMemoryLocales = [];
  },
};
