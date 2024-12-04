import {
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
} from '@axinom/mosaic-ui';
import { CountryGroupFilter } from '../../../../generated/graphql';
import { CountryGroupData } from './CountryGroupsExplorer.types';

export function useCountriesFilters(): {
  readonly filterOptions: FilterType<CountryGroupData>[];
  readonly transformFilters: (
    filters: FilterValues<CountryGroupData>,
    excludeItems?: number[],
  ) => CountryGroupFilter | undefined;
} {
  const filterOptions: FilterType<CountryGroupData>[] = [
    {
      label: 'Name',
      property: 'name',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Countries',
      property: 'countryGroupsCountriesByGroupId',
      type: FilterTypes.FreeText,
    },
  ];

  const transformFilters = (
    filters: FilterValues<CountryGroupData>,
    _excludeItems?: number[],
  ): CountryGroupFilter | undefined => {
    return filterToPostGraphileFilter<CountryGroupFilter>(filters, {
      name: 'includesInsensitive',
      countryGroupsCountriesByGroupId: ['some', 'countryId', 'equalTo'],
    });
  };

  return { filterOptions, transformFilters };
}
