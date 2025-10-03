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

    // TODO: Refactor this when we have time to make it cleaner.
    if (message.payload.table_name === 'movies_images') {
      if (message.payload.action === 'ADD_RELATED_ENTITY') {
        await deletes(message.payload.table_name, {
          movie_id: JSON.parse(message.payload.stringified_payload).movie_id,
          image_type: JSON.parse(message.payload.stringified_payload)
            .image_type,
        }).run(envOwnerClient);

        await insert(
          message.payload.table_name,
          JSON.parse(message.payload.stringified_payload),
        ).run(envOwnerClient);

        return;
      }
    }

    if (message.payload.table_name === 'tvshows_images') {
      if (message.payload.action === 'ADD_RELATED_ENTITY') {
        await deletes(message.payload.table_name, {
          tvshow_id: JSON.parse(message.payload.stringified_payload).tvshow_id,
          image_type: JSON.parse(message.payload.stringified_payload)
            .image_type,
        }).run(envOwnerClient);

        await insert(
          message.payload.table_name,
          JSON.parse(message.payload.stringified_payload),
        ).run(envOwnerClient);

        return;
      }
    }

    if (message.payload.table_name === 'seasons_images') {
      if (message.payload.action === 'ADD_RELATED_ENTITY') {
        await deletes(message.payload.table_name, {
          season_id: JSON.parse(message.payload.stringified_payload).season_id,
          image_type: JSON.parse(message.payload.stringified_payload)
            .image_type,
        }).run(envOwnerClient);

        await insert(
          message.payload.table_name,
          JSON.parse(message.payload.stringified_payload),
        ).run(envOwnerClient);

        return;
      }
    }

    if (message.payload.table_name === 'episodes_images') {
      if (message.payload.action === 'ADD_RELATED_ENTITY') {
        await deletes(message.payload.table_name, {
          episode_id: JSON.parse(message.payload.stringified_payload)
            .episode_id,
          image_type: JSON.parse(message.payload.stringified_payload)
            .image_type,
        }).run(envOwnerClient);

        await insert(
          message.payload.table_name,
          JSON.parse(message.payload.stringified_payload),
        ).run(envOwnerClient);

        return;
      }
    }

    await handlePerformItemChangeCommand(message.payload, envOwnerClient);
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
