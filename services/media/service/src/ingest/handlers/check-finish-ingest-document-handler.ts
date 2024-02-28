import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestDocumentCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { IngestItemStatusEnum, IngestStatusEnum } from 'zapatos/custom';
import { param, self as value, sql, SQL, update } from 'zapatos/db';
import { Config } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { getFutureIsoDateInMilliseconds } from '../utils';

export class CheckFinishIngestDocumentHandler extends MediaGuardedTransactionalInboxMessageHandler<CheckFinishIngestDocumentCommand> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.CheckFinishIngestDocument,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: CheckFinishIngestDocumentHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    {
      payload: {
        ingest_document_id,
        previous_error_count,
        previous_success_count,
        previous_in_progress_count,
        seconds_without_progress,
      },
      metadata,
    }: TypedTransactionalMessage<CheckFinishIngestDocumentCommand>,
    loginClient: ClientBase,
  ): Promise<void> {
    const countGroups = await sql<SQL, StatusAggregation[]>`
    SELECT status, COUNT (status)
    FROM app_public.ingest_items
    WHERE ingest_document_id = ${param(ingest_document_id)}
    GROUP BY status;
    `.run(loginClient);

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

    const [updatedDoc] = await update(
      'ingest_documents',
      { error_count, in_progress_count, success_count, status },
      { id: ingest_document_id },
    ).run(loginClient);

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
      ).run(loginClient);
    } else {
      await this.storeOutboxMessage<CheckFinishIngestDocumentCommand>(
        ingest_document_id.toString(),
        MediaServiceMessagingSettings.CheckFinishIngestDocument,
        {
          ingest_document_id,
          seconds_without_progress,
          previous_error_count: updatedDoc.error_count,
          previous_success_count: updatedDoc.success_count,
          previous_in_progress_count: updatedDoc.in_progress_count,
        },
        loginClient,
        {
          envelopeOverrides: { auth_token: metadata.authToken },
          lockedUntil: getFutureIsoDateInMilliseconds(1_000),
        },
      );
    }
  }
}

interface StatusAggregation {
  status: IngestItemStatusEnum;
  count: number;
}
