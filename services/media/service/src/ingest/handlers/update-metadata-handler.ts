import { MosaicError } from '@axinom/mosaic-service-common';
import {
  IngestMessageContext,
  MediaServiceMessagingSettings,
  UpdateMetadataCommand,
} from 'media-messages';
import { selectOne, update } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { getIngestErrorMessage } from '../utils/ingest-validation';

import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';

export class UpdateMetadataHandler extends MediaGuardedTransactionalInboxMessageHandler<UpdateMetadataCommand> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.UpdateMetadata,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: UpdateMetadataHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload, metadata }: TypedTransactionalMessage<UpdateMetadataCommand>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const messageContext = metadata.messageContext as IngestMessageContext;
    const processor = this.entityProcessors.find(
      (h) => h.type === payload.item.type,
    );

    if (!processor) {
      throw new MosaicError({
        message: `Entity type '${payload.item.type}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
        code: CommonErrors.IngestError.code,
      });
    }
    const localizationStep = await selectOne(
      'ingest_item_steps',
      {
        ingest_item_id: messageContext.ingestItemId,
        type: 'LOCALIZATIONS',
      },
      { columns: ['id'] },
    ).run(ownerClient);

    await processor.updateMetadata(
      payload,
      ownerClient,
      localizationStep ? messageContext.ingestItemId : undefined,
    );
    await update(
      'ingest_item_steps',
      { status: 'SUCCESS' },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }

  override async handleErrorMessage(
    error: Error,
    { metadata }: TypedTransactionalMessage<UpdateMetadataCommand>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const messageContext = metadata.messageContext as IngestMessageContext;
    await update(
      'ingest_item_steps',
      {
        status: 'ERROR',
        response_message: getIngestErrorMessage(
          error,
          'Unexpected error occurred while updating metadata.',
        ),
      },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }
}
