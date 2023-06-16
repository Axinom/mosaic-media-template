import { ChannelPublishedEvent } from '@axinom/mosaic-messages';
import { CpixSettings } from '../../../domains/cpix';
import { createTestVideo, getTestMutualStreamParams } from '../../../tests';
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

  const testCpix =
    'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...';

  const createTestCpixSettings = (isDrmProtected: boolean): CpixSettings => {
    return {
      decryptionCpixFile: isDrmProtected ? testCpix : null,
      encryptionDashCpixFile: isDrmProtected ? testCpix : null,
      encryptionHlsCpixFile: isDrmProtected ? testCpix : null,
    };
  };

  const getExpectedMetadataHeaders = (
    isDrmProtected: boolean,
    channelId: string,
  ): { '@name': string; '@content'?: string }[] => {
    const headers: { '@name': string; '@content'?: string }[] = [
      createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
      { '@name': HeaderMetadataNames.Vod2LiveStartTime },
      //temporary set to false, due to bug in Origin
      createHeaderMetadata(HeaderMetadataNames.SpliceMedia, false),
      createHeaderMetadata(HeaderMetadataNames.TimedMetadata, true),
      createHeaderMetadata(HeaderMetadataNames.MpdSegmentTemplate, 'time'),
      createHeaderMetadata(HeaderMetadataNames.HlsClientManifestVersion, 5),
      createHeaderMetadata(HeaderMetadataNames.MosaicChannelId, channelId),
    ];

    if (isDrmProtected) {
      headers.push(
        createHeaderMetadata(HeaderMetadataNames.DecryptCpix, testCpix),
        createHeaderMetadata(HeaderMetadataNames.MpdCpix, testCpix),
        createHeaderMetadata(HeaderMetadataNames.HlsCpix, testCpix),
      );
    }
    return headers;
  };

  it.each([true, false])(
    'created SMIL object with channel placeholder video',
    (isDrmProtected: boolean) => {
      // Arrange
      const channelWithPlaceholderVideo =
        createChannelWithVideo(isDrmProtected);
      const generator = new ChannelSmilGenerator(
        createTestCpixSettings(isDrmProtected),
      );
      // Act
      const resultSmil = generator.generate(channelWithPlaceholderVideo);
      // Assert
      expect(resultSmil).not.toBeNull();
      const headerMetadata = resultSmil.smil.head.meta;
      const expectedHeaders = getExpectedMetadataHeaders(
        isDrmProtected,
        channelWithPlaceholderVideo.id,
      );
      expect(headerMetadata).toHaveLength(expectedHeaders.length);
      expect(headerMetadata).toMatchObject(expectedHeaders);
      const parallels = resultSmil.smil.body.seq.par;
      expect(parallels).toHaveLength(1);
      expect(parallels).toMatchObject([
        videoToSmilParallelReferences(
          channelWithPlaceholderVideo.placeholder_video!,
          getTestMutualStreamParams(),
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
