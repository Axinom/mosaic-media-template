import {
  createInputRenderer,
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  DynamicDataList,
  formatDateTime,
  generateArrayMutationsWithUpdates,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
} from '@axinom/mosaic-ui';
import { useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
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
import classes from './AgeRatings.module.scss';
import {
  AssetAgeRatingsFormData,
  FormDataAgeRatings,
} from './AgeRatings.types';

const validationSchema = Yup.object<ObjectSchemaDefinition>({
  name: Yup.string().trim().required('Age Rating is required.'),
});

export const AgeRatings: React.FC = () => {
  const { loading, data, error } = useAgeRatingsQuery({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: AssetAgeRatingsFormData,
      initialData: DetailsProps<AssetAgeRatingsFormData>['initialData'],
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
                ageRating: { name: item.name },
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
                patch: { name: item.name },
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

  return (
    <Details<AssetAgeRatingsFormData>
      defaultTitle="Age Ratings"
      subtitle="Age ratings appear for selection at the properties station of a video and an audio"
      initialData={{
        data: { ageRatings: data?.ageRatings?.nodes },
        loading,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel data={data} />}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<AssetAgeRatingsFormData>();

  return (
    <DynamicDataList<FormDataAgeRatings>
      columns={[
        {
          propertyName: 'name',
          label: 'Age Rating',
          dataEntryRender: createInputRenderer({
            placeholder: 'Enter Age Rating',
          }),
        },
      ]}
      allowNewData={true}
      value={values.ageRatings ?? []}
      onChange={(v) => {
        setFieldValue('ageRatings', v);
      }}
      stickyHeader={false}
      allowEditing
      allowReordering={false}
      rowValidationSchema={validationSchema}
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
