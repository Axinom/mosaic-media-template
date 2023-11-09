import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  MessagingSettings,
  MultiTenantMessagingSettings,
} from '@axinom/mosaic-message-bus-abstractions';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  MediaServiceMessagingSettings,
  StartIngestItemCommand,
} from 'media-messages';
import { PublicationConfig, SubscriptionConfig } from 'rascal';
import {
  insert,
  IsolationLevel,
  param,
  Queryable,
  self as value,
  SQL,
  sql,
  update,
} from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';
import { IngestEntityProcessor, OrchestrationData } from '../models';
import { getIngestErrorMessage } from '../utils/ingest-validation';

export class StartIngestItemHandler extends MediaGuardedMessageHandler<StartIngestItemCommand> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    private broker: Broker,
    private loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      MediaServiceMessagingSettings.StartIngestItem.messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
    );
  }

  async onMessage(
    content: StartIngestItemCommand,
    message: MessageInfo,
  ): Promise<void> {
    const pgSettings = await this.getPgSettings(message);
    const orchestrationData = await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const processor = this.entityProcessors.find(
          (h) => h.type === content.item.type,
        );

        if (!processor) {
          throw new MosaicError({
            message: `Entity type '${content.item.type}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
            code: CommonErrors.IngestError.code,
          });
        }

        const data = processor.getOrchestrationData(content);
        await this.saveIngestItemSteps(data, ctx);
        return data.map((original) => ({
          ...original,
          publicationConfig: this.getPublicationConfig(
            original.messagingSettings,
          ),
        }));
      },
    );

    for (const data of orchestrationData) {
      await this.broker.publish(
        content.entity_id.toString(),
        data.messagingSettings,
        data.messagePayload,
        {
          auth_token: message.envelope.auth_token,
          message_context: data.messageContext,
        },
        data.publicationConfig,
      );
    }
  }

  public async onMessageFailure(
    content: StartIngestItemCommand,
    message: MessageInfo,
    error: Error,
  ): Promise<void> {
    const pgSettings = await this.getPgSettings(message);
    const errorMessage = getIngestErrorMessage(
      error,
      'An error occurred while trying to orchestrate ingest items.',
    );
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const error = param({
          message: errorMessage,
          source: StartIngestItemHandler.name,
        });
        await update(
          'ingest_items',
          {
            status: 'ERROR',
            errors: sql<SQL>`${value} || ${error}::jsonb`,
          },
          { id: content.ingest_item_id },
        ).run(ctx);
      },
    );
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
