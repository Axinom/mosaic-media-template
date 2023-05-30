import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import {
  SnapshotFilter,
  SnapshotState,
  SnapshotValidationStatus,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { SnapshotData } from './PublishingSnapshotExplorer.types';

export function usePublishingSnapshotFilters(): {
  readonly filterOptions: FilterType<SnapshotData>[];
  readonly transformFilters: (
    filters: FilterValues<SnapshotData>,
    excludeItems?: number[],
  ) => SnapshotFilter | undefined;
} {
  const [
    createFromDateFilterValidator,
    createToDateFilterValidator,
  ] = createDateRangeFilterValidators<SnapshotData>();

  const filterOptions: FilterType<SnapshotData>[] = [
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
      label: 'Created By',
      property: 'createdUser',
      type: FilterTypes.FreeText,
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
      label: 'State',
      property: 'snapshotState',
      type: FilterTypes.Options,
      options: Object.keys(SnapshotState).map((key) => ({
        value: SnapshotState[key],
        label: getEnumLabel(SnapshotState[key]),
      })),
    },
    {
      label: 'State Change Period (From)',
      property: 'updatedDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('updatedDate'),
    },
    {
      label: 'State Change Period (To)',
      property: 'updatedDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('updatedDate'),
    },
    {
      label: 'State Changed By',
      property: 'updatedUser',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Snapshot ID',
      property: 'id',
      type: FilterTypes.Numeric,
    },
  ];

  const transformFilters = (
    filters: FilterValues<SnapshotData>,
  ): SnapshotFilter | undefined => {
    return filterToPostGraphileFilter<SnapshotFilter>(filters, {
      createdDate: transformRange,
      createdUser: 'includes',
      validationStatus: 'equalTo',
      snapshotState: 'in',
      updatedDate: transformRange,
      updatedUser: 'includes',
      id: 'equalTo',
    });
  };

  return { filterOptions, transformFilters };
}
