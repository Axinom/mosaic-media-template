import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { assertDictionary } from '@axinom/mosaic-service-common';
import {
  DeleteEntityCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { deletes, IsolationLevel } from 'zapatos/db';
import { Table } from 'zapatos/schema';
import { Config } from '../../../common';
import { MediaGuardedMessageHandler } from '../../../messaging';

export class DeleteEntityCommandHandler extends MediaGuardedMessageHandler<DeleteEntityCommand> {
  constructor(
    private readonly broker: Broker,
    private readonly loginPool: LoginPgPool,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.DeleteEntity.messageType,
      [
        'ADMIN',
        'COLLECTIONS_EDIT',
        'MOVIES_EDIT',
        'SETTINGS_EDIT',
        'TVSHOWS_EDIT',
      ],
      config,
    );
  }

  async onMessage(
    payload: DeleteEntityCommand,
    messageInfo: MessageInfo<DeleteEntityCommand>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      await this.getPgSettings(messageInfo),
      async (tnxClient) => {
        const deletedItems = await deletes(payload.table_name as Table, {
          [payload.primary_key_name]: payload.entity_id,
        }).run(tnxClient);

        if (deletedItems.length >= 1) {
          const deletedRow = deletedItems[0];
          assertDictionary(deletedRow);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const entity_id = (deletedRow as any)[payload.primary_key_name]; //TODO: see if it's possible to get rid of any here, changed with zapatos 3.6.0
          await this.broker.publish(
            entity_id,
            MediaServiceMessagingSettings.EntityDeleted,
            {
              entity_id,
            },
            {
              auth_token: messageInfo.envelope.auth_token,
            },
          );
        }
      },
    );
  }
}
