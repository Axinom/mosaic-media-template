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
  SelectField,
  SingleLineTextField,
  TagsField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  Movie,
  MovieDocument,
  MovieGenre,
  MovieImageType,
  Mutation,
  MutationCreateMoviesCastArgs,
  MutationCreateMoviesMovieGenreArgs,
  MutationCreateMoviesProductionCountryArgs,
  MutationCreateMoviesTagArgs,
  MutationDeleteMoviesCastArgs,
  MutationDeleteMoviesMovieGenreArgs,
  MutationDeleteMoviesProductionCountryArgs,
  MutationDeleteMoviesTagArgs,
  SearchMovieCastDocument,
  SearchMovieCastQuery,
  SearchMovieCastQueryVariables,
  SearchMovieProductionCountriesDocument,
  SearchMovieProductionCountriesQuery,
  SearchMovieProductionCountriesQueryVariables,
  SearchMovieTagsDocument,
  SearchMovieTagsQuery,
  SearchMovieTagsQueryVariables,
  UpdateMovieInput,
  useMovieQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useMovieDetailsActions } from './MovieDetails.actions';
import classes from './MovieDetails.module.scss';
import { MovieDetailsFormData } from './MovieDetails.types';

const movieDetailSchema = Yup.object<
  ObjectSchemaDefinition<MovieDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

interface selectOption {
  value: string;
  label: string;
}

