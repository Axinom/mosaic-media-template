import React, { ReactNode } from 'react';
import {
  StatusIcon,
  StatusIcons,
} from '../../../../components/StatusIcons/StatusIcons';
import { Constants } from '../../../../constants';
import { IngestStatus as IngestProcessStatus } from '../../../../generated/graphql';
import classes from './IngestStatusRenderer.module.scss';

const ingestStatusIconMapping = {
  [IngestProcessStatus.Success]: StatusIcon.Success,
  [IngestProcessStatus.Error]: StatusIcon.Error,
  [IngestProcessStatus.InProgress]: StatusIcon.Progress,
  [IngestProcessStatus.PartialSuccess]: StatusIcon.Warning,
};

export const IngestStatusRenderer = (val: unknown): ReactNode => {
  const icon = ingestStatusIconMapping[val as IngestProcessStatus];
  const label = Constants[val as IngestProcessStatus];

  return (
    <div className={classes.statusContainer} title={label}>
      <StatusIcons icon={icon} className={classes.icon} />
      <span className={classes.label}>{label}</span>
    </div>
  );
};
