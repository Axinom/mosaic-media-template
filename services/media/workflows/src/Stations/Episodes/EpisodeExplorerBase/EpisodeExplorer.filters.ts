import {
  createDateRangeFilterValidators,
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
  EpisodeFilter,
  PublishStatus,
  useGetEpisodesFilterOptionsDataQuery,
} from '../../../generated/graphql';
import { transformRange } from '../../../Util/DateRangeTransformer/DateRangeTransformer';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { EpisodeData } from './EpisodeExplorer.types';

interface allOptions {
  allAgeRatings: Option[];
  allContentOwners: Option[];
  allGenres: Option[];
  allCountries: Option[];
}

export function useEpisodesFilters(): {
  readonly filterOptions: FilterType<EpisodeData>[];
  readonly transformFilters: (
    filters: FilterValues<EpisodeData>,
    excludeItems?: number[],
  ) => EpisodeFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<EpisodeData>();

  const [AllFilterOptions, setAllFilterOptions] = useState<allOptions>({
    allAgeRatings: [],
    allContentOwners: [],
    allGenres: [],
    allCountries: [],
  });

  const { data, error } = useGetEpisodesFilterOptionsDataQuery({
    client,
    fetchPolicy: 'network-only',
  });

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
    EpisodeData & {
      seasonExists?: boolean;
    }
  >[] = [
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Episode Index',
      property: 'index',
      type: FilterTypes.Numeric,
    },
    {
      label: 'Parent Entity',
      property: 'seasonExists',
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
      label: 'Original Title',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'episodesTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Genre',
      property: 'episodesTvshowGenres',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allGenres.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Cast',
      property: 'episodesCasts',
      type: FilterTypes.FreeText,
    },
    {
      label: 'License Countries',
      property: 'episodesLicenses',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allCountries.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Episode Valid Licensing',
      property: 'episodesLicenses',
      options: [
        { value: 'Valid license', label: 'Valid license' },
        { value: 'No valid license', label: 'No valid license' },
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
      property: 'episodesProductionCountries',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allCountries.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
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
      label: 'Publishing ID',
      property: 'publishingId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Main Video',
      property: 'mainVideoId',
      type: FilterTypes.Options,
      options: [
        {
          label: 'Assigned',
          value: true,
        },
        {
          label: 'Not Assigned',
          value: false,
        },
      ],
    },
    {
      label: 'ID',
      property: 'id',
      type: FilterTypes.Numeric,
    },
  ];

  const transformFilters = (
    filters: FilterValues<EpisodeData>,
    excludeItems?: number[],
  ): EpisodeFilter | undefined => {
    return filterToPostGraphileFilter<EpisodeFilter>(filters, {
      title: 'includesInsensitive',
      index: 'equalTo',
      originalTitle: 'includesInsensitive',
      externalId: 'includesInsensitive',
      publishingId: 'includesInsensitive',
      episodesTags: ['some', 'name', 'includesInsensitive'],
      episodesTvshowGenres: [
        'some',
        'tvshowGenres',
        'title',
        'includesInsensitive',
      ],
      episodesCasts: ['some', 'name', 'includesInsensitive'],
      episodesProductionCountries: ['some', 'name', 'includesInsensitive'],
      ageRating: 'includesInsensitive',
      contentOwner: 'includesInsensitive',
      publishStatus: 'in',
      episodesLicenses: (value: unknown) => {
        const [countryCode, licensesStatus] = value as [string, string];
        if (licensesStatus === 'Valid license') {
          return {
            some: {
              licenseEnd: {
                greaterThan: new Date(),
              },
            },
          };
        } else if (licensesStatus === 'No valid license') {
          return {
            every: {
              licenseEnd: {
                lessThanOrEqualTo: new Date(),
              },
            },
          };
        } else if (!isUuid(countryCode)) {
          return {
            some: {
              episodesLicensesCountries: {
                some: {
                  countryCode: {
                    equalTo: countryCode,
                  },
                },
              },
            },
          };
        } else {
          return {
            some: {
              episodesLicensesCountries: {
                some: {
                  countryGroupId: {
                    equalTo: countryCode,
                  },
                },
              },
            },
          };
        }
      },
      released: transformRange,
      createdDate: transformRange,
      publishedDate: transformRange,
      mainVideoId: (value) => ({
        isNull: !value,
      }),
      seasonExists: (value) => value as boolean,
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
