import { ChannelPublishedEvent } from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  createHeaderMetadata,
  createParallel,
  createSmilEnvelope,
  HeaderMetadata,
  HeaderMetadataNames,
  Parallel,
  SMILEnvelope,
} from '../models';
import { SmilGenerator } from './smil-generator';
import { videoToSmilParallelReferences } from './utils';

/**
 * Class to generate the SMIL Document from the channel published event.
 * Should be instantiated for each new document generation.
 */
export class ChannelSmilGenerator extends SmilGenerator<ChannelPublishedEvent> {
  generate(originalEvent: ChannelPublishedEvent): SMILEnvelope {
    const parallels: Parallel[] = [];
    if (originalEvent.placeholder_video) {
      const placeholderVideo = videoToSmilParallelReferences(
        originalEvent.placeholder_video,
      );
      parallels.push(createParallel(placeholderVideo));
    } else {
      // Virtual Channel cannot be created without the SMIL with a valid parallel/video
      throw new MosaicError({
        message: `Channel ${originalEvent.id} is missing placeholder video. Virtual Channel cannot be created.`,
        code: 'PLACEHOLDER_VIDEO_NOT_ASSIGNED',
      });
    }
    return createSmilEnvelope(parallels, this.populateHeader(originalEvent));
  }
  private populateHeader(
    originalEvent: ChannelPublishedEvent,
  ): HeaderMetadata[] {
    return [
      //mandatory properties
      createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
      createHeaderMetadata(
        HeaderMetadataNames.Vod2LiveStartTime,
        new Date().toISOString(),
      ), // start of the channel is a "publication" date
      // Axinom mosaic specific properties
      createHeaderMetadata(
        HeaderMetadataNames.MosaicChannelId,
        originalEvent.id,
      ),
    ];
  }
}
