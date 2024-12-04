import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  formatDateTime,
  generateArrayMutations,
  getFormDiff,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
  showNotification,
  SingleLineTextField,
  TagsField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../../apolloClient';
import {
  CreateCountryGroupsCountryPayload,
  Movie,
  Mutation,
  MutationCreateCountryGroupsCountryArgs,
  MutationDeleteCountryGroupsCountryArgs,
  MutationUpdateCountryGroupArgs,
  useCountryGroupQuery,
} from '../../../../generated/graphql';
import { CountryNames } from '../../../../Util/CountryNames/CountryNames';
import { useCountryGroupDetailsActions } from './CountryGroupDetails.actions';
import { CountryGroupDetailsFormData } from './CountryGroupDetails.types';

const countryGroupDetailSchema = Yup.object<
  ObjectSchemaDefinition<CountryGroupDetailsFormData>
>({
  name: Yup.string().required('Title is a required field').max(100),
});

export const CountryGroupDetails: React.FC = () => {
  const countryId = useParams<{
    countryId: string;
  }>()?.countryId;

  const { loading, data, error } = useCountryGroupQuery({
    client,
    variables: { id: countryId },
    fetchPolicy: 'network-only',
  });

  const { countries } = useMemo(
    () => ({
      countries: data?.countryGroup?.countryGroupsCountriesByGroupId.nodes.map(
        (country) => country.countryId,
      ),
    }),
    [data],
  );
  const { actions } = useCountryGroupDetailsActions(countryId);

  const onSubmit = useCallback(
    async (
      formData: CountryGroupDetailsFormData,
      initialData: DetailsProps<CountryGroupDetailsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const countryAssignmentMutations = generateArrayMutations({
        current: formData.countries,
        original: initialData.data?.countries,
        generateCreateMutation: (code) =>
          generateUpdateGQLFragment<
            MutationCreateCountryGroupsCountryArgs,
            CreateCountryGroupsCountryPayload
          >(
            'createCountryGroupsCountry',
            {
              input: {
                groupId: countryId,
                countryId: { type: 'enum', value: code },
              },
            },
            [
              {
                message: ['String']['output'],
              },
            ],
          ),
        generateDeleteMutation: (code) =>
          generateUpdateGQLFragment<MutationDeleteCountryGroupsCountryArgs>(
            'deleteCountryGroupsCountry',
            {
              input: {
                countryId: { type: 'enum', value: code },
                groupId: countryId,
              },
            },
          ),
      });

      const patch = createUpdateDto(formData, initialData.data);

      const countryGroupUpdateMutations =
        Object.keys(patch).length > 0
          ? generateUpdateGQLFragment<MutationUpdateCountryGroupArgs>(
              'updateCountryGroup',
              {
                input: { id: countryId, patch },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateCountryGroup {
        ${countryGroupUpdateMutations}
        ${countryAssignmentMutations}
      }`;

      const response = await client.mutate({ mutation: GqlMutationDocument });
      if (response.data?.create0?.message) {
        showNotification({
          title: response.data.create0.message,
          options: {
            type: 'info',
            autoClose: false,
          },
        });
      }
    },
    [countryId],
  );

  return (
    <Details<CountryGroupDetailsFormData>
      defaultTitle="Country"
      titleProperty="name"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={countryGroupDetailSchema}
      initialData={{
        data: {
          ...data?.countryGroup,
          countries,
        },
        loading,
        entityNotFound: data?.countryGroup === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
    >
      <Form />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { values } = useFormikContext<Movie>();

  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          <Paragraph title="Country Group ID">{values.id}</Paragraph>
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

const Form: React.FC = () => {
  return (
    <>
      <Field name="name" label="Name" as={SingleLineTextField} />
      <Field
        name="countries"
        label="Country"
        tagsOptions={CountryNames}
        as={TagsField}
        displayKey="display"
        valueKey="value"
      />
    </>
  );
};

function createUpdateDto(
  currentValues: CountryGroupDetailsFormData,
  initialValues?: CountryGroupDetailsFormData | null,
): Partial<CountryGroupDetailsFormData> {
  const { countries, ...rest } = getFormDiff(currentValues, initialValues);

  return rest;
}
