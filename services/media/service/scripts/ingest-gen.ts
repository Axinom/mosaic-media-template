/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import {
  assertError,
  Dict,
  getValidatedConfig,
  isNullOrWhitespace,
  MosaicError,
  pick,
  randomArray,
  UnreachableCaseError,
} from '@axinom/mosaic-service-common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { createCanvas } from 'canvas';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { IngestDocument, IngestItem, LicenseData } from 'media-messages';
import urljoin from 'url-join';
import yargs from 'yargs';
import {
  IngestItemTypeEnum,
  IsoAlphaTwoCountryCodesEnum,
} from 'zapatos/custom';
import { all, select } from 'zapatos/db';
import { getIdToken, initializePgPool } from '../../../../scripts/helpers';
import {
  Config,
  getConfigDefinitions,
  IsoAlphaTwoCountryCodes,
} from '../src/common';

/**
 * Represent CLI parameters passed with the command execution
 */
interface CliArgs {
  entitiesCount: number;
  imagesCount: number;
  videosCount: number;
  ingestName: string;
}

/**
 * Represents CLI parameters that are parsed from original CLI parameters and are used by further processing.
 */
interface ParsedCliArgs {
  movies: number;
  tvshows: number;
  seasons: number;
  episodes: number;
  movieCovers: number;
  movieTeasers: number;
  tvshowCovers: number;
  tvshowTeasers: number;
  seasonCovers: number;
  seasonTeasers: number;
  episodeCovers: number;
  episodeTeasers: number;
  movieMainVideos: number;
  movieTrailers: number;
  tvshowTrailers: number;
  seasonTrailers: number;
  episodeMainVideos: number;
  episodeTrailers: number;
  entitiesCount: number;
  videosCount: number;
  imagesCount: number;
  ingestName: string;
}

/**
 * Returns a readable timestamp in current locale time, e.g. `[2021-05-13 13:02:12.685]`
 */
const getTimestamp = (): string => {
  const offset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(Date.now() - offset)
    .toISOString()
    .slice(0, -1)
    .replace('T', ' ');
  return `[${localISOTime}]`;
};

/**
 * Generates a valid license object with up to 4 country cods
 */
const generateSampleLicense = (): LicenseData => {
  return {
    start: faker.date.recent().toISOString(),
    end: faker.date.future().toISOString(),
    countries: randomArray(0, 4, () => {
      return faker.helpers.arrayElement<IsoAlphaTwoCountryCodesEnum>(
        IsoAlphaTwoCountryCodes,
      );
    }),
  };
};

/**
 * Generates entity-specific json of custom properties based on type value.
 */
const getNonCommonProperties = (params: {
  type: IngestItemTypeEnum;
  processingProfiles?: string[];
  mainVideo?: string;
  parentInfo?: { externalId: string; childCount: number }[];
}): Dict<unknown> => {
  const title = faker.random.words().trim();
  const original_title = faker.random.words().trim();
  const main_video = params.mainVideo
    ? {
        source: params.mainVideo,
        profile: faker.helpers.arrayElement(params.processingProfiles ?? []),
      }
    : undefined;
  const parentInfo = faker.helpers.arrayElement(params.parentInfo ?? []);
  switch (params.type) {
    case 'MOVIE':
      return {
        title,
        original_title,
        main_video,
      };
    case 'EPISODE':
      return {
        title,
        original_title,
        main_video,
        index: parentInfo.childCount++,
        parent_external_id: parentInfo.externalId,
      };
    case 'SEASON':
      return {
        index: parentInfo.childCount++,
        parent_external_id: parentInfo.externalId,
      };
    case 'TVSHOW':
      return {
        title,
        original_title,
      };
    default:
      throw new UnreachableCaseError(params.type);
  }
};

/**
 *
 * @param type - entity type
 * @param nonCommonProperties - properties that are not common to entities of all types
 * @param processingProfiles - array of processing profiles to be used for trailers
 * @param trailers - array of trailer paths
 * @param genres - array of genere names
 * @param coverPath - relative path to cover image
 * @param teaserPath - relative path to teaser image
 * @returns ingest item object
 */
