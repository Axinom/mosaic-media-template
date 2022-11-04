import {
  SnapshotState,
  SnapshotValidationIssueSeverity,
  SnapshotValidationResult,
  SnapshotValidationStatus,
} from '../../generated/graphql';

export const getValidationResultMessage = (
  results: SnapshotValidationResult[],
  snapshotState: SnapshotState | null | undefined,
  validationStatus: SnapshotValidationStatus | null | undefined,
): string => {
  switch (true) {
    case snapshotState === SnapshotState.Initialization:
    case snapshotState === SnapshotState.Validation:
      return 'In Progress';
    case validationStatus === SnapshotValidationStatus.Ok:
      return 'Success';
    case snapshotState === SnapshotState.Error:
      return 'Error';
  }

  let warnings = 0,
    errors = 0;

  results.forEach((node) => {
    switch (node.severity) {
      case SnapshotValidationIssueSeverity.Error:
        errors++;
        break;
      case SnapshotValidationIssueSeverity.Warning:
        warnings++;
    }
  });

  return `${errors > 0 ? `${errors} Error(s)` : ''}${
    errors > 0 && warnings > 0 ? ', ' : ''
  }${warnings > 0 ? `${warnings} Warning(s)` : ''}`;
};
