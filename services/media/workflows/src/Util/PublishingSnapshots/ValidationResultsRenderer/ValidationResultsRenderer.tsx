import { ColumnRenderer } from '@axinom/mosaic-ui';
import React, { ReactNode } from 'react';
import {
  StatusIcon,
  StatusIcons,
} from '../../../components/StatusIcons/StatusIcons';
import {
  Snapshot,
  SnapshotState,
  SnapshotValidationResultsConnection,
  SnapshotValidationStatus,
} from '../../../generated/graphql';
import { getValidationResultMessage } from '../ValidationResultMessage';
import classes from './ValidationResultsRenderer.module.scss';

type ValidationData = Pick<Snapshot, 'snapshotState' | 'validationStatus'>;

/**
 * Displays a value in Date format
 * @param val date
 * @param data row data
 */
export const ValidationResultsRenderer: ColumnRenderer<ValidationData> = (
  val: unknown,
  data: ValidationData,
): ReactNode => {
  if (val) {
    const message = getValidationResultMessage(
      (val as SnapshotValidationResultsConnection).nodes,
      data.snapshotState,
      data.validationStatus,
    );

    let image;

    if (
      data.snapshotState === SnapshotState.Initialization ||
      data.snapshotState === SnapshotState.Validation
    ) {
      image = <StatusIcons icon={StatusIcon.Progress} />;
    } else if (data.snapshotState === SnapshotState.Error) {
      image = <StatusIcons icon={StatusIcon.Error} />;
    } else {
      switch (data.validationStatus) {
        case SnapshotValidationStatus.Ok:
          image = <StatusIcons icon={StatusIcon.Success} />;
          break;
        case SnapshotValidationStatus.Errors:
          image = <StatusIcons icon={StatusIcon.Error} />;
          break;
        case SnapshotValidationStatus.Warnings:
          image = <StatusIcons icon={StatusIcon.Warning} />;
          break;
        default:
          break;
      }
    }

    return (
      <div className={classes.container}>
        {image}
        <p title={message}>{message}</p>
      </div>
    );
  }

  return '';
};
