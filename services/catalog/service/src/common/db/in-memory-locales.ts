import {
  difference,
  ensureError,
  Logger,
  sleep,
} from '@axinom/mosaic-service-common';
import { Client } from 'pg';
import { all, doNothing, Queryable, select, upsert } from 'zapatos/db';
import { locales } from 'zapatos/schema';
import { Config } from '../config';
import { DEFAULT_LOCALE_TAG, MOSAIC_LOCALE_NOTIFY } from '../constants';

let inMemoryLocales: locales.JSONSelectable[] = [];

/**
 * Returns a language tag for a requested locale tag from the in-memory array of
 * locales currently registered within the service.
 * If not found - locale that is marked as default will be returned.
 * If such locale is not found - fallback to hardcoded `DEFAULT_LOCALE_TAG` is
 * used.
 */
export const getInMemoryLocale = (locale: string): string => {
  const found = inMemoryLocales.find(
    (l) => l.locale.toLowerCase() === locale.toLowerCase(),
  );
  if (found) {
    return found.locale;
  }

  const foundDefault = inMemoryLocales.find((l) => l.is_default);
  if (foundDefault) {
    return foundDefault.locale;
  }

  return DEFAULT_LOCALE_TAG;
};

/**
 * Expects a list of all available locales as a parameter. Updates the in-memory
 * array if its contents are different from the passed array. If current array
 * and passed array are different - update the `app_public.locales` as well.
 *
 * Returns false if no changes were made and true if local `app_public.locales`
 * table was updated
 *
 * BeyondDutch: We do not delete any existing locales since the locales may change from asset to asset.
 * Hence, we only add new locales.
 * We do not change the default locale if it is already set.
 */
export const syncInMemoryLocales = async (
  input: { language_tag: string; is_default_locale: boolean }[],
  queryable: Queryable,
): Promise<boolean> => {
  const locales = input.map((l) => l.language_tag);
  if (locales.length === 0) {
    return false;
  }
  const currentLocales = inMemoryLocales.map((l) => l.locale);
  const currentDefault = inMemoryLocales.find((x) => x.is_default);
  const inputDefault = input.find((x) => x.is_default_locale);

  const localesToAdd = difference(locales, currentLocales);
  if (
    localesToAdd.length === 0 &&
    inputDefault?.language_tag === currentDefault?.locale
  ) {
    return false;
  }

  let inputLocales: {
    locale: string;
    is_default: boolean;
  }[] = [];

  if (localesToAdd.length > 0) {
    inputLocales = input
      .filter((l) => localesToAdd.includes(l.language_tag))
      .map((i) => ({
        locale: i.language_tag,
        // We only set the very first value with is_default_locale set to true as the default locale.
        // After that we assume that the default locale is not changed. This is specific to BeyondDutch requirements.
        // https://axinom.slack.com/archives/C6DV4C1NG/p1732086948451999?thread_ts=1731569080.738099&cid=C6DV4C1NG
        is_default:
          currentDefault === undefined && i.is_default_locale ? true : false,
      }));

    inMemoryLocales = [...inMemoryLocales, ...inputLocales];
  }

  // We do db operations in the end so there is no latency in keeping the `inMemoryLocales` array upto date.
  if (inputLocales.length > 0) {
    await upsert('locales', inputLocales, ['locale'], {
      updateColumns: doNothing,
    }).run(queryable);
  }

  return true;
};

/**
 * Loads locales from `app_public.locales` table into the in-memory array to be
 * used during service runtime.
 */
export const loadInMemoryLocales = async (
  queryable: Queryable,
  logger: Logger,
): Promise<void> => {
  inMemoryLocales = await select('locales', all).run(queryable);
  logger.log({
    message: 'In-memory locales successfully (re)loaded.',
    details: { locales: inMemoryLocales },
  });
};

const maxRetryCount = 50;
let currentRetry = 0;
let activeClient: Client | null = null;

/**
 * During cases when connection with database is interrupted - errors can occur
 * from multiple places, which can result in multiple reconnection attempts and
 * end up with more than one client listening to notifications for a single
 * service instance. For this reason, each time a connection is established -
 * attempt to close other possible open connection.
 */
const closeActiveClient = async (): Promise<void> => {
  if (activeClient) {
    await activeClient.end();
    activeClient = null;
  }
};
/**
 * Every time a message is received for localizable entities - we try to keep
 * the used locales up-to-date. This includes updating the `app_public.locales`
 * by drop-recreating all locales. A dedicated trigger will then send a
 * notification that locales were changed. This listener picks it up and updates
 * the in-memory locales array. This is only relevant in scaled scenarios, where
 * multiple instances of the Catalog services are running, e.g. one instance
 * receives the message and updates the locales table. Notification is then sent
 * and in-memory locales array is updated by all instances.
 */
export const startLocalesInsertedListener = async (
  config: Config,
  logger: Logger,
): Promise<void> => {
  const handleError = async (e: unknown): Promise<void> => {
    currentRetry++;
    const error = ensureError(e);
    if (currentRetry > maxRetryCount) {
      throw error;
    }
    logger.error(
      error,
      `Listener database connection error occurred. Attempting to reconnect. (${currentRetry}/${maxRetryCount})`,
    );
    await sleep(currentRetry * 1000);
    await startLocalesInsertedListener(config, logger);
  };

  try {
    closeActiveClient();
    const client = new Client(config.dbOwnerConnectionString);

    client.on('error', async (e) => {
      await handleError(e);
    });

    client.on('notification', async (msg) => {
      if (msg.channel === MOSAIC_LOCALE_NOTIFY) {
        await loadInMemoryLocales(client, logger);
      }
    });

    await client.connect();
    activeClient = client;
    currentRetry = 0;

    // Intentionally not using await to keep the connection open.
    // Must use explicit client without Pool to do this.
    client.query(`LISTEN ${MOSAIC_LOCALE_NOTIFY};`);
  } catch (e) {
    await handleError(e);
  }
};

export const exportedForTesting = {
  getInMemoryLocales: (): locales.JSONSelectable[] => inMemoryLocales,
  clearInMemoryLocales: (): void => {
    inMemoryLocales = [];
  },
  populateInMemoryLocales: (locales: locales.JSONSelectable[]): void => {
    inMemoryLocales = locales;
  },
  getActiveClient: (): Client | null => activeClient,
  closeActiveClient,
};