const generateIngestItem = (
  ingestName: string,
  type: IngestItemTypeEnum,
  nonCommonProperties: Dict<unknown>,
  processingProfiles: string[],
  trailers: string[],
  genres: string[],
  coverPath?: string,
  teaserPath?: string,
): IngestItem => {
  const obj: IngestItem = {
    type,
    external_id: `${ingestName}-${faker.datatype.uuid()}`,
    data: {
      ...nonCommonProperties,
      synopsis: faker.lorem.paragraph(1),
      description: faker.lorem.paragraph(5),
      studio: faker.company.name(),
      released: faker.date.past().toISOString().split('T')[0],
      tags: randomArray(0, 4, () => {
        return faker.random.word();
      }),
      cast: randomArray(0, 4, () => {
        return faker.helpers.fake('{{name.lastName}} {{name.firstName}}');
      }),
      production_countries: randomArray(0, 4, () => {
        return faker.address.country();
      }),
      genres: randomArray(1, 4, () => {
        return faker.helpers.arrayElement(genres);
      }),
      licenses: randomArray(1, 4, () => {
        return generateSampleLicense();
      }),
      trailers:
        trailers.length > 0
          ? trailers.map((path) => ({
              source: path,
              profile: faker.helpers.arrayElement(processingProfiles),
            }))
          : undefined,
      images: coverPath || teaserPath ? [] : undefined,
    },
  };
  if (coverPath) {
    (obj.data as { images: unknown[] }).images.push({
      path: coverPath,
      type: 'COVER',
    });
  }
  if (teaserPath) {
    (obj.data as { images: unknown[] }).images.push({
      path: teaserPath,
      type: 'TEASER',
    });
  }
  return obj;
};

/**
 * Uses passed parameters to generate an array of Movie IngestItem objects
 */
const generateMoviesIngestMetadata = (
  args: ParsedCliArgs,
  videos: string[],
  images: string[],
  processingProfiles: string[],
  genres: string[],
): IngestItem[] => {
  const items: IngestItem[] = [];
  for (let i = 1; i <= args.movies; i++) {
    const mainVideo = args.movieMainVideos >= i ? videos.shift() : undefined;
    const coverPath = args.movieCovers >= i ? images.shift() : undefined;
    const teaserPath = args.movieTeasers >= i ? images.shift() : undefined;
    const trailers =
      i === args.movies && args.movieTrailers > i
        ? videos.splice(0, args.movieTrailers - i + 1)
        : args.movieTrailers >= i
        ? [videos.shift() as string]
        : [];
    const nonCommonProperties = getNonCommonProperties({
      type: 'MOVIE',
      processingProfiles,
      mainVideo,
    });
    items.push(
      generateIngestItem(
        args.ingestName,
        'MOVIE',
        nonCommonProperties,
        processingProfiles,
        trailers,
        genres,
        coverPath,
        teaserPath,
      ),
    );
  }
  return items;
};

/**
 * Uses passed parameters to generate an array of TV Show IngestItem objects
 */
const generateTvShowsIngestMetadata = (
  args: ParsedCliArgs,
  videos: string[],
  images: string[],
  processingProfiles: string[],
  genres: string[],
): IngestItem[] => {
  const items: IngestItem[] = [];
  for (let i = 1; i <= args.tvshows; i++) {
    const coverPath = args.tvshowCovers >= i ? images.shift() : undefined;
    const teaserPath = args.tvshowTeasers >= i ? images.shift() : undefined;
    const trailers =
      i === args.tvshows && args.tvshowTrailers > i
        ? videos.splice(0, args.tvshowTrailers - i + 1)
        : args.tvshowTrailers >= i
        ? [videos.shift() as string]
        : [];
    const nonCommonProperties = getNonCommonProperties({
      type: 'TVSHOW',
    });
    items.push(
      generateIngestItem(
        args.ingestName,
        'TVSHOW',
        nonCommonProperties,
        processingProfiles,
        trailers,
        genres,
        coverPath,
        teaserPath,
      ),
    );
  }
  return items;
};

/**
 * Uses passed parameters to generate an array of Season IngestItem objects
 */
