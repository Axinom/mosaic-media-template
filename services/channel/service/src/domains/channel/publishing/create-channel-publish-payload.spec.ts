import {
  ChannelLocalization,
  ChannelPublishedEvent,
  DetailedImage,
  DetailedVideo,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { channel_images } from 'zapatos/schema';
import { ChannelPublishDto } from './aggregate-channel-publish-dto';
import { createChannelPublishPayload } from './create-channel-publish-payload';

describe('createChannelPublishPayload', () => {
  const createTestPublishChannel = (
    imageId: string | null,
    placeholderVideoId: string | null,
  ): ChannelPublishDto => {
    const channelId = uuid();
    const images: channel_images.JSONSelectable[] = [];
    if (imageId) {
      images.push({
        channel_id: channelId,
        image_id: imageId,
        created_date: new Date().toISOString(),
        created_user: 'Test User',
        updated_date: new Date().toISOString(),
        updated_user: 'Test User',
        image_type: 'LOGO',
      });
    }
    return {
      id: channelId,
      title: 'Test channel',
      description: 'Best channel for testing',
      is_drm_protected: false,
      dash_stream_url: 'https://s.com/dash',
      hls_stream_url: 'https://s.com/hls',
      key_id: uuid(),
      created_date: new Date().toISOString(),
      created_user: 'TestUser',
      updated_date: new Date().toISOString(),
      updated_user: 'TestUSer',
      publication_state: 'NOT_PUBLISHED',
      published_date: null,
      published_user: null,
      images: images,
      placeholder_video_id: placeholderVideoId,
    };
  };
  const createImages = (): DetailedImage[] => {
    return [
      {
        id: uuid(),
        type: 'LOGO',
        path: 'test/image.png',
        height: 100,
        width: 100,
      },
    ];
  };

  const createVideo = (): DetailedVideo => {
    const videoId = uuid();
    return {
      id: videoId,
      custom_id: 'custom_id',
      title: `Video ${videoId}`,
      source_location: `source/folder/video-${videoId}`,
      is_archived: false,
      videos_tags: [videoId, 'video', 'channel'],
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
  };

  const createLocalizations = (): ChannelLocalization[] => [
    {
      is_default_locale: true,
      language_tag: 'en-US',
      title: 'Channel Title',
      description: 'Channel description',
    },
    {
      is_default_locale: false,
      language_tag: 'de-DE',
      title: 'Kanaltitel',
      description: 'Kanalbeschreibung',
    },
  ];

  it('publish payload is created for channel without images', () => {
    // Arrange
    const channel = createTestPublishChannel(null, null);
    const images: DetailedImage[] = [];
    const video = createVideo();
    const localizations = createLocalizations();

    // Act
    const publishPayload = createChannelPublishPayload(
      channel,
      images,
      video,
      localizations,
    );

    // Assert
    expect(publishPayload).toMatchObject<
      Omit<ChannelPublishedEvent, 'placeholder_video'>
    >({
      content_id: `channel-${channel.id}`,
      localizations,
      is_drm_protected: false,
      images: [],
    });
    expect(publishPayload.images).toHaveLength(0);
  });

  it('publish payload is created for channel with images', () => {
    // Arrange
    const images = createImages();
    const channel = createTestPublishChannel(images[0].id, null);
    const video = createVideo();
    const localizations = createLocalizations();

    // Act
    const publishPayload = createChannelPublishPayload(
      channel,
      images,
      video,
      localizations,
    );

    // Assert
    const expectedImage = images[0];

    expect(publishPayload).toMatchObject({
      content_id: `channel-${channel.id}`,
      localizations,
      images: [expectedImage],
    });
  });

  it('publish payload is created for channel with video and images', () => {
    // Arrange
    const images = createImages();
    const video = createVideo();
    const channel = createTestPublishChannel(images[0].id, video.id);
    const localizations = createLocalizations();

    // Act
    const publishPayload = createChannelPublishPayload(
      channel,
      images,
      video,
      localizations,
    );

    // Assert

    expect(publishPayload).toMatchObject({
      content_id: `channel-${channel.id}`,
      localizations,
      images,
      placeholder_video: video,
    });
  });
});
