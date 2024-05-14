import { FormStation, MessageBar } from '@axinom/mosaic-ui';
import React from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  PublishValidationStatus,
  useValidateChannelQuery,
} from '../../../generated/graphql';
import { ValidationResultsTable } from '../../../util/Publishing/ValidationResultsTable';
import { useActions } from './ChannelPublishing.actions';
import classes from './ChannelPublishing.module.scss';
import { FormData } from './ChannelPublishing.types';

interface UrlParams {
  channelId: string;
}

export const ChannelPublishing: React.FC = () => {
  const { channelId } = useParams<UrlParams>();

  const { loading, data, error } = useValidateChannelQuery({
    client,
    variables: { id: channelId },
    fetchPolicy: 'no-cache',
  });

  const { actions } = useActions(
    channelId,
    data?.validateChannel?.validationStatus,
    data?.validateChannel?.publishHash,
  );

  return (
    <FormStation<FormData>
      defaultTitle="Publishing"
      initialData={{
        loading,
        data: data?.validateChannel,
        error: error?.message,
      }}
      actions={actions}
      saveData={() => {
        // We don't need to save the data, since this station only displays the validation status.
      }}
      edgeToEdgeContent={true}
    >
      {data?.validateChannel?.validationStatus ===
        PublishValidationStatus.Errors && (
        <MessageBar
          type="info"
          title="Channel cannot be published. Please check validation errors and fix related data accordingly."
        />
      )}
      <div className={classes.content}>
        <ValidationResultsTable />
      </div>
    </FormStation>
  );
};
