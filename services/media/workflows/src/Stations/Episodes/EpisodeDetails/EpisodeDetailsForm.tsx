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
import { InfoPanelParent } from '../../../components';
import { ExtensionsContext } from '../../../externals';
import {
  Episode,
  EpisodeDocument,
  EpisodeImageType,
  Mutation,
  MutationCreateEpisodesCastArgs,
  MutationCreateEpisodesDirectorArgs,
  MutationCreateEpisodesProductionCountryArgs,
  MutationCreateEpisodesTagArgs,
  MutationCreateEpisodesTvshowGenreArgs,
  MutationDeleteEpisodesCastArgs,
  MutationDeleteEpisodesDirectorArgs,
  MutationDeleteEpisodesProductionCountryArgs,
  MutationDeleteEpisodesTagArgs,
  MutationDeleteEpisodesTvshowGenreArgs,
  PublishStatus,
  SearchEpisodeCastDocument,
  SearchEpisodeCastQuery,
  SearchEpisodeCastQueryVariables,
  SearchEpisodeDirectorDocument,
  SearchEpisodeDirectorQuery,
  SearchEpisodeDirectorQueryVariables,
  SearchEpisodeTagsDocument,
  SearchEpisodeTagsQuery,
  SearchEpisodeTagsQueryVariables,
  TvshowGenre,
  UpdateEpisodeMutation,
  UpdateEpisodeMutationVariables,
  useEpisodeQuery,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';
import { getLicenseWarningMessage } from '../../../Util/LicenseDateSchema/LicenseDateSchema';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useEpisodeDetailsActions } from './EpisodeDetails.actions';
import classes from './EpisodeDetails.module.scss';
import { EpisodeDetailsFormData } from './EpisodeDetails.types';

interface EpisodeDetailsFormProps {
  episodeId: number;
}
interface selectOption {
  value: string;
  label: string;
}

const episodeDetailSchema = Yup.object<
  ObjectSchemaDefinition<EpisodeDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
  index: Yup.number()
    .positive('Episode Index must be a positive number')
    .integer('Episode Index must be an integer')
    .required('Episode Index is a required field'),
  rating: Yup.number()
    .nullable()
    .min(0, 'Rating must not be less than 0.')
    .max(100, 'Rating must not be greater than 100.')
    .typeError('Rating must be a number between 0 and 100.'),
});

