import {
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  Option,
} from '@axinom/mosaic-ui';
import { useEffect, useState } from 'react';
import { client } from '../../../apolloClient';
import {
  BusinessType,
  MovieFilter,
  PublishStatus,
  useGetMoviesFilterOptionsDataQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { MovieData } from './MovieExplorer.types';

interface allOptions {
  allAgeRatings: Option[];
  allContentOwners: Option[];
  allGenres: Option[];
  allCollections: Option[];
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
  });

  const { data, error } = useGetMoviesFilterOptionsDataQuery({ client });

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
      });
    } else {
      let ageRating: Option[] = [];
      let contentOwner: Option[] = [];
      let genres: Option[] = [];
      let collections: Option[] = [];
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
      setAllFilterOptions({
        allAgeRatings: ageRating,
        allContentOwners: contentOwner,
        allGenres: genres,
        allCollections: collections,
      });
    }
  }, [data]);

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
      label: 'License Countries',
      property: 'moviesProductionCountries',
      type: FilterTypes.FreeText,
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
      label: 'Sub Type',
      property: 'assetSubtype',
      type: FilterTypes.FreeText,
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
      contentOwner: 'includesInsensitive',
      moviesProductionCountries: ['some', 'name', 'includesInsensitive'],
      moviesLicenses: (value) => {
        if (value === 'Valid License') {
          return {
            some: {
              licenseEnd: {
                greaterThan: new Date(),
              },
            },
          };
        } else {
          return {
            every: {
              licenseEnd: {
                lessThanOrEqualTo: new Date(),
              },
            },
          };
        }
      },
      assetSubtype: 'equalTo',
      businessType: 'in',
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
