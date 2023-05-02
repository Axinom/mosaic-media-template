import {
  DetailedVideo,
  PlaylistPublishedEvent,
  Program,
  ProgramCuePoint,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { Config, DAY_IN_SECONDS } from '../../../common';
import { CpixSettings } from '../../cpix';
import { getPlaylistDurationInSeconds } from '../../utils';
import {
  createHeaderMetadata,
  createParallel,
  createSmilEnvelope,
  EventStream,
  getDefaultMetadataHeaders,
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
  determineIntegerDivisionAndRemainder,
  extractSharedVideoStreamFormats,
  StreamParams,
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
  ): EventStream | undefined => {
    const playlistEvent = createPlaylistEventStream(
      outOfNetworkIndicator,
      this.lastOutOfNetworkIndicator,
      this.spliceEventId,
    );
    this.lastOutOfNetworkIndicator = playlistEvent.outOfNetworkIndicator;
    this.spliceEventId = playlistEvent.spliceEventId;
    return playlistEvent.eventStream;
  };

  private logger: Logger = new Logger({ context: 'PlaylistSmilGenerator' });
  private placeholderVideoParallel!: ParallelReference;
  private placeholderVideoDuration!: number;
  private mutualStreams!: StreamParams[];
  private placeholderVideo!: DetailedVideo;
  constructor(
    private drmSettings: CpixSettings,
    private config: Config,
    channelPlaceholderVideo?: DetailedVideo | undefined,
  ) {
    super();
    if (
      channelPlaceholderVideo &&
      channelPlaceholderVideo.video_encoding.length_in_seconds
    ) {
      this.placeholderVideoDuration =
        channelPlaceholderVideo.video_encoding.length_in_seconds;
      this.placeholderVideo = channelPlaceholderVideo;
    } else {
      throw new MosaicError({
        message: 'Placeholder video is not provided.',
        code: 'PLACEHOLDER_VIDEO_IS_MISSING',
      });
    }
  }
  generate(originalEvent: PlaylistPublishedEvent): SMILEnvelope {
    const videos =
      originalEvent.programs?.reduce((result, entry) => {
        let scheduleResult: DetailedVideo[] = [];
        if (entry.program_cue_points) {
          scheduleResult = entry.program_cue_points
            .flatMap((cp) => cp.schedules)
            .reduce((result, schedule) => {
              if (schedule?.video) {
                return [...result, schedule.video];
              }
              return result;
            }, new Array<DetailedVideo>());
        }
        return [...result, entry.video, ...scheduleResult];
      }, new Array<DetailedVideo>()) ?? [];
    this.mutualStreams = extractSharedVideoStreamFormats([
      this.placeholderVideo,
      ...videos,
    ]);
    this.placeholderVideoParallel = videoToSmilParallelReferences(
      this.placeholderVideo,
      this.mutualStreams,
    );
    const parallels =
      originalEvent.programs
        ?.sort((p) => p.sort_index)
        ?.reduce((result, entry) => {
          return [...result, ...this.processProgram(entry)];
        }, new Array<Parallel>()) ?? [];

    // if playlist prolongation flag is set to true,
    // playlist duration will be extended to hit 24 hours mark, if it doesn't hit it already
    if (this.config.prolongPlaylistTo24Hours) {
      parallels.push(
        ...this.tryProlongatePlaylist(
          originalEvent.start_date_time,
          originalEvent.end_date_time,
        ),
      );
    }

    // if first and last parallels are `out of network`
    // come back 'in network' parallel should be added for proper looping in USP
    const firstParallel = parallels[0];
    const lastParallel = parallels.slice(-1)[0];
    if (
      lastParallel?.EventStream?.Event?.Signal?.SpliceInfoSection?.SpliceInsert?.slice(
        -1,
      )[0]?.['@outOfNetworkIndicator'] === 1 &&
      firstParallel?.EventStream?.Event?.Signal?.SpliceInfoSection?.SpliceInsert?.slice(
        -1,
      )[0]?.['@outOfNetworkIndicator'] === 1
    ) {
      parallels.push(
        createParallel(
          { video: [], audio: [] },
          this.createEventStreamInPlaylist(0),
        ),
      );
    }

    return createSmilEnvelope(parallels, this.populateHeader(originalEvent));
  }
  private populateHeader(
    originalEvent: PlaylistPublishedEvent,
  ): HeaderMetadata[] {
    const headers = [
      ...getDefaultMetadataHeaders(new Date(originalEvent.start_date_time)),
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
    const programReference = videoToSmilParallelReferences(
      program.video,
      this.mutualStreams,
    );

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
                this.createEventStreamInPlaylist(0),
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
        this.createEventStreamInPlaylist(0),
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
                  this.createEventStreamInPlaylist(1),
                ),
              ];
            } else {
              return [
                ...result,
                createParallel(
                  { audio: [], video: [] },
                  this.createEventStreamInPlaylist(1),
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
                  videoToSmilParallelReferences(
                    entry.video,
                    this.mutualStreams,
                  ),
                  this.createEventStreamInPlaylist(0),
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

  /**
   * Creates additional parallels, if playlist duration is below 24 hours.
   * @param playlistStartDate - start date of the playlist.
   * @param playlistEndDate - end date of the playlist.
   * @returns list of the parallels for playlist prolongation.
   */
  private tryProlongatePlaylist = (
    playlistStartDate: string,
    playlistEndDate: string,
  ): Parallel[] => {
    const parallels: Parallel[] = [];
    const playlistDurationInSeconds = getPlaylistDurationInSeconds(
      playlistStartDate,
      playlistEndDate,
    );
    const prolongedPlaylistDurationInSeconds =
      DAY_IN_SECONDS + this.config.catchUpDurationInMinutes * 60;

    // determine if playlist duration is under 24 hours
    if (playlistDurationInSeconds < DAY_IN_SECONDS) {
      // duration of added content
      const prolongationDurationInSeconds = Math.floor(
        prolongedPlaylistDurationInSeconds - playlistDurationInSeconds,
      );

      const { quotient, remainder } = determineIntegerDivisionAndRemainder(
        prolongationDurationInSeconds,
        this.placeholderVideoDuration,
      );

      let eventStream = this.createEventStreamInPlaylist(0);
      for (let i = 0; i < quotient; i++) {
        parallels.push(
          createParallel(this.placeholderVideoParallel, eventStream),
        );
        //The event stream element must be added only for the first ad placeholder
        eventStream = undefined;
      }

      if (remainder > 0) {
        parallels.push(
          createParallel(
            this.placeholderVideoParallel,
            eventStream,
            undefined,
            remainder,
          ),
        );
      }
    }

    return parallels;
  };
}
