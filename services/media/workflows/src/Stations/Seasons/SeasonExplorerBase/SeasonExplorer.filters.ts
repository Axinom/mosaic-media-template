import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { PublishStatus, SeasonFilter } from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { SeasonData } from './SeasonExplorer.types';

export function useSeasonsFilters(): {
  readonly filterOptions: FilterType<SeasonData>[];
  readonly transformFilters: (
    filters: FilterValues<SeasonData>,
    excludeItems?: number[],
  ) => SeasonFilter | undefined;
} {
  const [
    createFromDateFilterValidator,
    createToDateFilterValidator,
  ] = createDateRangeFilterValidators<SeasonData>();

  const filterOptions: FilterType<SeasonData>[] = [
    {
      label: 'Season Index',
      property: 'index',
      type: FilterTypes.Numeric,
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
      type: FilterTypes.FreeText,
    },
    {
      label: 'Cast',
      property: 'seasonsCasts',
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
      property: 'seasonsProductionCountries',
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
