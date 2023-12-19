import {
  MessagingSettings,
  MultiTenantMessagingSettings,
} from '@axinom/mosaic-message-bus-abstractions';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TransactionalInboxMessage,
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
import { CommonErrors, Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { IngestEntityProcessor, OrchestrationData } from '../models';
import { getIngestErrorMessage } from '../utils/ingest-validation';

export class StartIngestItemHandler extends MediaGuardedTransactionalInboxMessageHandler<
  StartIngestItemCommand,
  Config
> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
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

  override async handleMessage(
    { payload, metadata }: TransactionalInboxMessage<StartIngestItemCommand>,
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

    const data = processor.getOrchestrationData(payload);
    await this.saveIngestItemSteps(data, loginClient);
    const orchestrationData = await data.map((original) => ({
      ...original,
      publicationConfig: this.getPublicationConfig(original.messagingSettings),
    }));

    for (const data of orchestrationData) {
      await this.storeOutboxMessage(
        data.aggregateId,
        data.messagingSettings,
        data.messagePayload,
        loginClient,
        {
          auth_token: metadata.authToken,
          message_context: data.messageContext,
        },
        data.publicationConfig,
      );
    }
  }

  override async handleErrorMessage(
    error: Error,
    { payload }: TransactionalInboxMessage<StartIngestItemCommand>,
    loginClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const errorMessage = getIngestErrorMessage(
      error,
      'An error occurred while trying to orchestrate ingest items.',
    );
    const errorParam = param({
      message: errorMessage,
      source: StartIngestItemHandler.name,
    });
    await update(
      'ingest_items',
      {
        status: 'ERROR',
        errors: sql<SQL>`${value} || ${errorParam}::jsonb`,
      },
      { id: payload.ingest_item_id },
    ).run(loginClient);
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
