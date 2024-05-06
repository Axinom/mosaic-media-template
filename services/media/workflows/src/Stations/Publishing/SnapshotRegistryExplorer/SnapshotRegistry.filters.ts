import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import {
  EntityType,
  SnapshotFilter,
  SnapshotState,
  SnapshotValidationStatus,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { SnapshotData } from './SnapshotRegistry.types';

export function useSnapshotRegistryFilters(): {
  readonly filterOptions: FilterType<SnapshotData>[];
  readonly transformFilters: (
    filters: FilterValues<SnapshotData>,
  ) => SnapshotFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<SnapshotData>();

  const filterOptions: FilterType<SnapshotData>[] = [
    {
      label: 'Entity Type',
      property: 'entityType',
      type: FilterTypes.Options,
      options: Object.keys(EntityType).map((key) => ({
        value: EntityType[key],
        label: getEnumLabel(EntityType[key]),
      })),
    },
    {
      label: 'Title',
      property: 'entityTitle',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Operation Id',
      property: 'jobId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Created Period (From)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('createdDate'),
    },
    {
      label: 'Created Period (To)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('createdDate'),
    },
    {
      label: 'Created By',
      property: 'createdUser',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Updated Period (From)',
      property: 'updatedDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('updatedDate'),
    },
    {
      label: 'Updated Period (To)',
      property: 'updatedDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('updatedDate'),
    },
    {
      label: 'Snapshot State',
      property: 'snapshotState',
      type: FilterTypes.Options,
      options: Object.keys(SnapshotState).map((key) => ({
        value: SnapshotState[key],
        label: getEnumLabel(SnapshotState[key]),
      })),
    },
    {
      label: 'Validation Results',
      property: 'validationStatus',
      type: FilterTypes.Options,
      options: [
        { label: 'Has Errors', value: SnapshotValidationStatus.Errors },
        { label: 'Has Warnings', value: SnapshotValidationStatus.Warnings },
        { label: 'No Errors/Warnings', value: SnapshotValidationStatus.Ok },
      ],
    },
    {
      label: 'Publishing Period (From)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('publishedDate'),
    },
    {
      label: 'Publishing Period (To)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('publishedDate'),
    },
    {
      label: 'Unublishing Period (From)',
      property: 'unpublishedDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('unpublishedDate'),
    },
    {
      label: 'Unublishing Period (To)',
      property: 'unpublishedDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('unpublishedDate'),
    },
  ];

  const transformFilters = (
    filters: FilterValues<SnapshotData>,
  ): SnapshotFilter | undefined => {
    return filterToPostGraphileFilter<SnapshotFilter>(filters, {
      entityType: 'in',
      entityTitle: 'includesInsensitive',
      jobId: 'includesInsensitive',
      createdDate: transformRange,
      createdUser: 'includesInsensitive',
      updatedDate: transformRange,
      snapshotState: 'in',
      validationStatus: 'equalTo',
      publishedDate: transformRange,
      unpublishedDate: transformRange,
    });
  };

  return { filterOptions, transformFilters };
}
