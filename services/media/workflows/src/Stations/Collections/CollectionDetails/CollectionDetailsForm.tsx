import { ID } from '@axinom/mosaic-managed-workflow-integration';
import {
  createUpdateGQLFragmentGenerator,
  CustomTagsField,
  Details,
  DetailsProps,
  formatDateTime,
  generateArrayMutations,
  getFormDiff,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
  SingleLineTextField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext, useMemo } from 'react';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  CollectionDocument,
  CollectionImageType,
  CollectionQuery,
  Mutation,
  MutationCreateCollectionsTagArgs,
  MutationDeleteCollectionsTagArgs,
  SearchCollectionTagsDocument,
  SearchCollectionTagsQuery,
  SearchCollectionTagsQueryVariables,
  UpdateCollectionInput,
  useCollectionQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useCollectionDetailsActions } from './CollectionDetails.actions';
import classes from './CollectionDetails.module.scss';
import { CollectionDetailsFormData } from './CollectionDetails.types';

interface CollectionDetailsFormProps {
  collectionId: number;
}

const collectionDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<CollectionDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
  description: Yup.string().nullable(),
  synopsis: Yup.string().nullable(),
  externalId: Yup.string().nullable(),
});

export const CollectionDetailsForm: React.FC<CollectionDetailsFormProps> = ({
  collectionId,
}) => {
  const { loading, data, error } = useCollectionQuery({
    client,
    variables: { id: collectionId },
    fetchPolicy: 'network-only',
  });

  const { tags } = useMemo(
    () => ({
      tags: data?.collection?.collectionsTags.nodes.map((node) => node.name),
    }),
    [data],
  );

  const { actions } = useCollectionDetailsActions(collectionId);

  const onSubmit = useCallback(
    async (
      formData: CollectionDetailsFormData,
      initialData: DetailsProps<CollectionDetailsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const tagAssignmentMutations = generateArrayMutations({
        current: formData.tags,
        original: initialData.data?.tags,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateCollectionsTagArgs>(
            'createCollectionsTag',
            { input: { collectionsTag: { name, collectionId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteCollectionsTagArgs>(
            'deleteCollectionsTag',
            { input: { collectionId, name } },
          ),
        prefix: 'collectionsTag',
      });

      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql`mutation UpdateCollection($input: UpdateCollectionInput!) {
          updateCollection(input: $input) {
            clientMutationId
            collection {
              id
              title
            }
          }
          ${tagAssignmentMutations}
        }`;

      await client.mutate<unknown, { input: UpdateCollectionInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: collectionId, patch } },
        refetchQueries: [CollectionDocument],
        awaitRefetchQueries: true,
      });
    },
    [collectionId],
  );

  return (
    <Details<CollectionDetailsFormData>
      defaultTitle="Collection"
      titleProperty="title"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={collectionDetailSchema}
      initialData={{
        data: {
          ...data?.collection,
          tags,
        },
        loading,
        entityNotFound: data?.collection === null,
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
  const { ImageCover } = useContext(ExtensionsContext);
  const { values } =
    useFormikContext<NonNullable<CollectionQuery['collection']>>();

  return useMemo(() => {
    let coverImageId: ID;
    let coverImageCount = 0;

    values.collectionsImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case CollectionImageType.Cover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        default:
          break;
      }
    });

    return (
      <InfoPanel>
        <Section>
          <ImageCover id={coverImageId} />
        </Section>
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
        <Section title="Assigned Items">
          <Paragraph title="Entities">
            <div className={classes.datalist}>
              <div>Movies</div>
              <div className={classes.rightAlignment}>
                {values.movies?.totalCount} / many
              </div>
              <div>TV Shows</div>
              <div className={classes.rightAlignment}>
                {values.tvshows?.totalCount} / many
              </div>
              <div>Seasons</div>
              <div className={classes.rightAlignment}>
                {values.seasons?.totalCount} / many
              </div>
              <div>Episodes</div>
              <div className={classes.rightAlignment}>
                {values.episodes?.totalCount} / many
              </div>
            </div>
          </Paragraph>
          <Paragraph title="Images">
            <div className={classes.datalist}>
              <div>Cover</div>
              <div className={classes.rightAlignment}>
                {coverImageCount} / 1
              </div>
            </div>
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [
    values.collectionsImages?.nodes,
    values.id,
    values.createdDate,
    values.createdUser,
    values.updatedDate,
    values.updatedUser,
    values.movies?.totalCount,
    values.tvshows?.totalCount,
    values.seasons?.totalCount,
    values.episodes?.totalCount,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    ImageCover,
  ]);
};

const Form: React.FC = () => {
  const tagsResolver = async (value: string): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchCollectionTagsQuery,
      SearchCollectionTagsQueryVariables
    >({
      query: SearchCollectionTagsDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getCollectionsTagsValues?.nodes ?? [];
  };

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="synopsis" label="Synopsis" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field name="externalId" label="External ID" as={SingleLineTextField} />
      <Field
        name="tags"
        label="Tags"
        liveSuggestionsResolver={tagsResolver}
        as={CustomTagsField}
      />
    </>
  );
};

function createUpdateDto(
  currentValues: CollectionDetailsFormData,
  initialValues?: CollectionDetailsFormData | null,
): CollectionDetailsFormData {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tags, ...rest } = getFormDiff(currentValues, initialValues);
  return rest;
}
