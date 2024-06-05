import { FetchResult } from '@apollo/client';
import {
  Details,
  DetailsProps,
  getFormDiff,
  StationError,
} from '@axinom/mosaic-ui';
import gql from 'graphql-tag';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CuePointSchedule,
  CuePointScheduleType,
  PlaylistPatch,
  ProgramBreakType,
  ProgramCuePoint,
  ProgramsConnection,
  Scalars,
  UpdatePlaylistMutation,
  UpdatePlaylistMutationVariables,
  UpdateProgramCuePointPayload,
  UpdateVideoCuePointSchedulePayload,
  usePlaylistProgramsQuery,
} from '../../../generated/graphql';
import { routes } from '../routes';
import {
  addCuePointIdsToCuePointsSchedules,
  addProgramIdsToCuePoints,
  sortPrograms,
} from './helpers';
import { generateAdSchedulesMutations } from './mutations/ad-schedules';
import { generateCuePointMutations } from './mutations/cue-points';
import { generateProgramMutations } from './mutations/program';
import { generateVideoSchedulesMutations } from './mutations/video-schedules';
import { Panel } from './Panel/Panel';
import {
  ProgramCuePointPayLoad,
  ProgramManagementFormData as FormData,
  ProgramProps,
} from './ProgramManagement.types';
import { ProgramManagementForm } from './ProgramManagementForm/ProgramManagementForm';
import { ProgramManagementProvider } from './ProgramManagementProvider/ProgramManagementProvider';

interface UrlParams {
  channelId: string;
  playlistId: string;
}

