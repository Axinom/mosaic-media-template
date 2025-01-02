import {
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
} from '@axinom/mosaic-ui';
import { CollectionFilter, PublishStatus } from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { CollectionData } from './Collections.types';

export function useCollectionsFilters(): {
  readonly filterOptions: FilterType<CollectionData>[];
  readonly transformFilters: (
    filters: FilterValues<CollectionData>,
    excludeItems?: number[],
  ) => CollectionFilter | undefined;
} {
  const filterOptions: FilterType<CollectionData>[] = [
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'collectionsTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Language',
      property: 'languages',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Type',
      property: '__typename',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Countries',
      property: 'collectionCountries',
      type: FilterTypes.FreeText,
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
  ];

  const transformFilters = (
    filters: FilterValues<CollectionData>,
    excludeItems?: number[],
  ): CollectionFilter | undefined => {
    return filterToPostGraphileFilter<CollectionFilter>(filters, {
      title: 'includesInsensitive',
      externalId: 'includes',
      collectionsTags: ['some', 'name', 'includesInsensitive'],
      languages: 'equalTo',
      collectionCountries: 'equalTo',
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
    });
  };

  return { filterOptions, transformFilters };
}
