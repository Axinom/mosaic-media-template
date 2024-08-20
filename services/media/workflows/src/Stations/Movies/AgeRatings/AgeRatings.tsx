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
  MovieGenresDocument,
  Mutation,
  MutationCreateMovieGenreArgs,
  MutationDeleteMovieGenreArgs,
  MutationUpdateMovieGenreArgs,
  SnapshotState,
} from '../../../generated/graphql';
import { useMovieGenresActions } from './AgeRatings.actions';
import classes from './AgeRatings.module.scss';
import { AgeRatingsFormData, FormDataAgeRatings } from './AgeRatings.types';

export const AgeRatings: React.FC = () => {
  // const { loading, data, error } = useMovieGenresQuery({
  //   client,
  //   fetchPolicy: 'no-cache',
  // });

  const data = {
    ageRatings: {
      nodes: [
        {
          createdBy: 'axinom',
          dateCreated: '2017-11-22T14:13:31.8310785+00:00',
          id: '1',
          sortOrder: 1,
          dateModified: '2017-11-27T11:06:57.4976832+00:00',
          modifiedBy: 'MilanVerbaandert',
          name: 'AL',
        },
        {
          createdBy: 'MilanVerbaandert',
          dateCreated: '2018-05-22T14:44:51.8975284+00:00',
          id: '2',
          sortOrder: 2,
          dateModified: '2018-06-25T13:08:21.5783338+00:00',
          modifiedBy: 'MilanVerbaandert',
          name: 'DOVE_AL',
        },
        {
          createdBy: 'MilanVerbaandert',
          dateCreated: '2018-06-25T13:08:30.9059435+00:00',
          id: '3',
          sortOrder: 3,
          dateModified: null,
          modifiedBy: null,
          name: '18PLUS',
        },
        {
          createdBy: 'MilanVerbaandert',
          dateCreated: '2018-06-25T13:08:35.9088247+00:00',
          id: '4',
          sortOrder: 4,
          dateModified: null,
          modifiedBy: null,
          name: 'DOVE_18PLUS',
        },
        {
          createdBy: 'MilanVerbaandert',
          dateCreated: '2018-06-25T13:08:40.4794594+00:00',
          id: '5',
          sortOrder: 5,
          dateModified: null,
          modifiedBy: null,
          name: '12PLUS',
        },
        {
          createdBy: 'MilanVerbaandert',
          dateCreated: '2018-06-25T13:08:42.10425+00:00',
          id: '6',
          sortOrder: 6,
          dateModified: null,
          modifiedBy: null,
          name: 'DOVE_12PLUS',
        },
        {
          createdBy: 'MilanVerbaandert',
          dateCreated: '2018-06-25T13:08:48.4062186+00:00',
          id: '7',
          sortOrder: 7,
          dateModified: null,
          modifiedBy: null,
          name: '9PLUS',
        },
        {
          createdBy: 'MilanVerbaandert',
          dateCreated: '2018-06-25T13:08:52.4661963+00:00',
          id: '8',
          sortOrder: 8,
          dateModified: null,
          modifiedBy: null,
          name: '6PLUS',
        },
      ],
    },
  };

  const onSubmit = useCallback(
    async (
      formData: AgeRatingsFormData,
      initialData: DetailsProps<AgeRatingsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const mutations = generateArrayMutationsWithUpdates({
        current: formData.ageRatings,
        original: initialData.data?.ageRatings,
        generateCreateMutation: (item: FormDataAgeRatings): string =>
          generateUpdateGQLFragment<MutationCreateMovieGenreArgs>(
            'createMovieGenre',
            {
              input: {
                movieGenre: { sortOrder: item.sortOrder, title: item.title },
              },
            },
          ),
        generateDeleteMutation: (item: FormDataAgeRatings): string =>
          generateUpdateGQLFragment<MutationDeleteMovieGenreArgs>(
            'deleteMovieGenre',
            { input: { id: item.id } },
          ),
        generateUpdateMutation: (item: FormDataAgeRatings): string =>
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

      await client.mutate({
        mutation: GqlMutationDocument,
        refetchQueries: [MovieGenresDocument],
        awaitRefetchQueries: true,
      });
    },
    [],
  );

  const { actions } = useMovieGenresActions();

  return (
    <Details<AgeRatingsFormData>
      defaultTitle="Age Ratings"
      subtitle="Age ratings appear for selection at the properties station of a video and an audio"
      initialData={{
        data: { ageRatings: data?.ageRatings?.nodes },
        loading: false,
        error: '',
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
  const { values, setFieldValue } = useFormikContext<AgeRatingsFormData>();

  return (
    <DynamicDataList<FormDataAgeRatings>
      columns={[
        {
          propertyName: 'name',
          label: 'Title',
          dataEntryRender: createInputRenderer({
            placeholder: 'Enter Title',
          }),
        },
      ]}
      allowNewData={true}
      positionPropertyName="sortOrder"
      value={values.ageRatings ?? []}
      onChange={(v) => {
        setFieldValue('ageRatings', v);
      }}
      stickyHeader={false}
      allowEditing
    />
  );
};

const Panel: React.FC<{ data?: any }> = ({ data }) => {
  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          {data?.ageRatings?.nodes[0] && (
            <Paragraph title="Last Modified">
              {formatDateTime(data?.ageRatings?.nodes[0].dateModified)} by{' '}
              {data?.ageRatings?.nodes[0].modifiedBy}
            </Paragraph>
          )}
          <Paragraph title="Statistic">
            <div className={classes.datalist}>
              <div>Items Total</div>
              <div className={classes.rightAlignment}>
                {data?.ageRatings?.totalCount}
              </div>
            </div>
          </Paragraph>
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
    data?.ageRatings?.nodes,
    data?.ageRatings?.totalCount,
    data?.snapshots?.nodes,
  ]);
};