export const ProgramManagement: React.FC = () => {
  const { channelId, playlistId } = useParams<UrlParams>();
  const history = useHistory();

  const [stationError, setStationError] = useState<StationError | undefined>();

  const { loading, data, error } = usePlaylistProgramsQuery({
    client,
    variables: { id: playlistId },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    // in case channelId is undefined, we need to redirect to the correct channel
    // this will resolve correct title and navigation for channel breadcrumb
    if (channelId === ':channelId' && data?.channel?.channelId) {
      history.replace(
        routes.generate(routes.programs, {
          channelId: data?.channel?.channelId,
          playlistId: playlistId,
        }),
      );
    }
  }, [channelId, data?.channel?.channelId, history, playlistId]);

  const form = data?.playlist?.programs
    ? {
        ...data?.playlist,
        programs: {
          ...sortPrograms(data?.playlist?.programs as ProgramsConnection),
        },
      }
    : data?.playlist;

  const programSchema = Yup.object({
    startDateTime: Yup.string(),
    calculatedEndDateTime: Yup.string(),
    calculatedDurationInSeconds: Yup.number().required(),
    programs: Yup.object().shape({
      nodes: Yup.array().of(
        Yup.object().shape({
          id: Yup.string(),
          sortIndex: Yup.number().integer().required(),
          title: Yup.string(),
          entityId: Yup.string().required().typeError('Entity Id is invalid'),
          entityType: Yup.string()
            .required()
            .typeError('Entity requires a valid type'),
          videoDurationInSeconds: Yup.number().required(
            'Video duration is required',
          ),
          imageId: Yup.string().nullable(),
          videoId: Yup.string()
            .required()
            .typeError('Entity has no valid video'),
          programCuePoints: Yup.object().shape({
            nodes: Yup.array().of(
              Yup.object().shape({
                id: Yup.string(),
                type: Yup.string()
                  .oneOf([
                    ProgramBreakType.Pre,
                    ProgramBreakType.Mid,
                    ProgramBreakType.Post,
                  ])
                  .required('Program Cue Point must `PRE`, `MID`, or `POST`'),
                videoCuePointId: Yup.string().when(['type'], {
                  is: (type: ProgramBreakType) =>
                    ProgramBreakType.Pre === type ||
                    ProgramBreakType.Post === type,
                  then: Yup.string().nullable().default(null),
                  otherwise: Yup.string().required(
                    '`MID` Program Cue Points require a valid `videoCuePointId`',
                  ),
                }),
                timeInSeconds: Yup.number().when(['type'], {
                  is: (type: ProgramBreakType) =>
                    ProgramBreakType.Pre === type ||
                    ProgramBreakType.Post === type,
                  then: Yup.number().nullable().default(null),
                  otherwise: Yup.number().required(
                    '`MID` Program Cue Points require a valid `timeInSeconds`',
                  ),
                }),
                cuePointSchedules: Yup.object().shape({
                  nodes: Yup.array().of(
                    Yup.object().shape({
                      id: Yup.string(),
                      type: Yup.string()
                        .oneOf([
                          CuePointScheduleType.AdPod,
                          CuePointScheduleType.Video,
                        ])
                        .required('Schedule must be `AD_POD` or `VIDEO`'),
                      durationInSeconds: Yup.number()
                        .typeError('Invalid Timestamp')
                        .positive('Cannot be zero')
                        .required('Duration required'),
                      videoId: Yup.string().when(['type'], {
                        is: (type: CuePointScheduleType) =>
                          CuePointScheduleType.AdPod === type,
                        then: Yup.string().nullable().default(null),
                        otherwise: Yup.string().required(
                          '`VIDEO` Cue Points Schedules require a valid `videoId`',
                        ),
                      }),
                      sortIndex: Yup.number().integer().required(),
                      programCuePointId: Yup.string(),
                    }),
                  ),
                }),
              }),
            ),
          }),
        }),
      ),
    }),
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      // These initial arrays contain only those that aren't associated with a deleted program
      const initialCuePoints: ProgramCuePoint[] = [];
      const initialAdSchedules: CuePointSchedule[] = [];
      const initialVideoSchedules: CuePointSchedule[] = [];

      // #region program and playlist mutations
      const patch: PlaylistPatch = createUpdateDto(formData, initialData.data);

      const deletedProgramIds: Scalars['UUID'][] = [];
      const deletedCuePointIds: Scalars['UUID'][] = [];

      const programMutations = generateProgramMutations(
        formData?.programs.nodes as ProgramProps[],
        initialData.data?.programs.nodes as ProgramProps[],
        playlistId,
        deletedProgramIds,
        deletedCuePointIds,
      );

      const gqlDoc = gql`mutation UpdatePlaylist($input: UpdatePlaylistInput!) {
          updatePlaylist(input: $input) {
            clientMutationId
            playlist {
              id
            }
          }
        ${programMutations}
      }`;

      // wait for programs to save
      const programResults = await client.mutate<
        UpdatePlaylistMutation,
        UpdatePlaylistMutationVariables
      >({
        mutation: gqlDoc,
        variables: { input: { id: playlistId, patch } },
      });
      // #endregion

      // #region cue point mutations

      for (const programNode of initialData.data?.programs?.nodes ?? []) {
        // separate cuePointSchedules and programCuePoints
        for (const { cuePointSchedules, ...rest } of programNode
          ?.programCuePoints?.nodes ?? []) {
          // only add cue points that were't deleted with a program
          if (!deletedProgramIds.includes(programNode.id)) {
            initialCuePoints.push(rest as ProgramCuePoint);
          }
          // only add cue point schedules that weren't deleted with a program
          for (const cps of cuePointSchedules?.nodes ?? []) {
            if (
              !deletedProgramIds.includes(programNode.id) &&
              cps.type === CuePointScheduleType.AdPod
            ) {
              initialAdSchedules.push(cps as CuePointSchedule);
            }
            if (
              !deletedProgramIds.includes(programNode.id) &&
              cps.type === CuePointScheduleType.Video
            ) {
              initialVideoSchedules.push(cps as CuePointSchedule);
            }
          }
        }
      }

      const cuePointsForOperations: ProgramCuePointPayLoad[] =
        addProgramIdsToCuePoints(formData, programResults);

      const cuePointsMutations = generateCuePointMutations(
        cuePointsForOperations,
        initialCuePoints,
      );

      let cuePointResults:
        | FetchResult<UpdateProgramCuePointPayload>
        | undefined;

      // only send cue point mutations if any exists
      if (cuePointsMutations.length) {
        const gqlCuePointDoc = gql`mutation UpdateCuePoints {
          ${cuePointsMutations}
        }`;

        cuePointResults = await client.mutate<UpdateProgramCuePointPayload>({
          mutation: gqlCuePointDoc,
        });
      }

      // #endregion

      const [adSchedulesForOperations, videoSchedulesForOperations] =
        addCuePointIdsToCuePointsSchedules(formData, cuePointResults);

      // #region video and ad pod cue point schedules mutations

      const videoSchedulesMutations = generateVideoSchedulesMutations(
        videoSchedulesForOperations,
        initialVideoSchedules,
      );

      const adSchedulesMutations = generateAdSchedulesMutations(
        adSchedulesForOperations,
        initialAdSchedules,
      );

      // update video and ad pod cue point schedules mutations if any exists
      if (videoSchedulesMutations.length || adSchedulesMutations.length) {
        const gqlDoc = gql`mutation UpdateSchedules {
          ${videoSchedulesMutations}
          ${adSchedulesMutations}
        }`;
        await client.mutate<UpdateVideoCuePointSchedulePayload>({
          mutation: gqlDoc,
        });
      }

      // #endregion
    },
    [playlistId],
  );

  return (
    <ProgramManagementProvider>
      <Details<FormData>
        defaultTitle="Programs"
        initialData={{
          data: form,
          loading,
          entityNotFound: data?.playlist === null,
          error: error?.message,
        }}
        validationSchema={programSchema}
        saveData={onSubmit}
        infoPanel={<Panel />}
        stationMessage={
          stationError
            ? {
                title: stationError.title,
                type: 'error',
                onClose: () => setStationError(undefined),
              }
            : undefined
        }
      >
        <ProgramManagementForm
          onStationError={(err) => {
            setStationError(err);
          }}
        />
      </Details>
    </ProgramManagementProvider>
  );
};

const createUpdateDto = (
  currentValues: FormData,
  initialValues?: FormData | null,
): { readonly calculatedDurationInSeconds?: number } => {
  const { calculatedDurationInSeconds } = getFormDiff(
    { calculatedDurationInSeconds: currentValues?.calculatedDurationInSeconds },
    { calculatedDurationInSeconds: initialValues?.calculatedDurationInSeconds },
  );

  return { calculatedDurationInSeconds } as const;
};
