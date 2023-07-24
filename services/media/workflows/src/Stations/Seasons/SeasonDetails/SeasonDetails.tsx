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
  Mutation,
  MutationCreateSeasonsCastArgs,
  MutationCreateSeasonsProductionCountryArgs,
  MutationCreateSeasonsTagArgs,
  MutationCreateSeasonsTvshowGenreArgs,
  MutationDeleteSeasonsCastArgs,
  MutationDeleteSeasonsProductionCountryArgs,
  MutationDeleteSeasonsTagArgs,
  MutationDeleteSeasonsTvshowGenreArgs,
  PublishStatus,
  SearchSeasonCastDocument,
  SearchSeasonCastQuery,
  SearchSeasonCastQueryVariables,
  SearchSeasonProductionCountriesDocument,
  SearchSeasonProductionCountriesQuery,
  SearchSeasonProductionCountriesQueryVariables,
  SearchSeasonTagsDocument,
  SearchSeasonTagsQuery,
  SearchSeasonTagsQueryVariables,
  Season,
  SeasonImageType,
  TvshowGenre,
  UpdateSeasonInput,
  useSeasonQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useSeasonDetailsActions } from './SeasonDetails.actions';
import classes from './SeasonDetails.module.scss';
import { SeasonDetailsFormData } from './SeasonDetails.types';

const seasonDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<SeasonDetailsFormData>
>({
  index: Yup.number()
    .positive('Season Index must be a positive number')
    .integer('Season Index must be an integer')
    .required('Season Index is a required field'),
});

