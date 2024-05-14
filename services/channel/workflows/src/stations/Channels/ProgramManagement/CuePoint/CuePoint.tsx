import {
  ActionData,
  ButtonContext,
  formatSecondsToTimestamp,
  IconName,
  InlineMenu,
  Timestamp,
  TIMESTAMP_DEFAULT,
} from '@axinom/mosaic-ui';
import clsx from 'clsx';
import { FormikErrors } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { v4 } from 'uuid';
import { CuePointSchedule } from '../CuePointSchedule/CuePointSchedule';
import {
  CuePointAction,
  CuePointScheduleFormData,
  ProgramCuePointProps,
} from '../ProgramManagement.types';
import classes from './CuePoint.module.scss';

export const CuePoint: React.FC<ProgramCuePointProps> = ({
  id,
  type,
  timeInSeconds,
  videoCuePointId,
  startTimeUTC,
  localTime,
  cuePointSchedules,
  errors = {},
  onChange,
}) => {
  const { cuePointSchedules: cpsErrors, ...rest } = errors;
  const errMsg = (Object.values(rest) as string[]).join(', ');

  const title = `${type}-ROLL`;
  const [totalDuration, setTotalDuration] =
    useState<Timestamp>(TIMESTAMP_DEFAULT);
  const [cpSchedule, setCpSchedule] = useState<
    (CuePointScheduleFormData & {
      time: string;
      idx: number;
    })[]
  >([]);

  const droppableId = id ?? v4();

  useEffect(() => {
    let previousDuration = 0;
    let scheduleDuration: Timestamp = TIMESTAMP_DEFAULT;
    const scheduleLength = cuePointSchedules?.nodes?.length ?? 0;

    const sch = (cuePointSchedules?.nodes ?? []).map((cpSchedule, idx) => {
      const time = moment(startTimeUTC, moment.ISO_8601, true)
        .add({ seconds: previousDuration })
        .format('hh:mm');
      previousDuration += cpSchedule.durationInSeconds;
      if (idx + 1 === scheduleLength) {
        scheduleDuration = formatSecondsToTimestamp(previousDuration);
      }
      return {
        ...cpSchedule,
        time,
        idx,
      };
    });
    setTotalDuration(scheduleDuration);
    setCpSchedule(sch);
  }, [cuePointSchedules?.nodes, startTimeUTC]);

  const cpActions: ActionData[] = [
    {
      label: 'Unassign All',
      icon: IconName.X,
      onActionSelected: () =>
        onChange({
          type: 'CUE_POINT',
          action: 'UNASSIGN_ALL',
        } as CuePointAction),
    },
  ];

  const addActions: ActionData[] = [
    {
      label: 'Add Ad Pod',
      icon: IconName.Plus,
      onActionSelected: () =>
        onChange({
          type: 'CUE_POINT',
          action: 'ADD_AD_POD',
        } as CuePointAction),
    },
    {
      label: 'Add Video',
      icon: IconName.Plus,
      onActionSelected: () =>
        onChange({
          type: 'CUE_POINT',
          action: 'ADD_VIDEO',
        } as CuePointAction),
    },
  ];

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className={classes.container}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {errMsg && <small>{errMsg}</small>}
          <div className={classes.slotWrapper}>
            {cpSchedule.map((scheduleItem, idx) => (
              <CuePointSchedule
                key={scheduleItem.id}
                {...scheduleItem}
                localTime={scheduleItem.time}
                errors={
                  cpsErrors?.nodes?.[
                    idx
                  ] as FormikErrors<CuePointScheduleFormData>
                }
                onChange={(action) =>
                  onChange({ ...action, scheduleIndex: idx })
                }
                idx={idx}
              />
            ))}
          </div>
          <div className={clsx(classes.columns, classes.header)}>
            <div className={clsx(classes.cell, classes.cpTimeSlot)}>
              <p title={localTime}>{localTime}</p>
            </div>
            <div className={clsx(classes.cell, classes.type)}>
              <p title={title}>{title}</p>
            </div>
            <div className={classes.cell}></div>
            <div className={classes.cell} title={totalDuration}>
              {totalDuration}
            </div>
            <div></div>
            <div className={classes.actions}>
              <InlineMenu
                placement="bottom-end"
                showArrow={false}
                addBackgroundOpacity={false}
                actions={cpActions}
              />
              <InlineMenu
                placement="bottom-end"
                showArrow={false}
                addBackgroundOpacity={false}
                actions={addActions}
                buttonIcon={IconName.Plus}
                buttonContext={ButtonContext.Active}
              />
            </div>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
