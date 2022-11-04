import { getCountryName } from '../CountryNames/CountryNames';

/**
 * Displays a value in Date format
 * @param val date
 * @param data row data
 */
export const CountryNamesRenderer = (val: unknown): string => {
  if (val) {
    return (val as string[]).map((v) => getCountryName(v)).join(', ');
  }

  return '';
};
