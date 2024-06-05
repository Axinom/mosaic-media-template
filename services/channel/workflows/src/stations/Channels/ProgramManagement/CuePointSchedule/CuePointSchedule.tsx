// TODO: Remove these disables
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { VideoStationNames } from '@axinom/mosaic-managed-workflow-integration';
import {
  ActionData,
  formatSecondsToTimestamp,
  IconName,
  Icons,
  InlineMenu,
  Timestamp,
  timestampToSeconds,
  timestampValidator,
} from '@axinom/mosaic-ui';
import clsx from 'clsx';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CuePointScheduleType } from '../../../../generated/graphql';
import { PortalContext } from '../../../../store/portal-contex';
import {
  CuePointScheduleProps,
  ScheduleAction,
} from '../ProgramManagement.types';
import classes from './CuePointSchedule.module.scss';
import { CuePointScheduleIcon } from './CuePointScheduleIcon/CuePointScheduleIcon';

const typeMap: Record<CuePointScheduleType, { type: string; title: string }> = {
  AD_POD: { type: 'ad', title: 'Ad Pod' },
  VIDEO: { type: 'video', title: 'Trailer Video' },
};

export const CuePointSchedule: React.FC<CuePointScheduleProps> = ({
  id,
  sortIndex,
  type,
  durationInSeconds,
  videoId,
  localTime,
  errors = {},
  idx,
  onChange,
}) => {
  const { resolveRoute } = useContext(PortalContext);
  const videoDetailsPath = resolveRoute(
    VideoStationNames.VideoDetails,
    videoId,
  );

  const actions: ActionData[] = [
    {
      label: 'Unassign',
      icon: IconName.X,
      onActionSelected: () =>
        onChange({
          type: 'SCHEDULE',
          action: 'UNASSIGN',
        } as ScheduleAction),
    },
    ...(type === CuePointScheduleType.Video && videoDetailsPath
      ? [
          {
            label: 'Open Details',
            path: videoDetailsPath,
            openInNewTab: true,
          },
        ]
      : []),
  ];

  const { title, type: cuePointScheduleType } = typeMap[type];

  const [value, setValue] = useState<Timestamp>(
    formatSecondsToTimestamp(durationInSeconds),
  );

  // TODO: Use Formik/Yup validation on the root form object, instead of this
  useEffect(() => {
    if (type === CuePointScheduleType.AdPod && durationInSeconds !== null) {
      setValue(formatSecondsToTimestamp(durationInSeconds));
    }
  }, [durationInSeconds, type]);

  const errMsg = Object.values(errors).join(', ');

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value as Timestamp);

    // check if input value is a valid Timestamp, if not, change value to null for error handling
    timestampValidator(e.target.value)
      ? onChange({
          type: 'SCHEDULE',
          action: 'DURATION_UPDATE',
          data: { duration: timestampToSeconds(e.target.value as Timestamp) },
        } as ScheduleAction)
      : onChange({
          type: 'SCHEDULE',
          action: 'DURATION_UPDATE',
          data: { duration: null },
        } as ScheduleAction);
  };

  return (
    <Draggable draggableId={id} index={idx}>
      {(provided) => (
        <div
          className={classes.container}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className={clsx(classes.cell, classes.cpTimeSlot, {
              [classes.hasError]: errMsg,
            })}
          >
            <p title={localTime}>{localTime}</p>
          </div>
          <div
            className={clsx(classes.columns, classes.row, {
              [classes.hasError]: errMsg,
            })}
          >
            <div className={clsx(classes.cell, classes.title)}>
              <div className={classes.dragIcon} {...provided.dragHandleProps}>
                <Icons icon={IconName.Drag} />
              </div>
              <CuePointScheduleIcon type={type} />
              <p title={title}>{title}</p>
            </div>
            <div className={clsx(classes.cell)}>
              <p title={cuePointScheduleType}>{cuePointScheduleType}</p>
            </div>
            <div
              className={clsx(classes.input, {
                [classes.hasError]: errMsg,
              })}
            >
              {errMsg && <small>{errMsg}</small>}
              {type === CuePointScheduleType.AdPod ? (
                <input
                  placeholder="00:00:00.000"
                  value={value}
                  onChange={onChangeHandler}
                />
              ) : (
                <div className={clsx(classes.cell)}>
                  <p title={value}>{value}</p>
                </div>
              )}
            </div>
            <div></div>
            <div className={clsx(classes.cell, classes.ellipses)}>
              <InlineMenu
                placement="bottom-end"
                showArrow={false}
                addBackgroundOpacity={false}
                actions={actions}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
