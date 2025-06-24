import { FormActionData, showNotification } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { axiosInstance } from '../../../axios/axios';
import { Constants } from '../../../constants';

export function useCustomerDetailsActions(
  id: string,
  email?: string,
  activated?: boolean,
): {
  readonly actions: FormActionData<any>[];
} {
  const history = useHistory();

  const deleteCustomer = async (): Promise<void> => {
    await axiosInstance.delete(`/v1/manage/customer/${id}`);
    history.push('/customers');
  };

  const resendActivation = async (): Promise<void> => {
    const response = await axiosInstance.post(
      `/v1/user/resendconfirmationemail`,
      email,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    showNotification({
      title:
        response.data.message ?? Constants.CustomerDetails.Messages.EmailSent,
      options: {
        type: 'success',
      },
    });
  };

  const resetPassword = async (): Promise<void> => {
    const response = await axiosInstance.post(
      `/v1/user/passwordforgottenemail`,
      email,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    showNotification({
      title:
        response.data.message ?? Constants.CustomerDetails.Messages.EmailSent,
      options: {
        type: 'success',
      },
    });
  };

  const actions: FormActionData<any>[] = [
    {
      label: Constants.CustomerDetails.Actions.ResendActivation,
      confirmationMode: 'Simple',
      onActionSelected: resendActivation,
      isDisabled: !email || activated,
    },
    {
      label: Constants.CustomerDetails.Actions.ResetPassword,
      confirmationMode: 'Simple',
      onActionSelected: resetPassword,
      isDisabled: !email,
    },
    {
      label: Constants.CustomerDetails.Actions.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteCustomer,
    },
  ];

  return { actions } as const;
}
