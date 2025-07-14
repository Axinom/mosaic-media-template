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
import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { validate as isUuid } from 'uuid';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  AllCountryType,
  DeleteEpisodesLicensesCountryInput,
  EpisodesLicense,
  EpisodesLicensesCountry,
  EpisodesLicensesCountryInput,
  IsoAlphaTwoCountryCodes,
  Mutation,
  MutationCreateEpisodesLicensesCountryArgs,
  MutationDeleteEpisodesLicensesCountryArgs,
  MutationUpdateEpisodesLicenseArgs,
  useDeleteEpisodesLicenseMutation,
  useEpisodesLicenseQuery,
} from '../../../generated/graphql';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationUpdateEpisodesLicenseArgs['input']['patch'] & {
  countries?: IsoAlphaTwoCountryCodes[];
};

const licenseSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  episodeId: Yup.number().required(),
  licenseStart: getLicenseStartSchema().label('From'),
  licenseEnd: getLicenseEndSchema().label('To'),
  downloadedAssetLifespan: Yup.number()
    .nullable()
    .min(0, 'Downloaded Asset Lifespan must be a positive number')
    .integer('Downloaded Asset Lifespan must be an Integer'),
});

export const EpisodeLicensingDetails: React.FC = () => {
  const params = useParams<{
    episodesLicenseId: string;
    episodeId: string;
  }>();

  const episodesLicenseId = Number(params.episodesLicenseId);
  const episodeId = Number(params.episodeId);

  const { loading, data, error } = useEpisodesLicenseQuery({
    client,
    variables: { id: episodesLicenseId },
    fetchPolicy: 'no-cache',
  });

  const { countries, allCountries } = useMemo(
    () => ({
      countries: data?.episodesLicense?.episodesLicensesCountries.nodes.flatMap(
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

  const { actions } = useActions(episodesLicenseId, episodeId);

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
          generateUpdateGQLFragment<MutationCreateEpisodesLicensesCountryArgs>(
            'createEpisodesLicensesCountry',
            {
              input: {
                episodesLicensesCountry: generateCountryAssignmentPatch(
                  code,
                  episodesLicenseId,
                ),
              },
            },
          ),
        generateDeleteMutation: (code) =>
          generateUpdateGQLFragment<MutationDeleteEpisodesLicensesCountryArgs>(
            'deleteEpisodesLicensesCountry',
            {
              input: generateDeleteCountryAssignmentPatch(
                code,
                data?.episodesLicense?.episodesLicensesCountries.nodes,
                data?.allCountryTypes?.nodes,
              ),
            },
          ),
      });

      const patch = createUpdateDto(formData, initialData.data);

      const licenseUpdateMutations =
        Object.keys(patch).length > 0
          ? generateUpdateGQLFragment<MutationUpdateEpisodesLicenseArgs>(
              'updateEpisodesLicense',
              {
                input: { id: episodesLicenseId, patch },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateEpisodesLicense {
        ${licenseUpdateMutations}
        ${countryAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [episodesLicenseId, data],
  );

  return (
    <Details<FormData>
      defaultTitle="Episode Licensing Details"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={licenseSchema}
      initialData={{
        data: {
          ...data?.episodesLicense,
          countries,
        },
        loading,
        entityNotFound: data?.episodesLicense === null,
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
  const { values } = useFormikContext<EpisodesLicense>();

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
    values.id,
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
  const { values, setFieldValue } = useFormikContext<FormData>();
  useEffect(() => {
    if (!values.isDownloadable) {
      setFieldValue('downloadedAssetLifespan', 0);
    }
  }, [setFieldValue, values.isDownloadable]);
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
        disabled={!values.isDownloadable}
        as={SingleLineTextField}
      />
    </>
  );
};

function useActions(
  id: number,
  episodeId: number,
): {
  readonly actions: FormActionData<FormData>[];
} {
  const history = useHistory();

  const [deleteEpisodesLicenseMutation] = useDeleteEpisodesLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteLicense = async (): Promise<void> => {
    await deleteEpisodesLicenseMutation({ variables: { input: { id } } });
    history.push(`/episodes/${episodeId}/licenses`);
  };

  const actions: FormActionData[] = [
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
  if (
    rest.downloadedAssetLifespan !== undefined ||
    rest.isDownloadable !== undefined
  ) {
    return {
      ...rest,
      downloadedAssetLifespan:
        typeof rest.downloadedAssetLifespan === 'string' ||
        rest.isDownloadable === false
          ? 0
          : rest.downloadedAssetLifespan,
    };
  } else {
    return rest;
  }
}

const generateDeleteCountryAssignmentPatch = (
  countryId: string,
  licensesCountries: EpisodesLicensesCountry['id'],
  allCountries: AllCountryType[] | undefined,
): DeleteEpisodesLicensesCountryInput => {
  if (!isUuid(countryId)) {
    const country = licensesCountries.find(
      (con: EpisodesLicensesCountry['id']) => con.countryCode === countryId,
    );
    if (country) {
      return { id: country.id };
    }
  } else {
    if (allCountries) {
      const licensesCountry = licensesCountries.find(
        (con: EpisodesLicensesCountry['id']) =>
          con.countryGroupId === countryId,
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
  episodesLicenseId: number,
): EpisodesLicensesCountryInput['id'] => {
  if (!isUuid(countryId)) {
    return {
      episodesLicenseId,
      countryCode: { type: 'enum', value: countryId },
    };
  } else {
    return {
      episodesLicenseId,
      countryGroupId: countryId,
    };
  }
};
