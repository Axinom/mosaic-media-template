import { CuePointSchedule, DetailedVideo } from '@axinom/mosaic-messages';
import {
  createEventStream,
  createParallel,
  createReference,
  EventStream,
  OutOfNetworkIndicator,
  Parallel,
  ParallelReference,
} from '../models';

/**
 * Helper interface for generating the event streams within the Playlist context.
 */
export interface PlaylistEventStream {
  eventStream: EventStream | undefined;
  outOfNetworkIndicator: OutOfNetworkIndicator;
  spliceEventId: number;
}

/**
 * Creates a new event stream within the playlist with a unique identifier.
 * @param outOfNetworkIndicator: the out-of-network indicator of the playlist item.
 * @param previousOutOfNetworkIndicator: the out-of-network indicator of the previous playlist item.
 * @param previousSpliceEventId: the splice event ID of the previous playlist item.
 * @return An object containing the calculated out-of-network indicator, splice identifier, and EventStream if required.
 */
export const createPlaylistEventStream = (
  outOfNetworkIndicator: OutOfNetworkIndicator,
  previousOutOfNetworkIndicator: OutOfNetworkIndicator,
  previousSpliceEventId: number,
): PlaylistEventStream => {
  let spliceEventId = previousSpliceEventId;
  // event not needed if new OONI matches last OONI
  if (previousOutOfNetworkIndicator === outOfNetworkIndicator) {
    return {
      eventStream: undefined,
      outOfNetworkIndicator,
      spliceEventId,
    };
  }
  // new spliceEventId is generated, if playlist item jumps out of the network.
  if (previousOutOfNetworkIndicator === 0 && outOfNetworkIndicator === 1) {
    spliceEventId++;
  }
  return {
    eventStream: createEventStream(outOfNetworkIndicator, `${spliceEventId}`),
    outOfNetworkIndicator,
    spliceEventId,
  };
};

/**
 * Populates the `AD_POD` schedule with a placeholder video
 * that can be cut short or looped multiple times to fill
 * the requested duration of the AD_POD.
 * @param schedule cue point schedule of the playlist's item.
 * @param parallel SMIL parallel for the Ad Placeholder video.
 * @param placeholderLength length of the Ad Placeholder video.
 * @param eventStream SMIL event stream.
 */
export const createAdPlaceholders = (
  schedule: CuePointSchedule,
  parallel: ParallelReference,
  placeholderLength: number,
  eventStream: EventStream | undefined,
): Parallel[] => {
  const adPlaceholderParallels: Parallel[] = [];
  if (schedule.type !== 'AD_POD') {
    return adPlaceholderParallels;
  }

  let adEventStream = eventStream;
  const adPodDuration = schedule.duration_in_seconds;
  const { quotient, remainder } = determineIntegerDivisionAndRemainder(
    adPodDuration,
    placeholderLength,
  );

  for (let i = 0; i < quotient; i++) {
    // ad parallels should always have the end-time defined, for proper ad time calculation in HLS manifest
    adPlaceholderParallels.push(
      createParallel(parallel, adEventStream, undefined, placeholderLength),
    );
    // The event stream element must be added only for the first ad placeholder
    adEventStream = undefined;
  }

  if (remainder > 0) {
    adPlaceholderParallels.push(
      createParallel(parallel, adEventStream, undefined, remainder),
    );
  }
  return adPlaceholderParallels;
};

export const determineIntegerDivisionAndRemainder = (
  number: number,
  divisor: number,
): { quotient: number; remainder: number } => {
  if (divisor === 0) {
    return {
      quotient: 0,
      remainder: 0,
    };
  }
  return {
    quotient: Math.floor(number / divisor),
    remainder: number % divisor,
  };
};

/**
 * Transforms DetailedVideo object into SMIL parallels.
 * @param video - video object to transform to parallels.
 */
export const videoToSmilParallelReferences = (
  video: DetailedVideo,
  formats: StreamParams[],
): ParallelReference => {
  const parallelReference: ParallelReference = { audio: [], video: [] };
  const videoEncoding = video.video_encoding;
  if (videoEncoding.dash_manifest_path && videoEncoding.output_location) {
    const basePath =
      videoEncoding.dash_manifest_path.substring(
        0,
        videoEncoding.dash_manifest_path.indexOf(
          videoEncoding.output_location,
        ) + videoEncoding.output_location.length,
      ) + '/';
    const streamsForParallel = videoEncoding.video_streams?.filter(
      (vs) =>
        vs.format === 'CMAF' &&
        vs.file &&
        (vs.type === 'AUDIO' || vs.type === 'VIDEO'),
    );
    for (const stream of streamsForParallel) {
      if (stream.file) {
        const referenceToStreamFile = createReference(
          new URL(stream.file, basePath).toString(),
        );
        if (stream.type === 'AUDIO') {
          parallelReference.audio.push(referenceToStreamFile);
        }
        if (
          stream.type === 'VIDEO' &&
          formats.find(
            (f) =>
              f.bitrate_in_kbps === stream.bitrate_in_kbps &&
              f.height === stream.height &&
              f.width === stream.width &&
              f.frame_rate === stream.frame_rate,
          )
        ) {
          parallelReference.video.push(referenceToStreamFile);
        }
      }
    }
  }
  return parallelReference;
};

export interface StreamParams {
  width: number | undefined | null;
  height: number | undefined | null;
  bitrate_in_kbps: number | undefined | null;
  frame_rate: number | undefined | null;
}

/**
 *  Gets a list of video stream parameters that are shared across all videos.
 * @param videos - list of videos, where to find shared stream formats.
 * @returns - list of stream parameters, shared by all videos.
 */
export const extractSharedVideoStreamFormats = (
  videos: DetailedVideo[],
): StreamParams[] => {
  const videoStreams =
    videos.reduce((result, entry) => {
      const streams = entry.video_encoding.video_streams
        .filter((x) => x.type === 'VIDEO')
        .map((vs) => {
          return {
            width: vs.width,
            height: vs.height,
            bitrate_in_kbps: vs.bitrate_in_kbps,
            frame_rate: vs.frame_rate,
          };
        });
      return [...result, streams];
    }, new Array<StreamParams[]>()) ?? new Array<StreamParams[]>();

  if (videoStreams.length > 0) {
    return videoStreams.reduce((join, current) =>
      join.filter((el) =>
        current.find(
          (c) =>
            c.height === el.height &&
            c.width === el.width &&
            c.bitrate_in_kbps === el.bitrate_in_kbps &&
            c.frame_rate === el.frame_rate,
        ),
      ),
    );
  } else {
    return [];
  }
};
