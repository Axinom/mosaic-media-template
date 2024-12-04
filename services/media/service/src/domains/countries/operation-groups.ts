import {
  Mutations as M,
  Queries as Q,
  Relations as R,
} from '../../generated/graphql/operations';

export const CountriesReadOperations = [
  Q.countryGroupsCountries,
  Q.countryGroup,
  Q.countryGroups,
  R.countryGroupsCountriesByGroupId,
  R.countryGroup,
  R.group,
  Q.allCountryTypes,
];

export const CountriesWriteOperations = [
  M.createCountryGroupsCountry,
  M.createCountryGroup,
  M.deleteCountryGroup,
  M.updateCountryGroup,
  M.updateCountryGroupsCountry,
  M.deleteCountryGroupsCountry,
];
