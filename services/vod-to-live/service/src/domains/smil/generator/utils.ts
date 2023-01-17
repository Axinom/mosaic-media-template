import { CuePointSchedule, DetailedVideo } from '@axinom/mosaic-messages';
import { create } from 'xmlbuilder2';
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
 * Creates a unique event stream within the playlist.
 * @param outOfNetworkIndicator  out of network indicator of the playlist item.
 * @param previousOutOfNetworkIndicator out of network indicator of the previous playlist item.
 * @param previousSpliceEventId splice event id of the previous playlist item.
 * @param eventDuration duration of the event.
 * @returns An object containing calculated OONI indicator, splice identifier and EventStream, if required.
 */
export const createPlaylistEventStream = (
  outOfNetworkIndicator: OutOfNetworkIndicator,
  previousOutOfNetworkIndicator: OutOfNetworkIndicator,
  previousSpliceEventId: number,
  eventDuration: number,
): PlaylistEventStream => {
  let spliceEventId = previousSpliceEventId;
  //event not needed if new OONI matches last OONI
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
    eventStream: createEventStream(
      outOfNetworkIndicator,
      eventDuration,
      `${spliceEventId}`,
    ),
    outOfNetworkIndicator,
    spliceEventId,
  };
};

/**
 * Fills the `AD_POD` schedule with placeholder video.
 * The placeholder video will be cut short,
 * or looped multiple times to fill the requested `AD_POD` duration.
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

  // determine how many times the placeholder will fit into schedule fully
  const quotient = Math.floor(adPodDuration / placeholderLength);
  // determine if "shortened" placeholder video required to fill the duration of schedule
  const remainder = adPodDuration % placeholderLength;

  for (let i = 0; i < quotient; i++) {
    adPlaceholderParallels.push(createParallel(parallel, adEventStream));
    //The event stream element must be added only for the first ad placeholder
    adEventStream = undefined;
  }

  if (remainder > 0) {
    adPlaceholderParallels.push(
      createParallel(parallel, adEventStream, undefined, remainder),
    );
  }
  return adPlaceholderParallels;
};

/**
 * Transforms DetailedVideo object into SMIL parallels.
 * @param video - video object to transform to parallels.
 */
export const videoToSmilParallelReferences = (
  video: DetailedVideo,
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
        if (stream.type === 'VIDEO') {
          parallelReference.video.push(referenceToStreamFile);
        }
      }
    }
  }
  return parallelReference;
};

/**
 * Converts any object to string XML representation.
 * @param expandedObject - object to convert to XML.
 * @returns- string containing XML of the object.
 */
export const convertObjectToXml = (
  expandedObject:
    | {
        [key: string]: any;
      }
    | Map<string, any>
    | any[]
    | Set<any>
    | ((...args: any) => any),
): string => {
  return create({ version: '1.0', encoding: 'UTF-8' }, expandedObject).end({
    prettyPrint: true,
    spaceBeforeSlash: true,
  });
};
