import {
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  Option,
} from '@axinom/mosaic-ui';
import { useEffect, useState } from 'react';
import { validate as isUuid } from 'uuid';
import { client } from '../../../apolloClient';
import {
  CollectionFilter,
  PublishStatus,
  useGetAllCountryDataQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { CollectionData } from './Collections.types';

export function useCollectionsFilters(): {
  readonly filterOptions: FilterType<CollectionData>[];
  readonly transformFilters: (
    filters: FilterValues<CollectionData>,
    excludeItems?: number[],
  ) => CollectionFilter | undefined;
} {
  const { data, error } = useGetAllCountryDataQuery({ client });
  const [allCountryOptions, setAllCountryOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (error) {
      setAllCountryOptions([
        {
          label: 'Unable to load all country options data.',
          value: 'FAILED_TO_LOAD_ERROR',
        },
      ]);
    } else {
      if (data?.allCountryTypes?.nodes !== undefined) {
        const countries = data.allCountryTypes.nodes.map(({ name, id }) => ({
          label: name ?? '',
          value: id,
        }));
        setAllCountryOptions(countries);
      }
    }
  }, [data]);

  const filterOptions: FilterType<CollectionData>[] = [
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'collectionsTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Language',
      property: 'languages',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Type',
      property: '__typename',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Countries',
      property: 'collectionCountries',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        allCountryOptions?.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Publishing Status',
      property: 'publishStatus',
      type: FilterTypes.Options,
      options: Object.keys(PublishStatus).map((key) => ({
        value: PublishStatus[key],
        label: getEnumLabel(PublishStatus[key]),
      })),
    },
  ];

  const transformFilters = (
    filters: FilterValues<CollectionData>,
    excludeItems?: number[],
  ): CollectionFilter | undefined => {
    return filterToPostGraphileFilter<CollectionFilter>(filters, {
      title: 'includesInsensitive',
      externalId: 'includes',
      collectionsTags: ['some', 'name', 'includesInsensitive'],
      languages: 'equalTo',
      collectionCountries: (value: unknown) => {
        const code = value as string;
        if (!isUuid(code)) {
          return {
            some: {
              countryId: {
                equalTo: code,
              },
            },
          };
        } else {
          return {
            some: {
              countryGroupId: {
                equalTo: code,
              },
            },
          };
        }
      },
      publishStatus: 'in',
      id: (value) => {
        if (typeof value === 'number') {
          // User filter
          return {
            equalTo: value,
            notIn: excludeItems,
          };
        } else {
          // Exclude items
          return {
            notIn: excludeItems,
          };
        }
      },
    });
  };

  return { filterOptions, transformFilters };
}
