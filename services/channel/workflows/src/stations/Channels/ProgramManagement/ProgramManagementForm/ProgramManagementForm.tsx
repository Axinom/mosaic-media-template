import {
  ActionData,
  ErrorType,
  ErrorTypeToStationError,
  IconName,
  Loader,
  StationError,
} from '@axinom/mosaic-ui';
import { FormikErrors, useFormikContext } from 'formik';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { ExtensionsContext } from '../../../../externals/piralExtensions';
import {
  CuePointSchedule,
  CuePointScheduleType,
  ProgramCuePoint,
  ProgramsConnection,
  Scalars,
} from '../../../../generated/graphql';
import { EntityProvider } from '../EntityProvider/EntityProvider';
import { Header } from '../Header/Header';
import { generateProgram } from '../helpers';
import { useCalculatedTimes, useOpenItems } from '../hooks';
import { Program } from '../Program/Program';
import {
  CpsNodes,
  CuePointAction,
  CuePointSelect,
  FastProviderData,
  ProgramAction,
  ProgramEntity,
  ProgramFormAction,
  ProgramFormData,
  ProgramManagementFormData,
  ScheduleAction,
  ScheduleReorderActionData,
} from '../ProgramManagement.types';
import { ProgramManagementContext } from '../ProgramManagementProvider/ProgramManagementProvider';
import { ScheduleVideoExplorer } from '../VideoScheduleExplorer/VideoScheduleExplorer';
import classes from './ProgramManagementForm.module.scss';

type NewSchedule = Pick<
  CuePointSchedule,
  'type' | 'durationInSeconds' | 'videoId' | 'sortIndex' | 'programCuePointId'
>;

