import { SECOND_IN_MILLISECONDS } from '../../../common';
import {
  Event,
  EventStream,
  HeaderMetadata,
  OutOfNetworkIndicator,
  Parallel,
  ParallelReference,
  Reference,
  Signal,
  SMILEnvelope,
  SpliceInfoSection,
  SpliceInsert,
} from './smil-envelope';

export const createParallel = (
  reference: ParallelReference,
  eventStream?: EventStream | undefined,
  clipBegin?: number | undefined,
  clipEnd?: number | undefined,
): Parallel => ({
  '@clipBegin': transformSecondsToWallClock(clipBegin),
  '@clipEnd': transformSecondsToWallClock(clipEnd),
  audio: reference.audio,
  video: reference.video,
  EventStream: eventStream,
});

export const transformSecondsToWallClock = (
  seconds?: number | undefined,
): string | undefined => {
  if (!seconds) {
    return undefined;
  }
  const date = new Date(seconds * SECOND_IN_MILLISECONDS);
  return `wallclock(${date.toISOString()})`;
};

export const createSmilEnvelope = (
  parallels: Parallel[],
  headerMetadata: HeaderMetadata[],
): SMILEnvelope => ({
  smil: {
    '@xmlns': 'http://www.w3.org/2001/SMIL20/Language',
    head: {
      meta: headerMetadata,
    },
    body: {
      seq: {
        par: parallels,
      },
    },
  },
});

export const createHeaderMetadata = (
  name: string,
  content: string | boolean | number | undefined | null,
): HeaderMetadata => {
  return {
    '@name': name,
    '@content': `${content}`,
  };
};

export const createEventStream = (
  outOfNetworkIndicator: OutOfNetworkIndicator,
  eventDuration: number,
  spliceEventId?: string | undefined,
): EventStream => ({
  '@xmlns': 'urn:mpeg:dash:schema:mpd:2011',
  '@schemeIdUri': 'urn:scte:scte35:2013:xml',
  // 10000000 is the default (source: https://learn.microsoft.com/en-us/azure/media-services/previous/media-services-specifications-live-timed-metadata)
  '@timescale': '10000000',
  Event: createEvent(outOfNetworkIndicator, eventDuration, spliceEventId),
});

export const createReference = (source: string): Reference => ({
  '@src': source,
});

const createEvent = (
  outOfNetworkIndicator: OutOfNetworkIndicator,
  eventDuration: number,
  spliceEventId?: string | undefined,
): Event => ({
  '@id': spliceEventId,
  '@duration': `${eventDuration}`,
  '@presentationTime': '0',
  Signal: createSignal(outOfNetworkIndicator, spliceEventId),
});

const createSignal = (
  outOfNetworkIndicator: OutOfNetworkIndicator,
  spliceEventId?: string | undefined,
): Signal => ({
  '@xmlns': 'http://www.scte.org/schemas/35/2016',
  SpliceInfoSection: createSpliceInfoSection(
    outOfNetworkIndicator,
    spliceEventId,
  ),
});

const createSpliceInfoSection = (
  outOfNetworkIndicator: OutOfNetworkIndicator,
  spliceEventId?: string | undefined,
): SpliceInfoSection => ({
  SpliceInsert: [createSpliceInsert(outOfNetworkIndicator, spliceEventId)],
});

const createSpliceInsert = (
  outOfNetworkIndicator: OutOfNetworkIndicator,
  spliceEventId?: string | undefined,
): SpliceInsert => ({
  '@spliceEventId': spliceEventId,
  '@outOfNetworkIndicator': outOfNetworkIndicator,
  '@spliceImmediateFlag': 1, // default value is 1
  Program: {},
});
