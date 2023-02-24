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
  MutationCreateSeasonsLicensesCountryArgs,
  MutationDeleteSeasonsLicensesCountryArgs,
  MutationUpdateSeasonsLicenseArgs,
  useDeleteSeasonsLicenseMutation,
  useSeasonsLicenseQuery,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationUpdateSeasonsLicenseArgs['input']['patch'] & {
  countries?: IsoAlphaTwoCountryCodes[];
};

const licenseSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  seasonId: Yup.number().required(),
  licenseStart: getLicenseStartSchema(),
  licenseEnd: getLicenseEndSchema(),
});

export const SeasonLicensingDetails: React.FC = () => {
  const params = useParams<{
    seasonsLicenseId: string;
    seasonId: string;
  }>();

  const seasonsLicenseId = Number(params.seasonsLicenseId);
  const seasonId = Number(params.seasonId);

  const { loading, data, error } = useSeasonsLicenseQuery({
    client,
    variables: { id: seasonsLicenseId },
    fetchPolicy: 'no-cache',
  });

  const { countries } = useMemo(
    () => ({
      countries: data?.seasonsLicense?.seasonsLicensesCountries.nodes.map(
        (country) => country.code,
      ),
    }),
    [data],
  );

  const { actions } = useActions(seasonsLicenseId, seasonId);

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
          generateUpdateGQLFragment<MutationCreateSeasonsLicensesCountryArgs>(
            'createSeasonsLicensesCountry',
            {
              input: {
                seasonsLicensesCountry: {
                  code: { type: 'enum', value: code },
                  seasonsLicenseId,
                },
              },
            },
          ),
        generateDeleteMutation: (code) =>
          generateUpdateGQLFragment<MutationDeleteSeasonsLicensesCountryArgs>(
            'deleteSeasonsLicensesCountry',
            {
              input: { code: { type: 'enum', value: code }, seasonsLicenseId },
            },
          ),
      });

      const patch = createUpdateDto(formData, initialData.data);

      const licenseUpdateMutations =
        Object.keys(patch).length > 0
          ? generateUpdateGQLFragment<MutationUpdateSeasonsLicenseArgs>(
              'updateSeasonsLicense',
              {
                input: { id: seasonsLicenseId, patch },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateSeasonsLicense {
        ${licenseUpdateMutations}
        ${countryAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [seasonsLicenseId],
  );

  return (
    <Details<FormData>
      defaultTitle="Season Licensing Details"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={licenseSchema}
      initialData={{
        data: {
          ...data?.seasonsLicense,
          countries,
        },
        loading,
        entityNotFound: data?.seasonsLicense === null,
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
  seasonId: number,
): {
  readonly actions: FormActionData<FormData>[];
} {
  const history = useHistory();

  const [deleteSeasonsLicenseMutation] = useDeleteSeasonsLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteLicense = async (): Promise<void> => {
    await deleteSeasonsLicenseMutation({ variables: { input: { id } } });
    history.push(`/seasons/${seasonId}/licenses`);
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
