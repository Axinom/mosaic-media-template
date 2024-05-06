import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import {
  ActionHandler,
  Create,
  ObjectSchemaDefinition,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateCollectionMutation,
  CreateCollectionMutationVariables,
  useCreateCollectionMutation,
} from '../../../generated/graphql';

type FormData = CreateCollectionMutationVariables['input']['collection'];

type SubmitResponse = CreateCollectionMutation['createCollection'];

const collectionCreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

export const CollectionCreate: React.FC = () => {
  const [collectionCreate] = useCreateCollectionMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await collectionCreate({
          variables: {
            input: {
              collection: {
                title: formData.title ?? '',
              },
            },
          },
        })
      ).data?.createCollection;
    },
    [collectionCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.collection) {
        history.push(`/collections/${submitResponse?.collection.id}`);
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
      title="New Collection"
      subtitle="Add new collection metadata"
      validationSchema={collectionCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/collections"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
    </Create>
  );
};

export const CollectionCreateCrumb: BreadcrumbResolver = () => 'Create';
