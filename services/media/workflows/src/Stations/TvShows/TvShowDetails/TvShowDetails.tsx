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
  Section,
  SingleLineTextField,
  TagsField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import clsx from 'clsx';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  Mutation,
  MutationCreateTvshowsCastArgs,
  MutationCreateTvshowsProductionCountryArgs,
  MutationCreateTvshowsTagArgs,
  MutationCreateTvshowsTvshowGenreArgs,
  MutationDeleteTvshowsCastArgs,
  MutationDeleteTvshowsProductionCountryArgs,
  MutationDeleteTvshowsTagArgs,
  MutationDeleteTvshowsTvshowGenreArgs,
  SearchTvShowCastDocument,
  SearchTvShowCastQuery,
  SearchTvShowCastQueryVariables,
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

const tvShowDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<TvShowDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

export const TvShowDetails: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const { loading, data, error } = useTvShowQuery({
    client,
    variables: { id: tvshowId },
    fetchPolicy: 'network-only',
  });

  const { allGenres, cast, genres, productionCountries, tags } = useMemo(
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
        },
        loading,
        entityNotFound: data?.tvshow === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
    >
      <Form genreOptions={Object.keys(allGenres)} />
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
        case TvshowImageType.Cover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case TvshowImageType.Teaser:
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

const Form: React.FC<{ genreOptions?: string[] }> = ({ genreOptions }) => {
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

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field
        name="originalTitle"
        label="Original Title"
        as={SingleLineTextField}
      />
      <Field name="synopsis" label="Synopsis" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="externalId"
        label="External ID"
        className={classes.externalId}
        as={SingleLineTextField}
      />
      <Field
        name="tags"
        label="Tags"
        liveSuggestionsResolver={tagsResolver}
        as={CustomTagsField}
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
      <Field name="studio" label="Studio" as={SingleLineTextField} />
      <Field
        name="productionCountries"
        label="Production Countries"
        liveSuggestionsResolver={productionCountriesResolver}
        as={CustomTagsField}
      />
      <Field
        name="released"
        label="Released Date"
        as={DateTimeTextField}
        modifyTime={false}
      />
    </>
  );
};

function createUpdateDto(
  currentValues: TvShowDetailsFormData,
  initialValues?: TvShowDetailsFormData | null,
): Partial<TvShowDetailsFormData> {
  const { tags, cast, productionCountries, genres, ...rest } = getFormDiff(
    currentValues,
    initialValues,
  );

  return rest;
}
