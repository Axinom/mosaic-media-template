import {
  createInputRenderer,
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  DynamicDataList,
  formatDateTime,
  generateArrayMutationsWithUpdates,
  InfoPanel,
  Paragraph,
  Section,
} from '@axinom/mosaic-ui';
import { useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useMemo } from 'react';
import { client } from '../../../apolloClient';
import { Constants } from '../../../constants';
import {
  MovieGenresQuery,
  Mutation,
  MutationCreateMovieGenreArgs,
  MutationDeleteMovieGenreArgs,
  MutationUpdateMovieGenreArgs,
  SnapshotState,
  useMovieGenresQuery,
} from '../../../generated/graphql';
import { useMovieGenresActions } from './MovieGenres.actions';
import classes from './MovieGenres.module.scss';
import { FormDataGenre, MovieGenresFormData } from './MovieGenres.types';

export const MovieGenres: React.FC = () => {
  const { loading, data, error } = useMovieGenresQuery({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: MovieGenresFormData,
      initialData: DetailsProps<MovieGenresFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<
        Mutation
      >();

      const mutations = generateArrayMutationsWithUpdates({
        current: formData.genres,
        original: initialData.data?.genres,
        generateCreateMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationCreateMovieGenreArgs>(
            'createMovieGenre',
            {
              input: {
                movieGenre: { sortOrder: item.sortOrder, title: item.title },
              },
            },
          ),
        generateDeleteMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationDeleteMovieGenreArgs>(
            'deleteMovieGenre',
            { input: { id: item.id } },
          ),
        generateUpdateMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationUpdateMovieGenreArgs>(
            'updateMovieGenre',
            {
              input: {
                id: item.id,
                patch: { title: item.title, sortOrder: item.sortOrder },
              },
            },
          ),
        key: 'id',
      });

      const GqlMutationDocument = gql`mutation UpdateMovieGenre {
        ${mutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [],
  );

  const { actions } = useMovieGenresActions();

  return (
    <Details<MovieGenresFormData>
      defaultTitle="Movie Genres"
      subtitle="Properties"
      initialData={{
        data: { genres: data?.movieGenres?.nodes },
        loading,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel data={data} />}
      actions={actions}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<MovieGenresFormData>();
  return (
    <DynamicDataList<FormDataGenre>
      columns={[
        {
          propertyName: 'title',
          label: 'Title',
          dataEntryRender: createInputRenderer({ placeholder: 'Enter Title' }),
        },
      ]}
      allowNewData={true}
      positionPropertyName="sortOrder"
      value={values.genres ?? []}
      onChange={(v) => {
        setFieldValue('genres', v);
      }}
      stickyHeader={false}
    />
  );
};

const Panel: React.FC<{ data?: MovieGenresQuery }> = ({ data }) => {
  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          {data?.movieGenres?.nodes[0] && (
            <Paragraph title="Last Modified">
              {formatDateTime(data?.movieGenres?.nodes[0].updatedDate)} by{' '}
              {data?.movieGenres?.nodes[0].updatedUser}
            </Paragraph>
          )}
          <Paragraph title="Statistic">
            <div className={classes.datalist}>
              <div>Items Total</div>
              <div>{data?.movieGenres?.totalCount}</div>
            </div>
          </Paragraph>
        </Section>
        <Section title="Publishing Info">
          <Paragraph title="Publishing Status">
            {data?.snapshots?.nodes[0]?.snapshotState ===
            SnapshotState.Published
              ? Constants.PUBLISHED
              : Constants.NOT_PUBLISHED}
          </Paragraph>
          {data?.snapshots?.nodes[0] && (
            <Paragraph title="Published">
              {formatDateTime(data?.snapshots?.nodes[0].publishedDate)} by{' '}
              {data?.snapshots?.nodes[0].updatedUser}
            </Paragraph>
          )}
        </Section>
      </InfoPanel>
    );
  }, [
    data?.movieGenres?.nodes,
    data?.movieGenres?.totalCount,
    data?.snapshots?.nodes,
  ]);
};
