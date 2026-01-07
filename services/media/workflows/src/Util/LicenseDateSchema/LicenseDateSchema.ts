import * as Yup from 'yup';

/**
 * A schema to ensure that the start date of the license is either a valid date or null.
 */
export const getLicenseStartSchema = (): Yup.AnySchema => Yup.date().nullable();
/**
 * A schema to ensure that the end date of the license is either a valid date or null, and that it occurs after the start date.
 * @param startProperty the property name of the start date
 */
export const getLicenseEndSchema = (
  startProperty = 'licenseStart',
): Yup.AnySchema =>
  Yup.date()
    .nullable()
    .when(startProperty, (start, end) => {
      if (start?.getDate) {
        return end.min(
          new Date(start.getTime() + 1),
          'License end date must be after the start date',
        );
      }

      return end;
    });

interface License {
  licenseEnd?: string | null;
}

/**
 * Generates a warning message based on license expiration status.
 * @param licenses Array of license objects with licenseEnd dates
 * @returns Warning message string or null if no warning needed
 */
export const getLicenseWarningMessage = (
  licenses: License[],
): string | null => {
  if (licenses.length === 0) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let expiredCount = 0;
  let totalCount = 0;

  licenses.forEach((license) => {
    totalCount++;
    const licenseEnd = license.licenseEnd ? new Date(license.licenseEnd) : null;
    if (licenseEnd) {
      licenseEnd.setHours(0, 0, 0, 0);
      if (licenseEnd < today) {
        expiredCount++;
      }
    }
  });

  if (expiredCount === 0) {
    return null;
  }

  if (expiredCount === totalCount) {
    return 'Unavailable due to license expiration.';
  }

  return 'Unavailable in some countries due to license expiration.';
};
