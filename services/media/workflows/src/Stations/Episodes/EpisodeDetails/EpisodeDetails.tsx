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
import { InfoPanelParent } from '../../../components';
import { ExtensionsContext, ImageID } from '../../../externals';
import {
  Episode,
  EpisodeImageType,
  Mutation,
  MutationCreateEpisodesCastArgs,
  MutationCreateEpisodesProductionCountryArgs,
  MutationCreateEpisodesTagArgs,
  MutationCreateEpisodesTvshowGenreArgs,
  MutationDeleteEpisodesCastArgs,
  MutationDeleteEpisodesProductionCountryArgs,
  MutationDeleteEpisodesTagArgs,
  MutationDeleteEpisodesTvshowGenreArgs,
  PublishStatus,
  SearchEpisodeCastDocument,
  SearchEpisodeCastQuery,
  SearchEpisodeCastQueryVariables,
  SearchEpisodeProductionCountriesDocument,
  SearchEpisodeProductionCountriesQuery,
  SearchEpisodeProductionCountriesQueryVariables,
  SearchEpisodeTagsDocument,
  SearchEpisodeTagsQuery,
  SearchEpisodeTagsQueryVariables,
  TvshowGenre,
  UpdateEpisodeMutation,
  UpdateEpisodeMutationVariables,
  useEpisodeQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useEpisodeDetailsActions } from './EpisodeDetails.actions';
import classes from './EpisodeDetails.module.scss';
import { EpisodeDetailsFormData } from './EpisodeDetails.types';

const episodeDetailSchema = Yup.object<
  ObjectSchemaDefinition<EpisodeDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
  index: Yup.number()
    .positive('Episode Index must be a positive number')
    .integer('Episode Index must be an integer')
    .required('Episode Index is a required field'),
});

