import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { Constants } from '../../../constants';

export const CustomerDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    return params['customerId'] ?? Constants.CustomerDetailsCrumb.DefaultText;
  };
};
