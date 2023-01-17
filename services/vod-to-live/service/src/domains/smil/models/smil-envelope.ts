export type SchemeIdUri = 'urn:scte:scte35:2013:xml';
export type EventStreamXmlns = 'urn:mpeg:dash:schema:mpd:2011';
export type SMILXmlns = 'http://www.w3.org/2001/SMIL20/Language';
export type SignalXmlns = 'http://www.scte.org/schemas/35/2016';

export type OutOfNetworkIndicator = 0 | 1;

/**
 * Interface model describing SMIL (Synchronized Multimedia Integration Language) format.
 * Allows to make playlists for different combinations of files with different bitrates.
 * This model can be used to create Live streams from VOD videos.
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
 * Describes element of the SMIL envelope header.
 * Header contains information of how the SMIL should be processed and any other additional information associated with SMIL.
 */
export interface HeaderMetadata {
  '@name': string;
  '@content': string;
}

/**
 * SMIL container defines a sequence of elements in which programs play one after the other.
 */
export interface Sequence {
  par: Parallel[] | Parallel;
}

/**
 * SMIL parallel, defines a simple time grouping in which multiple audio and video(with different bitrates) may play back at the same time.
 */
export interface Parallel extends ParallelReference {
  '@clipEnd'?: string;
  '@clipBegin'?: string;
  EventStream?: EventStream | undefined;
}
/**
 * SMIL reference to the video, or audio file.
 */
export interface Reference {
  '@src': string;
}

/**
 * SMIL element allowing to add timed metadata events.
 * Allows insertions of ads in Live streams.
 */
export interface EventStream {
  '@xmlns': EventStreamXmlns;
  '@schemeIdUri': SchemeIdUri;
  '@timescale': string;
  Event: Event;
}

export interface ParallelReference {
  audio: Reference[];
  video: Reference[];
}

export interface Event {
  '@id'?: string;
  '@presentationTime': string;
  '@duration': string;
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
  '@outOfNetworkIndicator': OutOfNetworkIndicator; //can be 0|1
  '@spliceImmediateFlag': number;
  '@spliceEventId'?: string;
  Program: unknown;
}
