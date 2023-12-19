import { assertDictionary, Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  DeleteEntityCommand,
  EntityDeletedEvent,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes } from 'zapatos/db';
import { Table } from 'zapatos/schema';
import { Config } from '../../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../../messaging';

export class DeleteEntityHandler extends MediaGuardedTransactionalInboxMessageHandler<
  DeleteEntityCommand,
  Config
> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.DeleteEntity,
      [
        'ADMIN',
        'COLLECTIONS_EDIT',
        'MOVIES_EDIT',
        'SETTINGS_EDIT',
        'TVSHOWS_EDIT',
      ],
      new Logger({
        config,
        context: DeleteEntityHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload, metadata }: TransactionalInboxMessage<DeleteEntityCommand>,
    loginClient: ClientBase,
  ): Promise<void> {
    const deletedItems = await deletes(payload.table_name as Table, {
      [payload.primary_key_name]: payload.entity_id,
    }).run(loginClient);

    if (deletedItems.length >= 1) {
      const deletedRow = deletedItems[0];
      assertDictionary(deletedRow);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entity_id = (deletedRow as any)[payload.primary_key_name]; //TODO: see if it's possible to get rid of any here, changed with zapatos 3.6.0
      await this.storeOutboxMessage<EntityDeletedEvent>(
        entity_id,
        MediaServiceMessagingSettings.EntityDeleted,
        {
          entity_id,
          primary_key_name: payload.primary_key_name,
          table_name: payload.table_name,
        },
        loginClient,
        {
          auth_token: metadata.authToken,
        },
      );
    }
  }
}