const generateSeasonsIngestMetadata = (
  args: ParsedCliArgs,
  tvshows: IngestItem[],
  videos: string[],
  images: string[],
  processingProfiles: string[],
  genres: string[],
): IngestItem[] => {
  const items: IngestItem[] = [];
  const parentInfo = tvshows.map((i) => ({
    externalId: i.external_id,
    childCount: 1,
  }));
  for (let i = 1; i <= args.seasons; i++) {
    const coverPath = args.seasonCovers >= i ? images.shift() : undefined;
    const teaserPath = args.seasonTeasers >= i ? images.shift() : undefined;
    const trailers =
      i === args.seasons && args.seasonTrailers > i
        ? videos.splice(0, args.seasonTrailers - i + 1)
        : args.seasonTrailers >= i
        ? [videos.shift() as string]
        : [];
    const nonCommonProperties = getNonCommonProperties({
      type: 'SEASON',
      parentInfo,
    });
    items.push(
      generateIngestItem(
        args.ingestName,
        'SEASON',
        nonCommonProperties,
        processingProfiles,
        trailers,
        genres,
        coverPath,
        teaserPath,
      ),
    );
  }
  return items;
};

/**
 * Uses passed parameters to generate an array of Episode IngestItem objects
 */
const generateEpisodesIngestMetadata = (
  args: ParsedCliArgs,
  seasons: IngestItem[],
  videos: string[],
  images: string[],
  processingProfiles: string[],
  genres: string[],
): IngestItem[] => {
  const items: IngestItem[] = [];
  const parentInfo = seasons.map((i) => ({
    externalId: i.external_id,
    childCount: 1,
  }));
  for (let i = 1; i <= args.episodes; i++) {
    const mainVideo = args.episodeMainVideos >= i ? videos.shift() : undefined;
    const coverPath = args.episodeCovers >= i ? images.shift() : undefined;
    const teaserPath = args.episodeTeasers >= i ? images.shift() : undefined;
    const trailers =
      i === args.episodes && args.episodeTrailers > i
        ? videos.splice(0, args.episodeTrailers - i + 1)
        : args.episodeTrailers >= i
        ? [videos.shift() as string]
        : [];
    const nonCommonProperties = getNonCommonProperties({
      type: 'EPISODE',
      processingProfiles,
      mainVideo,
      parentInfo,
    });
    items.push(
      generateIngestItem(
        args.ingestName,
        'EPISODE',
        nonCommonProperties,
        processingProfiles,
        trailers,
        genres,
        coverPath,
        teaserPath,
      ),
    );
  }
  return items;
};

/**
 * Generates a JSON object that will be saved as ingest document json file.
 */
const generateIngestFileContents = (
  args: ParsedCliArgs,
  images: string[],
  videos: string[],
  processingProfiles: string[],
  movieGenres: string[],
  tvGenres: string[],
): IngestDocument => {
  const movies = generateMoviesIngestMetadata(
    args,
    videos,
    images,
    processingProfiles,
    movieGenres,
  );
  const tvshows = generateTvShowsIngestMetadata(
    args,
    videos,
    images,
    processingProfiles,
    tvGenres,
  );
  const seasons = generateSeasonsIngestMetadata(
    args,
    tvshows,
    videos,
    images,
    processingProfiles,
    tvGenres,
  );
  const episodes = generateEpisodesIngestMetadata(
    args,
    seasons,
    videos,
    images,
    processingProfiles,
    tvGenres,
  );
  return {
    name: args.ingestName,
    document_created: new Date().toISOString(),
    items: [...movies, ...tvshows, ...seasons, ...episodes],
  };
};

const blobRootFolderName = '_ingest-gen';

/**
 * Creates a copy of `resources/sample-video.mkv` and uploads it to blob storage. If video already exists - generation and upload operations are skipped
 * @param containerClient - container client to upload video data
 * @param index - video number, used for video folder name and filename, e.g. 00000001/00000001.mkv
 * @param ingestScopeName - folder name where video folder would be put
 * @returns resulting video folder path
 */
const makeVideoCopy = async (
  containerClient: ContainerClient,
  index: number,
  ingestScopeName: string,
  sampleVideoUrl: string,
): Promise<string> => {
  const indexName = index.toString().padStart(8, '0');
  const videoPath = `${blobRootFolderName}/${ingestScopeName}/${indexName}`;
  const videoFilePath = `${videoPath}/${indexName}.mkv`;
  const blob = containerClient.getBlockBlobClient(videoFilePath);
  try {
    await blob.beginCopyFromURL(sampleVideoUrl, {
      conditions: { ifNoneMatch: '*' },
    });
    console.log(getTimestamp(), `Copying video: ${videoPath}`);
  } catch (err) {
    assertError(err);
    const error = err as Error & { code: string };
    if (error.code === 'BlobAlreadyExists') {
      console.log(getTimestamp(), `Video already exists: ${videoPath}`);
    } else {
      console.log(
        getTimestamp(),
        `Failed to copy video: ${videoPath}. ${error.message}`,
      );
    }
  }
  return videoPath;
};

