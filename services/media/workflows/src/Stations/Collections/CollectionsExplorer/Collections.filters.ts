import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
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
  const [
    createFromDateFilterValidator,
    createToDateFilterValidator,
  ] = createDateRangeFilterValidators<CollectionData>();

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
    filters: FilterValues<CollectionData>,
    _excludeItems?: number[],
  ): CollectionFilter | undefined => {
    return filterToPostGraphileFilter<CollectionFilter>(filters, {
      title: 'includes',
      externalId: 'includes',
      collectionsTags: ['some', 'name', 'includes'],
      publishStatus: 'in',
      id: 'equalTo',
      createdDate: transformRange,
      publishedDate: transformRange,
    });
  };

  return { filterOptions, transformFilters };
}
