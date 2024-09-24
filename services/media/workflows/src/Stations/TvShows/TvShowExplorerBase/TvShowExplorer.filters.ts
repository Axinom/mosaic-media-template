import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { PublishStatus, TvshowFilter } from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
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
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
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
      property: 'tvshowsTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Genre',
      property: 'tvshowsTvshowGenres',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Cast',
      property: 'tvshowsCasts',
      type: FilterTypes.FreeText,
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
      property: 'tvshowsProductionCountries',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Studio',
      property: 'studio',
      type: FilterTypes.FreeText,
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
