import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { sleep } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestDocumentCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import { IngestItemStatusEnum, IngestStatusEnum } from 'zapatos/custom';
import {
  IsolationLevel,
  param,
  self as value,
  sql,
  SQL,
  update,
} from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';

interface StatusAggregation {
  status: IngestItemStatusEnum;
  count: number;
}

export class CheckFinishIngestDocumentHandler extends MediaGuardedMessageHandler<CheckFinishIngestDocumentCommand> {
  constructor(
    private loginPool: LoginPgPool,
    private broker: Broker,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      MediaServiceMessagingSettings.CheckFinishIngestDocument.messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
    );
  }

  async onMessage(
    {
      ingest_document_id,
      previous_error_count,
      previous_success_count,
      previous_in_progress_count,
      seconds_without_progress,
    }: CheckFinishIngestDocumentCommand,
    message: MessageInfo,
  ): Promise<void> {
    const pgSettings = await this.getPgSettings(message);
    const [updatedDoc] = await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const countGroups = await sql<SQL, StatusAggregation[]>`
            SELECT status, COUNT (status)
            FROM app_public.ingest_items
            WHERE ingest_document_id = ${param(ingest_document_id)}
            GROUP BY status;
            `.run(ctx);

        const error_count =
          countGroups.find((row) => row.status === 'ERROR')?.count ?? 0;
        const success_count =
          countGroups.find((row) => row.status === 'SUCCESS')?.count ?? 0;
        const in_progress_count =
          countGroups.find((row) => row.status === 'IN_PROGRESS')?.count ?? 0;

        const status: IngestStatusEnum =
          in_progress_count > 0
            ? 'IN_PROGRESS'
            : error_count === 0
            ? 'SUCCESS'
            : success_count === 0
            ? 'ERROR'
            : 'PARTIAL_SUCCESS';

        return update(
          'ingest_documents',
          { error_count, in_progress_count, success_count, status },
          { id: ingest_document_id },
        ).run(ctx);
      },
    );

    if (updatedDoc.status !== 'IN_PROGRESS') {
      // Ingest finished, no need to re-check progress anymore
      return;
    }
    if (
      previous_success_count === updatedDoc.success_count &&
      previous_in_progress_count === updatedDoc.in_progress_count &&
      previous_error_count === updatedDoc.error_count
    ) {
      seconds_without_progress += 5;
    } else {
      seconds_without_progress = 0;
    }

    if (seconds_without_progress >= 600) {
      await transactionWithContext(
        this.loginPool,
        IsolationLevel.Serializable,
        pgSettings,
        async (ctx) => {
          const error = param({
            message:
              'The progress of ingest failed to change for a long period of time. Assuming an unexpected messaging issue and failing the document.',
            source: CheckFinishIngestDocumentHandler.name,
          });
          await update(
            'ingest_documents',
            {
              status: 'ERROR',
              errors: sql<SQL>`${value} || ${error}::jsonb`,
            },
            { id: ingest_document_id },
          ).run(ctx);
        },
      );
      return;
    }

    await sleep(5000);
    await this.broker.publish<CheckFinishIngestDocumentCommand>(
      MediaServiceMessagingSettings.CheckFinishIngestDocument.messageType,
      {
        ingest_document_id,
        seconds_without_progress,
        previous_error_count: updatedDoc.error_count,
        previous_success_count: updatedDoc.success_count,
        previous_in_progress_count: updatedDoc.in_progress_count,
      },
      { auth_token: message.envelope.auth_token },
    );
  }
}
