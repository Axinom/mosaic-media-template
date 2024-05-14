import { FetchResult } from '@apollo/client';
import {
  CuePointScheduleType,
  ProgramBreakType,
  Scalars,
  UpdateProgramCuePointPayload,
} from '../../../../generated/graphql';
import {
  CuePointSchedulePayLoad,
  ProgramCuePointProps,
  ProgramManagementFormData as FormData,
} from '../ProgramManagement.types';

type CuePointPayloadType =
  | 'CreateProgramCuePointPayload'
  | 'UpdateProgramCuePointPayload'
  | 'DeleteProgramCuePointPayload';

type CuePointForMapping = Pick<
  ProgramCuePointProps,
  'id' | 'type' | 'timeInSeconds'
> & {
  program: {
    sortIndex: Scalars['UUID'];
  };
};
interface CPData {
  programCuePoint: CuePointForMapping;
  __typename: CuePointPayloadType;
}

type Payloads = [CuePointSchedulePayLoad[], CuePointSchedulePayLoad[]];

export const addCuePointIdsToCuePointsSchedules = (
  formData: FormData,
  cuePointResults?: FetchResult<UpdateProgramCuePointPayload>,
): Payloads => {
  const adSchedules: CuePointSchedulePayLoad[] = [];
  const videoSchedules: CuePointSchedulePayLoad[] = [];
  const cuePointData: CPData[] = Object.values(
    cuePointResults?.data ??
      ({} as {
        data: CPData;
      }),
  );

  // Remove any delete operations as they are handled when the program is deleted
  const cpResults: CPData[] = cuePointData.filter(
    (data) => data.__typename !== 'DeleteProgramCuePointPayload',
  );

  for (const pNode of formData?.programs?.nodes ?? []) {
    for (const cpNode of pNode?.programCuePoints?.nodes ?? []) {
      for (const cpsNode of cpNode?.cuePointSchedules?.nodes ?? []) {
        // TODO: cue point schedules being dragged to another cue point should update their programCuePointId
        // Just add schedules that already have a programCuePointId assigned
        if (cpsNode.programCuePointId) {
          cpsNode.type === CuePointScheduleType.AdPod
            ? adSchedules.push(cpsNode)
            : videoSchedules.push(cpsNode);
        } else {
          for (const { __typename, programCuePoint } of cpResults as CPData[]) {
            // Only map cue point ids if the current program sortIndex matches the returned program sortIndex on the cue point
            if (pNode.sortIndex === programCuePoint.program.sortIndex) {
              if (__typename === 'CreateProgramCuePointPayload') {
                // add PRE cue point schedules
                if (
                  programCuePoint.type === ProgramBreakType.Pre &&
                  cpNode.type === ProgramBreakType.Pre
                ) {
                  pushScheduleToType(
                    cpsNode,
                    programCuePoint.id,
                    adSchedules,
                    videoSchedules,
                  );
                  continue;
                }
                // add POST cue point schedules
                if (
                  programCuePoint.type === ProgramBreakType.Post &&
                  cpNode.type === ProgramBreakType.Post
                ) {
                  pushScheduleToType(
                    cpsNode,
                    programCuePoint.id,
                    adSchedules,
                    videoSchedules,
                  );
                  continue;
                }
                // add MID cue point schedules using timeInSecond which should be unique
                if (
                  programCuePoint.type === ProgramBreakType.Mid &&
                  cpNode.type === ProgramBreakType.Mid &&
                  programCuePoint.timeInSeconds === cpNode.timeInSeconds
                ) {
                  pushScheduleToType(
                    cpsNode,
                    programCuePoint.id,
                    adSchedules,
                    videoSchedules,
                  );
                  continue;
                }
              }
            }
          }
        }
      }
    }
  }

  return [adSchedules, videoSchedules];
};

const pushScheduleToType = (
  cps: CuePointSchedulePayLoad,
  programId: Scalars['UUID'],
  adSchedules: CuePointSchedulePayLoad[],
  videoSchedules: CuePointSchedulePayLoad[],
): void => {
  const schedule = {
    ...cps,
    programCuePointId: programId,
  };
  cps.type === CuePointScheduleType.AdPod
    ? adSchedules.push(schedule)
    : videoSchedules.push(schedule);
};
