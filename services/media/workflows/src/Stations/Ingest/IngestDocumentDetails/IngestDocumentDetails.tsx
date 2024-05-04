import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import {
  Details,
  DetailsProps,
  getFormDiff,
  ReadOnlyField,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  IngestDocument,
  IngestDocumentTitleDocument,
  IngestDocumentTitleQuery,
  MutationUpdateIngestDocumentArgs,
  useIngestDocumentQuery,
  useUpdateIngestDocumentMutation,
} from '../../../generated/graphql';
import { DocumentDownloadField } from './DocumentDownloadField/DocumentDownloadField';
import { IngestStatus } from './IngestStatus/IngestStatus';

type FormData = MutationUpdateIngestDocumentArgs['input']['patch'];

const documentSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  title: Yup.string().notRequired(),
});

export const IngestDocumentDetails: React.FC = () => {
  const ingestId = Number(
    useParams<{
      ingestId: string;
    }>().ingestId,
  );

  const { loading, data, error } = useIngestDocumentQuery({
    client,
    variables: { id: ingestId },
    fetchPolicy: 'no-cache',
  });

  const [updateIngestDocumentMutation] = useUpdateIngestDocumentMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      await updateIngestDocumentMutation({
        variables: {
          input: {
            id: ingestId,
            patch: getFormDiff(formData, initialData.data),
          },
        },
      });
    },
    [updateIngestDocumentMutation, ingestId],
  );

  return (
    <Details<FormData>
      defaultTitle="Ingest Document"
      titleProperty="title"
      subtitle="Ingest Results"
      validationSchema={documentSchema}
      initialData={{
        data: {
          ...data?.ingestDocument,
        },
        loading,
        error: error?.message,
      }}
      saveData={onSubmit}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  const { values } = useFormikContext<IngestDocument>();
  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field
        name="document"
        label="Download Source"
        as={DocumentDownloadField}
        fileName={`${values.document?.name ?? values.title}.json`}
      />
      <Field name="itemsCount" label="Total Entities" as={ReadOnlyField} />
      <IngestStatus initialData={values} />
    </>
  );
};

export const IngestDocumentDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<IngestDocumentTitleQuery>({
      query: IngestDocumentTitleDocument,
      variables: {
        id: Number(params['ingestId']),
      },
      errorPolicy: 'ignore',
    });
    return response.data.ingestDocument?.title ?? 'Ingest Document';
  };
};
