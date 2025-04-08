import { ID, Maybe } from '@axinom/mosaic-managed-workflow-integration';
import {
  createUpdateGQLFragmentGenerator,
  CustomTagsField,
  Details,
  DetailsProps,
  formatDateTime,
  generateArrayMutations,
  getFormDiff,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
  SingleLineTextField,
  TagsField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext, useMemo } from 'react';
import { validate as isUuid } from 'uuid';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  AllCountryType,
  CollectionCountry,
  CollectionCountryInput,
  CollectionDocument,
  CollectionImageType,
  CollectionQuery,
  DeleteCollectionCountryInput,
  Mutation,
  MutationCreateCollectionCountryArgs,
  MutationCreateCollectionsTagArgs,
  MutationDeleteCollectionCountryArgs,
  MutationDeleteCollectionsTagArgs,
  SearchCollectionTagsDocument,
  SearchCollectionTagsQuery,
  SearchCollectionTagsQueryVariables,
  UpdateCollectionInput,
  useCollectionQuery,
} from '../../../generated/graphql';
import {
  getCountryCode,
  getCountryName,
} from '../../../Util/CountryNames/CountryNames';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useCollectionDetailsActions } from './CollectionDetails.actions';
import classes from './CollectionDetails.module.scss';
import { CollectionDetailsFormData } from './CollectionDetails.types';

interface CollectionDetailsFormProps {
  collectionId: number;
}

const collectionDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<CollectionDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
  description: Yup.string().nullable(),
  synopsis: Yup.string().nullable(),
  externalId: Yup.string().nullable(),
});