export const MovieDetails: React.FC = () => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );

  const { loading, data, error } = useMovieQuery({
    client,
    variables: { id: movieId },
    fetchPolicy: 'network-only',
  });

  const { allGenres, cast, genres, productionCountries, tags, allAgeRatings } =
    useMemo(
      () => ({
        allGenres:
          data?.movieGenres?.nodes.reduce<{
            [tagname: string]: Partial<MovieGenre>;
          }>((result, current) => {
            result[current.title] = current;
            return result;
          }, {}) ?? {},
        tags: data?.movie?.moviesTags.nodes.map((node) => node.name),
        genres: data?.movie?.moviesMovieGenres.nodes.map(
          (node) => node.movieGenres?.title ?? '',
        ),
        cast: data?.movie?.moviesCasts.nodes.map((node) => node.name),
        productionCountries: data?.movie?.moviesProductionCountries.nodes.map(
          (node) => node.name,
        ),
        allAgeRatings:
          data?.ageRatings?.nodes.map(
            (node) =>
              ({
                value: node.name,
                label: node.name,
              } as selectOption),
          ) ?? [],
      }),
      [data],
    );

  const { actions } = useMovieDetailsActions(movieId);

  const onSubmit = useCallback(
    async (
      formData: MovieDetailsFormData,
      initialData: DetailsProps<MovieDetailsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const tagAssignmentMutations = generateArrayMutations({
        current: formData.tags,
        original: initialData.data?.tags,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateMoviesTagArgs>(
            'createMoviesTag',
            { input: { moviesTag: { name, movieId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteMoviesTagArgs>(
            'deleteMoviesTag',
            { input: { movieId, name } },
          ),
        prefix: 'moviesTag',
      });

      const genreAssignmentMutations = generateArrayMutations({
        current: formData.genres,
        original: initialData.data?.genres,
        generateCreateMutation: (name) => {
          const movieGenresId = allGenres[name].id;

          if (movieGenresId) {
            return generateUpdateGQLFragment<MutationCreateMoviesMovieGenreArgs>(
              'createMoviesMovieGenre',
              {
                input: {
                  moviesMovieGenre: {
                    movieId,
                    movieGenresId,
                  },
                },
              },
            );
          } else {
            return '';
          }
        },
        generateDeleteMutation: (name) => {
          const movieGenresId = allGenres[name].id;
          if (movieGenresId) {
            return generateUpdateGQLFragment<MutationDeleteMoviesMovieGenreArgs>(
              'deleteMoviesMovieGenre',
              {
                input: { movieId, movieGenresId },
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
          generateUpdateGQLFragment<MutationCreateMoviesCastArgs>(
            'createMoviesCast',
            { input: { moviesCast: { name, movieId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteMoviesCastArgs>(
            'deleteMoviesCast',
            { input: { movieId, name } },
          ),
        prefix: 'cast',
      });

      const productionCountriesAssignmentMutations = generateArrayMutations({
        current: formData.productionCountries,
        original: initialData.data?.productionCountries,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateMoviesProductionCountryArgs>(
            'createMoviesProductionCountry',
            {
              input: { moviesProductionCountry: { name, movieId } },
            },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteMoviesProductionCountryArgs>(
            'deleteMoviesProductionCountry',
            { input: { movieId, name } },
          ),
        prefix: 'productionCountry',
      });

      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql`mutation UpdateMovie($input: UpdateMovieInput!) {
        updateMovie(input: $input) {
          clientMutationId
          movie {
            id
            title
          }
        }
        ${tagAssignmentMutations}
        ${genreAssignmentMutations}
        ${castAssignmentMutations}
        ${productionCountriesAssignmentMutations}
      }`;

      await client.mutate<unknown, { input: UpdateMovieInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: movieId, patch } },
        refetchQueries: [MovieDocument],
        awaitRefetchQueries: true,
      });
    },
    [allGenres, movieId],
  );

  return (
    <Details<MovieDetailsFormData>
      defaultTitle="Movie"
      titleProperty="title"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={movieDetailSchema}
      initialData={{
        data: {
          ...data?.movie,
          tags,
          genres,
          cast,
          productionCountries,
          businessType: [],
          adLanguages: [],
          sbLanguages: [],
          ccLanguages: [],
        },
        loading,
        entityNotFound: data?.movie === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
    >
      <Form
        genreOptions={Object.keys(allGenres)}
        ageRatingOptions={allAgeRatings}
      />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { ImageCover } = useContext(ExtensionsContext);
  const { values } = useFormikContext<Movie>();

  return useMemo(() => {
    let coverImageId: ID;
    let coverImageCount = 0;
    let teaserImageCount = 0;

    values.moviesImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case MovieImageType.Cover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case MovieImageType.Teaser:
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
          <Paragraph title="External ID">{values.externalId}</Paragraph>
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
        <Section title="Assigned Items">
          <Paragraph title="Videos">
            <div className={classes.datalist}>
              <div>Main Video</div>
              <div className={classes.rightAlignment}>
                {values.mainVideoId ? 1 : 0}/1
              </div>
              <div>Trailers</div>{' '}
              <div className={classes.rightAlignment}>
                {values.moviesTrailers?.totalCount}/many
              </div>
            </div>
          </Paragraph>
          <Paragraph title="Images">
            <div className={classes.datalist}>
              <div>Cover</div>
              <div className={classes.rightAlignment}>
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
    values.externalId,
    values.mainVideoId,
    values.moviesImages?.nodes,
    values.moviesTrailers?.totalCount,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    values.updatedDate,
    values.updatedUser,
  ]);
};

const Form: React.FC<{
  genreOptions?: string[];
  ageRatingOptions?: selectOption[];
}> = ({ genreOptions, ageRatingOptions }) => {
  const tagsResolver = async (value: string): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchMovieTagsQuery,
      SearchMovieTagsQueryVariables
    >({
      query: SearchMovieTagsDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getMoviesTagsValues?.nodes ?? [];
  };

  const castSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchMovieCastQuery,
      SearchMovieCastQueryVariables
    >({
      query: SearchMovieCastDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getMoviesCastsValues?.nodes ?? [];
  };

  const productionCountriesResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchMovieProductionCountriesQuery,
      SearchMovieProductionCountriesQueryVariables
    >({
      query: SearchMovieProductionCountriesDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getMoviesProductionCountriesValues?.nodes ?? [];
  };

  const bTypeOptions: selectOption[] = [
    { value: 'free', label: 'free' },
    { value: 'free_authenticated', label: 'free_authenticated' },
    { value: 'advertisement', label: 'advertisement' },
    { value: 'premium', label: 'premium' },
  ];

  const sTypeOptions: selectOption[] = [{ value: 'Movie', label: 'Movie' }];

  const languageOptions = [
    'Abkhaz (ab)',
    'Arabic (ar)',
    'English (en)',
    'Hindi (hi)',
  ];

  const contentOwnerOptions: selectOption[] = [
    { value: 'ACI', label: 'ACI' },
    { value: 'BBI', label: 'BBI' },
    { value: 'California Pictures', label: 'California Pictures' },
    { value: 'FOX', label: 'FOX' },
  ];

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="synopsis" label="Short Description" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="businessType"
        label="Business Type"
        addEmptyOption={true}
        options={bTypeOptions}
        as={SelectField}
      />
      <Field
        name="subtype"
        label="Subtype"
        addEmptyOption={true}
        options={sTypeOptions}
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
        name="directors"
        label="Directors"
        liveSuggestionsResolver={castSuggestionResolver}
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
        name="adLanguages"
        label="Audio Languages"
        tagsOptions={languageOptions}
        as={TagsField}
      />
      <Field
        name="sbLanguages"
        label="Subtitle Languages"
        tagsOptions={languageOptions}
        as={TagsField}
      />
      <Field
        name="ccLanguages"
        label="Closed Caption Languages"
        tagsOptions={languageOptions}
        as={TagsField}
      />
      <Field
        name="rating"
        label="Rating"
        className={classes.externalId}
        as={SingleLineTextField}
      />
      <Field
        name="contentOwners"
        label="Content Owner"
        addEmptyOption={true}
        options={contentOwnerOptions}
        as={SelectField}
      />
      <Field
        //need new component
        name="creditStartTime"
        label="Credit Start Time"
        className={classes.externalId}
        as={SingleLineTextField}
      />
      <Field
        name="customRating"
        label="Custom Rating"
        className={classes.externalId}
        as={SingleLineTextField}
      />
      <Field
        name="custom"
        label="Custom"
        className={classes.externalId}
        as={TextAreaField}
      />
    </>
  );
};

function createUpdateDto(
  currentValues: MovieDetailsFormData,
  initialValues?: MovieDetailsFormData | null,
): Partial<MovieDetailsFormData> {
  const { tags, cast, productionCountries, genres, ...rest } = getFormDiff(
    currentValues,
    initialValues,
  );

  return rest;
}
