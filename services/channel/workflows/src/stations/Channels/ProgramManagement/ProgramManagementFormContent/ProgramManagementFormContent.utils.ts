import {
  CpsNodes,
  ProgramFormData,
  ScheduleAction,
  ScheduleReorderActionData,
} from '../ProgramManagement.types';

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
 * Moves a cue point schedule node to another cue point and updates the sort
 * indexes of both affected cue point schedules.
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

  const removedNodes = cuePointSchedules.splice(scheduleIndex, 1);
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

/** Rearranges array items and updates every item's sort index. */
export const rearrangeArray = <T extends { sortIndex: number }>(
  array: T[],
  currentIndex: number,
  newIndex: number,
): T[] => {
  const items = [...array];
  const removedItem = items.splice(currentIndex, 1);
  items.splice(newIndex, 0, ...removedItem);

  return items.map((item, sortIndex) => ({
    ...item,
    sortIndex,
  }));
};
