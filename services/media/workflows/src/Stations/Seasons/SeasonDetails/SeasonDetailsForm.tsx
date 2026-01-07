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
  Mutation,
  MutationCreateSeasonsCastArgs,
  MutationCreateSeasonsDirectorArgs,
  MutationCreateSeasonsProductionCountryArgs,
  MutationCreateSeasonsTagArgs,
  MutationCreateSeasonsTvshowGenreArgs,
  MutationDeleteSeasonsCastArgs,
  MutationDeleteSeasonsDirectorArgs,
  MutationDeleteSeasonsProductionCountryArgs,
  MutationDeleteSeasonsTagArgs,
  MutationDeleteSeasonsTvshowGenreArgs,
  PublishStatus,
  SearchSeasonCastDocument,
  SearchSeasonCastQuery,
  SearchSeasonCastQueryVariables,
  SearchSeasonDirectorDocument,
  SearchSeasonDirectorQuery,
  SearchSeasonDirectorQueryVariables,
  SearchSeasonTagsDocument,
  SearchSeasonTagsQuery,
  SearchSeasonTagsQueryVariables,
  Season,
  SeasonDocument,
  SeasonImageType,
  TvshowGenre,
  UpdateSeasonInput,
  useSeasonQuery,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';
import { getLicenseWarningMessage } from '../../../Util/LicenseDateSchema/LicenseDateSchema';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { useSeasonDetailsActions } from './SeasonDetails.actions';
import classes from './SeasonDetails.module.scss';
import { SeasonDetailsFormData } from './SeasonDetails.types';

interface SeasonDetailsFormProps {
  seasonId: number;
}

const seasonDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<SeasonDetailsFormData>
>({
  index: Yup.number()
    .positive('Season Index must be a positive number')
    .integer('Season Index must be an integer')
    .required('Season Index is a required field'),
  title: Yup.string().required('Title is a required field'),
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

export const SeasonDetailsForm: React.FC<SeasonDetailsFormProps> = ({
  seasonId,
}) => {
  const { loading, data, error } = useSeasonQuery({
    client,
    variables: { id: seasonId },
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
      tags: data?.season?.seasonsTags.nodes.map((node) => node.name),
      genres: data?.season?.seasonsTvshowGenres.nodes.map(
        (node) => node.tvshowGenres?.title ?? '',
      ),
      cast: data?.season?.seasonsCasts.nodes.map((node) => node.name),
      director: data?.season?.seasonsDirectors.nodes.map((node) => node.name),
      productionCountries: data?.season?.seasonsProductionCountries.nodes.map(
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

  const { actions } = useSeasonDetailsActions(seasonId);

  const licenseWarningMessage = useMemo(
    () => getLicenseWarningMessage(data?.season?.seasonsLicenses?.nodes || []),
    [data?.season?.seasonsLicenses?.nodes],
  );

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

      const directorAssignmentMutations = generateArrayMutations({
        current: formData.director,
        original: initialData.data?.director,
        generateCreateMutation: (name) =>
          generateUpdateGQLFragment<MutationCreateSeasonsDirectorArgs>(
            'createSeasonsDirector',
            { input: { seasonsDirector: { name, seasonId } } },
          ),
        generateDeleteMutation: (name) =>
          generateUpdateGQLFragment<MutationDeleteSeasonsDirectorArgs>(
            'deleteSeasonsDirector',
            { input: { seasonId, name } },
          ),
        prefix: 'director',
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
        ${directorAssignmentMutations}
      }`;

      await client.mutate<unknown, { input: UpdateSeasonInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: seasonId, patch } },
        refetchQueries: [SeasonDocument],
        awaitRefetchQueries: true,
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
          director,
        },
        loading,
        entityNotFound: data?.season === null,
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
  const { values } = useFormikContext<Season>();

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

    values.seasonsImages?.nodes.forEach(({ imageId, imageType }) => {
      switch (imageType) {
        case SeasonImageType.SeasonCover:
          coverImageCount++;
          coverImageId = imageId;
          break;
        case SeasonImageType.SeasonCover_1X1:
          cover1x1ImageCount++;
          cover1x1ImageId = imageId;
          break;
        case SeasonImageType.SeasonCover_16X9:
          cover16x9ImageCount++;
          cover16x9ImageId = imageId;
          break;
        case SeasonImageType.SeasonCleanCover:
          cleanCoverImageCount++;
          break;
        case SeasonImageType.SeasonCleanCover_1X1:
          cleanCover1x1ImageCount++;
          break;
        case SeasonImageType.SeasonCleanCover_16X9:
          cleanCover16x9ImageCount++;
          break;
        case SeasonImageType.SeasonList:
          listImageCount++;
          break;
        case SeasonImageType.SeasonList_1X1:
          list1x1ImageCount++;
          break;
        case SeasonImageType.SeasonList_9X13:
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
            <Paragraph>
              <div className={classes.datalist}>
                <div>Episodes</div>
                <div className={classes.rightAlignment}>
                  {values.episodes?.totalCount}/many
                </div>
                <div>Trailers</div>{' '}
                <div className={classes.rightAlignment}>
                  {values.seasonsTrailers?.totalCount}/many
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
    values.publishingId,
  ]);
};

const Form: React.FC<{
  genreOptions?: string[];
  ageRatingOptions?: selectOption[];
  contentOwnerOptions?: selectOption[];
}> = ({ genreOptions, ageRatingOptions, contentOwnerOptions }) => {
  const { initialValues } = useFormikContext<SeasonDetailsFormData>();

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

  const directorSuggestionResolver = async (
    value: string,
  ): Promise<(string | null)[]> => {
    const { data } = await client.query<
      SearchSeasonDirectorQuery,
      SearchSeasonDirectorQueryVariables
    >({
      query: SearchSeasonDirectorDocument,
      variables: { searchKey: value, limit: 10 },
    });
    return data.getSeasonsDirectorsValues?.nodes ?? [];
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

  return (
    <>
      <Field
        type="number"
        name="index"
        label="Season Index"
        className={classes.seasonIndex}
        as={SingleLineTextField}
      />
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
  currentValues: SeasonDetailsFormData,
  initialValues?: SeasonDetailsFormData | null,
): Partial<SeasonDetailsFormData> {
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
