import { FormActionData } from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  PublishValidationStatus,
  usePublishChannelMutation,
} from '../../../generated/graphql';
import { FormData } from './ChannelPublishing.types';

export function useActions(
  id: string,
  publishValidationStatus: PublishValidationStatus | undefined,
  publishHash: string | undefined | null,
): {
  readonly actions: FormActionData<FormData>[];
} {
  const history = useHistory();

  const [publishChannelMutation] = usePublishChannelMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const actions: FormActionData<FormData>[] = [];

  if (
    publishHash &&
    publishValidationStatus !== PublishValidationStatus.Errors
  ) {
    actions.push({
      label: 'Publish',
      confirmationMode: 'Advanced',
      confirmationConfig: {
        body: (
          <>
            <p>Publish channel?</p>
          </>
        ),
      },
      onActionSelected: async () => {
        await publishChannelMutation({
          variables: { id, publishHash },
        });
        history.push('./');
      },
    });
  }

  return { actions } as const;
}