/**
 * Creates copies of `resources/sample-video.mkv` file, uploads them to image blob storage to `_ingest-gen/${ingestName}/${paddedIndexValue}` folder and returns an array of strings.
 * Each string in an array is a relative path to video folder, ready to be used in ingest file.
 */
const generateVideoFilesAndMetadata = async (
  args: CliArgs,
  connectionString: string,
  containerName: string,
): Promise<string[]> => {
  const containerClient =
    BlobServiceClient.fromConnectionString(connectionString).getContainerClient(
      containerName,
    );
  const videoPaths: string[] = [];
  const blob = containerClient.getBlockBlobClient(
    `${blobRootFolderName}/sample-video.mkv`,
  );
  const buffer = readFileSync('./scripts/resources/sample-video.mkv');
  await blob.uploadData(buffer);
  for (let index = 1; index <= args.videosCount; index++) {
    const path = await makeVideoCopy(
      containerClient,
      index,
      args.ingestName,
      blob.url,
    );
    videoPaths.push(path);
  }
  return videoPaths;
};

/**
 * Generates an image of relatively random size, random background color and static text of random color in a random position.
 */
const getRandomImageBuffer = (
  index: number,
  ingestScopeName: string,
): Buffer => {
  const randomHex = (): string =>
    `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padEnd(6, '0')}`;
  const possibleImageDimensions = [320, 480, 640, 600, 800, 1024, 1280];
  const width = faker.helpers.arrayElement(possibleImageDimensions);
  const height = faker.helpers.arrayElement(possibleImageDimensions);
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.fillStyle = randomHex();
  context.fillRect(0, 0, width, height);
  context.font = 'bold 16pt Times New Roman';
  context.fillStyle = randomHex();
  const x = 10 + faker.datatype.number(width - 300);
  const y = 20 + faker.datatype.number(height - 30);
  context.fillText(`${ingestScopeName} ${index}`, x, y);
  return canvas.toBuffer('image/png');
};

/**
 * Generates a random image and uploads it to blob storage. If image already exists - generation and upload operations are skipped
 * @param containerClient - container client to upload image data
 * @param index - image number, used for image filename, e.g. 00000001.png
 * @param ingestScopeName - folder name where image would be put
 * @returns resulting image file path
 */
const generateAndUploadImage = async (
  containerClient: ContainerClient,
  index: number,
  ingestScopeName: string,
): Promise<string> => {
  const imagePath = `${blobRootFolderName}/${ingestScopeName}/${index
    .toString()
    .padStart(8, '0')}.png`;
  const blob = containerClient.getBlockBlobClient(imagePath);
  const buffer = getRandomImageBuffer(index, ingestScopeName);
  try {
    await blob.uploadData(buffer, { conditions: { ifNoneMatch: '*' } });
    console.log(getTimestamp(), `Image uploaded: ${imagePath}`);
  } catch (err) {
    assertError(err);
    const error = err as Error & { code: string };
    if (error.code === 'BlobAlreadyExists') {
      console.log(getTimestamp(), `Image already exists: ${imagePath}`);
    } else {
      console.log(
        getTimestamp(),
        `Failed to upload image: ${imagePath}. ${error.message}`,
      );
    }
  }
  return imagePath;
};

/**
 * Creates random image files, uploads them to image blob storage to `_ingest-gen/${ingestName}` folder and returns an array of strings.
 * Each string in an array is a relative path to an image file, ready to be used in ingest file.
 */
const generateImageFilesAndMetadata = async (
  args: ParsedCliArgs,
  connectionString: string,
  containerName: string,
): Promise<string[]> => {
  const containerClient =
    BlobServiceClient.fromConnectionString(connectionString).getContainerClient(
      containerName,
    );
  const imagePaths: string[] = [];
  for (let index = 1; index <= args.imagesCount; index++) {
    const path = await generateAndUploadImage(
      containerClient,
      index,
      args.ingestName,
    );
    imagePaths.push(path);
  }
  return imagePaths;
};

