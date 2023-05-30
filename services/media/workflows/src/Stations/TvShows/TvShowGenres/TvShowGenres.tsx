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
  Mutation,
  MutationCreateTvshowGenreArgs,
  MutationDeleteTvshowGenreArgs,
  MutationUpdateTvshowGenreArgs,
  SnapshotState,
  TvShowGenresQuery,
  useTvShowGenresQuery,
} from '../../../generated/graphql';
import { useTvShowGenresActions } from './TvShowGenres.actions';
import classes from './TvShowGenres.module.scss';
import { FormDataGenre, TvShowGenresFormData } from './TvShowGenres.types';

export const TvShowGenres: React.FC = () => {
  const { loading, data, error } = useTvShowGenresQuery({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: TvShowGenresFormData,
      initialData: DetailsProps<TvShowGenresFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<
        Mutation
      >();

      const mutations = generateArrayMutationsWithUpdates({
        current: formData.genres,
        original: initialData.data?.genres,
        generateCreateMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationCreateTvshowGenreArgs>(
            'createTvshowGenre',
            {
              input: {
                tvshowGenre: { sortOrder: item.sortOrder, title: item.title },
              },
            },
          ),
        generateDeleteMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationDeleteTvshowGenreArgs>(
            'deleteTvshowGenre',
            { input: { id: item.id } },
          ),
        generateUpdateMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationUpdateTvshowGenreArgs>(
            'updateTvshowGenre',
            {
              input: {
                id: item.id,
                patch: { title: item.title, sortOrder: item.sortOrder },
              },
            },
          ),
        key: 'id',
      });

      const GqlMutationDocument = gql`mutation UpdateTvShowGenre {
        ${mutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [],
  );

  const { actions } = useTvShowGenresActions();

  return (
    <Details<TvShowGenresFormData>
      defaultTitle="TV Show Genres"
      subtitle="Properties"
      initialData={{
        data: { genres: data?.tvshowGenres?.nodes },
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
  const { values, setFieldValue } = useFormikContext<TvShowGenresFormData>();
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

const Panel: React.FC<{ data?: TvShowGenresQuery }> = ({ data }) => {
  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          <Paragraph title="Last Modified">
            {formatDateTime(data?.tvshowGenres?.nodes[0].updatedDate)} by{' '}
            {data?.tvshowGenres?.nodes[0].updatedUser}
          </Paragraph>
          <Paragraph title="Statistic">
            <div className={classes.datalist}>
              <div>Items Total</div>
              <div>{data?.tvshowGenres?.totalCount}</div>
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
              {formatDateTime(data?.snapshots?.nodes[0]?.publishedDate)} by{' '}
              {data?.snapshots?.nodes[0]?.updatedUser}
            </Paragraph>
          )}
        </Section>
      </InfoPanel>
    );
  }, [
    data?.snapshots?.nodes,
    data?.tvshowGenres?.nodes,
    data?.tvshowGenres?.totalCount,
  ]);
};
