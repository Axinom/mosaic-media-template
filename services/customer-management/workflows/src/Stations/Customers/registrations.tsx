import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import {
  customerManagementParentName as parentName,
  settingsGroupName,
} from '../../index';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { CustomerCreate } from './CustomerCreate/CustomerCreate';
import { CustomerDetails } from './CustomerDetails/CustomerDetails';
import { CustomerExplorer } from './CustomerExplorer/CustomerExplorer';

export function register(app: PiletApi): void {
  // CONTENT
  const customerNav = {
    name: 'customers',
    path: '/customers',
    label: 'Customers',
    icon: <MediaIcons icon={MediaIconName.Customers} />,
  };

  app.registerTile(
    {
      ...customerNav,
      kind: 'home',
      type: 'large',
    },
    false,
  );

  app.registerNavigationItem({
    ...customerNav,
    categoryName: 'Content',
  });

  // SETTINGS
  const customerSettingsNav = {
    path: '/settings/customer/customers',
    label: 'Customer Genres',
    icon: <MediaIcons icon={MediaIconName.MovieGenres} />,
  };

  app.registerTile(
    {
      ...customerSettingsNav,
      kind: 'settings',
      groupName: settingsGroupName,
    },
    false,
  );

  app.registerNavigationItem({
    ...customerSettingsNav,
    parentName: parentName,
    categoryName: 'Settings',
  });

  // STATION NAVIGATION
  app.registerPage('/customers', CustomerExplorer, {
    breadcrumb: () => 'Customers',
    // permissions: { 'user-service': ['ADMIN'] },
  });

  app.registerPage('/customers/create', CustomerCreate, {
    breadcrumb: () => 'New Customer',
    //permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
  });

  app.registerPage('/customers/:customerId', CustomerDetails, {
    breadcrumb: () => 'Customer',
    //permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
  });
}
