import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { seasons } from 'zapatos/schema';
import { InternalErrors } from '../../../common';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { LOCALIZATION_SEASON_TYPE } from './constants';
import { seasonsReplicationHandlers } from './seasons-replication-handlers';

describe('seasonsReplicationHandlers', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handlers: ReplicationOperationHandlers;
  const defaultSeason: Partial<seasons.JSONSelectable> = {
    id: 1,
    description: 'Test Description',
    index: 2,
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    handlers = seasonsReplicationHandlers(ctx.config, ctx.ownerPool);
    user = createTestUser(ctx.config.serviceId, { name: 'TestUser' });
  });

  afterEach(async () => {
    await ctx.truncate('tvshows');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('insertHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.insertHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "seasons". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'id'],
      [{ id: 'test' }, 'index'],
    ])(
      'incomplete season %p is passed -> error is thrown for column %p',
      async (season, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(season));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "seasons" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('season without parent tvshow is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultSeason);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultSeason.id!.toString(),
          entity_title: 'Season 2',
          entity_type: LOCALIZATION_SEASON_TYPE,
          fields: {
            description: defaultSeason.description,
          },
          image_id: undefined,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });

    it('season with parent tvshow is inserted -> upsert message data is returned with expanded entity_title', async () => {
      // Arrange
      const tvshowId = await ctx.executeGqlSql(user, async (txn) => {
        return (
          await insert('tvshows', {
            title: 'TV show title',
          }).run(txn)
        ).id;
      });

      // Act
      const result = await handlers.insertHandler({
        ...defaultSeason,
        tvshow_id: tvshowId,
      });

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultSeason.id!.toString(),
          entity_title: 'Season 2 (TV show title)',
          entity_type: LOCALIZATION_SEASON_TYPE,
          fields: {
            description: defaultSeason.description,
          },
          image_id: undefined,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });
  });

  describe('updateHandler', () => {
    it.each([
      [undefined, undefined],
      [
        {
          id: 'test',
          index: 1,
        },
        undefined,
      ],
      [
        undefined,
        {
          id: 'test',
          index: 1,
        },
      ],
    ])(
      'undefined is passed for new, old, or both -> error is thrown, checking that assertion works for both inputs',
      async (first, second) => {
        // Act
        const error = await rejectionOf(handlers.updateHandler(first, second));

        // Assert
        expect(error).toMatchObject({
          message:
            'The data was not provided for the table "seasons". Have you set `REPLICA IDENTITY full` for it?',
          code: InternalErrors.ReplicaDataNotFound.code,
        });
      },
    );

    it('season is updated, but properties remains the same -> undefined is returned, localization does not require an update', async () => {
      // Act
      const result = await handlers.updateHandler(defaultSeason, defaultSeason);

      // Assert
      expect(result).toBeUndefined();
    });

    it('season is updated, properties remains the same, but context is passed -> upsert message data with context is returned', async () => {
      // Arrange
      const context = { ingestItemId: 1 };
      const contextHandlers = seasonsReplicationHandlers(
        ctx.config,
        ctx.ownerPool,
        context,
      );

      // Act
      const result = await contextHandlers.updateHandler(
        defaultSeason,
        defaultSeason,
      );

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultSeason.id!.toString(),
          entity_title: 'Season 2',
          entity_type: LOCALIZATION_SEASON_TYPE,
          fields: {},
          image_id: undefined,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
        messageContext: context,
      });
    });

    it.each([
      [{ description: 'updated' }, undefined],
      [{ synopsis: 'updated' }, { ingestItemId: 2 }],
      [{ description: 'updated', synopsis: 'updated' }, undefined],
    ])(
      'season is updated, changing properties %p -> upsert message data is returned',
      async (updated, messageContext) => {
        // Arrange
        const contextHandlers = seasonsReplicationHandlers(
          ctx.config,
          ctx.ownerPool,
          messageContext,
        );

        // Act
        const updatedSeason = {
          ...defaultSeason,
          ...updated,
        };
        const result = await contextHandlers.updateHandler(
          updatedSeason,
          defaultSeason,
        );

        // Assert
        expect(result).toEqual({
          payload: {
            entity_id: defaultSeason.id!.toString(),
            entity_title: 'Season 2',
            entity_type: LOCALIZATION_SEASON_TYPE,
            fields: updated,
            image_id: undefined,
            service_id: ctx.config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
          messageContext,
        });
      },
    );

    it('season is assigned to a tv show -> upsert message data is returned with empty fields and relevant entity_title', async () => {
      // Arrange
      const tvshowId = await ctx.executeGqlSql(user, async (txn) => {
        return (
          await insert('tvshows', {
            title: 'TV show title',
          }).run(txn)
        ).id;
      });

      // Act
      const updatedSeason = {
        ...defaultSeason,
        tvshow_id: tvshowId,
      };
      const result = await handlers.updateHandler(updatedSeason, {
        ...defaultSeason,
        tvshow_id: null,
      });

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultSeason.id!.toString(),
          entity_title: 'Season 2 (TV show title)',
          entity_type: LOCALIZATION_SEASON_TYPE,
          fields: {},
          image_id: undefined,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });
  });

  describe('deleteHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.deleteHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "seasons". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('season is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler(defaultSeason);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultSeason.id!.toString(),
          entity_type: LOCALIZATION_SEASON_TYPE,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      });
    });
  });
});
