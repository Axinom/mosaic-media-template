import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { initializeApolloClient } from './apolloClient/apolloClient';
import './global.scss';
import { MediaIconName, MediaIcons } from './MediaIcons';
import { initializeConfig, piletConfig } from './piletConfig';

import { initializeUi } from '@axinom/mosaic-ui';
import { register as registerCustomers } from './Stations/Customers/registrations';
import { transformNavigationItems } from './transformNavigation/transformNavigation';

export const settingsGroupName = 'Customer Management';
export const customerManagementParentName = 'customer-management';

export function setup(app: PiletApi): void {
  initializeConfig(app.meta.custom);

  initializeUi(app);
  // Initializing the GraphQL clients
  initializeApolloClient(
    app.getToken,
    piletConfig.customerManagementHost,
    piletConfig.customerManagementHttpProtocol,
  );

  app.setNavigationItemsTransformer(transformNavigationItems);

  app.registerNavigationItem({
    icon: <MediaIcons icon={MediaIconName.Snapshots} />,
    label: settingsGroupName,
    name: customerManagementParentName,
    categoryName: 'Settings',
  });

  // Registering all items (Pages, Tiles, Extensions,...) this pilet provides
  registerCustomers(app);
}
