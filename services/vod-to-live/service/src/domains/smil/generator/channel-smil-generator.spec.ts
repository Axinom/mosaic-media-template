import { ChannelPublishedEvent } from '@axinom/mosaic-messages';
import { createTestVideo } from '../../../tests';
import { createHeaderMetadata, HeaderMetadataNames } from '../models';
import { ChannelSmilGenerator } from './channel-smil-generator';
import { videoToSmilParallelReferences } from './utils';

describe('ChannelSmilGenerator', () => {
  const createChannelWithVideo = (
    isDrmProtected: boolean,
  ): ChannelPublishedEvent => {
    return {
      description: null,
      id: 'adbff5f4-fc18-4f4d-818c-91f37ba131ee',
      images: [
        {
          height: 646,
          id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
          path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
          type: 'channel_logo',
          width: 860,
        },
      ],
      placeholder_video: createTestVideo(
        isDrmProtected,
        '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
        62,
      ),
      title: 'Discovery++',
    };
  };
  const channelWithoutPlaceholderVideo: ChannelPublishedEvent = {
    description: null,
    id: 'adbff5f4-fc18-4f4d-818c-91f37ba131ee',
    images: [
      {
        height: 646,
        id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
        path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
        type: 'channel_logo',
        width: 860,
      },
    ],
    title: 'Discovery++',
  };

  it.each([true, false])(
    'created SMIL object with channel placeholder video',
    (isDrmProtected: boolean) => {
      // Arrange
      const cpix = isDrmProtected
        ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
        : null;
      const channelWithPlaceholderVideo =
        createChannelWithVideo(isDrmProtected);
      const generator = new ChannelSmilGenerator({
        decryptionCpixFile: cpix,
        encryptionDashCpixFile: cpix,
        encryptionHlsCpixFile: cpix,
      });
      // Act
      const resultSmil = generator.generate(channelWithPlaceholderVideo);
      // Assert
      expect(resultSmil).not.toBeNull();
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaderLength = isDrmProtected ? 6 : 3;
      const expectedHeaders = [
        createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
        { '@name': HeaderMetadataNames.Vod2LiveStartTime },
        createHeaderMetadata(
          HeaderMetadataNames.MosaicChannelId,
          channelWithPlaceholderVideo.id,
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
      expect(parallels).toHaveLength(1);
      expect(parallels).toMatchObject([
        videoToSmilParallelReferences(
          channelWithPlaceholderVideo.placeholder_video!,
        ),
      ]);
    },
  );

  it('error is thrown if placeholder video is not defined', async () => {
    // Arrange
    const generator = new ChannelSmilGenerator({
      decryptionCpixFile: undefined,
      encryptionDashCpixFile: undefined,
      encryptionHlsCpixFile: undefined,
    });
    // Act & Assert
    expect(() => {
      generator.generate(channelWithoutPlaceholderVideo);
    }).toThrow(
      `Channel ${channelWithoutPlaceholderVideo.id} is missing placeholder video. Virtual Channel cannot be created.`,
    );
  });
});
