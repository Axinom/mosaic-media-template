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
  ContentOwnersDocument,
  ContentOwnersQuery,
  Mutation,
  MutationCreateContentOwnerArgs,
  MutationDeleteContentOwnerArgs,
  MutationUpdateContentOwnerArgs,
  useContentOwnersQuery,
} from '../../../generated/graphql';
import { useMovieGenresActions } from './ContentOwners.actions';
import classes from './ContentOwners.module.scss';
import {
  ContentOwnersFormData,
  FormDataContentOwners,
} from './ContentOwners.types';

export const ContentOwners: React.FC = () => {
  const { loading, data, error } = useContentOwnersQuery({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: ContentOwnersFormData,
      initialData: DetailsProps<ContentOwnersFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const mutations = generateArrayMutationsWithUpdates({
        current: formData.contentOwners,
        original: initialData.data?.contentOwners,
        generateCreateMutation: (item: FormDataContentOwners): string =>
          generateUpdateGQLFragment<MutationCreateContentOwnerArgs>(
            'createContentOwner',
            {
              input: {
                contentOwner: { sortOrder: item.sortOrder, name: item.name },
              },
            },
          ),
        generateDeleteMutation: (item: FormDataContentOwners): string =>
          generateUpdateGQLFragment<MutationDeleteContentOwnerArgs>(
            'deleteContentOwner',
            { input: { id: item.id } },
          ),
        generateUpdateMutation: (item: FormDataContentOwners): string =>
          generateUpdateGQLFragment<MutationUpdateContentOwnerArgs>(
            'updateContentOwner',
            {
              input: {
                id: item.id,
                patch: { name: item.name, sortOrder: item.sortOrder },
              },
            },
          ),
        key: 'id',
      });

      const GqlMutationDocument = gql`mutation UpdateContentOwner {
        ${mutations}
      }`;

      await client.mutate({
        mutation: GqlMutationDocument,
        refetchQueries: [ContentOwnersDocument],
        awaitRefetchQueries: true,
      });
    },
    [],
  );

  const { actions } = useMovieGenresActions();

  return (
    <Details<ContentOwnersFormData>
      defaultTitle="Video Content Owners"
      subtitle="Content Owner's names appear for selection at the properties station of a video"
      initialData={{
        data: { contentOwners: data?.contentOwners?.nodes },
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
  const { values, setFieldValue } = useFormikContext<ContentOwnersFormData>();

  return (
    <DynamicDataList<FormDataContentOwners>
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
      value={values.contentOwners ?? []}
      onChange={(v) => {
        setFieldValue('contentOwners', v);
      }}
      stickyHeader={false}
      allowEditing
    />
  );
};

const Panel: React.FC<{ data?: ContentOwnersQuery }> = ({ data }) => {
  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          {data?.contentOwners?.nodes[0] && (
            <Paragraph title="Last Modified">
              {formatDateTime(data?.contentOwners?.nodes[0].updatedDate)} by{' '}
              {data?.contentOwners?.nodes[0].updatedUser}
            </Paragraph>
          )}
          <Paragraph title="Statistic">
            <div className={classes.datalist}>
              <div>Items Total</div>
              <div className="">{data?.contentOwners?.totalCount}</div>
            </div>
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [data?.contentOwners?.nodes, data?.contentOwners?.totalCount]);
};
