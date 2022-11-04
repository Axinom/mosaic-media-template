import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  generateArrayMutations,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { array, number, object } from 'yup';
import { client } from '../../../apolloClient';
import {
  Mutation,
  MutationUpdateSeasonArgs,
  useTvShowSeasonsQuery,
} from '../../../generated/graphql';
import { SeasonSelectField } from './SeasonSelectField/SeasonSelectField';
import { TvShowSeason } from './TvShowSeasonManagement.types';

interface FormData {
  seasons: TvShowSeason[];
}

const tvShowSeasonManagementSchema = object<ObjectSchemaDefinition<FormData>>({
  seasons: array().of(object({ id: number() })),
});

export const TvShowSeasonManagement: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const { loading, data, error } = useTvShowSeasonsQuery({
    client,
    variables: { id: tvshowId },
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<
        Mutation
      >();

      const seasonAssignmentMutations = generateArrayMutations({
        current: formData.seasons,
        original: initialData.data?.seasons,
        generateCreateMutation: ({ id }) =>
          generateUpdateGQLFragment<MutationUpdateSeasonArgs>('updateSeason', {
            input: { id, patch: { tvshowId } },
          }),
        generateDeleteMutation: ({ id }) =>
          generateUpdateGQLFragment<MutationUpdateSeasonArgs>('updateSeason', {
            input: { id, patch: { tvshowId: null } },
          }),
      });

      const GqlMutationDocument = gql`mutation UpdateTvShowSeasons {
        ${seasonAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [tvshowId],
  );

  return (
    <Details<FormData>
      defaultTitle="Season Management"
      validationSchema={tvShowSeasonManagementSchema}
      initialData={{
        data: {
          seasons: data?.tvshow?.seasons.nodes ?? [],
        },
        loading,
        entityNotFound: data?.tvshow === null,
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
      <Field name="seasons" label="Seasons" as={SeasonSelectField} />
    </>
  );
};
