import { ID } from '@axinom/mosaic-managed-workflow-integration';
import {
  createUpdateGQLFragmentGenerator,
  CustomTagsField,
  DateTimeTextField,
  Details,
  DetailsProps,
  formatDateTime,
  generateArrayMutations,
  getFormDiff,
  InfoPanel,
  Paragraph,
  ReadOnlyTextField,
  Section,
  SelectField,
  SingleLineTextField,
  TagsField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import clsx from 'clsx';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useContext, useMemo } from 'react';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  AssetSubtype,
  BusinessType,
  Mutation,
  MutationCreateTvshowsCastArgs,
  MutationCreateTvshowsDirectorArgs,
  MutationCreateTvshowsProductionCountryArgs,
  MutationCreateTvshowsTagArgs,
  MutationCreateTvshowsTvshowGenreArgs,
  MutationDeleteTvshowsCastArgs,
  MutationDeleteTvshowsDirectorArgs,
  MutationDeleteTvshowsProductionCountryArgs,
  MutationDeleteTvshowsTagArgs,
  MutationDeleteTvshowsTvshowGenreArgs,
  SearchTvShowCastDocument,
  SearchTvShowCastQuery,
  SearchTvShowCastQueryVariables,
  SearchTvShowDirectorDocument,
  SearchTvShowDirectorQuery,
  SearchTvShowDirectorQueryVariables,
  SearchTvShowProductionCountriesDocument,
  SearchTvShowProductionCountriesQuery,
  SearchTvShowProductionCountriesQueryVariables,
  SearchTvShowTagsDocument,
  SearchTvShowTagsQuery,
  SearchTvShowTagsQueryVariables,
  Tvshow,
  TvShowDocument,
  TvshowGenre,
  TvshowImageType,
  UpdateTvshowInput,
  useTvShowQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useTvShowDetailsActions } from './TvShowDetails.actions';
import classes from './TvShowDetails.module.scss';
import { TvShowDetailsFormData } from './TvShowDetails.types';

interface TvShowDetailsProps {
  tvshowId: number;
}

const tvShowDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<TvShowDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

interface selectOption {
  value: string;
  label: string;
}

