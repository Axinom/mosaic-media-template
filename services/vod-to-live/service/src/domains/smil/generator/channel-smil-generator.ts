import { MosaicError } from '@axinom/mosaic-service-common';
import { ChannelPublishedEvent } from 'media-messages';
import { CpixSettings } from '../../cpix';
import {
  createHeaderMetadata,
  createParallel,
  createSmilEnvelope,
  getDefaultMetadataHeaders,
  HeaderMetadata,
  HeaderMetadataNames,
  Parallel,
  SMILEnvelope,
} from '../models';
import { SmilGenerator } from './smil-generator';
import {
  extractSharedVideoStreamFormats,
  videoToSmilParallelReferences,
} from './utils';

/**
 * This class generates an SMIL Document from a channel published event.
 * It should be instantiated for each new document generation.
 */
export class ChannelSmilGenerator extends SmilGenerator<ChannelPublishedEvent> {
  constructor(private drmSettings: CpixSettings) {
    super();
  }
  generate(originalEvent: ChannelPublishedEvent): SMILEnvelope {
    const parallels: Parallel[] = [];
    if (originalEvent.placeholder_video) {
      const placeholderVideo = videoToSmilParallelReferences(
        originalEvent.placeholder_video,
        extractSharedVideoStreamFormats([originalEvent.placeholder_video]),
      );
      parallels.push(createParallel(placeholderVideo));
    } else {
      // Virtual Channel cannot be created without the SMIL with a valid parallel/video
      throw new MosaicError({
        message: `Channel ${originalEvent.content_id} is missing placeholder video. Virtual Channel cannot be created.`,
        code: 'PLACEHOLDER_VIDEO_NOT_ASSIGNED',
      });
    }
    return createSmilEnvelope(parallels, this.populateHeader(originalEvent));
  }
  private populateHeader(
    originalEvent: ChannelPublishedEvent,
  ): HeaderMetadata[] {
    const headers = [
      ...getDefaultMetadataHeaders(new Date()),
      createHeaderMetadata(
        HeaderMetadataNames.MosaicChannelId,
        originalEvent.content_id,
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
}
