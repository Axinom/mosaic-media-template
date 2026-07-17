import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  VideoEncodingFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-video-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { findLatestVideoIngestItemStep } from '../utils/find-latest-video-ingest-item-step';

const fallbackErrorMessage =
  'The video encoding has failed, but there was an error updating the ingest item step status.';

export class VideoEncodingFailedHandler extends MediaGuardedTransactionalInboxMessageHandler<VideoEncodingFailedEvent> {
  constructor(config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.VideoEncodingFailed,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: VideoEncodingFailedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<VideoEncodingFailedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const step = await findLatestVideoIngestItemStep(
      payload.video_id,
      ownerClient,
    );

    if (!step) {
      return;
    }

    await update(
      'ingest_item_steps',
      { status: 'ERROR', response_message: payload.message },
      { id: step.id },
    ).run(ownerClient);
  }

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message: fallbackErrorMessage,
      code: CommonErrors.IngestError.code,
    });
  }

  override async handleErrorMessage(
    error: Error,
    { payload }: TypedTransactionalMessage<VideoEncodingFailedEvent>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }

    const step = await findLatestVideoIngestItemStep(
      payload.video_id,
      ownerClient,
    );

    if (!step) {
      return;
    }

    await update(
      'ingest_item_steps',
      { status: 'ERROR', response_message: error.message },
      { id: step.id },
    ).run(ownerClient);
  }
}
