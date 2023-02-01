import {
  createUpdateGQLFragmentGenerator,
  DateTimeTextField,
  Details,
  DetailsProps,
  FormActionData,
  generateArrayMutations,
  getFormDiff,
  IconName,
  TagsField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  IsoAlphaTwoCountryCodes,
  Mutation,
  MutationCreateMoviesLicensesCountryArgs,
  MutationDeleteMoviesLicensesCountryArgs,
  MutationUpdateMoviesLicenseArgs,
  useDeleteMoviesLicenseMutation,
  useMoviesLicenseQuery,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';

type FormData = MutationUpdateMoviesLicenseArgs['input']['patch'] & {
  countries?: IsoAlphaTwoCountryCodes[];
};

const licenseSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
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

export const MovieLicensingDetails: React.FC = () => {
  const params = useParams<{
    moviesLicenseId: string;
    movieId: string;
  }>();

  const moviesLicenseId = Number(params.moviesLicenseId);
  const movieId = Number(params.movieId);

  const { loading, data, error } = useMoviesLicenseQuery({
    client,
    variables: { id: moviesLicenseId },
    fetchPolicy: 'no-cache',
  });

  const { countries } = useMemo(
    () => ({
      countries: data?.moviesLicense?.moviesLicensesCountries.nodes.map(
        (country) => country.code,
      ),
    }),
    [data],
  );

  const { actions } = useActions(moviesLicenseId, movieId);

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const countryAssignmentMutations = generateArrayMutations({
        current: formData.countries,
        original: initialData.data?.countries,
        generateCreateMutation: (code) =>
          generateUpdateGQLFragment<MutationCreateMoviesLicensesCountryArgs>(
            'createMoviesLicensesCountry',
            {
              input: {
                moviesLicensesCountry: {
                  code: { type: 'enum', value: code },
                  moviesLicenseId,
                },
              },
            },
          ),
        generateDeleteMutation: (code) =>
          generateUpdateGQLFragment<MutationDeleteMoviesLicensesCountryArgs>(
            'deleteMoviesLicensesCountry',
            { input: { code: { type: 'enum', value: code }, moviesLicenseId } },
          ),
      });

      const patch = createUpdateDto(formData, initialData.data);

      const licenseUpdateMutations =
        Object.keys(patch).length > 0
          ? generateUpdateGQLFragment<MutationUpdateMoviesLicenseArgs>(
              'updateMoviesLicense',
              {
                input: { id: moviesLicenseId, patch },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateMoviesLicense {
        ${licenseUpdateMutations}
        ${countryAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [moviesLicenseId],
  );

  return (
    <Details<FormData>
      defaultTitle="Movie Licensing Details"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={licenseSchema}
      initialData={{
        data: {
          ...data?.moviesLicense,
          countries,
        },
        loading,
        entityNotFound: data?.moviesLicense === null,
        error: error?.message,
      }}
      saveData={onSubmit}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="licenseStart" label="From" as={DateTimeTextField} />
      <Field name="licenseEnd" label="To" as={DateTimeTextField} />
      <Field
        name="countries"
        label="Licensing Countries"
        tagsOptions={CountryNames}
        as={TagsField}
        displayKey="display"
        valueKey="value"
      />
    </>
  );
};

function useActions(
  id: number,
  movieId: number,
): {
  readonly actions: FormActionData<FormData>[];
} {
  const history = useHistory();

  const [deleteMoviesLicenseMutation] = useDeleteMoviesLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteLicense = async (): Promise<void> => {
    await deleteMoviesLicenseMutation({ variables: { input: { id } } });
    history.push(`/movies/${movieId}/licenses`);
  };

  const actions: FormActionData<FormData>[] = [
    {
      label: 'Delete',
      icon: IconName.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteLicense,
    },
  ];

  return { actions } as const;
}

function createUpdateDto(
  currentValues: FormData,
  initialValues?: FormData | null,
): Partial<FormData> {
  const { countries, ...rest } = getFormDiff(currentValues, initialValues);

  return rest;
}
