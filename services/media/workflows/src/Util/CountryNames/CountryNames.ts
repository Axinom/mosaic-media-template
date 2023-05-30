import * as countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { IsoAlphaTwoCountryCodes } from '../../generated/graphql';

countries.registerLocale(en);

/** Adapter for i18n-iso-countries
 * @param countryCode Short country code
 */
export const getCountryName = (countryCode: string): string => {
  return countries.getName(countryCode, 'en');
};

export const CountryNames = Object.keys(IsoAlphaTwoCountryCodes)
  .map((key) => ({
    display: getCountryName(IsoAlphaTwoCountryCodes[key]),
    value: IsoAlphaTwoCountryCodes[key],
  }))
  .sort((v1, v2) => (v1.display > v2.display ? 1 : -1));
