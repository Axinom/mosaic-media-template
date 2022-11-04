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
import { date, object, ref } from 'yup';
import { client } from '../../../apolloClient';
import {
  IsoAlphaTwoCountryCodes,
  Mutation,
  MutationCreateTvshowsLicensesCountryArgs,
  MutationDeleteTvshowsLicensesCountryArgs,
  MutationUpdateTvshowsLicenseArgs,
  useDeleteTvshowsLicenseMutation,
  useTvshowsLicenseQuery,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';

type FormData = MutationUpdateTvshowsLicenseArgs['input']['patch'] & {
  countries?: IsoAlphaTwoCountryCodes[];
};

const licenseSchema = object<ObjectSchemaDefinition<FormData>>({
  licenseStart: date(),
  licenseEnd: date().when('licenseStart', {
    is: (start) => start != null,
    then: (end) =>
      end.min(
        ref('licenseStart'),
        'License end date cannot be before start date',
      ),
  }),
});

export const TvShowLicensingDetails: React.FC = () => {
  const params = useParams<{
    tvshowsLicenseId: string;
    tvshowId: string;
  }>();

  const tvshowsLicenseId = Number(params.tvshowsLicenseId);
  const tvshowId = Number(params.tvshowId);

  const { loading, data, error } = useTvshowsLicenseQuery({
    client,
    variables: { id: tvshowsLicenseId },
    fetchPolicy: 'no-cache',
  });

  const { countries } = useMemo(
    () => ({
      countries: data?.tvshowsLicense?.tvshowsLicensesCountries.nodes.map(
        (country) => country.code,
      ),
    }),
    [data],
  );

  const { actions } = useActions(tvshowsLicenseId, tvshowId);

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<
        Mutation
      >();

      const countryAssignmentMutations = generateArrayMutations({
        current: formData.countries,
        original: initialData.data?.countries,
        generateCreateMutation: (code) =>
          generateUpdateGQLFragment<MutationCreateTvshowsLicensesCountryArgs>(
            'createTvshowsLicensesCountry',
            {
              input: {
                tvshowsLicensesCountry: {
                  code: { type: 'enum', value: code },
                  tvshowsLicenseId,
                },
              },
            },
          ),
        generateDeleteMutation: (code) =>
          generateUpdateGQLFragment<MutationDeleteTvshowsLicensesCountryArgs>(
            'deleteTvshowsLicensesCountry',
            {
              input: { code: { type: 'enum', value: code }, tvshowsLicenseId },
            },
          ),
      });

      const patch = createUpdateDto(formData, initialData.data);

      const licenseUpdateMutations =
        Object.keys(patch).length > 0
          ? generateUpdateGQLFragment<MutationUpdateTvshowsLicenseArgs>(
              'updateTvshowsLicense',
              {
                input: { id: tvshowsLicenseId, patch },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateTvShowsLicense {
        ${licenseUpdateMutations}
        ${countryAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [tvshowsLicenseId],
  );

  return (
    <Details<FormData>
      defaultTitle="TV Show Licensing Details"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={licenseSchema}
      initialData={{
        data: {
          ...data?.tvshowsLicense,
          countries,
        },
        loading,
        entityNotFound: data?.tvshowsLicense === null,
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
  tvshowId: number,
): {
  readonly actions: FormActionData<FormData>[];
} {
  const history = useHistory();

  const [deleteTvshowsLicenseMutation] = useDeleteTvshowsLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteLicense = async (): Promise<void> => {
    await deleteTvshowsLicenseMutation({ variables: { input: { id } } });
    history.push(`/tvshows/${tvshowId}/licenses`);
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
