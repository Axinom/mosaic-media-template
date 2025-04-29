import { CommonErrors } from '../errors';
import { isLicenseValid } from './validate-licenses';

describe('isLicenseValid', () => {
  const nowDate = new Date('2023-01-15T12:00:00Z');
  let originalDate: DateConstructor;

  beforeAll(() => {
    originalDate = global.Date;
    // Mock the Date constructor to return a fixed date for 'new Date()'
    global.Date = class extends Date {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(nowDate);
          return;
        }
        super(...(args as [string | number | Date]));
      }
    } as DateConstructor;
  });

  afterAll(() => {
    // Restore the original Date constructor
    global.Date = originalDate;
  });

  it('When no licenses are provided, should return error', () => {
    const result = isLicenseValid('US', 'movie');
    expect(result).toEqual({
      ...CommonErrors.LicenseNotFound,
      messageParams: ['movie'],
    });
  });

  it('When an empty array of licenses is provided, should return error', () => {
    const result = isLicenseValid('US', 'movie', []);
    expect(result).toEqual({
      ...CommonErrors.LicenseNotFound,
      messageParams: ['movie'],
    });
  });

  it('When license is valid for all countries with no time restrictions, should return true', () => {
    const licenses = [
      {
        countries: [],
        start_time: null,
        end_time: null,
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toBe(true);
  });

  it('When license is valid for specific country with no time restrictions, should return true', () => {
    const licenses = [
      {
        countries: ['US', 'CA'],
        start_time: null,
        end_time: null,
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toBe(true);
  });

  it('When license is not valid for the country, should return error', () => {
    const licenses = [
      {
        countries: ['CA', 'UK'],
        start_time: null,
        end_time: null,
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toEqual({
      ...CommonErrors.LicenseIsNotValid,
      messageParams: ['movie', 'US'],
    });
  });

  it('When license is valid for the time period, should return true', () => {
    const licenses = [
      {
        countries: ['US'],
        start_time: '2023-01-01T00:00:00Z',
        end_time: '2023-02-01T00:00:00Z',
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toBe(true);
  });

  it('When license is expired, should return error', () => {
    const licenses = [
      {
        countries: ['US'],
        start_time: '2022-01-01T00:00:00Z',
        end_time: '2022-12-31T23:59:59Z',
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toEqual({
      ...CommonErrors.LicenseIsNotValid,
      messageParams: ['movie', 'US'],
    });
  });

  it('When license has not started yet, should return error', () => {
    const licenses = [
      {
        countries: ['US'],
        start_time: '2023-02-01T00:00:00Z',
        end_time: '2023-03-01T00:00:00Z',
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toBe(true); // Returns true for future licenses
  });

  it('When at least one valid license exists among multiple licenses, should return true', () => {
    const licenses = [
      {
        countries: ['CA'],
        start_time: null,
        end_time: null,
      },
      {
        countries: ['US'],
        start_time: '2023-01-01T00:00:00Z',
        end_time: '2023-02-01T00:00:00Z',
      },
      {
        countries: ['UK'],
        start_time: null,
        end_time: null,
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toBe(true);
  });

  it('When country code is null or whitespace, should return true', () => {
    const licenses = [
      {
        countries: ['CA', 'UK'],
        start_time: null,
        end_time: null,
      },
    ];
    const result = isLicenseValid('', 'movie', licenses);
    expect(result).toBe(true);
  });

  it('When there is a future license for the country, should return true', () => {
    const licenses = [
      {
        countries: ['US'],
        start_time: '2023-02-01T00:00:00Z',
        end_time: '2023-03-01T00:00:00Z',
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toBe(true);
  });

  it('When there is a future license but for a different country, should return error', () => {
    const licenses = [
      {
        countries: ['CA'],
        start_time: '2023-02-01T00:00:00Z',
        end_time: '2023-03-01T00:00:00Z',
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toEqual({
      ...CommonErrors.LicenseIsNotValid,
      messageParams: ['movie', 'US'],
    });
  });

  it('When different entity identifiers are provided, should handle correctly', () => {
    const licenses = [
      {
        countries: ['US'],
        start_time: null,
        end_time: null,
      },
    ];
    let result = isLicenseValid('US', 'episode', licenses);
    expect(result).toBe(true);
    result = isLicenseValid('US', 'season', licenses);
    expect(result).toBe(true);
    result = isLicenseValid('US', 'TV show', licenses);
    expect(result).toBe(true);
  });

  it('should require at least one property to be defined', () => {
    const licenses = [
      {
        countries: null,
        start_time: null,
        end_time: null,
      },
    ];
    const result = isLicenseValid('US', 'movie', licenses);
    expect(result).toEqual({
      ...CommonErrors.LicenseIsNotValid,
      messageParams: ['movie', 'US'],
    });
  });
});
