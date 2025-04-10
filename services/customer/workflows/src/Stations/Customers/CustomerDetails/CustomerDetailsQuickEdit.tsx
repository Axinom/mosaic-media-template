import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { CustomerDetailsForm } from './CustomerDetailsForm';

export const CustomerDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<any>>(QuickEditContext);

  return selectedItem ? (
    <CustomerDetailsForm customerId={selectedItem.id} />
  ) : null;
};
