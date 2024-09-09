import {
  createDateRangeFilterValidators,
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
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<CollectionData>();

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
      property: 'id', // should be language
      type: FilterTypes.FreeText,
    },
    {
      label: 'Type',
      property: 'collectionsTags', //should be type
      type: FilterTypes.Options,
      options: [
        { value: 'Manual', label: 'Manual' },
        { value: 'Automatic', label: 'Automatic' },
      ],
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
      label: 'Subtype',
      property: 'id', //should be subtype
      type: FilterTypes.Numeric,
    },
    {
      label: 'Countries',
      property: 'id', //should be country
      type: FilterTypes.Numeric,
    },
  ];

  const transformFilters = (
    filters: FilterValues<CollectionData>,
    excludeItems?: number[],
  ): CollectionFilter | undefined => {
    return filterToPostGraphileFilter<CollectionFilter>(filters, {
      title: 'includes',
      externalId: 'includes',
      collectionsTags: ['some', 'name', 'includes'],
      // language: 'in',
      // type: 'in',
      publishStatus: 'in',
      // subType: 'includes',
      // country: 'includes',
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
