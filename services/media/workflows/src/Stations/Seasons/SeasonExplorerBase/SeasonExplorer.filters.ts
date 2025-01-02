import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  Option,
  transformRange,
} from '@axinom/mosaic-ui';
import { useEffect, useState } from 'react';
import { client } from '../../../apolloClient';
import {
  PublishStatus,
  SeasonFilter,
  useGetSeasonsFilterOptionsDataQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { SeasonData } from './SeasonExplorer.types';

interface allOptions {
  allAgeRatings: Option[];
  allContentOwners: Option[];
  allGenres: Option[];
  allCountries: Option[];
}

export function useSeasonsFilters(): {
  readonly filterOptions: FilterType<SeasonData>[];
  readonly transformFilters: (
    filters: FilterValues<SeasonData>,
    excludeItems?: number[],
  ) => SeasonFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<SeasonData>();

  const [AllFilterOptions, setAllFilterOptions] = useState<allOptions>({
    allAgeRatings: [],
    allContentOwners: [],
    allGenres: [],
    allCountries: [],
  });

  const { data, error } = useGetSeasonsFilterOptionsDataQuery({ client });

  useEffect(() => {
    if (error) {
      setAllFilterOptions({
        allAgeRatings: [
          {
            label: 'Unable to load age rating options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
        allContentOwners: [
          {
            label: 'Unable to load content owner options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
        allGenres: [
          {
            label: 'Unable to load genres options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
        allCountries: [
          {
            label: 'Unable to load country options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
      });
    } else {
      let ageRating: Option[] = [];
      let contentOwner: Option[] = [];
      let genres: Option[] = [];
      let countries: Option[] = [];
      if (data?.ageRatings?.nodes !== undefined) {
        ageRating = data.ageRatings.nodes.map(({ name }) => ({
          label: name,
          value: name,
        }));
      }
      if (data?.contentOwners?.nodes !== undefined) {
        contentOwner = data.contentOwners.nodes.map(({ name }) => ({
          label: name,
          value: name,
        }));
      }
      if (data?.movieGenres?.nodes !== undefined) {
        genres = data.movieGenres.nodes.map(({ title }) => ({
          label: title,
          value: title,
        }));
      }
      if (data?.allCountryTypes?.nodes !== undefined) {
        countries = data.allCountryTypes.nodes.map(({ name, id }) => ({
          label: name ?? '',
          value: id,
        }));
      }
      setAllFilterOptions({
        allAgeRatings: ageRating,
        allContentOwners: contentOwner,
        allGenres: genres,
        allCountries: countries,
      });
    }
  }, [data]);

  const filterOptions: FilterType<
    SeasonData & {
      tvshowExists?: boolean;
    }
  >[] = [
    {
      label: 'Season Index',
      property: 'index',
      type: FilterTypes.Numeric,
    },
    {
      label: 'Parent Entity',
      property: 'tvshowExists',
      type: FilterTypes.Options,
      options: [
        {
          label: 'true',
          value: true,
        },
        {
          label: 'false',
          value: false,
        },
      ],
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'seasonsTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Genre',
      property: 'seasonsTvshowGenres',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allGenres.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Cast',
      property: 'seasonsCasts',
      type: FilterTypes.FreeText,
    },
    {
      label: 'License Countries',
      property: 'seasonsLicenses',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allCountries.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Valid Licensing',
      property: 'seasonsLicenses',
      options: [
        { value: 'Valid License', label: 'Valid License' },
        { value: 'No Valid License', label: 'No Valid License' },
      ],
      type: FilterTypes.Options,
    },
    {
      label: 'Release Period (From)',
      property: 'released',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('released'),
    },
    {
      label: 'Release Period (To)',
      property: 'released',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('released'),
    },
    {
      label: 'Production Country',
      property: 'seasonsProductionCountries',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Content Owners',
      property: 'contentOwner',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allContentOwners.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Age Ratings',
      property: 'ageRating',
      type: FilterTypes.SearcheableOptions,
      searchInputPlaceholder: 'Search',
      optionsProvider: (searchText) =>
        AllFilterOptions.allAgeRatings.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Publication Status',
      property: 'publishStatus',
      type: FilterTypes.Options,
      options: Object.keys(PublishStatus).map((key) => ({
        value: PublishStatus[key],
        label: getEnumLabel(PublishStatus[key]),
      })),
    },
    {
      label: 'Publication Period (From)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('publishedDate'),
    },
    {
      label: 'Publication Period (To)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('publishedDate'),
    },
    {
      label: 'Creation Period (From)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('createdDate'),
    },
    {
      label: 'Creation Period (To)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('createdDate'),
    },
    {
      label: 'ID',
      property: 'id',
      type: FilterTypes.Numeric,
    },
  ];

  const transformFilters = (
    filters: FilterValues<SeasonData>,
    excludeItems?: number[],
  ): SeasonFilter | undefined => {
    return filterToPostGraphileFilter<SeasonFilter>(filters, {
      index: 'equalTo',
      externalId: 'includesInsensitive',
      seasonsTags: ['some', 'name', 'includesInsensitive'],
      seasonsTvshowGenres: [
        'some',
        'tvshowGenres',
        'title',
        'includesInsensitive',
      ],
      seasonsCasts: ['some', 'name', 'includesInsensitive'],
      seasonsProductionCountries: ['some', 'name', 'includesInsensitive'],
      ageRating: 'includesInsensitive',
      contentOwner: 'includesInsensitive',
      publishStatus: 'in',
      seasonsLicenses: (value: unknown) => {
        const [countryCode, licensesStatus] = value as [string, string];
        if (licensesStatus === 'Valid License') {
          return {
            some: {
              licenseEnd: {
                greaterThan: new Date(),
              },
            },
          };
        } else if (licensesStatus === 'No Valid License') {
          return {
            every: {
              licenseEnd: {
                lessThanOrEqualTo: new Date(),
              },
            },
          };
        } else {
          return {
            some: {
              seasonsLicensesCountries: {
                some: {
                  code: {
                    equalTo: countryCode,
                  },
                },
              },
            },
          };
        }
      },
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
      released: transformRange,
      createdDate: transformRange,
      publishedDate: transformRange,
      tvshowExists: (value) => value as boolean,
    });
  };

  return { filterOptions, transformFilters };
}
