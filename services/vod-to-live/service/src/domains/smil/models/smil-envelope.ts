export type SchemeIdUri = 'urn:scte:scte35:2013:xml';
export type EventStreamXmlns = 'urn:mpeg:dash:schema:mpd:2011';
export type SMILXmlns = 'http://www.w3.org/2001/SMIL20/Language';
export type SignalXmlns = 'http://www.scte.org/schemas/35/2016';

export type OutOfNetworkIndicator = 0 | 1;

/**
 * This interface model describes the SMIL (Synchronized Multimedia Integration Language) format,
 * which allows the creation of playlists for different combinations of files with varying bitrates.
 * The model is used to create live streams from VOD (Video-On-Demand) videos.
 */
export interface SMILEnvelope {
  smil: {
    '@xmlns': SMILXmlns;
    head: {
      meta: HeaderMetadata[];
    };
    body: {
      seq: Sequence;
    };
  };
}

/**
 * This describes an element of the SMIL envelope header.
 * The header includes information about how the SMIL should be processed,
 * as well as any other additional information associated with the SMIL.
 */
export interface HeaderMetadata {
  '@name': string;
  '@content': string;
}

/**
 * A SMIL container defines a sequence of timed media elements that play one after another.
 * This allows for the creation of playlists with multiple media types and timed events.
 */
export interface Sequence {
  par: Parallel[] | Parallel;
}

/**
 * SMIL parallel element defines a time grouping in which multiple audio and video files with different bitrates can be played back simultaneously.
 */
export interface Parallel extends ParallelReference {
  '@clipEnd'?: string;
  '@clipBegin'?: string;
  EventStream?: EventStream | undefined;
}
/**
 * SMIL element that refers to a video or audio file.
 */
export interface Reference {
  '@src': string;
}

/**
 * The SMIL element enables the insertion of timed metadata events,
 *  which can be used for ad insertions in live streams.
 */
export interface EventStream {
  '@xmlns': EventStreamXmlns;
  '@schemeIdUri': SchemeIdUri;
  Event: Event;
}

export interface ParallelReference {
  audio: Reference[];
  video: Reference[];
}

export interface Event {
  '@id'?: string;
  Signal: Signal;
}

export interface Signal {
  '@xmlns': SignalXmlns;
  SpliceInfoSection: SpliceInfoSection;
}

export interface SpliceInfoSection {
  SpliceInsert: SpliceInsert[];
}

export interface SpliceInsert {
  '@outOfNetworkIndicator': OutOfNetworkIndicator; // can be 0|1
  '@spliceImmediateFlag': number;
  '@spliceEventId'?: string;
  Program: unknown;
}
