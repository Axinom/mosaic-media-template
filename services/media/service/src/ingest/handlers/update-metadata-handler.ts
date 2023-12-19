import { MosaicError } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  IngestMessageContext,
  MediaServiceMessagingSettings,
  UpdateMetadataCommand,
} from 'media-messages';
import { CommonErrors, Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { getIngestErrorMessage } from '../utils/ingest-validation';

import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';

export class UpdateMetadataHandler extends MediaGuardedTransactionalInboxMessageHandler<
  UpdateMetadataCommand,
  Config
> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    private readonly storeOutboxMessage: StoreOutboxMessage,
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
    { payload, metadata }: TransactionalInboxMessage<UpdateMetadataCommand>,
    loginClient: ClientBase,
  ): Promise<void> {
    const processor = this.entityProcessors.find(
      (h) => h.type === payload.item.type,
    );

    if (!processor) {
      throw new MosaicError({
        message: `Entity type '${payload.item.type}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
        code: CommonErrors.IngestError.code,
      });
    }

    await processor.updateMetadata(payload, loginClient);

    const messageContext = metadata.messageContext as IngestMessageContext;
    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
      },
      loginClient,
      { auth_token: metadata.authToken },
    );
  }

  override async handleErrorMessage(
    error: Error,
    { metadata }: TransactionalInboxMessage<UpdateMetadataCommand>,
    loginClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const messageContext = metadata.messageContext as IngestMessageContext;

    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: getIngestErrorMessage(
          error,
          'Unexpected error occurred while updating metadata.',
        ),
      },
      loginClient,
      { auth_token: metadata.authToken },
    );
  }
}