/**
 * Saves generated ingest file into the root folder of media service project, `ingest-gen` sub-folder
 */
const saveIngestFile = async (
  args: ParsedCliArgs,
  contents: unknown,
): Promise<unknown> => {
  const folderName = 'ingest-gen';
  if (!existsSync(folderName)) {
    mkdirSync(folderName);
  }

  const filePath = `${folderName}/${args.ingestName}.json`;
  writeFileSync(filePath, JSON.stringify(contents, null, 2));
  return filePath;
};

/**
 * Retrieves movie and tvshow genres from the database.
 * If genres do not exist - error is thrown.
 * Media service must be launched at least once to populate default genres on startup.
 */
const getGenres = async (
  connectionString: string,
): Promise<{ movieGenres: string[]; tvGenres: string[] }> => {
  const ownerPool = await initializePgPool(connectionString);
  const movieGenres = await select('movie_genres', all, {
    columns: ['title'],
  }).run(ownerPool);
  if (movieGenres.length === 0) {
    throw new Error(
      'Movie Genres do not exist. Please launch media service to populate default genres.',
    );
  }
  const tvGenres = await select('tvshow_genres', all, {
    columns: ['title'],
  }).run(ownerPool);
  if (tvGenres.length === 0) {
    throw new Error(
      'TV Show Genres do not exist. Please launch media service to populate default genres.',
    );
  }
  return {
    movieGenres: movieGenres.map((g) => g.title),
    tvGenres: tvGenres.map((g) => g.title),
  };
};

/**
 * Retrieves development jwt from ID service.
 * Makes a request with said token to configured encoding service URL to retrieve existing processing profile titles.
 */
const getProcessingProfiles = async (
  devServiceAccountClientId: string | undefined,
  devServiceAccountClientSecret: string | undefined,
  idServiceAuthBaseUrl: string | undefined,
  encodingBaseUrl: string,
): Promise<string[]> => {
  try {
    const idJwt = await getIdToken(
      './scripts/resources/encoding-settings-view.json',
      devServiceAccountClientId,
      devServiceAccountClientSecret,
      idServiceAuthBaseUrl,
    );
    const result = await axios.post(
      urljoin(encodingBaseUrl, 'graphql'),
      {
        query: print(gql`
          query GetProcessingProfileTitles {
            encodingProcessingProfiles {
              nodes {
                title
              }
            }
          }
        `),
      },
      { headers: { Authorization: `Bearer ${idJwt}` } },
    );

    const profiles: string[] | undefined =
      result.data.data?.encodingProcessingProfiles?.nodes?.map(
        (n: { title: string }) => n.title,
      );
    if (!profiles) {
      throw new Error(
        'Unable to retrieve encoding processing profiles! It is possible that Encoding Service API has changed.',
      );
    }
    if (profiles.length === 0) {
      throw new Error(
        'Encoding service has no processing profiles! Please make sure that at least one is created.',
      );
    }

    return profiles;
  } catch (error) {
    assertError(error);
    throw new MosaicError({
      message: `An error occurred trying to retrieve encoding processing profiles`,
      code: 'INGEST_GEN_PROFILES_ERROR',
      error,
    });
  }
};

/**
 * Parses input arguments and generates pseudo-random numbers for each entity type (number of specific entities, videos by entity and video type, images by entity and image type)
 */
