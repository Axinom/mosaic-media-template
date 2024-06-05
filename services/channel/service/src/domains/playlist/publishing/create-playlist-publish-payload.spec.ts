import {
  DetailedImage,
  DetailedVideo,
  ProgramLocalization,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { LocalizedPlaylistPublishDto } from './aggregate-playlist-publish-dto';
import { createPlaylistPublishPayload } from './create-playlist-publish-payload';

describe('createPlaylistPublishPayload', () => {
  const imageId1 = uuid();
  const imageId2 = uuid();
  const imageId3 = uuid();
  const programVideoId1 = uuid();
  const programVideoId2 = uuid();
  const programVideoId3 = uuid();
  const scheduleVideoId1 = uuid();
  const defaultAuditData = {
    created_date: new Date().toISOString(),
    created_user: 'TestUser',
    updated_date: new Date().toISOString(),
    updated_user: 'TestUSer',
  };
  const getLocalizedData = (index: number): ProgramLocalization[] => [
    {
      is_default_locale: true,
      language_tag: 'en-US',
      title: `Program ${index}`,
    },
    {
      is_default_locale: false,
      language_tag: 'et-EE',
      title: `Localized program ${index}`,
    },
  ];

  const createImages = (imageIds: string[]): DetailedImage[] => {
    return imageIds.map((element) => {
      return {
        id: element,
        path: `test/${element}/image.png`,
        width: 100,
        height: 100,
        type: 'test_cover',
      };
    });
  };
  const createVideos = (videoIds: string[]): DetailedVideo[] => {
    return videoIds.map((element) => {
      return {
        id: element,
        custom_id: 'custom_id',
        title: `Video ${element}`,
        source_location: `source/folder/video-${element}`,
        is_archived: false,
        videos_tags: [element, 'video', 'playlist'],
        video_encoding: {
          is_protected: false,
          encoding_state: 'READY',
          output_format: 'CMAF',
          preview_status: 'APPROVED',
          audio_languages: [],
          caption_languages: [],
          subtitle_languages: [],
          video_streams: [
            {
              label: 'audio',
              file: 'audio.mp4',
              format: 'CMAF',
            },
            {
              label: 'SD',
              file: 'video.mp4',
              format: 'CMAF',
            },
          ],
        },
      };
    });
  };
  const createEmptyPlaylist = (): LocalizedPlaylistPublishDto => {
    const startDate = new Date();
    return {
      id: uuid(),
      title: startDate.toISOString().substring(0, 10),
      start_date_time: startDate.toISOString(),
      calculated_duration_in_seconds: 10,
      calculated_end_date_time: new Date(
        startDate.getTime() + 1000 * 10,
      ).toISOString(),
      channel_id: uuid(),
      ...defaultAuditData,
      publication_state: 'NOT_PUBLISHED',
      published_date: null,
      published_user: null,
      programs: [],
    };
  };
  const createPlaylistWithPrograms = (): LocalizedPlaylistPublishDto => {
    const startDate = new Date();
    const playlistId = uuid();
    return {
      id: playlistId,
      title: startDate.toISOString().substring(0, 10),
      start_date_time: startDate.toISOString(),
      calculated_duration_in_seconds: 10,
      calculated_end_date_time: new Date(
        startDate.getTime() + 1000 * 10,
      ).toISOString(),
      channel_id: uuid(),
      ...defaultAuditData,
      publication_state: 'NOT_PUBLISHED',
      published_date: null,
      published_user: null,
      programs: [
        {
          id: uuid(),
          title: 'Program 1',
          localizations: getLocalizedData(1),
          ...defaultAuditData,
          sort_index: 1,
          program_cue_points: [],
          video_duration_in_seconds: 10,
          video_id: programVideoId1,
          image_id: imageId1,
          entity_id: uuid(),
          entity_type: 'MOVIE',
          playlist_id: playlistId,
        },
        {
          id: uuid(),
          title: 'Program 2',
          localizations: getLocalizedData(2),
          ...defaultAuditData,
          sort_index: 2,
          program_cue_points: [],
          video_duration_in_seconds: 10,
          video_id: programVideoId2,
          image_id: imageId2,
          entity_id: uuid(),
          entity_type: 'EPISODE',
          playlist_id: playlistId,
        },
        {
          id: uuid(),
          title: 'Program 3',
          localizations: getLocalizedData(3),
          ...defaultAuditData,
          sort_index: 3,
          program_cue_points: [],
          video_duration_in_seconds: 10,
          video_id: programVideoId3,
          image_id: imageId3,
          entity_id: uuid(),
          entity_type: 'MOVIE',
          playlist_id: playlistId,
        },
      ],
    };
  };
  const createPlaylistWithProgramAndCuePoints =
    (): LocalizedPlaylistPublishDto => {
      const playlistId = uuid();
      const programId = uuid();
      const startDate = new Date();
      return {
        id: playlistId,
        title: startDate.toISOString().substring(0, 10),
        start_date_time: startDate.toISOString(),
        calculated_duration_in_seconds: 10,
        calculated_end_date_time: new Date(
          startDate.getTime() + 1000 * 10,
        ).toISOString(),
        channel_id: uuid(),
        ...defaultAuditData,
        publication_state: 'NOT_PUBLISHED',
        published_date: null,
        published_user: null,
        programs: [
          {
            id: uuid(),
            title: 'Program 1',
            localizations: getLocalizedData(1),
            ...defaultAuditData,
            sort_index: 1,
            video_duration_in_seconds: 2000,
            video_id: programVideoId1,
            image_id: imageId1,
            entity_id: uuid(),
            entity_type: 'MOVIE',
            playlist_id: playlistId,
            program_cue_points: [
              {
                id: uuid(),
                time_in_seconds: 0,
                value: 'PRE_ROLL',
                type: 'PRE',
                program_id: programId,
                video_cue_point_id: uuid(),
                ...defaultAuditData,
                cue_point_schedules: [],
              },
              {
                id: uuid(),
                time_in_seconds: 999.12345,
                value: 'MID_ROLL',
                type: 'MID',
                program_id: programId,
                video_cue_point_id: uuid(),
                ...defaultAuditData,
                cue_point_schedules: [],
              },
              {
                id: uuid(),
                time_in_seconds: 1999.25147,
                value: 'POST_ROLL',
                type: 'POST',
                program_id: programId,
                video_cue_point_id: uuid(),
                ...defaultAuditData,
                cue_point_schedules: [],
              },
            ],
          },
        ],
      };
    };

  const createPlaylistFull = (): LocalizedPlaylistPublishDto => {
    const playlistId = uuid();
    const programId = uuid();
    const programCuePointId = uuid();
    const startDate = new Date();
    return {
      id: playlistId,
      title: startDate.toISOString().substring(0, 10),
      start_date_time: startDate.toISOString(),
      calculated_duration_in_seconds: 10,
      calculated_end_date_time: new Date(
        startDate.getTime() + 1000 * 10,
      ).toISOString(),
      channel_id: uuid(),
      ...defaultAuditData,
      publication_state: 'NOT_PUBLISHED',
      published_date: null,
      published_user: null,
      programs: [
        {
          id: uuid(),
          title: 'Program 1',
          localizations: getLocalizedData(1),
          ...defaultAuditData,
          sort_index: 1,
          video_duration_in_seconds: 2000,
          video_id: programVideoId1,
          image_id: imageId1,
          entity_id: uuid(),
          entity_type: 'MOVIE',
          playlist_id: playlistId,
          program_cue_points: [
            {
              id: programCuePointId,
              time_in_seconds: 999.12345,
              value: 'MID_ROLL',
              type: 'MID',
              program_id: programId,
              video_cue_point_id: uuid(),
              ...defaultAuditData,
              cue_point_schedules: [
                {
                  id: uuid(),
                  ...defaultAuditData,
                  sort_index: 1,
                  type: 'AD_POD',
                  duration_in_seconds: 23,
                  video_id: null,
                  program_cue_point_id: programCuePointId,
                },
                {
                  id: uuid(),
                  ...defaultAuditData,
                  sort_index: 2,
                  type: 'VIDEO',
                  duration_in_seconds: 120,
                  video_id: scheduleVideoId1,
                  program_cue_point_id: programCuePointId,
                },
              ],
            },
          ],
        },
      ],
    };
  };

  it('published event created from playlist with no programs', () => {
    // Arrange
    const playlist = createEmptyPlaylist();
    const images: DetailedImage[] = [];
    const videos: DetailedVideo[] = [];

    // Act
    const event = createPlaylistPublishPayload(playlist, images, videos);

    // Assert
    expect(event).toMatchObject({
      content_id: `playlist-${playlist.id}`,
      channel_id: `channel-${playlist.channel_id}`,
      start_date_time: playlist.start_date_time,
      end_date_time: playlist.calculated_end_date_time,
      programs: [],
    });
  });

  it('published event created from playlist with programs', () => {
    // Arrange
    const playlist = createPlaylistWithPrograms();
    const images: DetailedImage[] = [];
    const videos: DetailedVideo[] = [];

    // Act
    const event = createPlaylistPublishPayload(playlist, images, videos);

    // Assert
    expect(event).toMatchObject({
      content_id: `playlist-${playlist.id}`,
      channel_id: `channel-${playlist.channel_id}`,
      start_date_time: playlist.start_date_time,
      end_date_time: playlist.calculated_end_date_time,
    });

    expect(event.programs).toHaveLength(3);
    expect(event.programs?.map((pr) => pr.image)).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(event.programs?.map((pr) => pr.sort_index)).toEqual([1, 2, 3]);
    expect(event.programs?.map((pr) => pr.program_cue_points)).toEqual([
      [],
      [],
      [],
    ]);
  });

  it('images are added to program entries in published event', () => {
    // Arrange
    const playlist = createPlaylistWithPrograms();
    const images = createImages([imageId1, imageId2, imageId3]);
    const videos: DetailedVideo[] = [];
    const expectedImageDetails = [
      {
        height: 100,
        id: imageId1,
        path: `test/${imageId1}/image.png`,
        type: 'test_cover',
        width: 100,
      },
      {
        height: 100,
        id: imageId2,
        path: `test/${imageId2}/image.png`,
        type: 'test_cover',
        width: 100,
      },
      {
        height: 100,
        id: imageId3,
        path: `test/${imageId3}/image.png`,
        type: 'test_cover',
        width: 100,
      },
    ];
    // Act
    const event = createPlaylistPublishPayload(playlist, images, videos);

    // Assert
    expect(event).toMatchObject({
      content_id: `playlist-${playlist.id}`,
      channel_id: `channel-${playlist.channel_id}`,
      start_date_time: playlist.start_date_time,
      end_date_time: playlist.calculated_end_date_time,
    });
    expect(event.programs).toHaveLength(3);
    expect(event.programs?.map((pr) => pr.image)).toEqual(expectedImageDetails);
    expect(event.programs?.map((pr) => pr.sort_index)).toEqual([1, 2, 3]);
    expect(event.programs?.map((pr) => pr.program_cue_points)).toEqual([
      [],
      [],
      [],
    ]);
  });

  it('images and videos are added to program entries in published event, even if not all were found', () => {
    // Arrange
    const playlist = createPlaylistWithPrograms();
    const images = createImages([imageId1, imageId2]);
    const videos: DetailedVideo[] = createVideos([
      programVideoId1,
      programVideoId2,
    ]);
    const expectedImageDetails = [
      {
        height: 100,
        id: imageId1,
        path: `test/${imageId1}/image.png`,
        type: 'test_cover',
        width: 100,
      },
      {
        height: 100,
        id: imageId2,
        path: `test/${imageId2}/image.png`,
        type: 'test_cover',
        width: 100,
      },
      undefined,
    ];
    // Act
    const event = createPlaylistPublishPayload(playlist, images, videos);

    // Assert
    expect(event).toMatchObject({
      content_id: `playlist-${playlist.id}`,
      channel_id: `channel-${playlist.channel_id}`,
      start_date_time: playlist.start_date_time,
      end_date_time: playlist.calculated_end_date_time,
    });
    expect(event.programs).toHaveLength(3);
    expect(event.programs?.map((pr) => pr.image)).toEqual(expectedImageDetails);
    expect(event.programs?.map((pr) => pr.video)).toEqual([
      ...videos,
      undefined,
    ]);
    expect(event.programs?.map((pr) => pr.sort_index)).toEqual([1, 2, 3]);
    expect(event.programs?.map((pr) => pr.program_cue_points)).toEqual([
      [],
      [],
      [],
    ]);
  });

  it('cue points without the schedules are not published', () => {
    // Arrange
    const playlist = createPlaylistWithProgramAndCuePoints();
    const images: DetailedImage[] = [];
    const videos: DetailedVideo[] = [];
    // Act
    const event = createPlaylistPublishPayload(playlist, images, videos);

    // Assert
    expect(event).toMatchObject({
      content_id: `playlist-${playlist.id}`,
      channel_id: `channel-${playlist.channel_id}`,
      start_date_time: playlist.start_date_time,
      end_date_time: playlist.calculated_end_date_time,
    });
    expect(event.programs).toHaveLength(1);
    const programCuePoints = event.programs![0].program_cue_points;
    expect(programCuePoints).toHaveLength(0);
    expect(programCuePoints).toEqual([]);
  });

  it('playlist publish event contains all data', () => {
    // Arrange
    const playlist = createPlaylistFull();
    const program = playlist.programs[0];
    const programCuePoint = program.program_cue_points[0];
    const image = createImages([imageId1]);
    const videos: DetailedVideo[] = createVideos([
      programVideoId1,
      scheduleVideoId1,
    ]);
    const programVideo = videos.filter((v) => v.id === programVideoId1)[0];
    const scheduleVideo = videos.filter((v) => v.id === scheduleVideoId1)[0];

    // Act
    const event = createPlaylistPublishPayload(playlist, image, videos);

    // Assert
    expect(event).toMatchObject({
      content_id: `playlist-${playlist.id}`,
      channel_id: `channel-${playlist.channel_id}`,
      start_date_time: playlist.start_date_time,
      end_date_time: playlist.calculated_end_date_time,
    });
    expect(event.programs).toHaveLength(1);

    const eventProgram = event.programs![0];
    expect(eventProgram).toMatchObject({
      content_id: `program-${program.id}`,
      sort_index: program.sort_index,
      video_duration_in_seconds: program.video_duration_in_seconds,
      video: programVideo,
      entity_content_id: `movie-${program.entity_id}`,
      image: {
        height: 100,
        id: imageId1,
        path: `test/${imageId1}/image.png`,
        type: 'test_cover',
        width: 100,
      },
      localizations: program.localizations,
    });
    expect(eventProgram.program_cue_points).toHaveLength(1);

    const eventCuePoint = eventProgram.program_cue_points![0];
    expect(eventCuePoint).toMatchObject({
      id: programCuePoint.id,
      time_in_seconds: programCuePoint.time_in_seconds,
      value: programCuePoint.value,
    });
    expect(eventCuePoint.schedules).toHaveLength(2);

    const eventSchedules = eventCuePoint.schedules!;
    expect(eventSchedules.map((s) => s.sort_index)).toEqual([1, 2]);
    expect(eventSchedules.map((s) => s.type)).toEqual(['AD_POD', 'VIDEO']);
    expect(eventSchedules.map((s) => s.duration_in_seconds)).toEqual([23, 120]);
    expect(eventSchedules.map((s) => s.video)).toEqual([
      undefined,
      scheduleVideo,
    ]);
  });
});
