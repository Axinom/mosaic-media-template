import * as Yup from 'yup';

/**
 * Schema to validate that the license start date is either null or a valid date.
 */
export const getLicenseStartSchema = (): Yup.AnySchema => Yup.date().nullable();
/**
 * Schema to validate that the license end date is either null or a valid date and is after the start date.
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
