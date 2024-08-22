import { Dict } from '@axinom/mosaic-db-common';
import { Request } from 'express';
import { MOSAIC_LOCALE_HEADER_KEY, MOSAIC_LOCALE_PG_KEY } from '../constants';
import { getInMemoryLocale } from './in-memory-locales';

export const getMosaicLocaleSetting = (req: Request): Dict<string> => {
  const header = String(req.headers[MOSAIC_LOCALE_HEADER_KEY]);
  return {
    [MOSAIC_LOCALE_PG_KEY]: getInMemoryLocale(header),
  };
};
