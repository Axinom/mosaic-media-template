import {
  createOffsetDate,
  getFirstMockResult,
} from '@axinom/mosaic-service-common';
import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { CommonErrors, DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';

const TV_SHOW_REQUEST = gql`
  query TestTvShowWithCode($id: String!, $countryCode: String) {
    tvshow(id: $id, countryCode: $countryCode) {
      id
    }
  }
`;

describe('ExtendTvShowQueryWithCountryCodePlugin', () => {
  let ctx: ITestContext;
  let errorOverride: jest.SpyInstance;
  let debugOverride: jest.SpyInstance;
  const tvshowId = 'tvshow-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('tvshow', { id: tvshowId }).run(ctx.ownerPool);
    await insert('tvshow_localizations', {
      tvshow_id: tvshowId,
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
    await ctx?.truncate('tvshow_licenses');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx?.truncate('tvshow');
    await ctx.dispose();
  });

  describe('Error cases', () => {
    it('tvshow that does not exist -> license not checked, empty response returned', async () => {
      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: `${tvshowId}10`,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toBeFalsy();
    });

    it('no license -> tv show returned', async () => {
      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with no values set -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The TV show does not have a valid license in your current country (DE)',
          path: ['tvshow'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The TV show does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with only start date after current date -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The TV show does not have a valid license in your current country (DE)',
          path: ['tvshow'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The TV show does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with only end date before current date -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The TV show does not have a valid license in your current country (DE)',
          path: ['tvshow'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The TV show does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with start and end dates with current date before start -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(60 * 60),
        end_time: createOffsetDate(60 * 60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The TV show does not have a valid license in your current country (DE)',
          path: ['tvshow'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The TV show does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with start and end dates with current date after end -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60 * 60)),
        end_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The TV show does not have a valid license in your current country (DE)',
          path: ['tvshow'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The TV show does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with valid period, but no fitting country -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The TV show does not have a valid license in your current country (DE)',
          path: ['tvshow'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The TV show does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });

    it('license with not matching country codes without start and end dates -> error for not valid license', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        countries: ['EE', 'ER', 'BE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp?.data?.tvshow).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: CommonErrors.LicenseIsNotValid.code,
          details: undefined,
          message:
            'The TV show does not have a valid license in your current country (DE)',
          path: ['tvshow'],
        },
      ]);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'The TV show does not have a valid license in your current country (DE)',
        loglevel: 'DEBUG',
        details: { code: CommonErrors.LicenseIsNotValid.code },
      });
    });
  });

  describe('Success cases', () => {
    // Control case to make sure that passing country code triggers validation logic
    it('tvshow without license, no code passed -> tvshow returned', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        gql`
          query TestTvShowWithoutCode($id: String!) {
            tvshow(id: $id) {
              id
            }
          }
        `,
        { id: tvshowId },
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only start date before current date -> tvshow returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with only end date after current date -> tvshow returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and no specified countries -> tvshow returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with valid period and matching country code -> tvshow returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
        end_time: createOffsetDate(60 * 60),
        countries: ['EE', 'ER', 'BE', 'DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('license with matching country code and without start and end dates -> tvshow returned', async () => {
      // Arrange
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        countries: ['DE'],
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });

    it('two licenses, one valid and one invalid -> tvshow returned', async () => {
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
      const resp = await ctx.runGqlQuery(TV_SHOW_REQUEST, {
        id: tvshowId,
        countryCode: 'DE',
      });

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.tvshow.id).toEqual(tvshowId);
      expect(errorOverride).toHaveBeenCalledTimes(0);
      expect(debugOverride).toHaveBeenCalledTimes(0);
    });
  });
});
