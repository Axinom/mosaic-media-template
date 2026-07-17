import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  VideoEncodingFinishedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-video-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { findLatestVideoIngestItemStep } from '../utils/find-latest-video-ingest-item-step';

const fallbackErrorMessage =
  'The video encoding has finished, but there was an error updating the ingest item step status.';

export class VideoEncodingFinishedHandler extends MediaGuardedTransactionalInboxMessageHandler<VideoEncodingFinishedEvent> {
  constructor(config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.VideoEncodingFinished,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: VideoEncodingFinishedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<VideoEncodingFinishedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const step = await findLatestVideoIngestItemStep(
      payload.video_id,
      ownerClient,
    );

    if (!step) {
      return;
    }

    // Clears a previously recorded ERROR (e.g. after a successful retry of a
    // failed encoding) so the ingest item step reflects the current outcome.
    await update(
      'ingest_item_steps',
      { status: 'SUCCESS', response_message: null },
      { id: step.id },
    ).run(ownerClient);
  }

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message: fallbackErrorMessage,
      code: CommonErrors.IngestError.code,
    });
  }
}
