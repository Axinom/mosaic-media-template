import {
  EmptyStation,
  ErrorTypeToStationError,
  StationError,
} from '@axinom/mosaic-ui';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { client } from '../../../../apolloClient';
import {
  ProgramDetailsRootPathParamsDocument,
  ProgramDetailsRootPathParamsQuery,
  useProgramDetailsRootPathParamsQuery,
} from '../../../../generated/graphql';
import { routes } from '../../routes';
import classes from './ProgramDetails.module.scss';

/**
 * A React component that redirects linked items from localization workflows
 * for entity type `program` to the program management station.
 * This component is used to retrieve the necessary `channelId` and `playlistId`
 * information that is required by the `ProgramManagement` component.
 *
 * The `LocalizationService` only has knowledge of `programId`, so this component is responsible
 * for determining the relevant `channelId` and `playlistId` and then redirecting
 * the user to the `ProgramManagement` component, which has no knowledge of `programId`.
 */
export const ProgramDetails: React.FC = () => {
  const history = useHistory();
  const { programId } = useParams<{ programId: string }>();
  const [stationError, setStationError] = useState<StationError | undefined>();

  const { data, error } = useProgramDetailsRootPathParamsQuery({
    client,
    variables: {
      programId,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    const playlistId = data?.program?.playlist?.id;

    if (playlistId) {
      history.replace(
        routes.generate(routes.program, {
          channelId: data?.program?.playlist?.channel?.id,
          playlistId,
        }),
      );
    } else if (error) {
      const stationError = ErrorTypeToStationError(
        error,
        'An error occurred when trying to load data.',
        'Entity not found',
      );
      setStationError(stationError);
    } else if (data?.program === null) {
      setStationError({
        title: `Could not find program with ID "${programId}".`,
      });
    }
  }, [data, error, history, programId]);

  return (
    <EmptyStation title="Program Management" stationError={stationError}>
      <div className={classes.container}>
        {!stationError && <h2>Loading...</h2>}
      </div>
    </EmptyStation>
  );
};

export const resolveProgramDetailsRoot = async (
  programId: string,
): Promise<{ playlistId: string; channelId: string }> => {
  const { data } = await client.query<ProgramDetailsRootPathParamsQuery>({
    query: ProgramDetailsRootPathParamsDocument,
    variables: {
      programId,
    },
  });
  return {
    playlistId: data?.program?.playlist?.id,
    channelId: data?.program?.playlist?.channel?.id,
  };
};