export const EpisodeDetailsForm: React.FC<EpisodeDetailsFormProps> = ({
  episodeId,
}) => {
  const { loading, data, error } = useEpisodeQuery({
    client,
    variables: { id: episodeId },
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
      director: data?.episode?.episodesDirectors.nodes.map((node) => node.name),
      productionCountries: data?.episode?.episodesProductionCountries.nodes.map(
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

  const { actions } = useEpisodeDetailsActions(episodeId);

  const licenseWarningMessage = useMemo(
    () =>
      getLicenseWarningMessage(data?.episode?.episodesLicenses?.nodes || []),
    [data?.episode?.episodesLicenses?.nodes],
  );

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

      const directorAssignmentMutations = generateArrayMutations({
        current: formData.director,
        original: initialData.data?.director,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateEpisodesDirectorArgs>(
            'createEpisodesDirector',
            { input: { episodesDirector: { name, episodeId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteEpisodesDirectorArgs>(
            'deleteEpisodesDirector',
            { input: { episodeId, name } },
          ),
        prefix: 'director',
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
        ${directorAssignmentMutations}
      }`;

      await client.mutate<
        UpdateEpisodeMutation,
        UpdateEpisodeMutationVariables
      >({
        mutation: GqlMutationDocument,
        variables: { input: { id: episodeId, patch } },
        refetchQueries: [EpisodeDocument],
        awaitRefetchQueries: true,
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
          director,
        },
        loading,
        entityNotFound: data?.episode === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
      stationMessage={
        licenseWarningMessage
          ? { type: 'warning', title: licenseWarningMessage }
          : undefined
      }
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
  const { ImageCover, ImagePreview } = useContext(ExtensionsContext);
  const { values } = useFormikContext<Episode>();

  return useMemo(() => {
    let coverImageId: ID;
    let cover1x1ImageId: ID;
    let cover16x9ImageId: ID;
    let coverImageCount = 0;
    let cover1x1ImageCount = 0;
    let cover16x9ImageCount = 0;
    let cleanCoverImageCount = 0;
    let cleanCover1x1ImageCount = 0;
    let cleanCover16x9ImageCount = 0;
    let listImageCount = 0;
    let list1x1ImageCount = 0;
    let list9x13ImageCount = 0;

    values.episodesImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case EpisodeImageType.EpisodeCover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case EpisodeImageType.EpisodeCover_1X1:
          cover1x1ImageCount++;
          cover1x1ImageId = imageId;
          break;
        case EpisodeImageType.EpisodeCover_16X9:
          cover16x9ImageCount++;
          cover16x9ImageId = imageId;
          break;
        case EpisodeImageType.EpisodeCleanCover:
          cleanCoverImageCount++;
          break;
        case EpisodeImageType.EpisodeCleanCover_1X1:
          cleanCover1x1ImageCount++;
          break;
        case EpisodeImageType.EpisodeCleanCover_16X9:
          cleanCover16x9ImageCount++;
          break;
        case EpisodeImageType.EpisodeList:
          listImageCount++;
          break;
        case EpisodeImageType.EpisodeList_1X1:
          list1x1ImageCount++;
          break;
        case EpisodeImageType.EpisodeList_9X13:
          list9x13ImageCount++;
          break;
        default:
          break;
      }
    });

    return (
      <InfoPanel>
        <Section>
          <ImageCover
            id={cover1x1ImageId ?? cover16x9ImageId ?? coverImageId}
          />
        </Section>
        <Section title="Additional Information">
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
          {values.publishStatus !== PublishStatus.NotPublished ? (
            <Paragraph title="Publishing ID">{values.publishingId}</Paragraph>
          ) : null}
          {values.publishedDate ? (
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
            <Paragraph title="Videos">
              <div className={classes.datalist}>
                <div>Main Video</div>
                <div className={classes.rightAlignment}>
                  {values.mainVideoId ? 1 : 0}/1
                </div>
                <div>Trailers</div>
                <div className={classes.rightAlignment}>
                  {values.episodesTrailers?.totalCount}/many
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
                <div>Cover 16x9</div>
                <div className={classes.rightAlignment}>
                  {cover16x9ImageCount} / 1
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
                <div>Clean Cover 16x9</div>
                <div className={classes.rightAlignment}>
                  {cleanCover16x9ImageCount} / 1
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
                <div>List 9x13</div>
                <div className={classes.rightAlignment}>
                  {list9x13ImageCount} / 1
                </div>
              </div>
            </Paragraph>
          </Paragraph>
        </Section>
      </InfoPanel>
    );
  }, [
    ImageCover,
    ImagePreview,
    values.assetSubtype,
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

const Form: React.FC<{
  genreOptions?: string[];
  ageRatingOptions?: selectOption[];
  contentOwnerOptions?: selectOption[];
}> = ({ genreOptions, ageRatingOptions, contentOwnerOptions }) => {
  const { initialValues } = useFormikContext<EpisodeDetailsFormData>();

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

  const directorSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchEpisodeDirectorQuery,
      SearchEpisodeDirectorQueryVariables
    >({
      query: SearchEpisodeDirectorDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getEpisodesDirectorsValues?.nodes ?? [];
  };

  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field
        name="originalTitle"
        label="Original Title"
        as={SingleLineTextField}
      />
      <Field name="synopsis" label="Synopsis" as={SingleLineTextField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="externalId"
        label="External ID"
        as={SingleLineTextField}
        disabled={!!initialValues.externalId}
      />
      <Field
        type="number"
        name="index"
        label="Index"
        className={classes.episodeIndex}
        as={SingleLineTextField}
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
        label="Released Date"
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
  currentValues: EpisodeDetailsFormData,
  initialValues?: EpisodeDetailsFormData | null,
): Partial<EpisodeDetailsFormData> {
  const {
    index: idx,
    tags,
    cast,
    productionCountries,
    director,
    genres,
    ...rest
  } = getFormDiff(currentValues, initialValues);
  let index: number | undefined;

  if (idx) {
    index = Number(idx);
  }

  return { index, ...rest };
}
