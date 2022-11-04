import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { EpisodeFilter, PublishStatus } from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { EpisodeData } from './EpisodeExplorer.types';

export function useEpisodesFilters(): {
  readonly filterOptions: FilterType<EpisodeData>[];
  readonly transformFilters: (
    filters: FilterValues<EpisodeData>,
    excludeItems?: number[],
  ) => EpisodeFilter | undefined;
} {
  const [
    createFromDateFilterValidator,
    createToDateFilterValidator,
  ] = createDateRangeFilterValidators<EpisodeData>();

  const filterOptions: FilterType<EpisodeData>[] = [
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
      type: FilterTypes.FreeText,
    },
    {
      label: 'Cast',
      property: 'episodesCasts',
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
      property: 'episodesProductionCountries',
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
    filters: FilterValues<EpisodeData>,
    excludeItems?: number[],
  ): EpisodeFilter | undefined => {
    return filterToPostGraphileFilter<EpisodeFilter>(filters, {
      title: 'includesInsensitive',
      index: 'equalTo',
      originalTitle: 'includesInsensitive',
      externalId: 'includesInsensitive',
      episodesTags: ['some', 'name', 'includesInsensitive'],
      episodesTvshowGenres: [
        'some',
        'tvshowGenres',
        'title',
        'includesInsensitive',
      ],
      episodesCasts: ['some', 'name', 'includesInsensitive'],
      episodesProductionCountries: ['some', 'name', 'includesInsensitive'],
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
