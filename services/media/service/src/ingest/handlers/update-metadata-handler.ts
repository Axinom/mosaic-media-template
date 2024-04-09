import { MosaicError } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  IngestMessageContext,
  MediaServiceMessagingSettings,
  UpdateMetadataCommand,
} from 'media-messages';
import { selectOne } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { getIngestErrorMessage } from '../utils/ingest-validation';

import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { getFutureIsoDateInMilliseconds } from '../utils';

export class UpdateMetadataHandler extends MediaGuardedTransactionalInboxMessageHandler<UpdateMetadataCommand> {
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

    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
      },
      ownerClient,
      {
        envelopeOverrides: { auth_token: metadata.authToken },
        lockedUntil: getFutureIsoDateInMilliseconds(1_000),
      },
    );
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
      ownerClient,
      { envelopeOverrides: { auth_token: metadata.authToken } },
    );
  }
}
