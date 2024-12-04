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
      label: 'Collections',
      property: 'collectionRelations',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Content Owners',
      property: 'contentOwner',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Age Ratings',
      property: 'ageRating',
      type: FilterTypes.FreeText,
    },
    {
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
    // {
    //   label: 'TVOD Tier',
    //   property: 'studio',
    //   type: FilterTypes.FreeText,
    // },
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
      audioLanguages: 'equalTo',
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
                lessThanOrEqualTo: '2024-09-29T18:30:00+00:00',
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
