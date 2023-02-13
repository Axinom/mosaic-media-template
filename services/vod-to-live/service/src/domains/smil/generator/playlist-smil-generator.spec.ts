/* eslint-disable jest/no-conditional-expect */
import {
  CuePointSchedule,
  CuePointScheduleType,
  PlaylistPublishedEvent,
  Program,
  ProgramCuePoint,
} from '@axinom/mosaic-messages';
import { v4 as uuid } from 'uuid';
import { createTestVideo } from '../../../tests';
import {
  createHeaderMetadata,
  HeaderMetadataNames,
  Parallel,
  transformSecondsToWallClock,
} from '../models';
import { PlaylistSmilGenerator } from './playlist-smil-generator';
import { videoToSmilParallelReferences } from './utils';

describe('PlaylistSmilGenerator', () => {
  const createCuePointWithSchedules = (
    type: 'PRE' | 'MID' | 'POST',
    timeInSeconds?: number | null | undefined,
    schedules?: CuePointSchedule[],
  ): ProgramCuePoint => {
    return {
      id: uuid(),
      type,
      time_in_seconds: timeInSeconds,
      schedules: schedules,
    };
  };
  const createSchedule = (
    sortIndex: number,
    type: CuePointScheduleType,
    durationInSeconds: number,
    isDrmProtected: boolean,
  ): CuePointSchedule => {
    const video =
      type === 'VIDEO'
        ? createTestVideo(isDrmProtected, '1', durationInSeconds)
        : undefined;
    return {
      id: uuid(),
      sort_index: sortIndex,
      type,
      duration_in_seconds: durationInSeconds,
      video,
    };
  };
  const createPlaylistWithPrograms = (
    startDateTime: Date,
    isDrmProtected: boolean,
  ): PlaylistPublishedEvent => {
    const programs: Program[] = [];
    for (let i = 0; i < 3; i++) {
      programs.push({
        id: uuid(),
        sort_index: i,
        title: `Program-${i}`,
        entity_id: uuid(),
        entity_type: 'MOVIE',
        video_duration_in_seconds: (i + 1) * 3600,
        video: createTestVideo(isDrmProtected, `${i}`, (i + 1) * 3600),
      });
    }
    const totalDurationInSeconds = programs.reduce((accumulator, pr) => {
      return accumulator + pr.video.video_encoding.length_in_seconds!;
    }, 0);
    return {
      id: uuid(),
      channel_id: uuid(),
      start_date_time: startDateTime.toISOString(),
      end_date_time: new Date(
        startDateTime.getTime() + 1000 * totalDurationInSeconds,
      ).toISOString(),
      programs,
    };
  };

  const createPlaylistWithProgramsAndSchedules = (
    cuePointType: 'PRE' | 'POST',
    scheduleType: CuePointScheduleType,
    isDrmProtected: boolean,
  ): PlaylistPublishedEvent => {
    const playlist = createPlaylistWithPrograms(new Date(), isDrmProtected);
    playlist.programs?.map((p, index) => {
      p.program_cue_points = [
        createCuePointWithSchedules(cuePointType, null, [
          createSchedule(index, scheduleType, 10, isDrmProtected),
        ]),
      ];
    });

    return playlist;
  };

  const PLACEHOLDER_VIDEO = createTestVideo(false, '0', 20);

  //Playlist contains:
  // - Program/video for 60 seconds
  // - MID cue point at 10s (of the video) with duration for 5s
  // - MID cue point at 25s (of the video) with duration for 7s
  // - MID cue point at 47s (of the video) with duration for 13s
  const createPlaylistVideoAndMidSchedules = (
    scheduleType: CuePointScheduleType,
    isDrmProtected: boolean,
  ): PlaylistPublishedEvent => {
    const startDateTime = new Date();
    return {
      id: uuid(),
      channel_id: uuid(),
      start_date_time: startDateTime.toISOString(),
      end_date_time: new Date(
        startDateTime.getTime() + 1000 * 85,
      ).toISOString(),
      programs: [
        {
          id: uuid(),
          sort_index: 0,
          title: `Program-12345`,
          entity_id: uuid(),
          entity_type: 'MOVIE',
          video_duration_in_seconds: 60,
          video: createTestVideo(isDrmProtected, '12345', 60),
          program_cue_points: [
            createCuePointWithSchedules('MID', 10, [
              createSchedule(0, scheduleType, 5, isDrmProtected),
            ]),
            createCuePointWithSchedules('MID', 25, [
              createSchedule(0, scheduleType, 7, isDrmProtected),
            ]),
            createCuePointWithSchedules('MID', 47, [
              createSchedule(0, scheduleType, 13, isDrmProtected),
            ]),
          ],
        },
      ],
    };
  };

  it.each([true, false])(
    'created SMIL object for playlist with programs',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistWithPrograms(
        new Date(),
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator(
        {
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        },
        PLACEHOLDER_VIDEO,
      );

      // Act
      const resultSmil = generator.generate(testPlaylist);

      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }

      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par;
      expect(parallels).toHaveLength(testPlaylist.programs!.length);
      expect(parallels).toMatchObject([
        ...testPlaylist.programs!.map((p) =>
          videoToSmilParallelReferences(p.video),
        ),
      ]);
    },
  );

  it.each([true, false])(
    'created SMIL object for playlist with programs and pre-roll ad for each program',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistWithProgramsAndSchedules(
        'PRE',
        'AD_POD',
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator(
        {
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        },
        PLACEHOLDER_VIDEO,
      );

      // Act
      const resultSmil = generator.generate(testPlaylist);

      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }
      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par as Parallel[];
      expect(parallels).toHaveLength(testPlaylist.programs!.length * 2); // each program has one pre roll
      let spliceId = 0;
      for (let i = 0; i < parallels.length; i++) {
        const parallel = parallels[i];
        if (i % 2 === 0) {
          spliceId++;
          // index is even - expect parallel for ad
          expect(parallel).toMatchObject({
            ...videoToSmilParallelReferences(PLACEHOLDER_VIDEO),
            '@clipBegin': undefined,
            '@clipEnd': transformSecondsToWallClock(10),
            EventStream: {
              Event: {
                Signal: {
                  SpliceInfoSection: {
                    SpliceInsert: [
                      {
                        '@outOfNetworkIndicator': 1, //out of network indicator
                        '@spliceImmediateFlag': 1,
                        '@spliceEventId': `${spliceId}`,
                      },
                    ],
                  },
                },
              },
            },
          });
        } else {
          // index is odd - expect parallel for video
          expect(parallel.audio).toHaveLength(1);
          expect(parallel.video).toHaveLength(1);
          expect(parallel).toMatchObject({
            '@clipBegin': undefined,
            '@clipEnd': undefined,
            EventStream: {
              Event: {
                Signal: {
                  SpliceInfoSection: {
                    SpliceInsert: [
                      {
                        '@outOfNetworkIndicator': 0, //back to the network indicator
                        '@spliceImmediateFlag': 1,
                        '@spliceEventId': `${spliceId}`,
                      },
                    ],
                  },
                },
              },
            },
          });
        }
      }
    },
  );

  it.each([true, false])(
    'created SMIL object for playlist with programs and post-roll ad for each program',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistWithProgramsAndSchedules(
        'POST',
        'AD_POD',
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator(
        {
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        },
        PLACEHOLDER_VIDEO,
      );

      // Act
      const resultSmil = generator.generate(testPlaylist);

      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }
      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par as Parallel[];
      expect(parallels).toHaveLength(testPlaylist.programs!.length * 2); // each program has one pre roll
      let spliceId = 0;
      for (let i = 0; i < parallels.length; i++) {
        const parallel = parallels[i];
        if (i % 2 === 0) {
          // index is even - expect parallel for video
          expect(parallel.audio).toHaveLength(1);
          expect(parallel.video).toHaveLength(1);
          expect(parallel).toMatchObject({
            '@clipBegin': undefined,
            '@clipEnd': undefined,
            EventStream:
              spliceId === 0
                ? undefined
                : {
                    Event: {
                      Signal: {
                        SpliceInfoSection: {
                          SpliceInsert: [
                            {
                              '@outOfNetworkIndicator': 0, //back to the network indicator
                              '@spliceImmediateFlag': 1,
                              '@spliceEventId': `${spliceId}`,
                            },
                          ],
                        },
                      },
                    },
                  },
          });
        } else {
          // index is odd - expect parallel for ad
          spliceId++;
          expect(parallel).toMatchObject({
            ...videoToSmilParallelReferences(PLACEHOLDER_VIDEO),
            '@clipBegin': undefined,
            '@clipEnd': transformSecondsToWallClock(10),
            EventStream: {
              Event: {
                Signal: {
                  SpliceInfoSection: {
                    SpliceInsert: [
                      {
                        '@outOfNetworkIndicator': 1, //out of network indicator
                        '@spliceImmediateFlag': 1,
                        '@spliceEventId': `${spliceId}`,
                      },
                    ],
                  },
                },
              },
            },
          });
        }
      }
    },
  );

  it.each([true, false])(
    'created SMIL object for playlist with programs and pre-roll video for each program',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistWithProgramsAndSchedules(
        'PRE',
        'VIDEO',
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator(
        {
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        },
        PLACEHOLDER_VIDEO,
      );

      // Act
      const resultSmil = generator.generate(testPlaylist);

      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }
      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par as Parallel[];
      expect(parallels).toHaveLength(testPlaylist.programs!.length * 2); // each program has one pre roll
      for (let i = 0; i < parallels.length; i++) {
        const parallel = parallels[i];
        if (i % 2 === 0) {
          // index is even - expect parallel for video insert
          expect(parallel['@clipEnd']).toEqual(transformSecondsToWallClock(10));
        } else {
          // index is odd - expect parallel for video of the program
          expect(parallel['@clipEnd']).toBeUndefined();
        }
        expect(parallel.audio).toHaveLength(1);
        expect(parallel.video).toHaveLength(1);
        expect(parallel).toMatchObject({
          '@clipBegin': undefined,
          EventStream: undefined,
        });
      }
    },
  );

  it.each([true, false])(
    'created SMIL object for playlist with programs and post-roll video for each program',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistWithProgramsAndSchedules(
        'POST',
        'VIDEO',
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator(
        {
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        },
        PLACEHOLDER_VIDEO,
      );

      // Act
      const resultSmil = generator.generate(testPlaylist);

      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }
      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par as Parallel[];
      expect(parallels).toHaveLength(testPlaylist.programs!.length * 2); // each program has one post roll
      for (let i = 0; i < parallels.length; i++) {
        const parallel = parallels[i];
        if (i % 2 === 0) {
          // index is odd - expect parallel for video insert
          expect(parallel['@clipEnd']).toBeUndefined();
        } else {
          {
            // index is even - expect parallel for video of the program
            expect(parallel['@clipEnd']).toEqual(
              transformSecondsToWallClock(10),
            );
          }
        }
        expect(parallel.audio).toHaveLength(1);
        expect(parallel.video).toHaveLength(1);
        expect(parallel).toMatchObject({
          '@clipBegin': undefined,
          EventStream: undefined,
        });
      }
    },
  );

  it.each([true, false])(
    'created SMIL object for playlist with program and several ad mid-rolls',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistVideoAndMidSchedules(
        'AD_POD',
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator(
        {
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        },
        PLACEHOLDER_VIDEO,
      );
      // Act
      const resultSmil = generator.generate(testPlaylist);
      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }
      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par;
      expect(parallels).toHaveLength(7); // 3 parallels for ads and 4 for program's video
      expect(parallels).toMatchObject([
        //program is played for 10 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(10),
          EventStream: undefined,
        },
        //ad is played for 5 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(5),
          EventStream: {
            Event: {
              Signal: {
                SpliceInfoSection: {
                  SpliceInsert: [
                    {
                      '@outOfNetworkIndicator': 1, //out of the network indicator
                      '@spliceImmediateFlag': 1,
                      '@spliceEventId': `1`,
                    },
                  ],
                },
              },
            },
          },
        },
        //program is played from 10s mark to 25
        {
          '@clipBegin': transformSecondsToWallClock(10),
          '@clipEnd': transformSecondsToWallClock(25),
          EventStream: {
            Event: {
              Signal: {
                SpliceInfoSection: {
                  SpliceInsert: [
                    {
                      '@outOfNetworkIndicator': 0, //to the network indicator
                      '@spliceImmediateFlag': 1,
                      '@spliceEventId': `1`,
                    },
                  ],
                },
              },
            },
          },
        },
        //ad is played for 7 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(7),
          EventStream: {
            Event: {
              Signal: {
                SpliceInfoSection: {
                  SpliceInsert: [
                    {
                      '@outOfNetworkIndicator': 1, //out of the network indicator
                      '@spliceImmediateFlag': 1,
                      '@spliceEventId': `2`,
                    },
                  ],
                },
              },
            },
          },
        },
        //program is played from 10s mark to 25
        {
          '@clipBegin': transformSecondsToWallClock(25),
          '@clipEnd': transformSecondsToWallClock(47),
          EventStream: {
            Event: {
              Signal: {
                SpliceInfoSection: {
                  SpliceInsert: [
                    {
                      '@outOfNetworkIndicator': 0, //to the network indicator
                      '@spliceImmediateFlag': 1,
                      '@spliceEventId': `2`,
                    },
                  ],
                },
              },
            },
          },
        },
        //ad is played for 13 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(13),
          EventStream: {
            Event: {
              Signal: {
                SpliceInfoSection: {
                  SpliceInsert: [
                    {
                      '@outOfNetworkIndicator': 1, //out of the network indicator
                      '@spliceImmediateFlag': 1,
                      '@spliceEventId': `3`,
                    },
                  ],
                },
              },
            },
          },
        },
        //program is played from 47s mark till end
        {
          '@clipBegin': transformSecondsToWallClock(47),
          '@clipEnd': undefined,
          EventStream: {
            Event: {
              Signal: {
                SpliceInfoSection: {
                  SpliceInsert: [
                    {
                      '@outOfNetworkIndicator': 0, //to the network indicator
                      '@spliceImmediateFlag': 1,
                      '@spliceEventId': `3`,
                    },
                  ],
                },
              },
            },
          },
        },
      ]);
    },
  );

  it.each([true, false])(
    'created SMIL object for playlist with program and several video mid-rolls',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistVideoAndMidSchedules(
        'VIDEO',
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator(
        {
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        },
        PLACEHOLDER_VIDEO,
      );
      // Act
      const resultSmil = generator.generate(testPlaylist);
      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }
      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par;
      expect(parallels).toHaveLength(7); // 3 parallels for ads and 4 for program's video
      expect(parallels).toMatchObject([
        //program is played for 10 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(10),
          EventStream: undefined,
        },
        //ad video is played for 5 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(5),
          EventStream: undefined,
        },
        //program is played from 10s mark to 25
        {
          '@clipBegin': transformSecondsToWallClock(10),
          '@clipEnd': transformSecondsToWallClock(25),
          EventStream: undefined,
        },
        //ad video is played for 7 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(7),
          EventStream: undefined,
        },
        //program is played from 10s mark to 25
        {
          '@clipBegin': transformSecondsToWallClock(25),
          '@clipEnd': transformSecondsToWallClock(47),
          EventStream: undefined,
        },
        //ad video is played for 13 seconds
        {
          '@clipBegin': undefined,
          '@clipEnd': transformSecondsToWallClock(13),
          EventStream: undefined,
        },
        //program is played from 47s mark till end
        {
          '@clipBegin': transformSecondsToWallClock(47),
          '@clipEnd': undefined,
          EventStream: undefined,
        },
      ]);
    },
  );

  it.each([true, false])(
    'created SMIL object for playlist with program and ad pre-rolls without replacing the ads with placeholder video',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const testPlaylist = createPlaylistWithProgramsAndSchedules(
        'PRE',
        'AD_POD',
        isDrmProtected,
      );
      const generator = new PlaylistSmilGenerator({
        decryptionCpixFile: cpix,
        encryptionDashCpixFile: cpix,
        encryptionHlsCpixFile: cpix,
      });

      // Act
      const resultSmil = generator.generate(testPlaylist);

      // Assert
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 8 : 5;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        createHeaderMetadata(
          HeaderMetadataNames.Vod2LiveStartTime,
          testPlaylist.start_date_time,
        ),
        createHeaderMetadata(HeaderMetadataNames.SplicedMedia, true),
        createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
        createHeaderMetadata(
          HeaderMetadataNames.MosaicPlaylistId,
          testPlaylist.id,
        ),
      ];

      if (isDrmProtected) {
        expectedHeaders.push(
          createHeaderMetadata(HeaderMetadataNames.DecryptCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.MpdCpix, cpix),
          createHeaderMetadata(HeaderMetadataNames.HlsCpix, cpix),
        );
      }
      expect(headerMetadata).toHaveLength(expectedHeaderLength);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par as Parallel[];
      expect(parallels).toHaveLength(testPlaylist.programs!.length * 2); // each program has one pre roll
      let spliceId = 0;
      for (let i = 0; i < parallels.length; i++) {
        const parallel = parallels[i];
        if (i % 2 === 0) {
          spliceId++;
          // index is even - expect parallel for ad
          expect(parallel).toMatchObject({
            audio: [],
            video: [],
            '@clipBegin': undefined,
            '@clipEnd': transformSecondsToWallClock(10),
            EventStream: {
              Event: {
                Signal: {
                  SpliceInfoSection: {
                    SpliceInsert: [
                      {
                        '@outOfNetworkIndicator': 1, //out of network indicator
                        '@spliceImmediateFlag': 1,
                        '@spliceEventId': `${spliceId}`,
                      },
                    ],
                  },
                },
              },
            },
          });
        } else {
          // index is odd - expect parallel for video
          expect(parallel.audio).toHaveLength(1);
          expect(parallel.video).toHaveLength(1);
          expect(parallel).toMatchObject({
            '@clipBegin': undefined,
            '@clipEnd': undefined,
            EventStream: {
              Event: {
                Signal: {
                  SpliceInfoSection: {
                    SpliceInsert: [
                      {
                        '@outOfNetworkIndicator': 0, //back to the network indicator
                        '@spliceImmediateFlag': 1,
                        '@spliceEventId': `${spliceId}`,
                      },
                    ],
                  },
                },
              },
            },
          });
        }
      }
    },
  );
});