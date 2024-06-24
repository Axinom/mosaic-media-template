import {
  EncodingState,
  getVideoCuePointsData,
  VideoData,
} from '@axinom/mosaic-managed-workflow-integration';
import { StationError } from '@axinom/mosaic-ui';
import { v4 } from 'uuid';
import {
  ProgramBreakType,
  ProgramCuePoint,
  ProgramsConnection,
  Scalars,
} from '../../../../generated/graphql';
import { NewProgram, ProgramEntity } from '../ProgramManagement.types';

interface ProgramCuePointMid {
  type: ProgramBreakType.Mid;
  videoCuePointId: Scalars['UUID'];
  timeInSeconds: number;
}
interface ProgramCuePointPREorPOST {
  type: ProgramBreakType.Pre | ProgramBreakType.Post;
  videoCuePointId: null;
  timeInSeconds: null;
}

type ProgramCuePointType = ProgramCuePointMid | ProgramCuePointPREorPOST;

type NewCuePointNode = Pick<ProgramCuePoint, 'value' | 'videoCuePointId'> &
  ProgramCuePointType;

const filteredCuePointTypeKeys: string[] = ['AD_SPOT'];

// Generates a new program with the required cue points and metadata
export const generateProgram = async (
  newPrograms: ProgramEntity[],
  currentNodes: ProgramsConnection['nodes'] = [],
): Promise<NewProgram[]> => {
  const currentPrograms = currentNodes ?? [];

  const videoIds: string[] = newPrograms.map((programItem) => {
    // check if entity's video has been assigned
    if (!programItem.videoId) {
      throw createInvalidVideoError(programItem);
    }
    return programItem.videoId;
  });

  // fetch the video's cue points and duration from the video service
  const data = await getVideoCuePointsData(videoIds, filteredCuePointTypeKeys);

  // Find the maximum sortIndex in the currentPrograms array
  const maxSortIndex = currentPrograms.reduce((maxIndex, program) => {
    return program.sortIndex > maxIndex ? program.sortIndex : maxIndex;
  }, -1); // Start with -1 to handle an empty currentPrograms array

  return newPrograms.map((newProgram, index) => {
    const { title, entityId, entityType, imageId, videoId } = newProgram;

    const video = data.find((video) => video.id === videoId);

    // check if the video fetched from the video service has a valid duration (lengthInSeconds) and Ready state
    if (
      !video ||
      typeof video.lengthInSeconds !== 'number' ||
      video.encodingState !== EncodingState.Ready
    ) {
      throw createInvalidVideoDurationError(video);
    }

    const midCuePoints: NewCuePointNode[] = (video.cuePoints?.nodes ?? []).map(
      ({ id, timeInSeconds }) => ({
        value: 'MID-ROLL',
        videoCuePointId: id,
        type: ProgramBreakType.Mid,
        timeInSeconds,
      }),
    );

    return {
      trackId: v4(),
      title,
      sortIndex: maxSortIndex + index + 1,
      entityId,
      entityType,
      imageId,
      videoDurationInSeconds: video.lengthInSeconds as number,
      videoId,
      programCuePoints: {
        nodes: [
          {
            value: 'PRE-ROLL',
            videoCuePointId: null,
            type: ProgramBreakType.Pre,
            timeInSeconds: null,
          },
          ...midCuePoints.sort(
            (a, b) => (a.timeInSeconds as number) - (b.timeInSeconds as number),
          ),
          {
            value: 'POST-ROLL',
            videoCuePointId: null,
            type: ProgramBreakType.Post,
            timeInSeconds: null,
          },
        ],
      },
    };
  });
};

function createInvalidVideoError(programItem: ProgramEntity): StationError {
  const { title, entityId, entityType, imageId, videoId } = programItem;
  return {
    title: `Invalid video. Please ensure a video has been assigned to the entity.`,
    body: { title, entityId, entityType, imageId, videoId },
  };
}

function createInvalidVideoDurationError(video?: VideoData): StationError {
  return {
    title: `Invalid video. Please ensure the video has a duration and that the encoding state is 'Ready.'`,
    body: video,
  };
}