export const EpisodeDetails: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  const { loading, data, error } = useEpisodeQuery({
    client,
    variables: { id: episodeId },
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
      tags: data?.episode?.episodesTags.nodes.map((node) => node.name),
      genres: data?.episode?.episodesTvshowGenres.nodes.map(
        (node) => node.tvshowGenres?.title ?? '',
      ),
      cast: data?.episode?.episodesCasts.nodes.map((node) => node.name),
      productionCountries: data?.episode?.episodesProductionCountries.nodes.map(
        (node) => node.name,
      ),
    }),
    [data],
  );

  const { actions } = useEpisodeDetailsActions(episodeId);

  const onSubmit = useCallback(
    async (
      formData: EpisodeDetailsFormData,
      initialData: DetailsProps<EpisodeDetailsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const tagAssignmentMutations = generateArrayMutations({
        current: formData.tags,
        original: initialData.data?.tags,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateEpisodesTagArgs>(
            'createEpisodesTag',
            { input: { episodesTag: { name, episodeId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteEpisodesTagArgs>(
            'deleteEpisodesTag',
            { input: { episodeId, name } },
          ),
        prefix: 'episodesTag',
      });

      const genreAssignmentMutations = generateArrayMutations({
        current: formData.genres,
        original: initialData.data?.genres,
        generateCreateMutation: (name) => {
          const tvshowGenresId = allGenres[name].id;

          if (tvshowGenresId) {
            return generateUpdateGQLFragment<MutationCreateEpisodesTvshowGenreArgs>(
              'createEpisodesTvshowGenre',
              {
                input: {
                  episodesTvshowGenre: {
                    episodeId,
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
            return generateUpdateGQLFragment<MutationDeleteEpisodesTvshowGenreArgs>(
              'deleteEpisodesTvshowGenre',
              {
                input: { episodeId, tvshowGenresId },
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
          generateUpdateGQLFragment<MutationCreateEpisodesCastArgs>(
            'createEpisodesCast',
            { input: { episodesCast: { name, episodeId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteEpisodesCastArgs>(
            'deleteEpisodesCast',
            { input: { episodeId, name } },
          ),
        prefix: 'cast',
      });

      const productionCountriesAssignmentMutations = generateArrayMutations({
        current: formData.productionCountries,
        original: initialData.data?.productionCountries,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateEpisodesProductionCountryArgs>(
            'createEpisodesProductionCountry',
            {
              input: { episodesProductionCountry: { name, episodeId } },
            },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteEpisodesProductionCountryArgs>(
            'deleteEpisodesProductionCountry',
            { input: { episodeId, name } },
          ),
        prefix: 'productionCountry',
      });

      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql`mutation UpdateEpisode($input: UpdateEpisodeInput!) {
        updateEpisode(input: $input) {
          clientMutationId
          episode {
            id
            title
          }
        }
        ${tagAssignmentMutations}
        ${genreAssignmentMutations}
        ${castAssignmentMutations}
        ${productionCountriesAssignmentMutations}
      }`;

      await client.mutate<
        UpdateEpisodeMutation,
        UpdateEpisodeMutationVariables
      >({
        mutation: GqlMutationDocument,
        variables: { input: { id: episodeId, patch } },
      });
    },
    [allGenres, episodeId],
  );

  return (
    <Details<EpisodeDetailsFormData>
      defaultTitle="Episode"
      titleProperty="title"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={episodeDetailSchema}
      initialData={{
        data: {
          ...data?.episode,
          tags,
          genres,
          cast,
          productionCountries,
        },
        loading,
        entityNotFound: data?.episode === null,
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
  const { ImageCover, ImagePreview } = useContext(ExtensionsContext);
  const { values } = useFormikContext<Episode>();

  return useMemo(() => {
    let coverImageId: ImageID;
    let coverImageCount = 0;
    let teaserImageCount = 0;

    values.episodesImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case EpisodeImageType.Cover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case EpisodeImageType.Teaser:
          teaserImageCount++;
          break;
        default:
          break;
      }
    });

    return (
      <InfoPanel>
        <Section>
          <ImageCover params={{ id: coverImageId }} />
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
          {values.publishStatus === PublishStatus.Published ? (
            <Paragraph title="Last Published">
              {formatDateTime(values.publishedDate)} by {values.publishedUser}
            </Paragraph>
          ) : null}
        </Section>
        <Section title="Assignments">
          <Paragraph title="Parent Entity">
            {values?.season ? (
              <InfoPanelParent
                Thumbnail={ImagePreview}
                imageId={values.season?.seasonsImages?.nodes?.[0]?.imageId}
                path={`/seasons/${values.season?.id}`}
                label="Open Details"
                title={
                  typeof values.season?.index === 'number'
                    ? `S${values.season?.index}` +
                      (values.season?.tvshow?.title
                        ? `: ${values.season?.tvshow?.title}`
                        : '')
                    : ''
                }
              />
            ) : (
              <div>not assigned</div>
            )}
          </Paragraph>
          <Paragraph title="Assigned items">
            <div className={classes.datalist}>
              <div>Main Video</div>
              <div className={classes.rightAlignment}>
                {values.mainVideoId ? 1 : 0}/1
              </div>
              <div>Trailers</div>
              <div className={classes.rightAlignment}>
                {values.episodesTrailers?.totalCount}/many
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
    ImagePreview,
    values.createdDate,
    values.createdUser,
    values.episodesImages?.nodes,
    values.episodesTrailers?.totalCount,
    values.id,
    values.mainVideoId,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    values.season,
    values.updatedDate,
    values.updatedUser,
  ]);
};

const Form: React.FC<{ genreOptions?: string[] }> = ({ genreOptions }) => {
  const tagsResolver = async (value: string): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchEpisodeTagsQuery,
      SearchEpisodeTagsQueryVariables
    >({
      query: SearchEpisodeTagsDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getEpisodesTagsValues?.nodes ?? [];
  };

  const castSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchEpisodeCastQuery,
      SearchEpisodeCastQueryVariables
    >({
      query: SearchEpisodeCastDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getEpisodesCastsValues?.nodes ?? [];
  };

  const productionCountriesResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchEpisodeProductionCountriesQuery,
      SearchEpisodeProductionCountriesQueryVariables
    >({
      query: SearchEpisodeProductionCountriesDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getEpisodesProductionCountriesValues?.nodes ?? [];
  };

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field
        name="originalTitle"
        label="Original Title"
        as={SingleLineTextField}
      />
      <Field
        type="number"
        name="index"
        label="Episode Index"
        className={classes.episodeIndex}
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
  currentValues: EpisodeDetailsFormData,
  initialValues?: EpisodeDetailsFormData | null,
): Partial<EpisodeDetailsFormData> {
  const {
    index: idx,
    tags,
    cast,
    productionCountries,
    genres,
    ...rest
  } = getFormDiff(currentValues, initialValues);
  let index: number | undefined;

  if (idx) {
    index = Number(idx);
  }

  return { index, ...rest };
}
