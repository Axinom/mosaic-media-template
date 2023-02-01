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
  CreateMoviesLicenseMutation,
  MutationCreateMoviesLicenseArgs,
  useCreateMoviesLicenseMutation,
} from '../../../generated/graphql';

type FormData = MutationCreateMoviesLicenseArgs['input']['moviesLicense'];

type SubmitResponse = CreateMoviesLicenseMutation['createMoviesLicense'];

const licenseSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  movieId: Yup.number().required(),
  licenseStart: Yup.date().typeError('required'),
  licenseEnd: Yup.date()
    .typeError('required')
    .test(
      'checkEndDate',
      'License end date cannot be before start date',
      function (value) {
        const { parent } = this;
        if (value) {
          return parent.licenseStart.getMinutes() < value.getMinutes();
        }
        return true;
      },
    ),
});

export const MovieLicensingCreate: React.FC = () => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );

  const [createMoviesLicenseMutation] = useCreateMoviesLicenseMutation({
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
        await createMoviesLicenseMutation({
          variables: {
            input: {
              moviesLicense: {
                movieId: movieId,
                ...formDiff,
              },
            },
          },
        })
      ).data?.createMoviesLicense;
    },
    [createMoviesLicenseMutation, movieId],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.moviesLicense) {
        history.push(
          `/movies/${movieId}/licenses/${submitResponse.moviesLicense.id}`,
        );
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history, movieId],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New Movie License"
      subtitle="Properties"
      onProceed={onProceed}
      initialData={{
        loading: false,
        data: { movieId },
      }}
      validationSchema={licenseSchema}
      saveData={onSubmit}
      cancelNavigationUrl={`/movies/${movieId}/licenses`}
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
