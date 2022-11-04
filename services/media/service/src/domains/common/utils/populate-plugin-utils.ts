/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomArray } from '@axinom/mosaic-service-common';
import { faker } from '@faker-js/faker';
import { IsoAlphaTwoCountryCodesEnum } from 'zapatos/custom';
import { insert, Queryable } from 'zapatos/db';
import { movie_genres, tvshow_genres } from 'zapatos/schema';
import { IsoAlphaTwoCountryCodes } from '../../../common';

export const splitCount = (totalCount: number, batchSize = 2000): number[] => {
  const count = Math.floor(totalCount / batchSize);
  const array = [];
  for (let i = 1; i <= count; i++) {
    array.push(batchSize);
  }
  const leftover = totalCount % batchSize;
  if (leftover > 0) {
    array.push(leftover);
  }
  return array;
};

export const insertTrailers = async (
  ctx: Queryable,
  entityId: number,
  entityName: string,
): Promise<void> => {
  const trailers = randomArray(0, 4, () => {
    return faker.datatype.uuid();
  }).map((trailerId) => ({
    [`${entityName}_id`]: entityId,
    video_id: trailerId,
  }));

  if (trailers.length === 0) {
    return;
  }

  const tableName: any = `${entityName}s_trailers`;
  await insert(tableName, trailers).run(ctx);
};

export const insertTags = async (
  ctx: Queryable,
  entityId: number,
  entityName: string,
): Promise<void> => {
  const tags = randomArray(0, 4, () => {
    return faker.random.word();
  }).map((tag) => ({ [`${entityName}_id`]: entityId, name: tag }));

  if (tags.length === 0) {
    return;
  }

  const tableName: any = `${entityName}s_tags`;
  await insert(tableName, tags).run(ctx);
};

export const insertProductionCountries = async (
  ctx: Queryable,
  entityId: number,
  entityName: string,
): Promise<void> => {
  const countries = randomArray(0, 4, () => {
    return faker.address.country();
  }).map((country) => ({ [`${entityName}_id`]: entityId, name: country }));

  if (countries.length === 0) {
    return;
  }

  const tableName: any = `${entityName}s_production_countries`;
  await insert(tableName, countries).run(ctx);
};

export const insertImages = async (
  ctx: Queryable,
  entityId: number,
  entityName: string,
): Promise<void> => {
  const images = randomArray(0, 2, () => {
    return faker.helpers.arrayElement(
      entityName === 'collection' ? ['COVER'] : ['COVER', 'TEASER'],
    );
  }).map((type) => ({
    [`${entityName}_id`]: entityId,
    image_type: type,
    image_id: faker.datatype.uuid(),
  }));

  if (images.length === 0) {
    return;
  }

  const tableName: any = `${entityName}s_images`;
  await insert(tableName, images).run(ctx);
};

export const insertCasts = async (
  ctx: Queryable,
  entityId: number,
  entityName: string,
): Promise<void> => {
  const actors = randomArray(0, 4, () => {
    return faker.helpers.fake('{{name.lastName}} {{name.firstName}}');
  }).map((actor) => ({ [`${entityName}_id`]: entityId, name: actor }));

  if (actors.length === 0) {
    return;
  }

  const tableName: any = `${entityName}s_casts`;
  await insert(tableName, actors).run(ctx);
};

export const generateSampleLicense = (
  entityId: number,
  entityName: string,
): any => {
  return {
    [`${entityName}_id`]: entityId,
    license_start: faker.date.recent(),
    license_end: faker.date.future(),
  };
};

export const generateSampleLicenseCountries = (
  licenseId: number,
  entityName: string,
): any[] => {
  const uniqueCountries = randomArray(0, 5, () => {
    return faker.helpers.arrayElement<IsoAlphaTwoCountryCodesEnum>(
      IsoAlphaTwoCountryCodes,
    );
  });

  const countryEntries = [];
  for (const country of uniqueCountries) {
    countryEntries.push({
      [`${entityName}s_license_id`]: licenseId,
      code: country,
    });
  }
  return countryEntries;
};

export const insertLicenses = async (
  ctx: Queryable,
  entityId: number,
  entityName: string,
): Promise<void> => {
  const licensesCount = faker.datatype.number({ min: 0, max: 10 });
  const elements = [];
  for (let i = 0; i < licensesCount; i++) {
    elements.push(generateSampleLicense(entityId, entityName));
  }
  if (elements.length === 0) {
    return;
  }

  const licenceTableName: any = `${entityName}s_licenses`;
  const licenses = await insert(licenceTableName, elements).run(ctx);

  for (const license of licenses as []) {
    const countryElements = generateSampleLicenseCountries(
      (license as any).id,
      entityName,
    );
    if (countryElements.length === 0) {
      return;
    }
    const licenceCountryTableName: any = `${entityName}s_licenses_countries`;
    await insert(licenceCountryTableName, countryElements).run(ctx);
  }
};

export const generateSampleGenre = (
  name: string,
  sortOrder: number,
): movie_genres.Insertable | tvshow_genres.Insertable => {
  return {
    title: name,
    sort_order: sortOrder,
    created_user: faker.helpers.fake('{{name.lastName}}, {{name.firstName}}'),
    updated_user: faker.helpers.fake('{{name.lastName}}, {{name.firstName}}'),
    created_date: faker.date.recent(),
    updated_date: faker.date.recent(),
  };
};

export const seedGenres = async (
  ctx: Queryable,
  tableName: tvshow_genres.Table | movie_genres.Table,
): Promise<number[]> => {
  const genreNames = [
    'Action',
    'Adventure',
    'Animation',
    'Children’s',
    'Comedy',
    'Documentary',
    'Drama',
    'Education',
    'Faith and Spirituality',
    'Family',
    'Fantasy',
    'Food',
    'Horror',
    'Independent',
    'Instructional',
    'Live Performance',
    'Music Performance',
    'Musical',
    'Mystery',
    'Reality',
    'Romance',
    'Science Fiction',
    'Sports',
    'Thriller',
    'Variety/Talk Show',
    'Western',
    'Miscellaneous',
  ];
  const elements = [];
  for (let i = 0; i < genreNames.length; i++) {
    elements.push(generateSampleGenre(genreNames[i], i));
  }
  return (await insert(tableName, elements).run(ctx)).map((r) => r.id);
};

export const insertGenres = async (
  ctx: Queryable,
  entityId: number,
  genreIds: number[],
  entityName: string,
  genreEntityName: string,
): Promise<void> => {
  const genres = randomArray(0, 5, () => {
    return faker.helpers.arrayElement(genreIds);
  }).map((genreId) => ({
    [`${entityName}_id`]: entityId,
    [`${genreEntityName}_genres_id`]: genreId,
  }));
  if (genres.length === 0) {
    return;
  }

  const tableName: any = `${entityName}s_${genreEntityName}_genres`;
  await insert(tableName, genres).run(ctx);
};
