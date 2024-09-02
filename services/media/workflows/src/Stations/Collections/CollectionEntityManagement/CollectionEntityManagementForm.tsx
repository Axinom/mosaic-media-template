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

interface CollectionEntityManagementFormProps {
  collectionId: number;
}

interface FormData {
  entities: CollectionRelatedEntity[] | undefined;
}

const collectionEntityManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  entities: Yup.array().of(Yup.object()),
});

export const CollectionEntityManagementForm: React.FC<
  CollectionEntityManagementFormProps
> = ({ collectionId }) => {
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
            const entityTypeId = (() => {
              switch (item.entityType) {
                case EntityType.Movie:
                  return 'movieId';
                case EntityType.Tvshow:
                  return 'tvshowId';
                case EntityType.Season:
                  return 'seasonId';
                case EntityType.Episode:
                  return 'episodeId';
                default: {
                  throw new Error(
                    `Unsupported entityType found when calling generateCreateMutation.`,
                  );
                }
              }
            })();

            return generateUpdateGQLFragment<MutationCreateCollectionRelationArgs>(
              'createCollectionRelation',
              {
                input: {
                  collectionRelation: {
                    collectionId,
                    sortOrder: item.sortOrder,
                    [entityTypeId]: item.entityId,
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
          key: 'id',
        });

      const GqlMutationDocument = gql`mutation UpdateCollectionEntityAssignments {
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
