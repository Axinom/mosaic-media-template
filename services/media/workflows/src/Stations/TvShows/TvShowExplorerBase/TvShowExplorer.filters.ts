import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { TvshowFilter } from '../../../generated/graphql';
import { TvShowData } from './TvShowExplorer.types';

export function useTvShowsFilters(): {
  readonly filterOptions: FilterType<TvShowData>[];
  readonly transformFilters: (
    filters: FilterValues<TvShowData>,
    excludeItems?: number[],
  ) => TvshowFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<TvShowData>();

  const filterOptions: FilterType<TvShowData>[] = [
    {
      label: 'Asset Types',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Genre',
      property: 'tvshowsTvshowGenres',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'tvshowsTags',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Content Owners',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Age Ratings',
      property: 'originalTitle',
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
      property: 'tvshowsCasts',
      type: FilterTypes.FreeText,
    },
    {
      label: 'License Countries',
      property: 'tvshowsProductionCountries',
      type: FilterTypes.FreeText,
    },
    {
      // select from list [Valid License, No Valid License]
      label: 'TV Show Valid Licensing',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      // select from list [Valid License, No Valid License]
      label: 'Episode Valid Licensing',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Business Type',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      label: 'TVOD Tier',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'TV Show Sub Type',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Episode Sub Type',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
    {
      // select from list
      label: 'Subscription Plans',
      property: 'originalTitle',
      type: FilterTypes.FreeText,
    },
  ];

  const transformFilters = (
    filters: FilterValues<TvShowData>,
    excludeItems?: number[],
  ): TvshowFilter | undefined => {
    return filterToPostGraphileFilter<TvshowFilter>(filters, {
      title: 'includesInsensitive',
      originalTitle: 'includesInsensitive',
      externalId: 'includesInsensitive',
      tvshowsTags: ['some', 'name', 'includesInsensitive'],
      tvshowsTvshowGenres: [
        'some',
        'tvshowGenres',
        'title',
        'includesInsensitive',
      ],
      tvshowsCasts: ['some', 'name', 'includesInsensitive'],
      tvshowsProductionCountries: ['some', 'name', 'includesInsensitive'],
      studio: 'includesInsensitive',
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
      released: transformRange,
      createdDate: transformRange,
      publishedDate: transformRange,
    });
  };

  return { filterOptions, transformFilters };
}
