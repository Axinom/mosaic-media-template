import { MosaicErrorInfo } from '@axinom/mosaic-service-common';
import { JSONOnlyColsForTable } from 'zapatos/db';
import { CommonErrors } from '../errors';

// All licenses are the same, so using movie_licenses type as a base
type License = JSONOnlyColsForTable<
  'movie_licenses',
  ('countries' | 'start_time' | 'end_time')[]
>;

const minDate = new Date(-8640000000000000);
const maxDate = new Date(8640000000000000);

const hasValidLicense = (
  licenses: License[],
  date: Date,
  countryCode: string,
): boolean => {
  return licenses.some(
    (license: License) =>
      (license.countries || license.start_time || license.end_time) && // Must have at least one property defined
      (!license.countries || // Must have empty countries (valid for all countries), or must include user countryCode
        license.countries.length === 0 ||
        license.countries.includes(countryCode)) &&
      date >= (license.start_time ? new Date(license.start_time) : minDate) && //Current date must be after license start date
      date < (license.end_time ? new Date(license.end_time) : maxDate), // Current date must be before license end date
  );
};

/**
 * Makes sure that entity has at least one valid license for current country and current date.
 * @param countryCode - ISO-3166 alpha-2 country code
 * @param identifier - Used in returned messages to identify entity type for which licenses were checked. e.g. `Movie`
 * @param licenses - an array of licenses associated with an entity
 */
export const isLicenseValid = (
  countryCode: string,
  identifier: 'movie' | 'episode' | 'season' | 'TV show',
  licenses?: License[],
): MosaicErrorInfo | true => {
  if (!licenses || licenses.length === 0) {
    return {
      ...CommonErrors.LicenseNotFound,
      messageParams: [identifier],
    };
  }

  const date = new Date();
  const validLicenseExists = hasValidLicense(licenses, date, countryCode);

  // If there is a future license, we skip the license validation error and return true
  // We still do a country check for future licenses as well.
  const hasFutureLicense = licenses.some(
    (license: License) =>
      license.start_time &&
      new Date(license.start_time) > date &&
      (!license.countries || // Must have empty countries (valid for all countries), or must include user countryCode
        license.countries.length === 0 ||
        license.countries.includes(countryCode)),
  );

  if (validLicenseExists || hasFutureLicense) {
    return true;
  }

  return {
    ...CommonErrors.LicenseIsNotValid,
    messageParams: [identifier, countryCode],
  };
};

/**
 * Returns true if the given licenses are valid for the given date and country code.
 *
 * @param licenses - an array of licenses associated with an entity
 * @param countryCode - ISO-3166 alpha-2 country code
 * @returns true if the licenses are valid, false otherwise
 */
export const hasCurrentValidLicense = (
  licenses: License[],
  countryCode: string,
): boolean => {
  const date = new Date();
  return hasValidLicense(licenses, date, countryCode);
};
