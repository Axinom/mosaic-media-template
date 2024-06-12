import { formatSecondsToTimestamp, Timestamp } from '@axinom/mosaic-ui';
import moment from 'moment';
import { useContext, useEffect } from 'react';
import {
  ProgramManagementFormData,
  ProgramProps,
} from '../ProgramManagement.types';
import { ProgramManagementContext } from '../ProgramManagementProvider/ProgramManagementProvider';

/**
 * Provides the follow:
 * playlist's total duration, start time, end time
 * Programs with calculated start time and end time
 * Also updates the metadata rendered by the info panel
 * */
export const useCalculatedTimes = (
  formData: ProgramManagementFormData,
): {
  readonly programs: ProgramProps[];
  readonly playListDurationInSeconds: number;
  readonly playListDuration: Timestamp;
  readonly playListEndTime: string;
  readonly playListStartTime: string;
} => {
  let calculatedPlayListDuration = 0;
  const entityTypeCounts = {};

  const startDateTime: Timestamp = formData?.startDateTime;

  const programs: ProgramProps[] = [];

  if (formData?.programs?.nodes.length) {
    const sortedByIndex = formData.programs.nodes.sort(
      (a, b) => a.sortIndex - b.sortIndex,
    );
    let previousProgramEndTime = moment
      .utc(startDateTime, moment.ISO_8601, true)
      .toISOString() as Timestamp;

    for (let i = 0; i < sortedByIndex.length; i++) {
      const program = sortedByIndex[i];
      let cumulativeTotalCPScheduleTime = 0;

      for (const cuePoint of program?.programCuePoints?.nodes ?? []) {
        // calculate the total of all cue point schedules for current program
        for (const cpSchedules of cuePoint?.cuePointSchedules?.nodes ?? []) {
          if (cpSchedules.durationInSeconds !== null) {
            cumulativeTotalCPScheduleTime += cpSchedules.durationInSeconds;
          }
        }
      }

      // total program duration
      const duration: number =
        typeof program.videoDurationInSeconds === 'number'
          ? program.videoDurationInSeconds + cumulativeTotalCPScheduleTime
          : 0 + cumulativeTotalCPScheduleTime;

      calculatedPlayListDuration += duration;

      if (!entityTypeCounts[program.entityType]) {
        entityTypeCounts[program.entityType] = 0;
      }
      entityTypeCounts[program.entityType] += 1;

      // program end time - calculated with total program duration
      const endTime = moment
        .utc(previousProgramEndTime, moment.ISO_8601, true)
        .add({ seconds: duration })
        .toISOString() as Timestamp;

      programs.push({
        ...program,
        startTime: previousProgramEndTime,
        endTime,
      } as ProgramProps);

      previousProgramEndTime = endTime;
    }
  }

  // Channel service only goes to up to the 5th decimal place for the 'calculatedDurationInSeconds' field
  const roundedCalculatedPlayListDuration = roundTo5thDecimal(
    calculatedPlayListDuration,
  );

  const playListDurationInSeconds = roundedCalculatedPlayListDuration;
  const playListDuration: Timestamp = formatSecondsToTimestamp(
    roundedCalculatedPlayListDuration,
  );
  const playListEndTime = moment(startDateTime, moment.ISO_8601, true)
    .add({ seconds: roundedCalculatedPlayListDuration })
    .locale(navigator.language)
    .format('LT');

  const playListStartTime = moment(
    formData?.startDateTime,
    moment.ISO_8601,
    true,
  )
    .locale(navigator.language)
    .format('LT');

  const { updateMetadata } = useContext(ProgramManagementContext);
  useEffect(() => {
    if (formData?.programs?.nodes !== undefined) {
      updateMetadata({
        playListDuration,
        playListEndTime,
        playListStartTime,
        entityTypeCounts,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return {
    programs,
    playListDurationInSeconds,
    playListDuration,
    playListEndTime,
    playListStartTime,
  } as const;
};

const roundTo5thDecimal = (num: number): number => {
  return Math.round(num * 100000) / 100000;
};
