import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  generateArrayMutationsWithUpdates,
  ObjectSchemaDefinition,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  Mutation,
  MutationCreateCollectionRelationArgs,
  MutationDeleteCollectionRelationArgs,
  MutationUpdateCollectionRelationArgs,
} from '../../../generated/graphql';
import { TvshowRelatedCollections } from './CollectionEntityManagement.types';
import { useTvshowRelatedCollections } from './CollectionEntityRelationMapper/CollectionEntityRelationMapper';
import { EntitySelectField } from './EntitySelectField/EntitySelectField';

interface FormData {
  entities: TvshowRelatedCollections[] | undefined;
}

const collectionEntityManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  entities: Yup.array().of(Yup.object()),
});

export const TvShowCollectionAssignment: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const { loading, data, error } = useTvshowRelatedCollections(tvshowId);

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const collectionEntityAssignmentMutations =
        generateArrayMutationsWithUpdates({
          current: formData.entities,
          original: initialData.data?.entities,
          generateCreateMutation: (item) => {
            return generateUpdateGQLFragment<MutationCreateCollectionRelationArgs>(
              'createCollectionRelation',
              {
                input: {
                  collectionRelation: {
                    collectionId: item?.entityId,
                    sortOrder: item.sortOrder,
                    tvshowId: tvshowId,
                  },
                },
              },
            );
          },
          generateDeleteMutation: (item) =>
            generateUpdateGQLFragment<MutationDeleteCollectionRelationArgs>(
              'deleteCollectionRelation',
              { input: { id: item.id as number } },
            ),
          generateUpdateMutation: (item) =>
            generateUpdateGQLFragment<MutationUpdateCollectionRelationArgs>(
              'updateCollectionRelation',
              {
                input: {
                  id: item.id as number,
                  patch: { sortOrder: item.sortOrder },
                },
              },
            ),
          key: 'entityId',
        });

      const GqlMutationDocument = gql`mutation UpdateCollectionEntityAssignments {
        ${collectionEntityAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [tvshowId],
  );

  return (
    <Details<FormData>
      defaultTitle="Collection Assignment"
      subtitle="Add a TV Show to one or more Collections"
      validationSchema={collectionEntityManagementSchema}
      initialData={{
        data: { entities: data ?? [] },
        loading,
        entityNotFound: data === null,
        error: error?.message,
      }}
      saveData={onSubmit}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="entities" label="Entities" as={EntitySelectField} />
    </>
  );
};
