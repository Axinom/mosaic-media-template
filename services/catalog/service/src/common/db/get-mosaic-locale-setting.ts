import { Dict } from '@axinom/mosaic-db-common';
import { Request } from 'express';
import {
  DEFAULT_LOCALE_TAG,
  MOSAIC_LOCALE_HEADER_KEY,
  MOSAIC_LOCALE_PG_KEY,
} from '../constants';
import { getInMemoryLocales } from './in-memory-locales';

export const getMosaicLocaleSetting = (req: Request): Dict<string> => {
  const header = String(req.headers[MOSAIC_LOCALE_HEADER_KEY]);
  return {
    [MOSAIC_LOCALE_PG_KEY]:
      getInMemoryLocales().find(
        (locale) => locale.toLowerCase() === header.toLowerCase(),
      ) ?? DEFAULT_LOCALE_TAG,
  };
};