const parseArgs = (args: CliArgs): ParsedCliArgs => {
  // Entities count calculation
  const movies = faker.datatype.number({ min: 1, max: args.entitiesCount - 3 }); // At least one movie must be present and 3 elements are reserved for tv entities
  const episodes = faker.datatype.number({
    min: 1,
    max: args.entitiesCount - movies - 2,
  }); // At least one episode must be present and 2 elements are reserved for seasons and tvshows
  const seasons = faker.datatype.number({
    min: 1,
    max: args.entitiesCount - movies - episodes - 1,
  }); // At least one season must be present and 1 element is reserved for tvshows
  const tvshows = args.entitiesCount - movies - episodes - seasons;

  // Videos count calculation
  const mainVideos = Math.min(args.videosCount, movies + episodes);
  const movieMainVideos = Math.min(movies, mainVideos);
  const episodeMainVideos =
    episodes === 0 ? 0 : Math.min(episodes, mainVideos - movieMainVideos);

  const trailers = Math.max(
    0,
    args.videosCount - movieMainVideos - episodeMainVideos,
  );
  const episodeTrailers = episodes === 0 ? 0 : faker.datatype.number(trailers);
  const seasonTrailers =
    seasons === 0 ? 0 : faker.datatype.number(trailers - episodeTrailers);
  const tvshowTrailers =
    tvshows === 0
      ? 0
      : faker.datatype.number(trailers - episodeTrailers - seasonTrailers);
  const movieTrailers =
    trailers - episodeTrailers - seasonTrailers - tvshowTrailers;

  // Images count calculation
  const covers = Math.min(args.entitiesCount, args.imagesCount);
  const movieCovers = Math.min(movies, covers);
  const episodeCovers =
    episodes === 0 ? 0 : Math.min(episodes, covers - movieCovers);
  const tvshowCovers =
    tvshows === 0 ? 0 : Math.min(tvshows, covers - movieCovers - episodeCovers);
  const seasonCovers =
    seasons === 0
      ? 0
      : Math.min(seasons, covers - movieCovers - episodeCovers - tvshowCovers);

  const teasers = Math.min(args.entitiesCount, args.imagesCount - covers);
  const movieTeasers = Math.min(movies, teasers);
  const episodeTeasers = Math.min(episodes, teasers - movieTeasers);
  const tvshowTeasers = Math.min(
    tvshows,
    teasers - movieTeasers - episodeTeasers,
  );
  const seasonTeasers = Math.min(
    seasons,
    teasers - movieTeasers - episodeTeasers - tvshowTeasers,
  );
  return {
    movies,
    episodes,
    seasons,
    tvshows,
    movieMainVideos,
    episodeMainVideos,
    movieTrailers,
    episodeTrailers,
    seasonTrailers,
    tvshowTrailers,
    movieCovers,
    episodeCovers,
    seasonCovers,
    tvshowCovers,
    movieTeasers,
    episodeTeasers,
    seasonTeasers,
    tvshowTeasers,
    entitiesCount: movies + episodes + seasons + tvshows,
    videosCount:
      movieMainVideos +
      episodeMainVideos +
      movieTrailers +
      tvshowTrailers +
      seasonTrailers +
      episodeTrailers,
    imagesCount:
      movieCovers +
      movieTeasers +
      tvshowCovers +
      tvshowTeasers +
      seasonCovers +
      seasonTeasers +
      episodeCovers +
      episodeTeasers,
    ingestName: args.ingestName,
  };
};

/**
 * Checks that optional values are actually set (since they are only optional for service launch, but required for this script).
 * If blob storage config is missing - args videos or images count is set to 0;
 */
const configAndArgsAreValid = (
  args: CliArgs,
  config: Partial<Config>,
): boolean => {
  if (args.entitiesCount < 4) {
    console.log(
      getTimestamp(),
      `Unable to generate ingest file with ${args.entitiesCount} entities! At least one entity of each type must be created!`,
    );
    return false;
  }

  if (
    isNullOrWhitespace(config.devImageBlobStorageConnectionString) ||
    isNullOrWhitespace(config.devImageBlobStorageContainer)
  ) {
    console.log(
      getTimestamp(),
      `'DEV_IMAGE_BLOB_STORAGE_CONNECTION_STRING' and 'DEV_IMAGE_BLOB_STORAGE_CONTAINER' .env variables must be filled. Images count set to 0.`,
    );
    args.imagesCount = 0;
  }

  if (
    isNullOrWhitespace(config.devVideoBlobStorageConnectionString) ||
    isNullOrWhitespace(config.devVideoBlobStorageContainer)
  ) {
    console.log(
      getTimestamp(),
      `'DEV_VIDEO_BLOB_STORAGE_CONNECTION_STRING' and 'DEV_VIDEO_BLOB_STORAGE_CONTAINER' .env variables must be filled. Videos count set to 0.`,
    );
    args.videosCount = 0;
  }

  return true;
};

