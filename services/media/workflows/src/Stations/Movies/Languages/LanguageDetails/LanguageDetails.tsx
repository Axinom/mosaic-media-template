import {
  Details,
  DetailsProps,
  formatDateTime,
  getFormDiff,
  InfoPanel,
  Paragraph,
  Section,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../../apolloClient';
import {
  Movie,
  MovieDocument,
  UpdateMovieInput,
  useLanguageQuery,
} from '../../../../generated/graphql';
import { getEnumLabel } from '../../../../Util/StringEnumMapper/StringEnumMapper';
import { useLanguageDetailsActions } from './LanguageDetails.actions';
import { LanguageDetailsFormData } from './LanguageDetails.types';

const languageDetailSchema = Yup.object<
  ObjectSchemaDefinition<LanguageDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

export const LanguageDetails: React.FC = () => {
  const languageId = Number(
    useParams<{
      languageId: string;
    }>().languageId,
  );

  const { loading, data, error } = useLanguageQuery({
    client,
    variables: { id: languageId },
    fetchPolicy: 'network-only',
  });

  const { actions } = useLanguageDetailsActions(languageId);

  const onSubmit = useCallback(
    async (
      formData: LanguageDetailsFormData,
      initialData: DetailsProps<LanguageDetailsFormData>['initialData'],
    ): Promise<void> => {
      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql`
        mutation UpdateMovie($input: UpdateMovieInput!) {
          updateMovie(input: $input) {
            clientMutationId
            movie {
              id
              title
            }
          }
        }
      `;

      await client.mutate<unknown, { input: UpdateMovieInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: languageId, patch } },
        refetchQueries: [MovieDocument],
        awaitRefetchQueries: true,
      });
    },
    [languageId],
  );

  return (
    <Details<LanguageDetailsFormData>
      defaultTitle="Language"
      titleProperty="title"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={languageDetailSchema}
      initialData={{
        data: {
          ...data?.language,
        },
        loading,
        entityNotFound: data?.language === null,
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
          <Paragraph title="External ID">{values.externalId}</Paragraph>
          <Paragraph title="Created">
            {formatDateTime(values.createdDate)} by {values.createdUser}
          </Paragraph>
          <Paragraph title="Last Modified">
            {formatDateTime(values.updatedDate)} by {values.updatedUser}
          </Paragraph>
          <Paragraph title="Publishing Status">
            {getEnumLabel(values.publishStatus)}
          </Paragraph>
          {values.publishedDate ? (
            <Paragraph title="Last Published">
              {formatDateTime(values.publishedDate)} by {values.publishedUser}
            </Paragraph>
          ) : null}
        </Section>
      </InfoPanel>
    );
  }, [
    values.createdDate,
    values.createdUser,
    values.externalId,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    values.updatedDate,
    values.updatedUser,
  ]);
};

const Form: React.FC<LanguageDetailsFormData> = () => {
  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="native" label="Native" as={SingleLineTextField} />
      <Field name="code" label="Code" as={SingleLineTextField} />
    </>
  );
};

function createUpdateDto(
  currentValues: LanguageDetailsFormData,
  initialValues?: LanguageDetailsFormData | null,
): Partial<LanguageDetailsFormData> {
  const { tags, cast, director, productionCountries, genres, ...rest } =
    getFormDiff(currentValues, initialValues);

  return rest;
}
