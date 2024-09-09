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
import { MovieRelatedCollections } from './CollectionEntityManagement.types';
import { useMovieRelatedCollections } from './CollectionEntityRelationMapper/CollectionEntityRelationMapper';
import { EntitySelectField } from './EntitySelectField/EntitySelectField';

interface FormData {
  entities: MovieRelatedCollections[] | undefined;
}

const collectionEntityManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  entities: Yup.array().of(Yup.object()),
});

export const MovieCollectionAssignment: React.FC = () => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );

  const { loading, data, error } = useMovieRelatedCollections(movieId);

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
                    movieId: movieId,
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
    [movieId],
  );

  return (
    <Details<FormData>
      defaultTitle="Collection Assignment"
      subtitle="Add movie to one or more collections"
      // validationSchema={collectionEntityManagementSchema}
      initialData={{
        data: { entities: data ?? [] },
        loading,
        // entityNotFound: data?.filtered?.nodes === null,
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
