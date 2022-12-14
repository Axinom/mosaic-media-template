import {
  Details,
  DetailsProps,
  getFormDiff,
  IconName,
  Nullable,
  SingleLineTextField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { number, object, string } from 'yup';
import { client } from '../../../apolloClient';
import {
  MutationUpdateReviewArgs,
  useDeleteReviewMutation,
  useReviewQuery,
  useUpdateReviewMutation,
} from '../../../generated/graphql';

type FormData = Nullable<MutationUpdateReviewArgs['input']['patch']>;

const reviewDetailSchema = object<ObjectSchemaDefinition<FormData>>({
  title: string().required('Title is a required field').max(100),
  description: string().required('Description is a required field').max(5000),
  rating: number().max(100).min(0),
});

export const ReviewDetails: React.FC = () => {
  const reviewId = Number(
    useParams<{
      reviewId: string;
    }>().reviewId,
  );

  const { loading, data, error } = useReviewQuery({
    client,
    variables: { id: reviewId },
    fetchPolicy: 'no-cache',
  });

  const [updateReview] = useUpdateReviewMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      await updateReview({
        variables: {
          input: {
            id: reviewId,
            patch: getFormDiff(formData, initialData.data),
          },
        },
      });
    },
    [reviewId, updateReview],
  );

  const history = useHistory();
  const [deleteReviewMutation] = useDeleteReviewMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const deleteMovie = async (): Promise<void> => {
    await deleteReviewMutation({ variables: { input: { id: reviewId } } });
    history.push('/reviews');
  };

  return (
    <Details<FormData>
      defaultTitle="Review"
      titleProperty="title"
      subtitle="Properties"
      validationSchema={reviewDetailSchema}
      initialData={{
        data: data?.review,
        loading,
        error: error?.message,
      }}
      saveData={onSubmit}
      actions={[
        {
          label: 'Delete',
          icon: IconName.Delete,
          confirmationMode: 'Simple',
          onActionSelected: deleteMovie,
        },
      ]}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="rating"
        type="number"
        label="Rating"
        as={SingleLineTextField}
      />
    </>
  );
};
