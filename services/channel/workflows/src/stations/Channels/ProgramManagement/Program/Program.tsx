import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import {
  ActionData,
  Button,
  ButtonContext,
  formatSecondsToTimestamp,
  IconName,
  Icons,
  InlineMenu,
  Timestamp,
} from '@axinom/mosaic-ui';
import clsx from 'clsx';
import { FormikErrors } from 'formik';
import moment, { utc } from 'moment';
import React, { useContext, useEffect, useMemo } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useParams } from 'react-router';
import { ProgramBreakType } from '../../../../generated/graphql';
import { PortalContext } from '../../../../store/portal-contex';
import { routes } from '../../routes';
import { CuePoint } from '../CuePoint/CuePoint';
import {
  ProgramAction,
  ProgramCuePointFormData,
  ProgramCuePointProps,
  ProgramProps,
} from '../ProgramManagement.types';
import classes from './Program.module.scss';

export const Program: React.FC<ProgramProps> = ({
  id,
  trackId,
  entityType,
  title,
  videoDurationInSeconds,
  imageId,
  programCuePoints,
  startTime,
  endTime,
  errors = {},
  ImagePreview,
  isOpen,
  sortIndex,
  entityId,
  resolver,
  onChange,
  onToggle,
}) => {
  const { playlistId, channelId } = useParams<{
    channelId: string;
    playlistId: string;
  }>();
  const { programCuePoints: cpErrors, ...rest } = errors;
  const errMsg = (Object.values(rest) as string[]).join(', ');
  const programLocalizationPath = getLocalizationEntryPoint('program');
  const { resolveRoute } = useContext(PortalContext);

  const sourceEntityPath = useMemo(
    () => resolveRoute(`${entityType.toLowerCase()}-details`, entityId),
    [resolveRoute, entityType, entityId],
  );

  useEffect(() => {
    onToggle(id ?? trackId, false);
    return () => onToggle(id ?? trackId, null);
  }, [id, trackId, onToggle]);

  const actions: ActionData[] = [
    ...(sourceEntityPath
      ? [{ label: 'Open Source Details', path: sourceEntityPath }]
      : []),
    ...(resolver && id
      ? [
          {
            label: 'Edit Program Details',
            path: routes.generate(routes.programDetails, {
              channelId,
              playlistId,
              programId: id,
            }),
          },
        ]
      : []),
    ...(programLocalizationPath && id
      ? [
          {
            label: 'Localizations',
            path: routes.generate(programLocalizationPath, {
              channelId,
              playlistId,
              programId: id,
            }),
          },
        ]
      : []),
    {
      label: 'Unassign',
      icon: IconName.X,
      onActionSelected: () =>
        onChange({
          type: 'PROGRAM',
          action: 'REMOVE',
        } as ProgramAction),
    },
  ];

  const cuePointAmt: number = programCuePoints?.nodes?.length ?? 0;
  let usedCuePoints = 0;
  const preNodes: ProgramCuePointProps[] = [];
  const midNodes: ProgramCuePointProps[] = [];
  const postNodes: ProgramCuePointProps[] = [];

  let cumulativeCuePointDurations = 0;

  // Calculate start times for cuepoints
  for (let i = 0; i < programCuePoints?.nodes?.length ?? []; i++) {
    let totalCuePointDuration = 0;
    const node = programCuePoints?.nodes[i];
    if (node?.cuePointSchedules?.nodes?.length) {
      usedCuePoints++;
    }
    for (const cpSchedule of node?.cuePointSchedules?.nodes ?? []) {
      totalCuePointDuration += cpSchedule.durationInSeconds;
    }

    let time = moment(startTime, moment.ISO_8601, true);

    switch (node.type) {
      case ProgramBreakType.Pre:
        preNodes.push({
          ...node,
          startTimeUTC: time.toISOString(),
          localTime: moment(time, moment.ISO_8601, true).format('hh:mm'),
          onChange: (action) => onChange({ ...action, cuePointIndex: i }),
        });
        break;
      case ProgramBreakType.Post:
        time = moment(endTime, moment.ISO_8601, true).clone().subtract({
          seconds: totalCuePointDuration,
        });
        postNodes.push({
          ...node,
          startTimeUTC: time.toISOString(),
          localTime: time.format('hh:mm'),
          onChange: (action) => onChange({ ...action, cuePointIndex: i }),
        });
        break;
      default:
        time = moment(startTime, moment.ISO_8601, true)
          .clone()
          .add({
            seconds: cumulativeCuePointDurations + (node?.timeInSeconds ?? 0),
          });
        midNodes.push({
          ...node,
          startTimeUTC: time.toISOString(),
          localTime: time.format('hh:mm'),
          onChange: (action) => onChange({ ...action, cuePointIndex: i }),
        });
        break;
    }

    cumulativeCuePointDurations += totalCuePointDuration;
  }

  const cuePoints = [...preNodes, ...midNodes, ...postNodes];

  const midNodesAmt = `${usedCuePoints}/${cuePointAmt}`;
  const programDuration: Timestamp = formatSecondsToTimestamp(
    videoDurationInSeconds,
  );

  const localStartTime = moment(startTime, moment.ISO_8601, true).format(
    'hh:mm',
  );
  const isLive = utc().isBetween(startTime, endTime);

  const onCuePointDragEnd = (result): void => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const cuePointIndex = cuePoints.findIndex(
      (cuePoint) => cuePoint.id === source.droppableId,
    );

    const newCuePointId =
      destination.droppableId !== source.droppableId
        ? destination.droppableId
        : undefined;

    cuePoints[cuePointIndex]?.onChange({
      action: 'REORDER',
      data: {
        newPosition: destination.index,
        newCuePointId,
      },
      type: 'SCHEDULE',
      programIndex: sortIndex,
      cuePointIndex,
      scheduleIndex: source.index,
    });
  };

  return (
    <Draggable draggableId={id ?? trackId} index={sortIndex}>
      {(provided) => (
        <div
          className={classes.sections}
          data-test-id="program"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className={classes.timeSlot}>
            <p title={localStartTime}>{localStartTime}</p>
            {isLive && <span className={classes.badge}>LIVE</span>}
          </div>
          <div
            className={clsx(classes.container, {
              [classes.closed]: !isOpen,
            })}
          >
            <div className={clsx(classes.columns, classes.header)}>
              {errMsg && <small>{errMsg}</small>}
              <div className={clsx(classes.cell, classes.icons)}>
                <div className={classes.dragIcon} {...provided.dragHandleProps}>
                  <Icons icon={IconName.Drag} />
                </div>
                <Button
                  icon={IconName.ChevronRight}
                  onButtonClicked={() => onToggle(id ?? trackId, !isOpen)}
                  className={clsx(classes.chevron, {
                    [classes.closed]: !isOpen,
                  })}
                  buttonContext={ButtonContext.None}
                />
              </div>
              <div className={clsx(classes.cell, classes.title)}>
                <ImagePreview id={imageId} type={'thumbnail'} />
                <p title={title}>{title}</p>
              </div>
              <div className={classes.cell}>
                <p title={entityType}>{entityType}</p>
              </div>
              <div className={classes.cell}>
                <p title={programDuration}>{programDuration}</p>
              </div>
              <div className={classes.cell}>
                <p title={midNodesAmt}>{midNodesAmt}</p>
              </div>
              <div className={clsx(classes.cell, classes.ellipses)}>
                <InlineMenu
                  placement="bottom-end"
                  showArrow={false}
                  addBackgroundOpacity={false}
                  actions={actions}
                  buttonContext={ButtonContext.None}
                />
              </div>
            </div>
            <div
              className={clsx(classes.cpWrapper, {
                [classes.hasCuePoints]: cuePointAmt,
                [classes.hasErrors]: errMsg,
                [classes.collapsed]: !isOpen,
              })}
            >
              <DragDropContext onDragEnd={onCuePointDragEnd}>
                {[...preNodes, ...midNodes, ...postNodes].map(
                  (cuePoint, idx) => (
                    <CuePoint
                      key={
                        cuePoint?.id ??
                        `${cuePoint.type}${cuePoint.timeInSeconds}`
                      }
                      {...cuePoint}
                      errors={
                        cpErrors?.nodes?.[
                          idx
                        ] as FormikErrors<ProgramCuePointFormData>
                      }
                    />
                  ),
                )}
              </DragDropContext>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