export const CollectionDetailsForm: React.FC<CollectionDetailsFormProps> = ({
  collectionId,
}) => {
  const { loading, data, error } = useCollectionQuery({
    client,
    variables: { id: collectionId },
    fetchPolicy: 'network-only',
  });

  const { tags, allCountries, countries } = useMemo(
    () => ({
      tags: data?.collection?.collectionsTags.nodes.map((node) => node.name),
      allCountries:
        data?.allCountryTypes?.nodes.map((node: AllCountryType) =>
          isUuid(node.id ?? '') ? node.name : getCountryName(node.id ?? ''),
        ) ?? [],
      countries: data?.collection?.collectionCountries.nodes.map((country) =>
        getCountryNameById(country, data?.allCountryTypes?.nodes),
      ),
    }),
    [data],
  );

  const { actions } = useCollectionDetailsActions(collectionId);

  const onSubmit = useCallback(
    async (
      formData: CollectionDetailsFormData,
      initialData: DetailsProps<CollectionDetailsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const tagAssignmentMutations = generateArrayMutations({
        current: formData.tags,
        original: initialData.data?.tags,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateCollectionsTagArgs>(
            'createCollectionsTag',
            { input: { collectionsTag: { name, collectionId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteCollectionsTagArgs>(
            'deleteCollectionsTag',
            { input: { collectionId, name } },
          ),
        prefix: 'collectionsTag',
      });

      const countriesAssignmentMutations = generateArrayMutations({
        current: formData.countries,
        original: initialData.data?.countries,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateCollectionCountryArgs>(
            'createCollectionCountry',
            {
              input: {
                collectionCountry: generateCountryAssignmentPatch(
                  name,
                  collectionId,
                  data?.allCountryTypes?.nodes,
                ),
              },
            },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteCollectionCountryArgs>(
            'deleteCollectionCountry',
            {
              input: generateDeleteCountryAssignmentPatch(
                name,
                data?.collection?.collectionCountries.nodes,
                data?.allCountryTypes?.nodes,
              ),
            },
          ),
        prefix: 'collectionCountry',
      });

      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql`mutation UpdateCollection($input: UpdateCollectionInput!) {
          updateCollection(input: $input) {
            clientMutationId
            collection {
              id
              title
            }
          }
          ${tagAssignmentMutations}
          ${countriesAssignmentMutations}
        }`;

      await client.mutate<unknown, { input: UpdateCollectionInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: collectionId, patch } },
        refetchQueries: [CollectionDocument],
        awaitRefetchQueries: true,
      });
    },
    [collectionId, data],
  );

  return (
    <Details<CollectionDetailsFormData>
      defaultTitle="Collection"
      titleProperty="title"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={collectionDetailSchema}
      initialData={{
        data: {
          ...data?.collection,
          tags,
          countries,
        },
        loading,
        entityNotFound: data?.collection === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
    >
      <Form countryOptions={allCountries} />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { ImageCover } = useContext(ExtensionsContext);
  const { values } =
    useFormikContext<NonNullable<CollectionQuery['collection']>>();

  return useMemo(() => {
    let coverImageId: ID;
    let cover1x1ImageId: ID;
    let cover4x1ImageId: ID;
    let coverImageCount = 0;
    let cover1x1ImageCount = 0;
    let cover4x1ImageCount = 0;
    let cleanCoverImageCount = 0;
    let cleanCover1x1ImageCount = 0;
    let cleanCover4x1ImageCount = 0;
    let listImageCount = 0;
    let list1x1ImageCount = 0;
    let list15x16ImageCount = 0;

    values.collectionsImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case CollectionImageType.CollectionCover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case CollectionImageType.CollectionCover_1X1:
          cover1x1ImageCount++;
          cover1x1ImageId = imageId;
          break;
        case CollectionImageType.CollectionCover_4X1:
          cover4x1ImageCount++;
          cover4x1ImageId = imageId;
          break;
        case CollectionImageType.CollectionCleanCover:
          cleanCoverImageCount++;
          break;
        case CollectionImageType.CollectionCleanCover_1X1:
          cleanCover1x1ImageCount++;
          break;
        case CollectionImageType.CollectionCleanCover_4X1:
          cleanCover4x1ImageCount++;
          break;
        case CollectionImageType.CollectionList:
          listImageCount++;
          break;
        case CollectionImageType.CollectionList_1X1:
          list1x1ImageCount++;
          break;
        case CollectionImageType.CollectionList_15X16:
          list15x16ImageCount++;
          break;
        default:
          break;
      }
    });

    return (
      <InfoPanel>
        <Section>
          <ImageCover id={cover1x1ImageId ?? cover4x1ImageId ?? coverImageId} />
        </Section>
        <Section title="Additional Information">
          <Paragraph title="ID">{values.id}</Paragraph>
          <Paragraph title="Subtype">
            {getEnumLabel(values.assetSubtype)}
          </Paragraph>
          <Paragraph title="Created">
            {formatDateTime(values.createdDate)} by {values.createdUser}
          </Paragraph>
          <Paragraph title="Last Modified">
            {formatDateTime(values.updatedDate)} by {values.updatedUser}
          </Paragraph>
          <Paragraph title="Publishing Status">
            {getEnumLabel(values.publishStatus)}
          </Paragraph>
          <Paragraph title="Publishing ID">{values.publishingId}</Paragraph>
          {values.publishedDate ? (
            <Paragraph title="Published">
              {formatDateTime(values.publishedDate)} by {values.publishedUser}
            </Paragraph>
          ) : null}         
        </Section>
        <Section title="Assigned Items">
          <Paragraph title="Entities">
            <div className={classes.datalist}>
              <div>Movies</div>
              <div className={classes.rightAlignment}>
                {values.movies?.totalCount} / many
              </div>
              <div>TV Shows</div>
              <div className={classes.rightAlignment}>
                {values.tvshows?.totalCount} / many
              </div>
              <div>Episodes</div>
              <div className={classes.rightAlignment}>
                {values.episodes?.totalCount} / many
              </div>
              <div>Collections</div>
              <div className={classes.rightAlignment}>
                {values.childCollections?.totalCount} / many
              </div>
            </div>
          </Paragraph>
          <Paragraph title="Images">
            <div className={classes.datalist}>
              <div>Cover</div>
              <div className={classes.rightAlignment}>
                {coverImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Cover 1x1</div>
              <div className={classes.rightAlignment}>
                {cover1x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Cover 4x1</div>
              <div className={classes.rightAlignment}>
                {cover4x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Clean Cover</div>
              <div className={classes.rightAlignment}>
                {cleanCoverImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Clean Cover 1x1</div>
              <div className={classes.rightAlignment}>
                {cleanCover1x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Clean Cover 4x1</div>
              <div className={classes.rightAlignment}>
                {cleanCover4x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>List</div>
              <div className={classes.rightAlignment}>
                {listImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>List 1x1</div>
              <div className={classes.rightAlignment}>
                {list1x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>List 15x16</div>
              <div className={classes.rightAlignment}>
                {list15x16ImageCount} / 1
              </div>
            </div>
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [
    values.collectionsImages?.nodes,
    values.id,
    values.assetSubtype,
    values.createdDate,
    values.createdUser,
    values.updatedDate,
    values.updatedUser,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    values.movies?.totalCount,
    values.tvshows?.totalCount,
    values.episodes?.totalCount,
    values.childCollections?.totalCount,
    ImageCover,
  ]);
};

const Form: React.FC<{
  countryOptions?: (Maybe<string> | undefined)[];
}> = ({ countryOptions }) => {
  const { initialValues } = useFormikContext<CollectionDetailsFormData>();

  const tagsResolver = async (value: string): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchCollectionTagsQuery,
      SearchCollectionTagsQueryVariables
    >({
      query: SearchCollectionTagsDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getCollectionsTagsValues?.nodes ?? [];
  };

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="synopsis" label="Short Description" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="externalId"
        label="External ID"
        as={SingleLineTextField}
        disabled={!!initialValues.externalId}
      />
      <Field
        name="tags"
        label="Tags"
        liveSuggestionsResolver={tagsResolver}
        as={CustomTagsField}
      />
      <Field
        name="countries"
        label="Country"
        tagsOptions={countryOptions}
        as={TagsField}
        displayKey="display"
        valueKey="value"
      />
      <Field name="extendedField" label="Custom" as={TextAreaField} />
    </>
  );
};

function createUpdateDto(
  currentValues: CollectionDetailsFormData,
  initialValues?: CollectionDetailsFormData | null,
): CollectionDetailsFormData {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tags, countries, ...rest } = getFormDiff(
    currentValues,
    initialValues,
  );
  return rest;
}

const getCountryNameById = (
  country: CollectionCountry['id'],
  allCountries: AllCountryType[] | undefined,
): string => {
  if (isUuid(country.countryGroupId)) {
    return (
      allCountries?.filter((con) => con.id === country.countryGroupId)[0]
        .name ?? ''
    );
  } else {
    return getCountryName(country.countryId);
  }
};

const generateCountryAssignmentPatch = (
  name: string,
  collectionId: number,
  allCountries: AllCountryType[] | undefined,
): CollectionCountryInput['id'] => {
  const countryCode = getCountryCode(name);
  if (countryCode) {
    return {
      collectionId,
      countryId: { type: 'enum', value: countryCode },
    };
  } else {
    if (allCountries) {
      const countryGroup = allCountries.find((con) => con.name === name);
      if (countryGroup) {
        return {
          collectionId,
          countryGroupId: countryGroup.id,
        };
      }
    }
  }
};

const generateDeleteCountryAssignmentPatch = (
  name: string,
  collectionCountries: CollectionCountry['id'],
  allCountries: AllCountryType[] | undefined,
): DeleteCollectionCountryInput => {
  const countryCode = getCountryCode(name);
  if (countryCode) {
    const country = collectionCountries.find(
      (con: CollectionCountry['id']) => con.countryId === countryCode,
    );
    if (country) {
      return { id: country.id };
    }
  } else {
    if (allCountries) {
      const countryGroup = allCountries.find((con) => con.name === name);
      if (countryGroup) {
        const collectionCountry = collectionCountries.find(
          (con: CollectionCountry['id']) =>
            con.countryGroupId === countryGroup.id,
        );
        if (collectionCountry) {
          return { id: collectionCountry.id };
        }
      }
    }
  }
  return { id: '' };
};
