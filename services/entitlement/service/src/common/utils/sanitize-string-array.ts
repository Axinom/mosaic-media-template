import { isNullOrWhitespace } from '@axinom/mosaic-service-common';

/**
 * Takes an optional array, removes all empty and duplicate values from it and
 * returns a string array with remaining values
 */
export const sanitizeStringArray = (
  array?: (string | null | undefined)[] | null,
): string[] => {
  if (!array) {
    return [];
  }
  return array.reduce<string[]>((array, item) => {
    if (!isNullOrWhitespace(item) && !array.includes(item)) {
      array.push(item);
    }
    return array;
  }, []);
};
