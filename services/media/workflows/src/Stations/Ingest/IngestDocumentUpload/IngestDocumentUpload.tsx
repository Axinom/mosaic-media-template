import {
  ActionHandler,
  Create,
  FileUpload,
  FileUploadField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { uploadClient } from '../../../apolloClient';
import {
  IngestDocumentUploadMutation,
  useIngestDocumentUploadMutation,
} from '../../../generated/graphql';

interface FormData {
  ingest: FileUpload;
}

type SubmitResponse = IngestDocumentUploadMutation['startIngest'];

const movieCreateSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  ingest: Yup.mixed().required('Select a file to continue'),
});

export const IngestDocumentUpload: React.FC = () => {
  const [ingestUploadMutation] = useIngestDocumentUploadMutation({
    client: uploadClient,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      const {
        file,
        uploadStarted,
        uploadProgress,
        uploadCompleted,
      } = (formData as FormData).ingest;

      uploadStarted();

      try {
        const ingestResult = (
          await ingestUploadMutation({
            variables: { file: file },
            context: {
              fetchOptions: {
                useUpload: true,
                onProgress: (ev: ProgressEvent) => {
                  uploadProgress((ev.loaded / ev.total) * 100);
                },
              },
            },
          })
        ).data?.startIngest;

        return ingestResult;
      } finally {
        uploadCompleted();
      }
    },
    [ingestUploadMutation],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.ingestDocument) {
        history.push(`/ingest/${submitResponse?.ingestDocument?.id}`);
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="Upload Ingest Document"
      validationSchema={movieCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/ingest"
      initialData={{
        loading: false,
      }}
    >
      <Field name="ingest" label="Document" as={FileUploadField} />
    </Create>
  );
};
