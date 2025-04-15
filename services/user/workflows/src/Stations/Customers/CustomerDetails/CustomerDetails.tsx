import React from 'react';
import { useParams } from 'react-router-dom';
import { CustomerDetailsForm } from './CustomerDetailsForm';

export const CustomerDetails: React.FC = () => {
  const customerId = useParams<{
    customerId: string;
  }>().customerId;
  return <CustomerDetailsForm customerId={customerId} />;
};
