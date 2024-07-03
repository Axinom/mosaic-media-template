import {
  createOffsetDate,
  getFirstMockResult,
} from '@axinom/mosaic-service-common';
import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { CommonErrors, DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';

const MOVIE_REQUEST = gql`
  query TestMovieWithCode($id: String!, $countryCode: String) {
    movie(id: $id, countryCode: $countryCode) {
      id
    }
  }
`;

describe('ExtendMovieQueryWithCountryCodePlugin', () => {
  let ctx: ITestContext;
  let errorOverride: jest.SpyInstance;
  let debugOverride: jest.SpyInstance;
  const movieId = 'movie-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('movie', { id: movieId }).run(ctx.ownerPool);
    await insert('movie_localizations', {
      movie_id: movieId,
      locale: DEFAULT_LOCALE_TAG,
      is_default_locale: true,
      title: 'test',
    }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    errorOverride = await jest
      .spyOn(console, 'error')
      .mockImplementation((obj) => JSON.parse(obj));
    debugOverride = await jest
      .spyOn(console, 'debug')
      .mockImplementation((obj) => JSON.parse(obj));
  });

  afterEach(async () => {
    await ctx?.truncate('movie_licenses');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx?.truncate('movie');
    await ctx.dispose();
  });

  describe('Error cases', () => {
    it('movie that does not exist -> license not checked, empty response returned', async () => {
      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: `${movieId}10`,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toBeFalsy();
    });

    it('no license -> error for no license', async () => {
      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The movie does not have a license.',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The movie does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with no values set -> error for not valid license', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The movie does not have a valid license in your current country (DE)',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The movie does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with only start date after current date -> error for not valid license', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The movie does not have a valid license in your current country (DE)',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The movie does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with only end date before current date -> error for not valid license', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The movie does not have a valid license in your current country (DE)',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The movie does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with start and end dates with current date before start -> error for not valid license', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(60 * 60),
        end_time: createOffsetDate(60 * 60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The movie does not have a valid license in your current country (DE)',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The movie does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with start and end dates with current date after end -> error for not valid license', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(-(60 * 60 * 60)),
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The movie does not have a valid license in your current country (DE)',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The movie does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with valid period, but no fitting country -> error for not valid license', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The movie does not have a valid license in your current country (DE)',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The movie does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with not matching country codes without start and end dates -> error for not valid license', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.movie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The movie does not have a valid license in your current country (DE)',
          path: ['movie'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The movie does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });
  });

  describe('Success cases', () => {
    // Control case to make sure that passing country code triggers validation logic
    it('movie without license, no code passed -> movie returned', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        gql`
          query TestMovieWithoutCode($id: String!) {
            movie(id: $id) {
              id
            }
          }
        `,
        { id: movieId },
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.movie.id).toEqual(movieId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only start date before current date -> movie returned', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.movie.id).toEqual(movieId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only end date after current date -> movie returned', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.movie.id).toEqual(movieId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and no specified countries -> movie returned', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.movie.id).toEqual(movieId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and matching country code -> movie returned', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE', 'DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.movie.id).toEqual(movieId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with matching country code and without start and end dates -> movie returned', async () => {
      // Arrange
      await insert('movie_licenses', {
        movie_id: movieId,
        countries: ['DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.movie.id).toEqual(movieId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('two licenses, one valid and one invalid -> movie returned', async () => {
      // Arrange
      await insert('movie_licenses', [
        {
          movie_id: movieId,
          start_time: createOffsetDate(-(60 * 60)),
          end_time: createOffsetDate(60 * 60),
          countries: ['EE', 'ER', 'BE'],
        },
        {
          movie_id: movieId,
          countries: ['DE'],
        },
      ]).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(MOVIE_REQUEST, {
        id: movieId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.movie.id).toEqual(movieId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });
  });
});
