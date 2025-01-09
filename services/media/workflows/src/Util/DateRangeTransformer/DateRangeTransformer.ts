import { FilterFunction } from '@axinom/mosaic-ui';

/**
 * Accepts an array of 2 elements containing from and to values
 * and returns on object of shape:
 * ```
 * {
 *   greaterThanOrEqualTo?: value[0],
 *   lessThanOrEqualTo?: value[1],
 * }
 * ```
 *
 * The transformer is designed to be used on a property that has two filters (a 'from' as well as a 'to' filter) attached to it.
 *
 * @param value An array of two string elements. Element 1 contains 'from' value, element 2 contains 'to' value.
 * @returns An object that can be used as filter for fields that accept `greaterThanOrEqualTo` as well as `lessThanOrEqualTo` options.
 */
export const transformRange: FilterFunction = (value) => {
  const [from, to] = value as [unknown, unknown];
  const range: Record<string, unknown> = {
    greaterThanOrEqualTo: undefined,
    lessThanOrEqualTo: undefined,
  };

  from && (range.greaterThanOrEqualTo = from);
  to && (range.lessThanOrEqualTo = to);

  return range;
};