async function main(): Promise<void> {
  console.log(getTimestamp(), `Starting ingest file generation!`);
  const args = yargs(process.argv.slice(2)).options({
    entitiesCount: { type: 'number', default: 50, alias: 'e' },
    videosCount: { type: 'number', default: 100, alias: 'v' },
    imagesCount: { type: 'number', default: 100, alias: 'i' },
    ingestName: { type: 'string', default: 'default', alias: 'n' },
  }).argv;

  const config = getValidatedConfig(
    pick(
      getConfigDefinitions(),
      'devImageBlobStorageConnectionString',
      'devImageBlobStorageContainer',
      'devVideoBlobStorageConnectionString',
      'devVideoBlobStorageContainer',
      'encodingServiceBaseUrl',
      'devServiceAccountClientId',
      'devServiceAccountClientSecret',
      'idServiceAuthBaseUrl',
      'dbName',
      'dbOwner',
      'dbOwnerPassword',
      'dbOwnerConnectionString',
      'pgUserSuffix',
      'pgHost',
      'pgPort',
    ),
  );

  if (!configAndArgsAreValid(args, config)) {
    return;
  }

  const parsedArgs = parseArgs(args);

  console.log(getTimestamp(), `Getting encoding processing profile titles.`);
  const processingProfiles: string[] =
    parsedArgs.videosCount > 0
      ? await getProcessingProfiles(
          config.devServiceAccountClientId,
          config.devServiceAccountClientSecret,
          config.idServiceAuthBaseUrl,
          config.encodingServiceBaseUrl,
        )
      : [];

  console.log(getTimestamp(), `Getting available genres from database.`);
  const { movieGenres, tvGenres } = await getGenres(
    config.dbOwnerConnectionString,
  );

  let images: string[] = [];
  if (parsedArgs.imagesCount > 0) {
    console.log(getTimestamp(), `Generating image files and metadata.`);
    images = await generateImageFilesAndMetadata(
      parsedArgs,
      config.devImageBlobStorageConnectionString!,
      config.devImageBlobStorageContainer!,
    );
  }

  let videos: string[] = [];
  if (parsedArgs.videosCount > 0) {
    console.log(getTimestamp(), `Generating video files and metadata.`);
    videos = await generateVideoFilesAndMetadata(
      args,
      config.devVideoBlobStorageConnectionString!,
      config.devVideoBlobStorageContainer!,
    );
  }

  console.log(getTimestamp(), `Generating ingest file contents.`);
  const ingestFileContents = generateIngestFileContents(
    parsedArgs,
    images,
    videos,
    processingProfiles,
    movieGenres,
    tvGenres,
  );

  console.log(getTimestamp(), `Saving ingest file contents.`);
  const fileName = await saveIngestFile(parsedArgs, ingestFileContents);

  console.log(
    getTimestamp(),
    `Ingest file generation success! File location: ${fileName}\n`,
    'Resulting file stats:\n',
    `----------------------------------------\n`,
    `Total entities: ${parsedArgs.entitiesCount}\n`,
    `Total videos: ${parsedArgs.videosCount}\n`,
    `Total images: ${parsedArgs.imagesCount}\n`,
    `Total movies: ${parsedArgs.movies}\n`,
    `Total episodes: ${parsedArgs.episodes}\n`,
    `Total seasons: ${parsedArgs.seasons}\n`,
    `Total tvshows: ${parsedArgs.tvshows}\n`,
    `Total movie main videos: ${parsedArgs.movieMainVideos}\n`,
    `Total movie trailers: ${parsedArgs.movieTrailers}\n`,
    `Total movie covers: ${parsedArgs.movieCovers}\n`,
    `Total movie teasers: ${parsedArgs.movieTeasers}\n`,
    `Total episode main videos: ${parsedArgs.episodeMainVideos}\n`,
    `Total episode trailers: ${parsedArgs.episodeTrailers}\n`,
    `Total episode covers: ${parsedArgs.episodeCovers}\n`,
    `Total episode teasers: ${parsedArgs.episodeTeasers}\n`,
    `Total season trailers: ${parsedArgs.seasonTrailers}\n`,
    `Total season covers: ${parsedArgs.seasonCovers}\n`,
    `Total season teasers: ${parsedArgs.seasonTeasers}\n`,
    `Total tv show trailers: ${parsedArgs.tvshowTrailers}\n`,
    `Total tv show covers: ${parsedArgs.tvshowCovers}\n`,
    `Total tv show teasers: ${parsedArgs.tvshowTeasers}\n`,
    `----------------------------------------`,
  );
}

main().catch((error) => {
  console.log(getTimestamp(), error);
  process.exit(-1);
});
