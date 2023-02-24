import {
  ActionHandler,
  Create,
  CreateProps,
  DateTimeTextField,
  getFormDiff,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateEpisodesLicenseMutation,
  MutationCreateEpisodesLicenseArgs,
  useCreateEpisodesLicenseMutation,
} from '../../../generated/graphql';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationCreateEpisodesLicenseArgs['input']['episodesLicense'];

type SubmitResponse = CreateEpisodesLicenseMutation['createEpisodesLicense'];

const licenseSchema = Yup.object<ObjectSchemaDefinition<FormData>>({
  episodeId: Yup.number().required(),
  licenseStart: getLicenseStartSchema(),
  licenseEnd: getLicenseEndSchema(),
});

export const EpisodeLicensingCreate: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  const [createEpisodesLicenseMutation] = useCreateEpisodesLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: CreateProps<FormData>['initialData'],
    ): Promise<SubmitResponse> => {
      const formDiff = getFormDiff(formData, initialData.data);
      return (
        await createEpisodesLicenseMutation({
          variables: {
            input: {
              episodesLicense: {
                episodeId: episodeId,
                ...formDiff,
              },
            },
          },
        })
      ).data?.createEpisodesLicense;
    },
    [createEpisodesLicenseMutation, episodeId],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.episodesLicense) {
        history.push(
          `/episodes/${episodeId}/licenses/${submitResponse.episodesLicense.id}`,
        );
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [episodeId, history],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New Episode License"
      subtitle="Properties"
      onProceed={onProceed}
      validationSchema={licenseSchema}
      initialData={{
        loading: false,
        data: { episodeId },
      }}
      saveData={onSubmit}
      cancelNavigationUrl={`/episodes/${episodeId}/licenses`}
    >
      <Form />
    </Create>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="licenseStart" label="From" as={DateTimeTextField} />
      <Field name="licenseEnd" label="To" as={DateTimeTextField} />
    </>
  );
};
