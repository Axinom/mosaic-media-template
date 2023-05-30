import {
  createOffsetDate,
  getFirstMockResult,
} from '@axinom/mosaic-service-common';
import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { CommonErrors } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';

const EPISODE_REQUEST = gql`
  query TestEpisodeWithCode($id: String!, $countryCode: String) {
    episode(id: $id, countryCode: $countryCode) {
      id
    }
  }
`;

describe('ExtendEpisodeQueryWithCountryCodePlugin', () => {
  let ctx: ITestContext;
  let errorOverride: jest.SpyInstance;
  let debugOverride: jest.SpyInstance;
  const episodeId = 'episode-1';
  const seasonId = 'season-1';
  const tvshowId = 'season-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('episode', { id: episodeId, season_id: seasonId }).run(
      ctx.ownerPool,
    );
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
    await ctx?.truncate('episode_licenses');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx?.truncate('episode');
    await ctx.dispose();
  });

  describe('Episode Error cases', () => {
    it('episode that does not exist -> license not checked, empty response returned', async () => {
      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: `${episodeId}10`,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toBeFalsy();
    });

    it('no license -> error for no license', async () => {
      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with no values set -> error for not valid license', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The episode does not have a valid license in your current country (DE)',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The episode does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with only start date after current date -> error for not valid license', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The episode does not have a valid license in your current country (DE)',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The episode does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with only end date before current date -> error for not valid license', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The episode does not have a valid license in your current country (DE)',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The episode does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with start and end dates with current date before start -> error for not valid license', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(60 * 60),
        end_time: createOffsetDate(60 * 60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The episode does not have a valid license in your current country (DE)',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The episode does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with start and end dates with current date after end -> error for not valid license', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(-(60 * 60 * 60)),
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The episode does not have a valid license in your current country (DE)',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The episode does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with valid period, but no fitting country -> error for not valid license', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The episode does not have a valid license in your current country (DE)',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The episode does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with not matching country codes without start and end dates -> error for not valid license', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The episode does not have a valid license in your current country (DE)',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The episode does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });
  });

  describe('Episode Success cases', () => {
    // Control case to make sure that passing country code triggers validation logic
    it('episode without license, no code passed -> episode returned', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        gql`
          query TestEpisodeWithoutCode($id: String!) {
            episode(id: $id) {
              id
            }
          }
        `,
        { id: episodeId },
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only start date before current date -> episode returned', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only end date after current date -> episode returned', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and no specified countries -> episode returned', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and matching country code -> episode returned', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE', 'DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with matching country code and without start and end dates -> episode returned', async () => {
      // Arrange
      await insert('episode_licenses', {
        episode_id: episodeId,
        countries: ['DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('two licenses, one valid and one invalid -> episode returned', async () => {
      // Arrange
      await insert('episode_licenses', [
        {
          episode_id: episodeId,
          start_time: createOffsetDate(-(60 * 60)),
          end_time: createOffsetDate(60 * 60),
          countries: ['EE', 'ER', 'BE'],
        },
        {
          episode_id: episodeId,
          countries: ['DE'],
        },
      ]).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });
  });

  describe('Season Error cases', () => {
    beforeAll(async () => {
      await insert('season', { id: seasonId }).run(ctx.ownerPool);
    });

    afterEach(async () => {
      await ctx?.truncate('season_licenses');
    });

    afterAll(async () => {
      await ctx?.truncate('season');
    });

    it('no license -> error for no license', async () => {
      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with no values set -> error for not valid license', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with only start date after current date -> error for no license', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with only end date before current date -> error for no license', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with start and end dates with current date before start -> error for no license', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(60 * 60),
        end_time: createOffsetDate(60 * 60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with start and end dates with current date after end -> error for no license', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(-(60 * 60 * 60)),
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with valid period, but no fitting country -> error for no license', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with not matching country codes without start and end dates -> error for no license', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });
  });

  describe('Season Success cases', () => {
    beforeAll(async () => {
      await insert('season', { id: seasonId }).run(ctx.ownerPool);
    });

    afterEach(async () => {
      await ctx?.truncate('season_licenses');
    });

    afterAll(async () => {
      await ctx?.truncate('season');
    });

    it('license with only start date before current date -> episode returned', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only end date after current date -> episode returned', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and no specified countries -> episode returned', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and matching country code -> episode returned', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE', 'DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with matching country code and without start and end dates -> episode returned', async () => {
      // Arrange
      await insert('season_licenses', {
        season_id: seasonId,
        countries: ['DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('two licenses, one valid and one invalid -> episode returned', async () => {
      // Arrange
      await insert('season_licenses', [
        {
          season_id: seasonId,
          start_time: createOffsetDate(-(60 * 60)),
          end_time: createOffsetDate(60 * 60),
          countries: ['EE', 'ER', 'BE'],
        },
        {
          season_id: seasonId,
          countries: ['DE'],
        },
      ]).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });
  });

  describe('TV Show Error cases', () => {
    beforeAll(async () => {
      await insert('season', { id: seasonId, tvshow_id: tvshowId }).run(
        ctx.ownerPool,
      );
      await insert('tvshow', { id: tvshowId }).run(ctx.ownerPool);
    });

    afterEach(async () => {
      await ctx?.truncate('tvshow_licenses');
    });

    afterAll(async () => {
      await ctx?.truncate('season');
      await ctx?.truncate('tvshow');
    });

    it('no license -> error for no license', async () => {
      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with no values set -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with only start date after current date -> error for no license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with only end date before current date -> error for no license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with start and end dates with current date before start -> error for no license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(60 * 60),
        end_time: createOffsetDate(60 * 60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with start and end dates with current date after end -> error for no license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60 * 60)),
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with valid period, but no fitting country -> error for no license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });

    it('license with not matching country codes without start and end dates -> error for no license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.episode).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseNotFound.code,
          details: undefined,
          message: 'The episode does not have a license.',
          path: ['episode'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: 'The episode does not have a license.',
        loglevel: 'ERROR',
        details: { code: CommonErrors.LicenseNotFound.code },
      });
    });
  });

  describe('TV Show Success cases', () => {
    beforeAll(async () => {
      await insert('season', { id: seasonId, tvshow_id: tvshowId }).run(
        ctx.ownerPool,
      );
      await insert('tvshow', { id: tvshowId }).run(ctx.ownerPool);
    });

    afterEach(async () => {
      await ctx?.truncate('tvshow_licenses');
    });

    afterAll(async () => {
      await ctx?.truncate('season');
      await ctx?.truncate('tvshow');
    });

    it('license with only start date before current date -> episode returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only end date after current date -> episode returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and no specified countries -> episode returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and matching country code -> episode returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE', 'DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with matching country code and without start and end dates -> episode returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        countries: ['DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('two licenses, one valid and one invalid -> episode returned', async () => {
      // Arrange
      await insert('tvshow_licenses', [
        {
          tvshow_id: tvshowId,
          start_time: createOffsetDate(-(60 * 60)),
          end_time: createOffsetDate(60 * 60),
          countries: ['EE', 'ER', 'BE'],
        },
        {
          tvshow_id: tvshowId,
          countries: ['DE'],
        },
      ]).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(EPISODE_REQUEST, {
        id: episodeId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.episode.id).toEqual(episodeId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });
  });
});
