import { OwnerPgPool } from '@axinom/mosaic-db-common';
// import { getOwnerPgPool } from '@axinom/mosaic-db-common';
import { JSONOnlyColsForTable, select, upsert } from 'zapatos/db';
import { subscription_devices } from 'zapatos/schema';

export class SubscriptionDeviceDBHandler {
  constructor(private readonly ownerPool: OwnerPgPool) {}

  async GetEntitledDevices(
    subscriptionPlanCode: string,
  ): Promise<
    JSONOnlyColsForTable<
      'subscription_devices',
      (
        | 'subscription_code'
        | 'id'
        | 'device_id'
        | 'device_name'
        | 'last_active'
        | 'manual_closed'
      )[]
    >[]
  > {
    const devices = await select(
      'subscription_devices',
      { subscription_code: subscriptionPlanCode },
      {
        columns: [
          'id',
          'subscription_code',
          'device_id',
          'device_name',
          'last_active',
          'manual_closed',
        ],
      },
    ).run(this.ownerPool);

    return devices;
  }

  async InsertOrUpdateDevice(
    device: subscription_devices.Insertable,
  ): Promise<void> {
    await upsert('subscription_devices', device, [
      'device_id',
      'subscription_code',
    ]).run(this.ownerPool);
  }
}
