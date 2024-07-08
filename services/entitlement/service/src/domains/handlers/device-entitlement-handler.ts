import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Logger } from '@axinom/mosaic-service-common';
import { getFullConfig, SubscriptionDeviceDBHandler } from '../../common';

const config = getFullConfig();

export const DeviceEntitlementHandler = async (
  deviceId: string,
  deviceName: string,
  subscriptionPlanCode: string,
  ownerPool: OwnerPgPool,
) => {
  // Add 'async' keyword to the function declaration
  const logger = new Logger({
    config,
    context: DeviceEntitlementHandler.name,
  });

  // Access the 'app' property correctly

  const subscriptionDeviceDBHandler = new SubscriptionDeviceDBHandler(
    ownerPool,
  );

  const devices = await subscriptionDeviceDBHandler.GetEntitledDevices(
    subscriptionPlanCode,
  );
  //   const devices = await SubscriptionDeviceDBHandler.getEntitledDevices(
};
