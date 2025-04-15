import React from 'react';
import { Constants } from '../../../constants';
import { CustomerDetailsQuickEdit } from '../CustomerDetails/CustomerDetailsQuickEdit';
import { CustomersExplorer } from './CustomersExplorer';

export const Customers: React.FC = () => {
  //const { bulkActions } = useMoviesActions();

  return (
    <CustomersExplorer
      title={Constants.CustomersExplorer.Title}
      stationKey="CustomersExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/customers/${item.id}`}
      onCreateAction="/customers/create"
      //bulkActions={bulkActions}
      quickEditRegistrations={[
        {
          component: <CustomerDetailsQuickEdit />,
          label: Constants.CustomersExplorer.QuickEdit.CustomerDetails,
        },
      ]}
    />
  );
};
