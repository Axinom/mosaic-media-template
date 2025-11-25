import {
  handlePerformItemChangeCommand,
  handlePerformItemChangeCommandError,
} from '@axinom/mosaic-graphql-common';
import { GuardedContext } from '@axinom/mosaic-id-guard';
import {
  CommonServiceMessagingSettings,
  PerformItemChangeCommand,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { deletes, insert } from 'zapatos/db';
import { Config } from '../../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../../messaging';
import { PermissionKey } from '../../permission-definition';

export const bulkEditPermissions: PermissionKey[] = ['ADMIN', 'MOVIES_EDIT'];
export class BulkEditItemChangeHandler extends MediaGuardedTransactionalInboxMessageHandler<PerformItemChangeCommand> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      CommonServiceMessagingSettings.GetPerformItemChangeSettings(
        config.serviceId,
      ),
      bulkEditPermissions,
      new Logger({
        config,
        context: BulkEditItemChangeHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    message: TypedTransactionalMessage<PerformItemChangeCommand>,
    envOwnerClient: ClientBase,
    _context: GuardedContext,
  ): Promise<void> {
    this.logger.debug({ details: { ...message.payload } });

    const imageHandled = await this.handleImageTableAddRelated(
      message.payload,
      envOwnerClient,
    );

    if (imageHandled) {
      return;
    }

    const deferrableHandled = await this.handleDeferrableConstraintTables(
      message.payload,
      envOwnerClient,
    );

    if (!deferrableHandled) {
      await handlePerformItemChangeCommand(message.payload, envOwnerClient);
    }
  }

  private async handleDeferrableConstraintTables(
    payload: PerformItemChangeCommand,
    envOwnerClient: ClientBase,
  ): Promise<boolean> {
    // Handle collection_relations which has a DEFERRABLE sort_order constraint
    // that conflicts with the `ON CONFLICT` clauses in the base `handlePerformItemChangeCommand` handler.
    if (payload.table_name !== 'collection_relations') {
      return false;
    }

    // Only handle ADD_RELATED_ENTITY as `ON CONFLICT` is not applicable for other actions
    if (payload.action !== 'ADD_RELATED_ENTITY') {
      return false;
    }

    const parsedPayload = JSON.parse(payload.stringified_payload);

    // Use an INSERT + SELECT + WHERE NOT EXISTS query
    // This gives best effort to avoid unique constraint violations for deferrable constraints
    const columns = Object.keys(parsedPayload)
      .map((col) => `"${col}"`)
      .join(', ');
    const values = Object.values(parsedPayload);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const whereClause = Object.keys(parsedPayload)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(' AND ');

    const query = `
      INSERT INTO "${payload.table_name}" (${columns})
      SELECT ${placeholders}
      WHERE NOT EXISTS (
        SELECT 1 FROM "${payload.table_name}" WHERE ${whereClause}
      )
      RETURNING *
    `;

    await envOwnerClient.query(query, values);
    return true;
  }

  private async handleImageTableAddRelated(
    payload: PerformItemChangeCommand,
    envOwnerClient: ClientBase,
  ): Promise<boolean> {
    if (payload.action !== 'ADD_RELATED_ENTITY') {
      return false;
    }

    // Handle special upsert logic for image relation tables
    const imageTableMap = {
      movies_images: 'movie_id',
      tvshows_images: 'tvshow_id',
      seasons_images: 'season_id',
      episodes_images: 'episode_id',
      collections_images: 'collection_id',
    } as const;

    const entityIdField =
      imageTableMap[payload.table_name as keyof typeof imageTableMap];

    if (!entityIdField) {
      return false;
    }

    const parsedPayload = JSON.parse(payload.stringified_payload);

    // Delete existing image of the same type, then insert new one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await deletes(payload.table_name as any, {
      [entityIdField]: parsedPayload[entityIdField],
      image_type: parsedPayload.image_type,
    }).run(envOwnerClient);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await insert(payload.table_name as any, parsedPayload).run(envOwnerClient);

    return true;
  }

  public override async handleErrorMessage(
    error: Error,
    message: TypedTransactionalMessage<PerformItemChangeCommand>,
    envOwnerClient: ClientBase,
    retry: boolean,
    context?: GuardedContext,
  ): Promise<void> {
    if (retry || !context) {
      return;
    }

    this.logger.error({
      message: 'Failed to process the bulk edit item change command',
      details: { ...message.payload, error_details: { ...error } },
    });

    await handlePerformItemChangeCommandError(
      this.config,
      error,
      message,
      this.storeOutboxMessage,
      envOwnerClient,
    );
  }
}