export const SeasonDetails: React.FC = () => {
  const seasonId = Number(
    useParams<{
      seasonId: string;
    }>().seasonId,
  );

  const { loading, data, error } = useSeasonQuery({
    client,
    variables: { id: seasonId },
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
      tags: data?.season?.seasonsTags.nodes.map((node) => node.name),
      genres: data?.season?.seasonsTvshowGenres.nodes.map(
        (node) => node.tvshowGenres?.title ?? '',
      ),
      cast: data?.season?.seasonsCasts.nodes.map((node) => node.name),
      productionCountries: data?.season?.seasonsProductionCountries.nodes.map(
        (node) => node.name,
      ),
    }),
    [data],
  );

  const { actions } = useSeasonDetailsActions(seasonId);

  const onSubmit = useCallback(
    async (
      formData: SeasonDetailsFormData,
      initialData: DetailsProps<SeasonDetailsFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const tagAssignmentMutations = generateArrayMutations({
        current: formData.tags,
        original: initialData.data?.tags,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateSeasonsTagArgs>(
            'createSeasonsTag',
            { input: { seasonsTag: { name, seasonId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteSeasonsTagArgs>(
            'deleteSeasonsTag',
            { input: { seasonId, name } },
          ),
        prefix: 'SeasonsTag',
      });

      const genreAssignmentMutations = generateArrayMutations({
        current: formData.genres,
        original: initialData.data?.genres,
        generateCreateMutation: (name) => {
          const tvshowGenresId = allGenres[name].id;

          if (tvshowGenresId) {
            return generateUpdateGQLFragment<MutationCreateSeasonsTvshowGenreArgs>(
              'createSeasonsTvshowGenre',
              {
                input: {
                  seasonsTvshowGenre: {
                    seasonId,
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
            return generateUpdateGQLFragment<MutationDeleteSeasonsTvshowGenreArgs>(
              'deleteSeasonsTvshowGenre',
              {
                input: { seasonId, tvshowGenresId },
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
          generateUpdateGQLFragment<MutationCreateSeasonsCastArgs>(
            'createSeasonsCast',
            { input: { seasonsCast: { name, seasonId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteSeasonsCastArgs>(
            'deleteSeasonsCast',
            { input: { seasonId, name } },
          ),
        prefix: 'cast',
      });

      const productionCountriesAssignmentMutations = generateArrayMutations({
        current: formData.productionCountries,
        original: initialData.data?.productionCountries,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateSeasonsProductionCountryArgs>(
            'createSeasonsProductionCountry',
            {
              input: { seasonsProductionCountry: { name, seasonId } },
            },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteSeasonsProductionCountryArgs>(
            'deleteSeasonsProductionCountry',
            { input: { seasonId, name } },
          ),
        prefix: 'productionCountry',
      });

      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql`mutation UpdateSeason($input: UpdateSeasonInput!) {
        updateSeason(input: $input) {
          clientMutationId
          season {
            id
            index
          }
        }
        ${tagAssignmentMutations}
        ${genreAssignmentMutations}
        ${castAssignmentMutations}
        ${productionCountriesAssignmentMutations}
      }`;

      await client.mutate<unknown, { input: UpdateSeasonInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: seasonId, patch } },
      });
    },
    [allGenres, seasonId],
  );

  return (
    <Details<SeasonDetailsFormData>
      defaultTitle={`Season ${data?.season?.index}`}
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={seasonDetailSchema}
      initialData={{
        data: {
          ...data?.season,
          tags,
          genres,
          cast,
          productionCountries,
        },
        loading,
        entityNotFound: data?.season === null,
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
  const { values } = useFormikContext<Season>();

  return useMemo(() => {
    let coverImageId: ImageID;
    let coverImageCount = 0;
    let teaserImageCount = 0;

    values.seasonsImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case SeasonImageType.Cover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case SeasonImageType.Teaser:
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
        <Section title="Season Entity">
          <Paragraph title="ID">{values.id}</Paragraph>
          <Paragraph title="Created">
            {formatDateTime(values.createdDate)} by {values.createdUser}
          </Paragraph>
          <Paragraph title="Last Modified">
            {formatDateTime(values.updatedDate)} by {values.updatedUser}
          </Paragraph>
        </Section>
        <Section title="Assignments">
          <Paragraph title="Parent Entity">
            {values?.tvshow ? (
              <InfoPanelParent
                Thumbnail={ImagePreview}
                imageId={values.tvshow?.tvshowsImages?.nodes?.[0]?.imageId}
                path={`/tvshows/${values.tvshow?.id}`}
                label="Open Details"
                title={values.tvshow?.title}
              />
            ) : (
              <div>not assigned</div>
            )}
          </Paragraph>
          <Paragraph title="Assigned items">
            <div className={classes.datalist}>
              <div>Episodes</div>
              <div className={classes.rightAlignment}>
                {values.episodes?.totalCount}/many
              </div>
              <div>Trailers</div>{' '}
              <div className={classes.rightAlignment}>
                {values.seasonsTrailers?.totalCount}/many
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
        <Section title="Additional Information">
          <Paragraph title="Publishing Status">
            {getEnumLabel(values.publishStatus)}
          </Paragraph>
          {values.publishStatus === PublishStatus.Published ? (
            <Paragraph title="Last Published">
              {formatDateTime(values.publishedDate)} by {values.publishedUser}
            </Paragraph>
          ) : null}
        </Section>
      </InfoPanel>
    );
  }, [
    ImageCover,
    ImagePreview,
    values.createdDate,
    values.createdUser,
    values.episodes?.totalCount,
    values.id,
    values.publishStatus,
    values.publishedDate,
    values.publishedUser,
    values.seasonsImages?.nodes,
    values.seasonsTrailers?.totalCount,
    values.tvshow,
    values.updatedDate,
    values.updatedUser,
  ]);
};

const Form: React.FC<{ genreOptions?: string[] }> = ({ genreOptions }) => {
  const tagsResolver = async (value: string): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchSeasonTagsQuery,
      SearchSeasonTagsQueryVariables
    >({
      query: SearchSeasonTagsDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getSeasonsTagsValues?.nodes ?? [];
  };

  const castSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchSeasonCastQuery,
      SearchSeasonCastQueryVariables
    >({
      query: SearchSeasonCastDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getSeasonsCastsValues?.nodes ?? [];
  };

  const productionCountriesResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchSeasonProductionCountriesQuery,
      SearchSeasonProductionCountriesQueryVariables
    >({
      query: SearchSeasonProductionCountriesDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getSeasonsProductionCountriesValues?.nodes ?? [];
  };

  return (
    <>
      <Field
        type="number"
        name="index"
        label="Season Index"
        className={classes.seasonIndex}
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
  currentValues: SeasonDetailsFormData,
  initialValues?: SeasonDetailsFormData | null,
): Partial<SeasonDetailsFormData> {
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
