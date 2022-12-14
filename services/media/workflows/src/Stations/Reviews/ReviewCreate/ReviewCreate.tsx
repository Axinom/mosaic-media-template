import {
  ActionHandler,
  Create,
  SingleLineTextField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { object, string } from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateReviewMutation,
  CreateReviewMutationVariables,
  useCreateReviewMutation,
} from '../../../generated/graphql';

type FormData = CreateReviewMutationVariables['input']['review'];

type SubmitResponse = CreateReviewMutation['createReview'];

const reviewCreateSchema = object().shape<ObjectSchemaDefinition<FormData>>({
  title: string().required('Title is a required field').max(100),
  description: string().required('Description is a required field').max(5000),
});

export const ReviewCreate: React.FC = () => {
  const [reviewCreate] = useCreateReviewMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await reviewCreate({
          variables: {
            input: {
              review: {
                title: formData.title,
                description: formData.description,
              },
            },
          },
        })
      ).data?.createReview;
    },
    [reviewCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      history.push(`/reviews/${submitResponse?.review?.id}`);
    },
    [history],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New Review"
      subtitle="Add new review metadata"
      validationSchema={reviewCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/reviews"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="description" label="Description" as={TextAreaField} />
    </Create>
  );
};
