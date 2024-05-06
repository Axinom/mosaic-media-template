import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreInboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestDocumentCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { IngestItemStatusEnum, IngestStatusEnum } from 'zapatos/custom';
import { param, self as value, sql, SQL, update } from 'zapatos/db';
import {
  CommonErrors,
  Config,
  getMediaMappedError,
  PRIORITY_SEGMENT,
} from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { getFutureIsoDateInMilliseconds } from '../utils';

interface StatusAggregation {
  status: IngestItemStatusEnum;
  count: number;
}

export class CheckFinishIngestDocumentHandler extends MediaGuardedTransactionalInboxMessageHandler<CheckFinishIngestDocumentCommand> {
  constructor(
    private readonly storeInboxMessage: StoreInboxMessage,
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
    ownerClient: ClientBase,
  ): Promise<void> {
    const docId = param(ingest_document_id);
    await sql`WITH updated AS (
      SELECT
        iis.ingest_item_id,
        CASE
          WHEN BOOL_OR(iis.status = 'IN_PROGRESS') THEN NULL
          WHEN BOOL_OR(iis.status = 'ERROR') THEN 'ERROR'
          ELSE 'SUCCESS'
        END as new_status
      FROM app_public.ingest_item_steps iis
      JOIN app_public.ingest_items ii ON iis.ingest_item_id = ii.id
      WHERE ii.ingest_document_id = ${docId} AND ii.status = 'IN_PROGRESS'
      GROUP BY iis.ingest_item_id
    )
    UPDATE app_public.ingest_items item
    SET status = updated.new_status
    FROM updated
    WHERE item.id = updated.ingest_item_id AND
          updated.new_status IS NOT NULL;`.run(ownerClient);

    const countGroups = await sql<SQL, StatusAggregation[]>`
    SELECT status, COUNT (status)
    FROM app_public.ingest_items
    WHERE ingest_document_id = ${docId}
    GROUP BY status;
    `.run(ownerClient);

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
    ).run(ownerClient);

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

    // At baseline, allow 5 minutes of inactivity for any ingest, no matter the
    // reason (e.g. services starting up).
    // Add additional minute of inactivity for every 250 items in the document.
    const maxSecondsOfInactivity =
      600 + 60 * Math.round(updatedDoc.items_count / 250);

    if (seconds_without_progress >= maxSecondsOfInactivity) {
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
      ).run(ownerClient);
    } else {
      await this.storeInboxMessage<CheckFinishIngestDocumentCommand>(
        ingest_document_id.toString(),
        MediaServiceMessagingSettings.CheckFinishIngestDocument,
        {
          ingest_document_id,
          seconds_without_progress,
          previous_error_count: updatedDoc.error_count,
          previous_success_count: updatedDoc.success_count,
          previous_in_progress_count: updatedDoc.in_progress_count,
        },
        ownerClient,
        {
          metadata: { authToken: metadata.authToken },
          lockedUntil: getFutureIsoDateInMilliseconds(5_000),
          segment: PRIORITY_SEGMENT,
        },
      );
    }
  }

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message:
        'An unexpected error occurred trying to update the ingest document and its relations.',
      code: CommonErrors.IngestError.code,
    });
  }

  override async handleErrorMessage(
    error: Error,
    {
      payload: { ingest_document_id },
    }: TypedTransactionalMessage<CheckFinishIngestDocumentCommand>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }

    const wrappedError = param({
      message: error.message,
      source: CheckFinishIngestDocumentHandler.name,
    });
    await update(
      'ingest_documents',
      {
        status: 'ERROR',
        errors: sql<SQL>`${value} || ${wrappedError}::jsonb`,
      },
      { id: ingest_document_id },
    ).run(ownerClient);
  }
}
