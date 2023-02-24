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
  CreateTvshowsLicenseMutation,
  MutationCreateTvshowsLicenseArgs,
  useCreateTvshowsLicenseMutation,
} from '../../../generated/graphql';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationCreateTvshowsLicenseArgs['input']['tvshowsLicense'];

type SubmitResponse = CreateTvshowsLicenseMutation['createTvshowsLicense'];

const licenseSchema = Yup.object<ObjectSchemaDefinition<FormData>>({
  tvshowId: Yup.number(),
  licenseStart: getLicenseStartSchema(),
  licenseEnd: getLicenseEndSchema(),
});

export const TvShowLicensingCreate: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const [createTvshowLicenseMutation] = useCreateTvshowsLicenseMutation({
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
        await createTvshowLicenseMutation({
          variables: {
            input: {
              tvshowsLicense: {
                tvshowId: tvshowId,
                ...formDiff,
              },
            },
          },
        })
      ).data?.createTvshowsLicense;
    },
    [createTvshowLicenseMutation, tvshowId],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.tvshowsLicense) {
        history.push(
          `/tvshows/${tvshowId}/licenses/${submitResponse.tvshowsLicense.id}`,
        );
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history, tvshowId],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New TV Show License"
      subtitle="Properties"
      onProceed={onProceed}
      validationSchema={licenseSchema}
      initialData={{
        loading: false,
        data: { tvshowId },
      }}
      saveData={onSubmit}
      cancelNavigationUrl={`/tvshows/${tvshowId}/licenses`}
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
