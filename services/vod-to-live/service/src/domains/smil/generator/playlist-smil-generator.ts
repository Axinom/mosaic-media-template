import {
  DetailedVideo,
  PlaylistPublishedEvent,
  Program,
  ProgramCuePoint,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { CpixSettings } from '../../cpix';
import {
  createHeaderMetadata,
  createParallel,
  createSmilEnvelope,
  EventStream,
  HeaderMetadata,
  HeaderMetadataNames,
  OutOfNetworkIndicator,
  Parallel,
  ParallelReference,
  SMILEnvelope,
} from '../models';
import { SmilGenerator } from './smil-generator';
import {
  createAdPlaceholders,
  createPlaylistEventStream,
  videoToSmilParallelReferences,
} from './utils';

/**
 * Class to generate the SMIL Document from the playlist published event.
 * Should be instantiated for each new document generation.
 */
export class PlaylistSmilGenerator extends SmilGenerator<PlaylistPublishedEvent> {
  // Playlist level variable: indicates if the last playlist item was in network, or out.
  private lastOutOfNetworkIndicator: OutOfNetworkIndicator = 0;
  // Playlist level variable: unique indicator to mark event streams.
  private spliceEventId = 0;

  /**
   * Creates a unique event stream within the playlist.
   * @param outOfNetworkIndicator out of network indicator of the playlist item.
   * @param eventDuration duration of the event.
   * @returns Event stream if it is required, or undefined if event is not needed.
   */
  private createEventStreamInPlaylist = (
    outOfNetworkIndicator: OutOfNetworkIndicator,
    eventDuration: number,
  ): EventStream | undefined => {
    const playlistEvent = createPlaylistEventStream(
      outOfNetworkIndicator,
      this.lastOutOfNetworkIndicator,
      this.spliceEventId,
      eventDuration,
    );
    this.lastOutOfNetworkIndicator = playlistEvent.outOfNetworkIndicator;
    this.spliceEventId = playlistEvent.spliceEventId;
    return playlistEvent.eventStream;
  };

  private logger: Logger = new Logger({ context: 'PlaylistSmilGenerator' });
  private placeholderVideoParallel: ParallelReference | undefined;
  private placeholderVideoDuration: number | undefined | null;
  constructor(
    private drmSettings: CpixSettings,
    channelPlaceholderVideo?: DetailedVideo | undefined,
  ) {
    super();
    if (channelPlaceholderVideo) {
      this.placeholderVideoDuration =
        channelPlaceholderVideo.video_encoding.length_in_seconds;
      this.placeholderVideoParallel = videoToSmilParallelReferences(
        channelPlaceholderVideo,
      );
    }
  }
  generate(originalEvent: PlaylistPublishedEvent): SMILEnvelope {
    const parallels =
      originalEvent.programs
        ?.sort((p) => p.sort_index)
        ?.reduce((result, entry) => {
          return [...result, ...this.processProgram(entry)];
        }, new Array<Parallel>()) ?? [];

    return createSmilEnvelope(parallels, this.populateHeader(originalEvent));
  }
  private populateHeader(
    originalEvent: PlaylistPublishedEvent,
  ): HeaderMetadata[] {
    const headers = [
      createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
      createHeaderMetadata(
        HeaderMetadataNames.Vod2LiveStartTime,
        new Date(originalEvent.start_date_time).toISOString(),
      ),
      createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
      createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
      createHeaderMetadata(
        HeaderMetadataNames.MosaicPlaylistId,
        originalEvent.id,
      ),
    ];
    if (this.drmSettings.decryptionCpixFile) {
      headers.push(
        createHeaderMetadata(
          HeaderMetadataNames.DecryptCpix,
          this.drmSettings.decryptionCpixFile,
        ),
      );
    }
    if (this.drmSettings.encryptionDashCpixFile) {
      headers.push(
        createHeaderMetadata(
          HeaderMetadataNames.MpdCpix,
          this.drmSettings.encryptionDashCpixFile,
        ),
      );
    }
    if (this.drmSettings.encryptionHlsCpixFile) {
      headers.push(
        createHeaderMetadata(
          HeaderMetadataNames.HlsCpix,
          this.drmSettings.encryptionHlsCpixFile,
        ),
      );
    }
    return headers;
  }

  /**
   * Transform playlist program into SMIL parallels with the insertions of ads.
   * @param program Playlist program (VOD video).
   * @returns - SMIL parallels in order they should be played in.
   */
  private processProgram(program: Program): Parallel[] {
    const parallels: Parallel[] = [];
    // getting audio and video streams of the video
    const programReference = videoToSmilParallelReferences(program.video);

    const preCuePoint = program.program_cue_points?.filter(
      (cp) => cp.type === 'PRE',
    )[0];
    const midCuePoints =
      program.program_cue_points
        ?.filter((cp) => cp.type === 'MID')
        .sort((cp1, cp2) => {
          return (
            (cp1.time_in_seconds != null ? cp1.time_in_seconds : 0) -
            (cp2.time_in_seconds != null ? cp2.time_in_seconds : 0)
          );
        }) ?? [];
    const postCuePoint = program.program_cue_points?.filter(
      (cp) => cp.type === 'POST',
    )[0];

    // adding PRE cue point
    if (preCuePoint) {
      parallels.push(...this.processCuePoint(preCuePoint));
    }

    //cutting program video for MID cue points
    const splicedWithCuePoints: {
      parallels: Parallel[];
      lastSpliceTimeInSeconds: number;
    } =
      midCuePoints.reduce(
        (result, midCuePoint) => {
          if (midCuePoint.time_in_seconds) {
            result.parallels.push(
              createParallel(
                programReference,
                this.createEventStreamInPlaylist(0, 0),
                result.lastSpliceTimeInSeconds === 0
                  ? undefined
                  : result.lastSpliceTimeInSeconds,
                midCuePoint.time_in_seconds,
              ),
            );
            result.lastSpliceTimeInSeconds = midCuePoint.time_in_seconds;
            result.parallels.push(...this.processCuePoint(midCuePoint));
          } else {
            this.logger.warn({
              message: `MID cue point '${midCuePoint.id}' is missing insertion time. Cue point is skipped! `,
              details: {
                programId: program.id,
                programTitle: program.title,
                programType: program.entity_type,
                cuePoint: midCuePoint,
              },
            });
          }
          return result;
        },
        {
          parallels: new Array<Parallel>(),
          lastSpliceTimeInSeconds: 0,
        },
      ) ?? [];

    parallels.push(...splicedWithCuePoints.parallels);

    //Program is played from the last MID cue point, or whole program if there is no MID cue points
    parallels.push(
      createParallel(
        programReference,
        this.createEventStreamInPlaylist(0, 0),
        splicedWithCuePoints.lastSpliceTimeInSeconds === 0
          ? undefined
          : splicedWithCuePoints.lastSpliceTimeInSeconds,
      ),
    );

    // adding POST cue point
    if (postCuePoint) {
      parallels.push(...this.processCuePoint(postCuePoint));
    }

    return parallels;
  }

  /**
   * Transform playlist cue point schedules into SMIL parallels.
   * @param cuePoint - Cue Point of the program.
   * @returns - SMIL parallels in order they should be played in.
   */
  private processCuePoint = (cuePoint: ProgramCuePoint): Parallel[] => {
    return (
      cuePoint.schedules
        ?.sort((s1, s2) => {
          // sorting just to be sure, that cue points are in correct order
          return s1.sort_index - s2.sort_index;
        })
        .reduce((result, entry) => {
          if (entry.type === 'AD_POD') {
            if (
              this.placeholderVideoParallel &&
              this.placeholderVideoDuration
            ) {
              return [
                ...result,
                ...createAdPlaceholders(
                  entry,
                  this.placeholderVideoParallel,
                  this.placeholderVideoDuration,
                  this.createEventStreamInPlaylist(
                    1,
                    entry.duration_in_seconds,
                  ),
                ),
              ];
            } else {
              return [
                ...result,
                createParallel(
                  { audio: [], video: [] },
                  this.createEventStreamInPlaylist(
                    1,
                    entry.duration_in_seconds,
                  ),
                  undefined,
                  entry.duration_in_seconds,
                ),
              ];
            }
          } else {
            if (entry.video) {
              return [
                ...result,
                createParallel(
                  videoToSmilParallelReferences(entry.video),
                  this.createEventStreamInPlaylist(0, 0),
                  undefined,
                  entry.duration_in_seconds,
                ),
              ];
            }
            return result;
          }
        }, new Array<Parallel>()) ?? []
    );
  };
}
