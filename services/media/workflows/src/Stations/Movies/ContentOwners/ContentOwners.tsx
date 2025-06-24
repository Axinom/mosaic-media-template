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
  ContentOwnersDocument,
  ContentOwnersQuery,
  Mutation,
  MutationCreateContentOwnerArgs,
  MutationDeleteContentOwnerArgs,
  MutationUpdateContentOwnerArgs,
  useContentOwnersQuery,
} from '../../../generated/graphql';
import classes from './ContentOwners.module.scss';
import {
  AssetContentOwnersFormData,
  FormDataContentOwners,
} from './ContentOwners.types';

const validationSchema = Yup.object<ObjectSchemaDefinition>({
  name: Yup.string().trim().required('Content Owner is required.'),
});

export const ContentOwners: React.FC = () => {
  const { loading, data, error } = useContentOwnersQuery({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: AssetContentOwnersFormData,
      initialData: DetailsProps<AssetContentOwnersFormData>['initialData'],
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
                contentOwner: { name: item.name },
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
                patch: { name: item.name },
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

  return (
    <Details<AssetContentOwnersFormData>
      defaultTitle="Video Content Owners"
      subtitle="Content Owner's names appear for selection at the properties station of a video"
      initialData={{
        data: { contentOwners: data?.contentOwners?.nodes },
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
  const { values, setFieldValue } =
    useFormikContext<AssetContentOwnersFormData>();

  return (
    <DynamicDataList<FormDataContentOwners>
      columns={[
        {
          propertyName: 'name',
          label: 'Content Owner',
          dataEntryRender: createInputRenderer({
            placeholder: 'Enter Content Owner',
          }),
        },
      ]}
      allowNewData={true}
      value={values.contentOwners ?? []}
      onChange={(v) => {
        setFieldValue('contentOwners', v);
      }}
      stickyHeader={false}
      allowEditing
      allowReordering={false}
      rowValidationSchema={validationSchema}
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
