import {
  MessagingSettings,
  MultiTenantMessagingSettings,
} from '@axinom/mosaic-message-bus-abstractions';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreInboxMessage,
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  MediaServiceMessagingSettings,
  StartIngestItemCommand,
} from 'media-messages';
import { ClientBase } from 'pg';
import { PublicationConfig } from 'rascal';
import {
  insert,
  param,
  Queryable,
  self as value,
  SQL,
  sql,
  update,
} from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import {
  FullOrchestrationData,
  IngestEntityProcessor,
  OrchestrationData,
} from '../models';

export class StartIngestItemHandler extends MediaGuardedTransactionalInboxMessageHandler<StartIngestItemCommand> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    private readonly storeInboxMessage: StoreInboxMessage,
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.StartIngestItem,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: StartIngestItemHandler.name,
      }),
      config,
    );
  }

  private isFullOrchestrationData(
    data: OrchestrationData,
  ): data is FullOrchestrationData {
    return 'messagingSettings' in data;
  }

  override async handleMessage(
    { payload, metadata }: TypedTransactionalMessage<StartIngestItemCommand>,
    ownerClient: ClientBase,
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

    const data = processor.getOrchestrationData(payload);
    await this.saveIngestItemSteps(data, ownerClient);
    const orchestrationData = data
      .filter<FullOrchestrationData>(this.isFullOrchestrationData)
      .map((original) => ({
        ...original,
        publicationConfig: this.getPublicationConfig(
          original.messagingSettings,
        ),
      }));

    for (const data of orchestrationData) {
      if (data.publicationConfig) {
        await this.storeOutboxMessage(
          data.aggregateId,
          data.messagingSettings,
          data.messagePayload,
          ownerClient,
          {
            envelopeOverrides: {
              auth_token: metadata.authToken,
              message_context: data.messageContext,
            },
            options: data.publicationConfig,
          },
        );
      } else {
        await this.storeInboxMessage(
          data.aggregateId,
          data.messagingSettings,
          data.messagePayload,
          ownerClient,
          {
            metadata: {
              authToken: metadata.authToken,
              messageContext: data.messageContext,
            },
          },
        );
      }
    }
  }

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message: 'An error occurred while trying to orchestrate ingest items.',
      code: CommonErrors.IngestError.code,
    });
  }

  override async handleErrorMessage(
    error: Error,
    { payload }: TypedTransactionalMessage<StartIngestItemCommand>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const errorParam = param({
      message: error.message,
      source: StartIngestItemHandler.name,
    });
    await update(
      'ingest_items',
      {
        status: 'ERROR',
        errors: sql<SQL>`${value} || ${errorParam}::jsonb`,
      },
      { id: payload.ingest_item_id },
    ).run(ownerClient);
  }

  private getPublicationConfig(
    messageSettings: MultiTenantMessagingSettings | MessagingSettings,
  ): PublicationConfig | undefined {
    if (!('getEnvironmentRoutingKey' in messageSettings)) {
      return undefined;
    }

    return {
      routingKey: messageSettings.getEnvironmentRoutingKey({
        tenantId: this.config.tenantId,
        environmentId: this.config.environmentId,
      }),
    };
  }

  private async saveIngestItemSteps(
    orchestrationData: OrchestrationData[],
    ctx: Queryable,
  ): Promise<void> {
    await insert(
      'ingest_item_steps',
      orchestrationData.map((data) => data.ingestItemStep),
    ).run(ctx);
  }
}
