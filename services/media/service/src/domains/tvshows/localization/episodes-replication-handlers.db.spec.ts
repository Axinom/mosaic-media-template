import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { episodes } from 'zapatos/schema';
import { InternalErrors } from '../../../common';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { LOCALIZATION_EPISODE_TYPE } from './constants';
import { episodesReplicationHandlers } from './episodes-replication-handlers';

describe('episodesReplicationHandlers', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handlers: ReplicationOperationHandlers;
  const defaultEpisode: Partial<episodes.JSONSelectable> = {
    id: 1,
    index: 1,
    title: 'Test Title',
    description: 'Test Description',
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    handlers = episodesReplicationHandlers(ctx.config, ctx.ownerPool);
    user = createTestUser(ctx.config.serviceId, { name: 'TestUser' });
  });

  afterEach(async () => {
    await ctx.truncate('seasons');
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
          'The data was not provided for the table "episodes". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'id'],
      [{ id: 'test' }, 'title'],
      [{ id: 'test', title: 'test' }, 'index'],
    ])(
      'incomplete episode %p is passed -> error is thrown for column %p',
      async (episode, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(episode));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "episodes" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('episode without season is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultEpisode);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultEpisode.id!.toString(),
          entity_title: 'Episode 1: Test Title',
          entity_type: LOCALIZATION_EPISODE_TYPE,
          fields: {
            description: defaultEpisode.description,
            title: defaultEpisode.title,
          },
          image_id: undefined,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });

    it('episode with season but without tvshow is inserted -> upsert message data is returned', async () => {
      // Arrange
      const seasonId = await ctx.executeGqlSql(user, async (txn) => {
        return (
          await insert('seasons', {
            index: 3,
          }).run(txn)
        ).id;
      });

      // Act
      const result = await handlers.insertHandler({
        ...defaultEpisode,
        season_id: seasonId,
      });

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultEpisode.id!.toString(),
          entity_title: 'Episode 1: Test Title (Season 3)',
          entity_type: LOCALIZATION_EPISODE_TYPE,
          fields: {
            description: defaultEpisode.description,
            title: defaultEpisode.title,
          },
          image_id: undefined,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      });
    });

    it('episode with season and tvshow is inserted -> upsert message data is returned', async () => {
      // Arrange
      const seasonId = await ctx.executeGqlSql(user, async (txn) => {
        const tvshowId = (
          await insert('tvshows', {
            title: 'TV show title',
          }).run(txn)
        ).id;

        return (
          await insert('seasons', {
            index: 3,
            tvshow_id: tvshowId,
          }).run(txn)
        ).id;
      });

      // Act
      const result = await handlers.insertHandler({
        ...defaultEpisode,
        season_id: seasonId,
      });

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultEpisode.id!.toString(),
          entity_title: 'Episode 1: Test Title (Season 3, TV show title)',
          entity_type: LOCALIZATION_EPISODE_TYPE,
          fields: {
            description: defaultEpisode.description,
            title: defaultEpisode.title,
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
          title: 'test',
          index: 1,
        },
        undefined,
      ],
      [
        undefined,
        {
          id: 'test',
          title: 'test',
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
            'The data was not provided for the table "episodes". Have you set `REPLICA IDENTITY full` for it?',
          code: InternalErrors.ReplicaDataNotFound.code,
        });
      },
    );

    it('episode is updated, but properties remains the same -> undefined is returned, localization does not require an update', async () => {
      // Act
      const result = await handlers.updateHandler(
        defaultEpisode,
        defaultEpisode,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it.each([
      { title: 'updated' },
      { description: 'updated' },
      { title: 'updated', description: 'updated' },
      { title: 'updated', description: 'updated', synopsis: 'updated' },
    ])(
      'episode is updated, changing properties %p -> upsert message data is returned',
      async (updated) => {
        // Act
        const updatedEpisode = {
          ...defaultEpisode,
          ...updated,
        };
        const result = await handlers.updateHandler(
          updatedEpisode,
          defaultEpisode,
        );

        // Assert
        expect(result).toEqual({
          payload: {
            entity_id: defaultEpisode.id!.toString(),
            entity_title: `Episode 1: ${updatedEpisode.title}`,
            entity_type: LOCALIZATION_EPISODE_TYPE,
            fields: updated,
            image_id: undefined,
            service_id: ctx.config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
        });
      },
    );

    it('episode is assigned to a season -> upsert message data is returned with empty fields and relevant entity_title', async () => {
      // Arrange
      const seasonId = await ctx.executeGqlSql(user, async (txn) => {
        return (
          await insert('seasons', {
            index: 3,
          }).run(txn)
        ).id;
      });

      // Act
      const updatedEpisode = {
        ...defaultEpisode,
        season_id: seasonId,
      };
      const result = await handlers.updateHandler(updatedEpisode, {
        ...defaultEpisode,
        tvshow_id: null,
      });

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultEpisode.id!.toString(),
          entity_title: 'Episode 1: Test Title (Season 3)',
          entity_type: LOCALIZATION_EPISODE_TYPE,
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
          'The data was not provided for the table "episodes". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('episode is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler(defaultEpisode);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultEpisode.id!.toString(),
          entity_type: LOCALIZATION_EPISODE_TYPE,
          service_id: ctx.config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      });
    });
  });
});
