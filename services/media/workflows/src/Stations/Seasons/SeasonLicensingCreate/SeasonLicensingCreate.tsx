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
  CreateSeasonsLicenseMutation,
  MutationCreateSeasonsLicenseArgs,
  useCreateSeasonsLicenseMutation,
} from '../../../generated/graphql';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationCreateSeasonsLicenseArgs['input']['seasonsLicense'];

type SubmitResponse = CreateSeasonsLicenseMutation['createSeasonsLicense'];

const licenseSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  seasonId: Yup.number().required(),
  licenseStart: getLicenseStartSchema().label('From'),
  licenseEnd: getLicenseEndSchema().label('To'),
});

export const SeasonLicensingCreate: React.FC = () => {
  const seasonId = Number(
    useParams<{
      seasonId: string;
    }>().seasonId,
  );

  const [createSeasonsLicenseMutation] = useCreateSeasonsLicenseMutation({
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
        await createSeasonsLicenseMutation({
          variables: {
            input: {
              seasonsLicense: {
                seasonId: seasonId,
                ...formDiff,
              },
            },
          },
        })
      ).data?.createSeasonsLicense;
    },
    [createSeasonsLicenseMutation, seasonId],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.seasonsLicense) {
        history.push(
          `/seasons/${seasonId}/licenses/${submitResponse.seasonsLicense.id}`,
        );
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history, seasonId],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New Season License"
      subtitle="Properties"
      onProceed={onProceed}
      initialData={{
        loading: false,
        data: { seasonId },
      }}
      validationSchema={licenseSchema}
      saveData={onSubmit}
      cancelNavigationUrl={`/seasons/${seasonId}/licenses`}
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
