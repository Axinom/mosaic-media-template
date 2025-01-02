import {
  CheckboxField,
  createUpdateGQLFragmentGenerator,
  DateTimeTextField,
  Details,
  DetailsProps,
  FormActionData,
  formatDateTime,
  generateArrayMutations,
  getFormDiff,
  InfoPanel,
  Paragraph,
  Section,
  SingleLineTextField,
  TagsField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { validate as isUuid } from 'uuid';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  AllCountryType,
  DeleteSeasonsLicensesCountryInput,
  IsoAlphaTwoCountryCodes,
  Mutation,
  MutationCreateSeasonsLicensesCountryArgs,
  MutationDeleteSeasonsLicensesCountryArgs,
  MutationUpdateSeasonsLicenseArgs,
  SeasonsLicense,
  SeasonsLicensesCountry,
  SeasonsLicensesCountryInput,
  useDeleteSeasonsLicenseMutation,
  useSeasonsLicenseQuery,
} from '../../../generated/graphql';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationUpdateSeasonsLicenseArgs['input']['patch'] & {
  countries?: IsoAlphaTwoCountryCodes[];
};

const licenseSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  seasonId: Yup.number().required(),
  licenseStart: getLicenseStartSchema().label('From'),
  licenseEnd: getLicenseEndSchema().label('To'),
  downloadedAssetLifespan: Yup.number()
    .nullable()
    .min(0, 'Downloaded Asset Lifespan must be a positive number')
    .integer('Downloaded Asset Lifespan must be an Integer'),
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

  const { countries, allCountries } = useMemo(
    () => ({
      countries: data?.seasonsLicense?.seasonsLicensesCountries.nodes.flatMap(
        (country) =>
          [country.countryCode, country.countryGroupId].filter(Boolean),
      ),
      allCountries:
        data?.allCountryTypes?.nodes.map(({ name, id }) => ({
          display: name ?? '',
          value: id,
        })) ?? [],
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
                seasonsLicensesCountry: generateCountryAssignmentPatch(
                  code,
                  seasonsLicenseId,
                ),
              },
            },
          ),
        generateDeleteMutation: (code) =>
          generateUpdateGQLFragment<MutationDeleteSeasonsLicensesCountryArgs>(
            'deleteSeasonsLicensesCountry',
            {
              input: generateDeleteCountryAssignmentPatch(
                code,
                data?.seasonsLicense?.seasonsLicensesCountries.nodes,
                data?.allCountryTypes?.nodes,
              ),
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
    [seasonsLicenseId, data],
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
      infoPanel={<Panel />}
    >
      <Form countryOptions={allCountries} />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { values } = useFormikContext<SeasonsLicense>();

  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          <Paragraph title="Created">
            {formatDateTime(values.createdDate)} by {values.createdUser}
          </Paragraph>
          <Paragraph title="Last Modified">
            {formatDateTime(values.updatedDate)} by {values.updatedUser}
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [
    values.createdDate,
    values.createdUser,
    values.updatedDate,
    values.updatedUser,
  ]);
};

interface Option {
  display: string;
  value: any;
}

const Form: React.FC<{
  countryOptions?: Option[];
}> = ({ countryOptions }) => {
  return (
    <>
      <Field name="licenseStart" label="From" as={DateTimeTextField} />
      <Field name="licenseEnd" label="To" as={DateTimeTextField} />
      <Field
        name="countries"
        label="Licensing Countries"
        tagsOptions={countryOptions}
        as={TagsField}
        displayKey="display"
        valueKey="value"
      />
      <Field name="isDownloadable" label="Downloadable" as={CheckboxField} />
      <Field
        name="downloadedAssetLifespan"
        label="Downloaded asset lifespan (days)"
        type="number"
        as={SingleLineTextField}
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
  if (rest.downloadedAssetLifespan !== undefined) {
    return {
      ...rest,
      downloadedAssetLifespan:
        typeof rest.downloadedAssetLifespan === 'string'
          ? 0
          : rest.downloadedAssetLifespan,
    };
  } else {
    return rest;
  }
}

const generateDeleteCountryAssignmentPatch = (
  countryId: string,
  licensesCountries: SeasonsLicensesCountry['id'],
  allCountries: AllCountryType[] | undefined,
): DeleteSeasonsLicensesCountryInput => {
  if (!isUuid(countryId)) {
    const country = licensesCountries.find(
      (con: SeasonsLicensesCountry['id']) => con.countryCode === countryId,
    );
    if (country) {
      return { id: country.id };
    }
  } else {
    if (allCountries) {
      const licensesCountry = licensesCountries.find(
        (con: SeasonsLicensesCountry['id']) => con.countryGroupId === countryId,
      );
      if (licensesCountry) {
        return { id: licensesCountry.id };
      }
    }
  }
  return { id: 0 };
};

const generateCountryAssignmentPatch = (
  countryId: IsoAlphaTwoCountryCodes,
  seasonsLicenseId: number,
): SeasonsLicensesCountryInput['id'] => {
  if (!isUuid(countryId)) {
    return {
      seasonsLicenseId,
      countryCode: { type: 'enum', value: countryId },
    };
  } else {
    return {
      seasonsLicenseId,
      countryGroupId: countryId,
    };
  }
};
