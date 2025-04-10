import { PiletApi } from '@axinom/mosaic-portal';
import { initializeUi } from '@axinom/mosaic-ui';
import React from 'react';
import { initializeAxios } from './axios/axios';
import { bindExtensions, ExtensionsContext } from './externals/piralExtensions';
import { CustomerIconName, CustomerIcons } from './Icons/CustomerIcons';
import { initializeConfig } from './piletConfig';
import { CustomerCreate } from './Stations/Customers/CustomerCreate/CustomerCreate';
import { CustomerDetails } from './Stations/Customers/CustomerDetails/CustomerDetails';
import { CustomerDetailsCrumb } from './Stations/Customers/CustomerDetails/CustomerDetailsCrumb';
import { Customers } from './Stations/Customers/CustomersExplorer/Customers';

export const settingsGroupName = 'Customer Management';
export const parentName = 'customer-management';

const permissions = undefined; // {
//   'customer-service': ['ADMIN'],
// };

export function setup(app: PiletApi): void {
  initializeConfig(app.meta.custom);

  // Provide the PiletAPI to the UI components (e.g. for raising toast notifications)
  initializeUi(app);

  // Optionally initialize axios instance for API calls
  initializeAxios(app);

  // Making all required extensions available
  const extensions = bindExtensions(app);

  const customersNav = {
    name: 'customers',
    path: '/customers',
    label: 'Customers',
    icon: <CustomerIcons icon={CustomerIconName.Customer} />,
  };

  app.registerTile(
    {
      ...customersNav,
      kind: 'home',
      type: 'large',
    },
    false,
  );

  app.registerNavigationItem({
    ...customersNav,
    categoryName: 'Customers',
  });

  app.registerPage(
    '/customers',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <Customers />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Customers',
      permissions,
    },
  );

  app.registerPage('/customers/create', () => <CustomerCreate />, {
    breadcrumb: () => 'New Customer',
    permissions,
  });

  app.registerPage(
    '/customers/:customerId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <CustomerDetails />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: CustomerDetailsCrumb,
      permissions,
    },
  );
}
