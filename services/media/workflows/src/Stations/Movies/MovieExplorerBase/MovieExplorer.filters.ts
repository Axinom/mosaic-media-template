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
  BusinessType,
  MovieFilter,
  PublishStatus,
  useGetMoviesFilterOptionsDataQuery,
} from '../../../generated/graphql';
import { transformRange } from '../../../Util/DateRangeTransformer/DateRangeTransformer';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { MovieData } from './MovieExplorer.types';
import { CountryOptions } from '../../../Util/CountryNames/CountryNames';

interface allOptions {
  allAgeRatings: Option[];
  allContentOwners: Option[];
  allGenres: Option[];
  allCollections: Option[];
  allCountries: Option[];
  countryNames: Option[];
}

export function useMoviesFilters(): {
  readonly filterOptions: FilterType<MovieData>[];
  readonly transformFilters: (
    filters: FilterValues<MovieData>,
    excludeItems?: number[],
  ) => MovieFilter | undefined;
} {
  const [AllFilterOptions, setAllFilterOptions] = useState<allOptions>({
    allAgeRatings: [],
    allContentOwners: [],
    allGenres: [],
    allCollections: [],
    allCountries: [],
    countryNames: []
  });

  const { data, error } = useGetMoviesFilterOptionsDataQuery({
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
        allCollections: [
          {
            label: 'Unable to load collection options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
        allCountries: [
          {
            label: 'Unable to load country options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
        countryNames: CountryOptions
      });
    } else {
      let ageRating: Option[] = [];
      let contentOwner: Option[] = [];
      let genres: Option[] = [];
      let collections: Option[] = [];
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
      if (data?.collections?.nodes !== undefined) {
        collections = data.collections.nodes.map(({ title }) => ({
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
        allCollections: collections,
        allCountries: countries,
        countryNames: CountryOptions
      });
    }
  }, [data, error]);

  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<MovieData>();

  const filterOptions: FilterType<MovieData>[] = [
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Genre',
      property: 'moviesMovieGenres',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allGenres.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Tags',
      property: 'moviesTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Collections',
      property: 'collectionRelations',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allCollections.filter((option) =>
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
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allAgeRatings.filter((option) =>
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
    {
      label: 'Cast',
      property: 'moviesCasts',
      type: FilterTypes.FreeText,
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Production Country',
      property: 'moviesProductionCountries',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.countryNames.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'License Countries',
      property: 'moviesLicenses',
      searchInputPlaceholder: 'Search',
      type: FilterTypes.SearcheableOptions,
      optionsProvider: (searchText) =>
        AllFilterOptions.allCountries.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        ),
    },
    {
      label: 'Valid Licensing',
      property: 'moviesLicenses',
      options: [
        { value: 'Valid License', label: 'Valid License' },
        { value: 'No Valid License', label: 'No Valid License' },
      ],
      type: FilterTypes.Options,
    },
    {
      label: 'Business Type',
      property: 'businessType',
      type: FilterTypes.Options,
      options: Object.keys(BusinessType).map((key) => ({
        value: BusinessType[key],
        label: getEnumLabel(BusinessType[key]),
      })),
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
  ];

  const transformFilters = (
    filters: FilterValues<MovieData>,
    excludeItems?: number[],
  ): MovieFilter | undefined => {
    return filterToPostGraphileFilter<MovieFilter>(filters, {
      title: 'includesInsensitive',
      moviesMovieGenres: [
        'some',
        'movieGenres',
        'title',
        'includesInsensitive',
      ],
      moviesTags: ['some', 'name', 'includesInsensitive'],
      collectionRelations: [
        'some',
        'collection',
        'title',
        'includesInsensitive',
      ],
      ageRating: 'includesInsensitive',
      publishStatus: 'in',
      moviesCasts: ['some', 'name', 'includesInsensitive'],
      externalId: 'includesInsensitive',
      publishingId: 'includesInsensitive',
      contentOwner: 'includesInsensitive',
      moviesProductionCountries: ['some', 'name', 'includesInsensitive'],
      moviesLicenses: (value: unknown) => {
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
        } else if (!isUuid(countryCode)) {
          return {
            some: {
              moviesLicensesCountries: {
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
              moviesLicensesCountries: {
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
      businessType: 'in',
      released: transformRange,
      createdDate: transformRange,
      publishedDate: transformRange,
    });
  };

  return { filterOptions, transformFilters };
}