export const ProgramManagementForm: React.FC<{
  onStationError: (err: StationError | undefined) => void;
}> = ({ onStationError }) => {
  const { allProviders, providerTypeMap } = useContext(
    ProgramManagementContext,
  );
  const { ImagePreview, VideoSelectExplorer } = useContext(ExtensionsContext);

  const [provider, setProvider] = useState<FastProviderData | undefined>();
  const [videoSelect, setVideoSelect] = useState<CuePointSelect>();
  const [isNewProgramLoading, setIsNewProgramLoading] =
    useState<boolean>(false);

  const { values, setFieldValue, errors } =
    useFormikContext<ProgramManagementFormData>();

  const { programs, playListDurationInSeconds } = useCalculatedTimes(values);

  useEffect(() => {
    setFieldValue('calculatedDurationInSeconds', playListDurationInSeconds);
  }, [playListDurationInSeconds, setFieldValue]);

  const { openItems, isAnyOpen, toggleAll, toggleItem } = useOpenItems();

  const headerActions: ActionData[] = [
    {
      label: 'Unassign All',
      icon: IconName.X,
      onActionSelected: () => setFieldValue('programs.nodes', []),
    },
  ];

  const headerAddActions: ActionData[] = allProviders.map((p) => ({
    label: `Select Source ${p.label}`,
    icon: IconName.Plus,
    onActionSelected: () => setProvider(p),
  }));

  const onHeaderToggleHandler = useCallback((): void => {
    isAnyOpen ? toggleAll(false) : toggleAll(true);
  }, [isAnyOpen, toggleAll]);

  const onToggleHandler = useCallback(
    (uuid: string, isOpen: boolean | null) => toggleItem(uuid, isOpen),
    [toggleItem],
  );

  const onProgramChangeHandler = (programAction: ProgramAction): void => {
    const { action, programIndex } = programAction;
    const parentField = 'programs';
    const field = `${parentField}.nodes`;

    const addProgram = async (data: ProgramEntity[]): Promise<void> => {
      setIsNewProgramLoading(true);

      let newPrograms: ProgramEntity[];
      try {
        newPrograms = await generateProgram(
          data,
          values?.programs?.nodes as ProgramsConnection['nodes'],
        );
        // remove station error if a program was successfully created
        onStationError(undefined);
        setFieldValue(field, [...programs, ...newPrograms]);
      } catch (error) {
        const stationError = ErrorTypeToStationError(error as ErrorType);
        onStationError(stationError);
      } finally {
        setIsNewProgramLoading(false);
      }
    };

    switch (action) {
      case 'ADD':
        addProgram(programAction.data);
        break;
      case 'REMOVE':
        setFieldValue(
          field,
          (values?.programs?.nodes ?? [])
            .filter((_, idx) => idx !== programIndex)
            .map((p, _idx) => ({ ...p, sortIndex: _idx })), // update all remain program `sortIndex` props
        );
        break;
      case 'REORDER':
        setFieldValue(
          field,
          rearrangeArray(
            values?.programs.nodes,
            programIndex,
            programAction.data.newPosition,
          ),
        );
        break;
      default:
        break;
    }
  };

  const onCuePointChangeHandler = (cuePointAction: CuePointAction): void => {
    const { action, programIndex, cuePointIndex } = cuePointAction;
    const field = getCuePointScheduleNodesField(programIndex, cuePointIndex);

    const addSchedule = (
      type: CuePointScheduleType,
      duration = 0,
      videoId: Scalars['UUID'] | null = null,
    ): void => {
      const cp: ProgramCuePoint | undefined = values?.programs.nodes[
        programIndex
      ].programCuePoints.nodes[cuePointIndex] as ProgramCuePoint;
      const cpsNodes = cp?.cuePointSchedules?.nodes ?? [];
      const lastSortIndex: number | undefined =
        cpsNodes[cpsNodes.length - 1]?.sortIndex;
      const schedule: NewSchedule = {
        durationInSeconds: duration,
        sortIndex: lastSortIndex !== undefined ? lastSortIndex + 1 : 0,
        type,
        videoId,
        programCuePointId: cp.id,
      };

      setFieldValue(field, [...cpsNodes, schedule]);
    };

    const addVideo = (
      lengthInSeconds: number,
      videoId: Scalars['UUID'],
    ): void => {
      addSchedule(CuePointScheduleType.Video, lengthInSeconds, videoId);
      setVideoSelect(undefined);
    };

    switch (action) {
      case 'UNASSIGN_ALL':
        setFieldValue(field, []);
        break;
      case 'ADD_AD_POD':
        addSchedule(CuePointScheduleType.AdPod);
        break;
      case 'ADD_VIDEO':
        setVideoSelect({ cuePointIndex, programIndex });
        break;
      case 'SELECT_VIDEO':
        addVideo(
          cuePointAction.data.lengthInSeconds as number,
          cuePointAction.data.id,
        );
        break;
      default:
        break;
    }
  };

  const onScheduleChangeHandler = (scheduleAction: ScheduleAction): void => {
    const { action, programIndex, cuePointIndex, scheduleIndex } =
      scheduleAction;
    const parentField = getCuePointScheduleNodesField(
      programIndex,
      cuePointIndex,
    );
    const field = `${parentField}[${scheduleIndex}]`;
    const program = values?.programs.nodes[programIndex];

    switch (action) {
      case 'UNASSIGN':
        setFieldValue(
          parentField,
          values?.programs.nodes[programIndex].programCuePoints.nodes[
            cuePointIndex
          ].cuePointSchedules.nodes.filter((_, i) => i !== scheduleIndex),
        );
        break;
      case 'DURATION_UPDATE':
        setFieldValue(
          `${field}.durationInSeconds`,
          scheduleAction.data.duration,
        );
        break;
      case 'REORDER':
        if (scheduleAction.data.newCuePointId !== undefined) {
          // move schedule to another cue point

          const cspChanges = moveCpsNode(program, {
            cuePointIndex,
            scheduleIndex,
            ...scheduleAction.data,
          });
          setFieldValue(
            getCuePointScheduleNodesField(
              programIndex,
              cspChanges.destinationCpsIndex,
            ),
            cspChanges.destinationCpsNodes,
          );
          setFieldValue(parentField, cspChanges.sourceCspNodes);
        } else {
          // reorder the same cue point schedule

          const newCspNodes = rearrangeArray(
            program.programCuePoints.nodes[cuePointIndex].cuePointSchedules
              .nodes,
            scheduleIndex,
            scheduleAction.data.newPosition,
          );

          setFieldValue(parentField, newCspNodes);
        }
        break;
      default:
        break;
    }
  };

  const onChangeHandler = (action: ProgramFormAction): void => {
    switch (action.type) {
      case 'PROGRAM':
        onProgramChangeHandler(action);
        break;
      case 'CUE_POINT':
        onCuePointChangeHandler(action);
        break;
      case 'SCHEDULE':
        onScheduleChangeHandler(action);
        break;
      default:
        break;
    }
  };

  const onProgramDragEnd = (result: DropResult): void => {
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

    onProgramChangeHandler({
      type: 'PROGRAM',
      action: 'REORDER',
      programIndex: source.index,
      data: {
        newPosition: destination.index,
      },
    });
  };

  return (
    <div className={classes.container}>
      <Header
        actions={headerActions}
        addActions={headerAddActions}
        isOpen={isAnyOpen}
        onToggleClick={onHeaderToggleHandler}
      />

      <DragDropContext onDragEnd={onProgramDragEnd}>
        {Boolean(programs.length) && (
          <Droppable droppableId={'programs'}>
            {(provided) => (
              <div
                className={classes.main}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {programs
                  .sort((a, b) => a.sortIndex - b.sortIndex)
                  .map((program, idx) => {
                    const trackId = program.id ?? program.trackId;
                    return (
                      <Program
                        key={trackId}
                        {...program}
                        resolver={
                          providerTypeMap?.[program?.entityType]
                            ?.detailsResolver
                        }
                        errors={
                          errors?.programs?.nodes?.[
                            idx
                          ] as FormikErrors<ProgramFormData>
                        }
                        ImagePreview={ImagePreview}
                        isOpen={openItems[trackId]}
                        onToggle={onToggleHandler}
                        onChange={(action) =>
                          onChangeHandler({ ...action, programIndex: idx })
                        }
                        sortIndex={program.sortIndex}
                      />
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        <Loader showLoader={isNewProgramLoading} height={50} width={200} />
      </DragDropContext>
      <EntityProvider
        provider={provider}
        setProvider={setProvider}
        onNewSelection={(selectedEntities) =>
          onProgramChangeHandler({
            type: 'PROGRAM',
            action: 'ADD',
            data: selectedEntities,
          } as ProgramAction)
        }
      />
      <ScheduleVideoExplorer
        isVideoSelectionShown={videoSelect !== undefined}
        setVideoSelect={setVideoSelect}
        VideoSelectExplorer={VideoSelectExplorer}
        onNewVideoSchedule={(newSchedule) => {
          onCuePointChangeHandler({
            type: 'CUE_POINT',
            action: 'SELECT_VIDEO',
            cuePointIndex: videoSelect?.cuePointIndex,
            programIndex: videoSelect?.programIndex,
            data: newSchedule,
          } as CuePointAction);
        }}
      />
    </div>
  );
};

/**
 * Returns the path to the cue point schedule nodes form field
 * `programs.nodes[${programIndex}].programCuePoints.nodes[${cuePontIndex}].cuePointSchedules.nodes`
 */
export const getCuePointScheduleNodesField = (
  programIndex: number,
  cuePontIndex: number,
): string =>
  `programs.nodes[${programIndex}].programCuePoints.nodes[${cuePontIndex}].cuePointSchedules.nodes`;

/**
 * Moves cue point schedule node to another cue point schedule
 * and updates the sort indexes of affected cue point schedules.
 * @returns
 */
export const moveCpsNode = (
  program: ProgramFormData,
  changes: Pick<ScheduleAction, 'cuePointIndex' | 'scheduleIndex'> &
    ScheduleReorderActionData,
): {
  sourceCspNodes: CpsNodes;
  destinationCpsNodes: CpsNodes;
  destinationCpsIndex: number;
} => {
  const { cuePointIndex, scheduleIndex, newPosition, newCuePointId } = changes;

  const cuePoint = program.programCuePoints.nodes[cuePointIndex];
  const cuePointSchedules = [...cuePoint.cuePointSchedules.nodes];

  const newCuePointIndex = program.programCuePoints.nodes.findIndex(
    (cp) => cp.id === newCuePointId,
  );
  const newCuePoint = program.programCuePoints.nodes[newCuePointIndex];
  const newCuePointSchedules = [...newCuePoint.cuePointSchedules.nodes];

  // remove schedule from source cue point
  const removedNodes = cuePointSchedules.splice(scheduleIndex, 1);

  // add schedule to destination cue pont in the specified position
  newCuePointSchedules.splice(newPosition, 0, ...removedNodes);

  const updateSortIndex = (
    schedules: CpsNodes,
    targetIndex: number,
  ): CpsNodes =>
    schedules.map((schedule, idx) => ({
      ...schedule,
      sortIndex: idx,
      programCuePointId:
        targetIndex === cuePointIndex ? cuePoint.id : newCuePoint.id,
    }));

  return {
    sourceCspNodes: updateSortIndex(cuePointSchedules, cuePointIndex),
    destinationCpsNodes: updateSortIndex(
      newCuePointSchedules,
      newCuePointIndex,
    ),
    destinationCpsIndex: newCuePointIndex,
  };
};

/**
 * Rearranges array items and updates the sortIndex property of each item.
 * @param array An array of items with a `sortIndex` property
 * @param currentIndex Current index of the item to be moved
 * @param newIndex New index of the item to be moved
 * @returns A new array with updated `sortIndex` properties
 */
export const rearrangeArray = <T extends { sortIndex: number }>(
  array: T[],
  currentIndex: number,
  newIndex: number,
): T[] => {
  const items = [...array];
  const removedItem = items.splice(currentIndex, 1);
  items.splice(newIndex, 0, ...removedItem);

  return items.map((s, idx) => ({
    ...s,
    sortIndex: idx,
  }));
};
