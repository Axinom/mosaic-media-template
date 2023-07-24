import { ColumnRenderer, Data, formatTitleCase } from '@axinom/mosaic-ui';
import React, { ReactNode } from 'react';
import {
  StatusIcon,
  StatusIcons,
} from '../../../../components/StatusIcons/StatusIcons';
import { SnapshotValidationResultSeverity } from '../ValidationResultMapper/ValidationResultMapper';
import classes from './SeverityRenderer.module.scss';

/**
 * Displays a value in Date format
 * @param val date
 * @param data row data
 */
export const SeverityRenderer: ColumnRenderer<Data> = (val): ReactNode => {
  if (val) {
    let image;
    switch (val as SnapshotValidationResultSeverity) {
      case SnapshotValidationResultSeverity.Error:
        image = <StatusIcons icon={StatusIcon.Error} />;
        break;
      case SnapshotValidationResultSeverity.Warning:
        image = <StatusIcons icon={StatusIcon.Warning} />;
        break;
      case SnapshotValidationResultSeverity.Success:
        image = <StatusIcons icon={StatusIcon.Success} />;
        break;
    }

    return (
      <div className={classes.container}>
        <div>{image}</div>
        {formatTitleCase(val as string)}
      </div>
    );
  }

  return '';
};
