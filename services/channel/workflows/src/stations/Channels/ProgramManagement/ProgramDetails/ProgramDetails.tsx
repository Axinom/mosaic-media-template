import {
  Details,
  DetailsProps,
  formatDateTime,
  getFormDiff,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../../apolloClient';
import { ExtensionsContext } from '../../../../externals/piralExtensions';
import {
  Program,
  ProgramDetailsRootPathParamsDocument,
  ProgramDetailsRootPathParamsQuery,
  ProgramPatch,
  UpdateProgramInput,
  useProgramQuery,
} from '../../../../generated/graphql';
import { useActions } from './ProgramDetails.actions';
import classes from './ProgramDetails.module.scss';
import { ProgramDetailsFormData } from './ProgramDetails.types';

const programValidationSchema = Yup.object<
  ObjectSchemaDefinition<ProgramDetailsFormData>
>({
  title: Yup.string().required('Title is a required field'),
});

interface UrlParams {
  programId: string;
  playlistId: string;
  channelId: string;
}

export const ProgramDetails: React.FC = () => {
  const { programId, channelId, playlistId } = useParams<UrlParams>();
  const loadDataMutationParams = { id: programId } as const;
  const { loading, data, error } = useProgramQuery({
    client,
    variables: loadDataMutationParams,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: ProgramDetailsFormData,
      initialData: DetailsProps<ProgramDetailsFormData>['initialData'],
    ): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...updateDto } = getFormDiff(formData, initialData.data);
      const patch: ProgramPatch = {
        ...updateDto,
      };
      const GqlMutationDocument = gql`
        mutation UpdateProgram($input: UpdateProgramInput!) {
          updateProgram(input: $input) {
            clientMutationId
            program {
              id
              title
            }
          }
        }
      `;

      await client.mutate<unknown, { input: UpdateProgramInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: programId, patch } },
      });
    },
    [programId],
  );

  const { actions } = useActions(programId, playlistId, channelId);

  return (
    <Details<ProgramDetailsFormData>
      defaultTitle="Program"
      titleProperty="title"
      subtitle="Properties"
      actions={actions}
      validationSchema={programValidationSchema}
      initialData={{
        data: {
          ...data?.program,
        },
        loading,
        entityNotFound: data?.program === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
      edgeToEdgeContent={true}
    >
      <div className={classes.content}>
        <Form />
      </div>
    </Details>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
    </>
  );
};

const Panel: React.FC = () => {
  const { ImageCover } = useContext(ExtensionsContext);
  const { values } = useFormikContext<Program>();

  return (
    <InfoPanel>
      <Section>
        <ImageCover id={values?.imageId} />
      </Section>
      <Section title="Additional Information">
        <Paragraph title="ID">{values.id}</Paragraph>
        <Paragraph title="Created">
          {formatDateTime(values.createdDate)} by {values.createdUser}
        </Paragraph>
        <Paragraph title="Last Modified">
          {formatDateTime(values.updatedDate)} by {values.updatedUser}
        </Paragraph>
      </Section>
    </InfoPanel>
  );
};

export const resolveProgramDetailsRoot = async (
  programId: string,
): Promise<{ playlistId: string; channelId: string }> => {
  const { data } = await client.query<ProgramDetailsRootPathParamsQuery>({
    query: ProgramDetailsRootPathParamsDocument,
    variables: {
      programId,
    },
  });
  return {
    playlistId: data?.program?.playlist?.id,
    channelId: data?.program?.playlist?.channel?.id,
  };
};
