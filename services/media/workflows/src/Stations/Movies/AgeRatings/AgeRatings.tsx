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
import {
  AgeRatingsDocument,
  AgeRatingsQuery,
  Mutation,
  MutationCreateAgeRatingArgs,
  MutationDeleteAgeRatingArgs,
  MutationUpdateAgeRatingArgs,
  useAgeRatingsQuery,
} from '../../../generated/graphql';
import { useMovieGenresActions } from './AgeRatings.actions';
import classes from './AgeRatings.module.scss';
import { AgeRatingsFormData, FormDataAgeRatings } from './AgeRatings.types';

export const AgeRatings: React.FC = () => {
  const { loading, data, error } = useAgeRatingsQuery({
    client,
    fetchPolicy: 'no-cache',
  });

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
          generateUpdateGQLFragment<MutationCreateAgeRatingArgs>(
            'createAgeRating',
            {
              input: {
                ageRating: { sortOrder: item.sortOrder, name: item.name },
              },
            },
          ),
        generateDeleteMutation: (item: FormDataAgeRatings): string =>
          generateUpdateGQLFragment<MutationDeleteAgeRatingArgs>(
            'deleteAgeRating',
            { input: { id: item.id } },
          ),
        generateUpdateMutation: (item: FormDataAgeRatings): string =>
          generateUpdateGQLFragment<MutationUpdateAgeRatingArgs>(
            'updateAgeRating',
            {
              input: {
                id: item.id,
                patch: { name: item.name, sortOrder: item.sortOrder },
              },
            },
          ),
        key: 'id',
      });

      const GqlMutationDocument = gql`mutation UpdateAgeRating {
        ${mutations}
      }`;

      await client.mutate({
        mutation: GqlMutationDocument,
        refetchQueries: [AgeRatingsDocument],
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

const Panel: React.FC<{ data?: AgeRatingsQuery }> = ({ data }) => {
  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          {data?.ageRatings?.nodes[0] && (
            <Paragraph title="Last Modified">
              {formatDateTime(data?.ageRatings?.nodes[0].updatedDate)} by{' '}
              {data?.ageRatings?.nodes[0].updatedUser}
            </Paragraph>
          )}
          <Paragraph title="Statistic">
            <div className={classes.datalist}>
              <div>Items Total</div>
              <div className="">{data?.ageRatings?.totalCount}</div>
            </div>
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [data?.ageRatings?.nodes, data?.ageRatings?.totalCount]);
};