export const TvShowDetailsForm: React.FC<TvShowDetailsProps> = ({
  tvshowId,
}) => {
  const { loading, data, error } = useTvShowQuery({
    client,
    variables: { id: tvshowId },
    fetchPolicy: 'network-only',
  });

  const {
    allGenres,
    cast,
    genres,
    productionCountries,
    tags,
    allAgeRatings,
    allContentOwners,
    director,
    allLanguages,
  } = useMemo(
    () => ({
      allGenres:
        data?.tvshowGenres?.nodes.reduce<{
          [tagname: string]: Partial<TvshowGenre>;
        }>((result, current) => {
          result[current.title] = current;
          return result;
        }, {}) ?? {},
      tags: data?.tvshow?.tvshowsTags.nodes.map((node) => node.name),
      genres: data?.tvshow?.tvshowsTvshowGenres.nodes.map(
        (node) => node.tvshowGenres?.title ?? '',
      ),
      cast: data?.tvshow?.tvshowsCasts.nodes.map((node) => node.name),
      productionCountries: data?.tvshow?.tvshowsProductionCountries.nodes.map(
        (node) => node.name,
      ),
      director: data?.tvshow?.tvshowsDirectors.nodes.map((node) => node.name),
      allAgeRatings:
        data?.ageRatings?.nodes.map(
          (node) =>
            ({
              value: node.name,
              label: node.name,
            } as selectOption),
        ) ?? [],
      allContentOwners:
        data?.contentOwners?.nodes.map(
          (node) =>
            ({
              value: node.name,
              label: node.name,
            } as selectOption),
        ) ?? [],

      allLanguages: data?.languages?.nodes.map((node) => node.title) ?? [],
    }),
    [data],
  );

  const { actions } = useTvShowDetailsActions(tvshowId);

  const onSubmit = useCallback(
    async (
      formData: TvShowDetailsFormData,
      initialData: DetailsProps<TvShowDetailsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const tagAssignmentMutations = generateArrayMutations({
        current: formData.tags,
        original: initialData.data?.tags,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateTvshowsTagArgs>(
            'createTvshowsTag',
            { input: { tvshowsTag: { name, tvshowId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteTvshowsTagArgs>(
            'deleteTvshowsTag',
            { input: { tvshowId, name } },
          ),
        prefix: 'tvshowsTag',
      });

      const genreAssignmentMutations = generateArrayMutations({
        current: formData.genres,
        original: initialData.data?.genres,
        generateCreateMutation: (name) => {
          const tvshowGenresId = allGenres[name].id;

          if (tvshowGenresId) {
            return generateUpdateGQLFragment<MutationCreateTvshowsTvshowGenreArgs>(
              'createTvshowsTvshowGenre',
              {
                input: {
                  tvshowsTvshowGenre: {
                    tvshowId,
                    tvshowGenresId,
                  },
                },
              },
            );
          } else {
            return '';
          }
        },
        generateDeleteMutation: (name) => {
          const tvshowGenresId = allGenres[name].id;
          if (tvshowGenresId) {
            return generateUpdateGQLFragment<MutationDeleteTvshowsTvshowGenreArgs>(
              'deleteTvshowsTvshowGenre',
              {
                input: { tvshowId, tvshowGenresId },
              },
            );
          } else {
            return '';
          }
        },
        prefix: 'genreConnection',
      });

      const castAssignmentMutations = generateArrayMutations({
        current: formData.cast,
        original: initialData.data?.cast,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateTvshowsCastArgs>(
            'createTvshowsCast',
            { input: { tvshowsCast: { name, tvshowId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteTvshowsCastArgs>(
            'deleteTvshowsCast',
            { input: { tvshowId, name } },
          ),
        prefix: 'cast',
      });

      const productionCountriesAssignmentMutations = generateArrayMutations({
        current: formData.productionCountries,
        original: initialData.data?.productionCountries,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateTvshowsProductionCountryArgs>(
            'createTvshowsProductionCountry',
            {
              input: { tvshowsProductionCountry: { name, tvshowId } },
            },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteTvshowsProductionCountryArgs>(
            'deleteTvshowsProductionCountry',
            { input: { tvshowId, name } },
          ),
        prefix: 'productionCountry',
      });

      const directorAssignmentMutations = generateArrayMutations({
        current: formData.director,
        original: initialData.data?.director,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateTvshowsDirectorArgs>(
            'createMoviesDirector',
            { input: { tvshowsDirector: { name, tvshowId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteTvshowsDirectorArgs>(
            'deleteMoviesDirector',
            { input: { tvshowId, name } },
          ),
        prefix: 'director',
      });

      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql`mutation UpdateTvShow($input: UpdateTvshowInput!) {
        updateTvshow(input: $input) {
          clientMutationId
          tvshow {
            id
            title
          }
        }
        ${tagAssignmentMutations}
        ${genreAssignmentMutations}
        ${castAssignmentMutations}
        ${productionCountriesAssignmentMutations}
        ${directorAssignmentMutations}
      }`;

      await client.mutate<unknown, { input: UpdateTvshowInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: tvshowId, patch } },
        refetchQueries: [TvShowDocument],
        awaitRefetchQueries: true,
      });
    },
    [allGenres, tvshowId],
  );

  return (
    <Details<TvShowDetailsFormData>
      defaultTitle="TV Show"
      titleProperty="title"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={tvShowDetailSchema}
      initialData={{
        data: {
          ...data?.tvshow,
          tags,
          genres,
          cast,
          productionCountries,
          director,
        },
        loading,
        entityNotFound: data?.tvshow === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
    >
      <Form
        genreOptions={Object.keys(allGenres)}
        ageRatingOptions={allAgeRatings}
        contentOwnerOptions={allContentOwners}
        languageOptions={allLanguages}
      />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { ImageCover } = useContext(ExtensionsContext);
  const { values } = useFormikContext<Tvshow>();

  return useMemo(() => {
    let coverImageId: ID;
    let coverImageCount = 0;
    let teaserImageCount = 0;

    values.tvshowsImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case TvshowImageType.Cover_1X1:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case TvshowImageType.CleanCover_1X1:
          teaserImageCount++;
          break;
        default:
          break;
      }
    });

    return (
      <InfoPanel>
        <Section>
          <ImageCover id={coverImageId} />
        </Section>
        <Section title="Additional Information">
          <Paragraph title="ID">{values.id}</Paragraph>
          <Paragraph title="Created">
            {formatDateTime(values.createdDate)} by {values.createdUser}
          </Paragraph>
          <Paragraph title="Last Modified">
            {formatDateTime(values.updatedDate)} by {values.updatedUser}
          </Paragraph>
          <Paragraph title="Publishing Status">
            {getEnumLabel(values.publishStatus)}
          </Paragraph>
          {values.publishedDate ? (
            <Paragraph title="Last Published">
              {formatDateTime(values.publishedDate)} by {values.publishedUser}
            </Paragraph>
          ) : null}
        </Section>
        <Section title="Assignments">
          <Paragraph title="Assigned items">
            <div className={classes.datalist}>
              <div>Seasons</div>
              <div className={classes.rightAlignment}>
                {values.seasons?.totalCount}/many
              </div>
              <div>Trailers</div>{' '}
              <div className={classes.rightAlignment}>
                {values.tvshowsTrailers?.totalCount}/many
              </div>
              <div className={classes.assignedItemsSpacing}>Cover</div>
              <div
                className={clsx(
                  classes.rightAlignment,
                  classes.assignedItemsSpacing,
                )}
              >
                {coverImageCount} / 1
              </div>
              <div>Teaser</div>
              <div className={classes.rightAlignment}>
                {teaserImageCount} / 1
              </div>
            </div>
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [
    ImageCover,
    values.createdDate,
    values.createdUser,
    values.id,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    values.seasons?.totalCount,
    values.tvshowsImages?.nodes,
    values.tvshowsTrailers?.totalCount,
    values.updatedDate,
    values.updatedUser,
  ]);
};

const Form: React.FC<{
  genreOptions?: string[];
  ageRatingOptions?: selectOption[];
  contentOwnerOptions?: selectOption[];
  languageOptions?: string[];
}> = ({
  genreOptions,
  ageRatingOptions,
  contentOwnerOptions,
  languageOptions,
}) => {
  const tagsResolver = async (value: string): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchTvShowTagsQuery,
      SearchTvShowTagsQueryVariables
    >({
      query: SearchTvShowTagsDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getTvshowsTagsValues?.nodes ?? [];
  };

  const castSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchTvShowCastQuery,
      SearchTvShowCastQueryVariables
    >({
      query: SearchTvShowCastDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getTvshowsCastsValues?.nodes ?? [];
  };

  const productionCountriesResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchTvShowProductionCountriesQuery,
      SearchTvShowProductionCountriesQueryVariables
    >({
      query: SearchTvShowProductionCountriesDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getTvshowsProductionCountriesValues?.nodes ?? [];
  };

  const directorSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchTvShowDirectorQuery,
      SearchTvShowDirectorQueryVariables
    >({
      query: SearchTvShowDirectorDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getTvshowsDirectorsValues?.nodes ?? [];
  };

  const ValidateRating = (value: string): boolean => {
    return value === null || value.trim() === ''
      ? false
      : isNaN(parseFloat(value)) ||
          parseFloat(value) < 0 ||
          parseFloat(value) > 100 ||
          !/^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/.test(value);
  };

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="synopsis" label="Short Description" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="businessType"
        label="Business Type"
        addEmptyOption={true}
        options={Object.keys(BusinessType).map((key) => ({
          value: BusinessType[key],
          label: getEnumLabel(BusinessType[key]),
        }))}
        as={SelectField}
      />
      <Field
        name="assetSubtype"
        label="Subtype"
        addEmptyOption={true}
        options={Object.keys(AssetSubtype)
          .filter((type) => type === 'TvShow')
          .map((key) => ({
            value: AssetSubtype[key],
            label: getEnumLabel(AssetSubtype[key]),
          }))}
        as={SelectField}
      />
      <Field
        name="genres"
        label="Genres"
        tagsOptions={genreOptions}
        as={TagsField}
      />
      <Field
        name="cast"
        label="Cast"
        liveSuggestionsResolver={castSuggestionResolver}
        as={CustomTagsField}
      />
      <Field
        name="director"
        label="Directors"
        liveSuggestionsResolver={directorSuggestionResolver}
        as={CustomTagsField}
      />
      <Field
        name="tags"
        label="Tags"
        liveSuggestionsResolver={tagsResolver}
        as={CustomTagsField}
      />
      <Field
        name="released"
        label="Released"
        as={DateTimeTextField}
        modifyTime={false}
      />
      <Field
        name="productionCountries"
        label="Country"
        liveSuggestionsResolver={productionCountriesResolver}
        as={CustomTagsField}
      />
      <Field name="duration" label="Duration" as={SingleLineTextField} />
      <Field
        name="ageRating"
        label="Age Rating"
        addEmptyOption={true}
        options={ageRatingOptions}
        as={SelectField}
      />
      <Field
        name="rating"
        label="Rating"
        validate={ValidateRating}
        as={SingleLineTextField}
      />
      <Field
        name="contentOwner"
        label="Content Owner"
        addEmptyOption={true}
        options={contentOwnerOptions}
        as={SelectField}
      />

      <Field name="extendedField" label="Custom" as={TextAreaField} />
      <Field name="externalId" label="External Id" as={ReadOnlyTextField} />
    </>
  );
};

function createUpdateDto(
  currentValues: TvShowDetailsFormData,
  initialValues?: TvShowDetailsFormData | null,
): Partial<TvShowDetailsFormData> {
  const { tags, cast, director, productionCountries, genres, ...rest } =
    getFormDiff(currentValues, initialValues);

  return rest;
}
