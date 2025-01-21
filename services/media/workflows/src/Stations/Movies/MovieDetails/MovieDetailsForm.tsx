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
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  BusinessType,
  Movie,
  MovieDocument,
  MovieGenre,
  MovieImageType,
  Mutation,
  MutationCreateMoviesCastArgs,
  MutationCreateMoviesDirectorArgs,
  MutationCreateMoviesMovieGenreArgs,
  MutationCreateMoviesProductionCountryArgs,
  MutationCreateMoviesTagArgs,
  MutationDeleteMoviesCastArgs,
  MutationDeleteMoviesDirectorArgs,
  MutationDeleteMoviesMovieGenreArgs,
  MutationDeleteMoviesProductionCountryArgs,
  MutationDeleteMoviesTagArgs,
  SearchMovieCastDocument,
  SearchMovieCastQuery,
  SearchMovieCastQueryVariables,
  SearchMovieDirectorDocument,
  SearchMovieDirectorQuery,
  SearchMovieDirectorQueryVariables,
  SearchMovieTagsDocument,
  SearchMovieTagsQuery,
  SearchMovieTagsQueryVariables,
  UpdateMovieInput,
  useMovieQuery,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useMovieDetailsActions } from './MovieDetails.actions';
import classes from './MovieDetails.module.scss';
import { MovieDetailsFormData } from './MovieDetails.types';

interface MovieDetailsFormProps {
  movieId: number;
}

const movieDetailSchema = Yup.object<
  ObjectSchemaDefinition<MovieDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
  rating: Yup.number()
    .nullable()
    .min(0, 'Rating must not be less than 0.')
    .max(100, 'Rating must not be greater than 100.')
    .typeError('Rating must be a number between 0 and 100.'),
});

interface selectOption {
  value: string;
  label: string;
}

export const MovieDetailsForm: React.FC<MovieDetailsFormProps> = ({
  movieId,
}) => {
  const { loading, data, error } = useMovieQuery({
    client,
    variables: { id: movieId },
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
  } = useMemo(
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
      director: data?.movie?.moviesDirectors.nodes.map((node) => node.name),
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
      allContentOwners:
        data?.contentOwners?.nodes.map(
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

      const directorAssignmentMutations = generateArrayMutations({
        current: formData.director,
        original: initialData.data?.director,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateMoviesDirectorArgs>(
            'createMoviesDirector',
            { input: { moviesDirector: { name, movieId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteMoviesDirectorArgs>(
            'deleteMoviesDirector',
            { input: { movieId, name } },
          ),
        prefix: 'director',
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
        ${directorAssignmentMutations}
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
          director,
          productionCountries,
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
        contentOwnerOptions={allContentOwners}
      />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { ImageCover } = useContext(ExtensionsContext);
  const { values } = useFormikContext<Movie>();

  return useMemo(() => {
    let cover1x1ImageId: ID;
    let cover1x1ImageCount = 0;
    let cover16x9ImageCount = 0;
    let cleanCover1x1ImageCount = 0;
    let cleanCover16x9ImageCount = 0;
    let list1x1ImageCount = 0;
    let list16x9ImageCount = 0;

    values.moviesImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case MovieImageType.MovieCover_1X1:
          cover1x1ImageCount++;
          cover1x1ImageId = imageId;
          break;
        case MovieImageType.MovieCover_16X9:
          cover16x9ImageCount++;
          break;
        case MovieImageType.MovieCleanCover_1X1:
          cleanCover1x1ImageCount++;
          break;
        case MovieImageType.MovieCleanCover_16X9:
          cleanCover16x9ImageCount++;
          break;
        case MovieImageType.MovieList_1X1:
          list1x1ImageCount++;
          break;
        case MovieImageType.MovieList_9X13:
          list16x9ImageCount++;
          break;
        default:
          break;
      }
    });

    return (
      <InfoPanel>
        <Section>
          <ImageCover id={cover1x1ImageId} />
        </Section>
        <Section title="Additional Information">
          <Paragraph title="External ID">{values.externalId}</Paragraph>
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
          {values.publishedDate ? (
            <Paragraph title="Published">
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
              <div>Cover 1x1</div>
              <div className={classes.rightAlignment}>
                {cover1x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Cover 16x9</div>
              <div className={classes.rightAlignment}>
                {cover16x9ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Clean Cover 1x1</div>
              <div className={classes.rightAlignment}>
                {cleanCover1x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>Clean Cover 16x9</div>
              <div className={classes.rightAlignment}>
                {cleanCover16x9ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>List 1x1</div>
              <div className={classes.rightAlignment}>
                {list1x1ImageCount} / 1
              </div>
            </div>
            <div className={classes.datalist}>
              <div>List 16x9</div>
              <div className={classes.rightAlignment}>
                {list16x9ImageCount} / 1
              </div>
            </div>
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [
    ImageCover,
    values.assetSubtype,
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
  contentOwnerOptions?: selectOption[];
  languageOptions?: string[];
}> = ({ genreOptions, ageRatingOptions, contentOwnerOptions }) => {
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

  const directorSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchMovieDirectorQuery,
      SearchMovieDirectorQueryVariables
    >({
      query: SearchMovieDirectorDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getMoviesDirectorsValues?.nodes ?? [];
  };

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="synopsis" label="Short Description" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="businessType"
        label="Business Type"
        options={Object.keys(BusinessType).map((key) => ({
          value: BusinessType[key],
          label: getEnumLabel(BusinessType[key]),
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
        tagsOptions={CountryNames}
        as={TagsField}
        displayKey="display"
        valueKey="value"
      />
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
        as={SingleLineTextField}
        className={classes.rating}
      />
      <Field
        name="contentOwner"
        label="Content Owner"
        addEmptyOption={true}
        options={contentOwnerOptions}
        as={SelectField}
      />

      <Field name="extendedField" label="Custom" as={TextAreaField} />
    </>
  );
};

function createUpdateDto(
  currentValues: MovieDetailsFormData,
  initialValues?: MovieDetailsFormData | null,
): Partial<MovieDetailsFormData> {
  const { tags, cast, director, productionCountries, genres, ...rest } =
    getFormDiff(currentValues, initialValues);

  return rest;
}
