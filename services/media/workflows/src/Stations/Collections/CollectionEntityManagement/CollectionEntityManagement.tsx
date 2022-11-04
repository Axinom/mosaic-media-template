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
  EntityType,
  Mutation,
  MutationCreateCollectionRelationArgs,
  MutationDeleteCollectionRelationArgs,
  MutationUpdateCollectionRelationArgs,
} from '../../../generated/graphql';
import { CollectionRelatedEntity } from './CollectionEntityManagement.types';
import { useCollectionRelatedEntities } from './CollectionEntityRelationMapper/CollectionEntityRelationMapper';
import { EntitySelectField } from './EntitySelectField/EntitySelectField';

interface FormData {
  entities: CollectionRelatedEntity[] | undefined;
}

const collectionEntityManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  entities: Yup.array().of(Yup.object()),
});

export const CollectionEntityManagement: React.FC = () => {
  const collectionId = Number(
    useParams<{
      collectionId: string;
    }>().collectionId,
  );

  const { loading, data, error } = useCollectionRelatedEntities(collectionId);

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
            switch (item.entityType) {
              case EntityType.Movie:
                return generateUpdateGQLFragment<MutationCreateCollectionRelationArgs>(
                  'createCollectionRelation',
                  {
                    input: {
                      collectionRelation: {
                        collectionId,
                        sortOrder: item.sortOrder,
                        movieId: item.entityId,
                      },
                    },
                  },
                );
              case EntityType.Tvshow:
                return generateUpdateGQLFragment<MutationCreateCollectionRelationArgs>(
                  'createCollectionRelation',
                  {
                    input: {
                      collectionRelation: {
                        collectionId,
                        sortOrder: item.sortOrder,
                        tvshowId: item.entityId,
                      },
                    },
                  },
                );
              case EntityType.Season:
                return generateUpdateGQLFragment<MutationCreateCollectionRelationArgs>(
                  'createCollectionRelation',
                  {
                    input: {
                      collectionRelation: {
                        collectionId,
                        sortOrder: item.sortOrder,
                        seasonId: item.entityId,
                      },
                    },
                  },
                );
              case EntityType.Episode:
                return generateUpdateGQLFragment<MutationCreateCollectionRelationArgs>(
                  'createCollectionRelation',
                  {
                    input: {
                      collectionRelation: {
                        collectionId,
                        sortOrder: item.sortOrder,
                        episodeId: item.entityId,
                      },
                    },
                  },
                );
            }
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
          key: 'id',
        });

      const GqlMutationDocument = gql`mutation UpdateSeasonEpisodes {
        ${collectionEntityAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [collectionId],
  );

  return (
    <Details<FormData>
      defaultTitle="Entity Management"
      validationSchema={collectionEntityManagementSchema}
      initialData={{
        data: { entities: data },
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
  return (
    <>
      <Field name="entities" label="Entities" as={EntitySelectField} />
    </>
  );
};
