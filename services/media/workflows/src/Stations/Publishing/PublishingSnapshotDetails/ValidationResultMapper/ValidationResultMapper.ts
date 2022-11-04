import {
  PublishingSnapshotQuery,
  SnapshotState,
} from '../../../../generated/graphql';

export enum SnapshotValidationResultSeverity {
  Warning = 'WARNING',
  Error = 'ERROR',
  Success = 'SUCCESS',
}

type SnapshotValidationResult = NonNullable<
  PublishingSnapshotQuery['snapshot']
>['snapshotValidationResults']['nodes'][number];

export interface ValidationData
  extends Omit<SnapshotValidationResult, 'severity' | 'context'> {
  severity:
    | SnapshotValidationResult['severity']
    | SnapshotValidationResultSeverity;
  context: SnapshotValidationResult['context'] | 'All';
}

export const mapValidationData = (
  originalData: SnapshotValidationResult[],
  snapshotState: SnapshotState,
): ValidationData[] => {
  return originalData.length > 0
    ? originalData
    : snapshotState === SnapshotState.Error
    ? [
        {
          id: 0,
          context: 'All',
          severity: SnapshotValidationResultSeverity.Error,
          message: 'Unhandled error occurred while processing the snapshot',
        },
      ]
    : [
        {
          id: 0,
          context: 'All',
          severity: SnapshotValidationResultSeverity.Success,
          message: 'Validation Success for all categories',
        },
      ];
};
