import {
  ActionData,
  ActionType,
  IconName,
  showNotification,
} from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteCustomerMutation,
  useGetCustomerEmailByIdQuery,
  useResendActivationMutation,
  useResetPasswordMutation,
} from '../../../generated/graphql';

export function useCustomerDetailsActions(id: string): {
  readonly actions: ActionData[];
} {
  const history = useHistory();

  const [deleteMutation] = useDeleteCustomerMutation({
    client,
    fetchPolicy: 'network-only',
  });

  const { data } = useGetCustomerEmailByIdQuery({
    client,
    variables: {
      customerId: id,
    },
    fetchPolicy: 'network-only',
  });

  const [resetPasswordMutation] = useResetPasswordMutation({
    client,
    fetchPolicy: 'network-only',
  });

  const [resendActivationMutation] = useResendActivationMutation({
    client,
    fetchPolicy: 'network-only',
  });

  const actions: ActionData[] = [
    {
      label: 'Payments',
      confirmationMode: 'None',
      actionType: ActionType.Navigation,
      onActionSelected: async () => {
        null;
      },
    },
    {
      label: 'Subscriptions',
      confirmationMode: 'None',
      actionType: ActionType.Navigation,
      onActionSelected: async () => {
        null;
      },
    },
    {
      label: 'Resend Activation',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        const result = await resendActivationMutation({
          variables: { email: data?.getCustomer?.email },
        });
        showNotification({
          options: { type: 'info' },
          title: 'Notification',
          body: result.data?.resendActivation?.message,
        });
      },
    },
    {
      label: 'Reset Password',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        const result = await resetPasswordMutation({
          variables: { email: data?.getCustomer?.email },
        });
        showNotification({
          options: { type: 'info' },
          title: 'Notification',
          body: result.data?.resetPassword?.message,
        });
      },
    },
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      icon: IconName.Delete,
      onActionSelected: async () => {
        const result = await deleteMutation({ variables: { Id: id } });
        showNotification({
          options: { type: 'info' },
          title: 'Notification',
          body: result.data?.deleteCustomer?.message,
        });
        history.push('/customers');
      },
    },
  ];

  return { actions } as const;
}
