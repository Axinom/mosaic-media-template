import { FormStation, MessageBar } from '@axinom/mosaic-ui';
import React from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  PublishValidationStatus,
  useValidatePlaylistQuery,
} from '../../../generated/graphql';
import { ValidationResultsTable } from '../../../util/Publishing/ValidationResultsTable';
import { useActions } from './PlaylistPublishing.actions';
import classes from './PlaylistPublishing.module.scss';
import { FormData } from './PlaylistPublishing.types';

interface UrlParams {
  playlistId: string;
}

export const PlaylistPublishing: React.FC = () => {
  const { playlistId } = useParams<UrlParams>();

  const { loading, data, error } = useValidatePlaylistQuery({
    client,
    variables: { id: playlistId },
    fetchPolicy: 'no-cache',
  });

  const { actions } = useActions(
    playlistId,
    data?.validatePlaylist?.validationStatus,
    data?.validatePlaylist?.publishHash,
  );

  return (
    <FormStation<FormData>
      defaultTitle="Publishing"
      initialData={{
        loading,
        data: data?.validatePlaylist,
        error: error?.message,
      }}
      actions={actions}
      saveData={() => {
        // We don't need to save the data, since this station only displays the validation status.
      }}
      edgeToEdgeContent={true}
    >
      {data?.validatePlaylist?.validationStatus ===
        PublishValidationStatus.Errors && (
        <MessageBar
          type="info"
          title="Playlist cannot be published. Please check validation errors and fix related data accordingly."
        />
      )}
      <div className={classes.content}>
        <ValidationResultsTable />
      </div>
    </FormStation>
  );
};
