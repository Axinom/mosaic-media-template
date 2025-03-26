import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import {
  Details,
  DetailsProps,
  formatDateTime,
  getFormDiff,
  IconName,
  InfoPanel,
  Nullable,
  Paragraph,
  Section,
  SingleLineTextField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { number, object, string } from 'yup';
import { client } from '../../../apolloClient';
import {
  MutationUpdateReviewArgs,
  Review,
  useDeleteReviewMutation,
  usePublishReviewMutation,
  useReviewQuery,
  useUnpublishReviewMutation,
  useUpdateReviewMutation,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import classes from './ReviewDetails.module.scss';

type FormData = Nullable<MutationUpdateReviewArgs['input']['patch']>;

const reviewDetailSchema = object<ObjectSchemaDefinition<FormData>>({
  title: string().required('Title is a required field').max(100),
  description: string().required('Description is a required field').max(5000),
  rating: number().max(100).min(0),
});

const Panel: React.FC = () => {
  const { values } = useFormikContext<Review>();

  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          <Paragraph title="ID">{values.id}</Paragraph>
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
    values.id,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    values.updatedDate,
    values.updatedUser,
  ]);
};

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
  const deleteReview = async (): Promise<void> => {
    await deleteReviewMutation({ variables: { input: { id: reviewId } } });
    history.push('/reviews');
  };
  const [publishReviewMutation] = usePublishReviewMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishReviewMutation] = useUnpublishReviewMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const localizationPath = getLocalizationEntryPoint('review');
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
      infoPanel={<Panel />}
      actions={[
        ...(localizationPath
          ? [
              {
                label: 'Localizations',
                path: localizationPath.replace(
                  ':reviewId',
                  reviewId.toString(),
                ),
              },
            ]
          : []),
        {
          label: 'Publish Now',
          confirmationMode: 'Simple',
          onActionSelected: async () => {
            await publishReviewMutation({ variables: { id: reviewId } });
          },
        },
        {
          label: 'Publishing Snapshots',
          path: `/reviews/${reviewId}/snapshots`,
        },
        {
          label: 'Unpublish',
          confirmationMode: 'Simple',
          onActionSelected: async () => {
            await unpublishReviewMutation({ variables: { id: reviewId } });
          },
        },
        {
          label: 'Delete',
          icon: IconName.Delete,
          confirmationMode: 'Simple',
          onActionSelected: deleteReview,
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
        name="externalId"
        label="External ID"
        className={classes.externalId}
        as={SingleLineTextField}
      />
      <Field
        name="rating"
        type="number"
        label="Rating"
        as={SingleLineTextField}
      />
    </>
  );
};
