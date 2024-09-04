import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
} from '@axinom/mosaic-ui';
import { MovieFilter } from '../../../generated/graphql';
import { MovieData } from './MovieExplorer.types';

export function useMoviesFilters(): {
  readonly filterOptions: FilterType<MovieData>[];
  readonly transformFilters: (
    filters: FilterValues<MovieData>,
    excludeItems?: number[],
  ) => MovieFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<MovieData>();

  const filterOptions: FilterType<MovieData>[] = [
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Genre',
      property: 'moviesMovieGenres',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'moviesTags',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Collections',
      property: 'collectionRelations',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Content Owners',
      property: 'contentOwner',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Age Ratings',
      property: 'ageRating',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Content Sets',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Publishing Status',
      property: 'publishStatus',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Audio Languages',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
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
      // select from list [Valid License, No Valid License]
      label: 'Valid Licensing',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Sub Type',
      property: '__typename',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Business Type',
      property: 'released',
      type: FilterTypes.FreeText,
    },
    {
      label: 'TVOD Tier',
      property: 'studio',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Subscription Plans',
      property: 'studio',
      type: FilterTypes.FreeText,
    },
  ];

  const transformFilters = (
    filters: FilterValues<MovieData>,
    _excludeItems?: number[],
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
      // contentOwners: 'includesInsensitive',
      // contentSets: 'includesInsensitive',
      publishStatus: 'in',
      // audioLanguages: 'includesInsensitive',
      moviesCasts: ['some', 'name', 'includesInsensitive'],
      externalId: 'includesInsensitive',
      contentOwner: 'includesInsensitive',
      moviesProductionCountries: ['some', 'name', 'includesInsensitive'],
      // validLicensing: 'includesInsensitive',
      // subtype: 'includesInsensitive',
      // businessType: 'includesInsensitive',
      // tvodTier: 'includesInsensitive',
      // subscriptionPlans: 'includesInsensitive',
    });
  };

  return { filterOptions, transformFilters };
}
