import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  EnsureVideoExistsFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-video-messages';
import { VideoMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { selectOne, update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';

export class VideoFailedHandler extends MediaGuardedTransactionalInboxMessageHandler<EnsureVideoExistsFailedEvent> {
  constructor(config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsFailed,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: VideoFailedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    {
      payload,
      metadata,
      id,
      aggregateId,
    }: TypedTransactionalMessage<EnsureVideoExistsFailedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }

    const messageContext = metadata.messageContext as VideoMessageContext;

    await update(
      'ingest_item_steps',
      {
        status: 'ERROR',
        response_message: payload.message,
      },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);

    // We only mark cue points step as failed if the video is the main video
    if (messageContext.videoType === 'MAIN') {
      const cuePointsIngestStep = await selectOne('ingest_item_steps', {
        ingest_item_id: messageContext.ingestItemId,
        type: 'CUE_POINTS',
      }).run(ownerClient);

      if (cuePointsIngestStep) {
        await update(
          'ingest_item_steps',
          {
            status: 'ERROR',
            response_message:
              'Video processing start failed. Cue points cannot be ingested.',
          },
          { id: cuePointsIngestStep.id },
        ).run(ownerClient);
      }
    }
  }
}
