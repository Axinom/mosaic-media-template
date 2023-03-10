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
