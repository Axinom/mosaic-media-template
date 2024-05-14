import { ColumnRenderer, Data, formatTitleCase } from '@axinom/mosaic-ui';
import React, { ReactNode } from 'react';
import { StatusIcon, StatusIcons } from '../../../icons/StatusIcons';
import classes from './SeverityRenderer.module.scss';

export const SeverityRenderer: ColumnRenderer<Data> = (val): ReactNode => {
  if (val) {
    let image;
    switch (val) {
      case 'ERROR':
        image = <StatusIcons icon={StatusIcon.Error} />;
        break;
      case 'WARNING':
        image = <StatusIcons icon={StatusIcon.Warning} />;
        break;
      case 'SUCCESS':
        image = <StatusIcons icon={StatusIcon.Success} />;
        break;
    }

    return (
      <div className={classes.container}>
        {image}
        {formatTitleCase(val as string)}
      </div>
    );
  }

  return '';
};
