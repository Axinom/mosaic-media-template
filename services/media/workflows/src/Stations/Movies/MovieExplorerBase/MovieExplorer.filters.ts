import {
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
} from '@axinom/mosaic-ui';
import { BusinessType, MovieFilter } from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { MovieData } from './MovieExplorer.types';

export function useMoviesFilters(): {
  readonly filterOptions: FilterType<MovieData>[];
  readonly transformFilters: (
    filters: FilterValues<MovieData>,
    excludeItems?: number[],
  ) => MovieFilter | undefined;
} {
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
      label: 'Publishing Status',
      property: 'publishStatus',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Audio Languages',
      property: 'audioLanguages',
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
      property: 'businessType',
      type: FilterTypes.Options,
      options: Object.keys(BusinessType).map((key) => ({
        value: BusinessType[key],
        label: getEnumLabel(BusinessType[key]),
      })),
    },
    {
      label: 'TVOD Tier',
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
      audioLanguages: 'equalTo',
      moviesCasts: ['some', 'name', 'includesInsensitive'],
      externalId: 'includesInsensitive',
      contentOwner: 'includesInsensitive',
      moviesProductionCountries: ['some', 'name', 'includesInsensitive'],
      // validLicensing: 'includesInsensitive',
      // subtype: 'includesInsensitive',
      businessType: 'in',
      // tvodTier: 'includesInsensitive',
      // subscriptionPlans: 'includesInsensitive',
    });
  };

  return { filterOptions, transformFilters };
}
