import { mockRequest } from 'mock-req-res';
import {
  DEFAULT_LOCALE_TAG,
  MOSAIC_LOCALE_HEADER_KEY,
  MOSAIC_LOCALE_PG_KEY,
} from '../constants';
import { getMosaicLocaleSetting } from './get-mosaic-locale-setting';
import * as m from './in-memory-locales';

describe('getMosaicLocaleSetting', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('No supported locales and no header specified -> setting with selected default returned', async () => {
    // Arrange
    const req = mockRequest({ headers: {} });

    // Act
    const setting = getMosaicLocaleSetting(req);

    // Assert
    expect(setting).toEqual({
      [MOSAIC_LOCALE_PG_KEY]: DEFAULT_LOCALE_TAG,
    });
  });

  it.each([null, undefined, '', ' ', 'my-locale', 'de-DE', ['asd']])(
    'No supported locales and any header %p specified --> setting with default locale returned',
    async (value) => {
      // Arrange
      const req = mockRequest({
        headers: {
          [MOSAIC_LOCALE_HEADER_KEY]: value,
        },
      });

      // Act
      const setting = getMosaicLocaleSetting(req);

      // Assert
      expect(setting).toEqual({
        [MOSAIC_LOCALE_PG_KEY]: DEFAULT_LOCALE_TAG,
      });
    },
  );

  it.each(['de-DE', 'de-de', 'DE-DE', 'DE-de'])(
    'Supported locale exists and matching header %p specified --> setting with selected locale returned',
    async (header) => {
      // Arrange
      const locale = 'de-DE';
      m.exportedForTesting.populateInMemoryLocales([
        { locale, is_default: false },
      ]);
      const req = mockRequest({
        headers: {
          [MOSAIC_LOCALE_HEADER_KEY]: header,
        },
      });

      // Act
      const setting = getMosaicLocaleSetting(req);

      // Assert
      expect(setting).toEqual({
        [MOSAIC_LOCALE_PG_KEY]: locale,
      });
    },
  );

  it('Multiple supported locales and matching header specified -> setting with selected locale returned', async () => {
    // Arrange
    const selectedLocale = 'zh-CN';
    m.exportedForTesting.populateInMemoryLocales([
      { locale: 'de-DE', is_default: false },
      { locale: 'bg-BG', is_default: false },
      { locale: selectedLocale, is_default: false },
    ]);
    const req = mockRequest({
      headers: {
        [MOSAIC_LOCALE_HEADER_KEY]: selectedLocale,
      },
    });

    // Act
    const setting = getMosaicLocaleSetting(req);

    // Assert
    expect(setting).toEqual({
      [MOSAIC_LOCALE_PG_KEY]: selectedLocale,
    });
  });

  it('Multiple supported locales and non-matching header specified with no default locale -> setting with hardcoded default locale returned', async () => {
    // Arrange
    m.exportedForTesting.populateInMemoryLocales([
      { locale: 'de-DE', is_default: false },
      { locale: 'bg-BG', is_default: false },
      { locale: 'zh-CN', is_default: false },
    ]);
    const req = mockRequest({
      headers: {
        [MOSAIC_LOCALE_HEADER_KEY]: 'zh-TW',
      },
    });

    // Act
    const setting = getMosaicLocaleSetting(req);

    // Assert
    expect(setting).toEqual({
      [MOSAIC_LOCALE_PG_KEY]: DEFAULT_LOCALE_TAG,
    });
  });

  it('Multiple supported locales and non-matching header specified -> setting with is_default locale returned', async () => {
    // Arrange
    m.exportedForTesting.populateInMemoryLocales([
      { locale: 'de-DE', is_default: false },
      { locale: 'bg-BG', is_default: false },
      { locale: 'zh-CN', is_default: false },
      { locale: 'en-US', is_default: true },
    ]);
    const req = mockRequest({
      headers: {
        [MOSAIC_LOCALE_HEADER_KEY]: 'zh-TW',
      },
    });

    // Act
    const setting = getMosaicLocaleSetting(req);

    // Assert
    expect(setting).toEqual({
      [MOSAIC_LOCALE_PG_KEY]: 'en-US',
    });
  });
});
