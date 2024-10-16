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
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  Mutation,
  MutationUpdateSeasonArgs,
  useTvShowSeasonsQuery,
} from '../../../generated/graphql';
import { SeasonSelectField } from './SeasonSelectField/SeasonSelectField';
import { TvShowSeason } from './TvShowSeasonManagement.types';

interface TvShowSeasonManagementFormProps {
  tvshowId: number;
}

interface FormData {
  seasons: TvShowSeason[];
}

const tvShowSeasonManagementSchema = Yup.object<
  ObjectSchemaDefinition<FormData>
>({
  seasons: Yup.array().of(Yup.object({ id: Yup.number() })),
});

export const TvShowSeasonManagementForm: React.FC<
  TvShowSeasonManagementFormProps
> = ({ tvshowId }) => {
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
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

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
