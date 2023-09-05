import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { movie_genres } from 'zapatos/schema';
import { Config, InternalErrors } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { ReplicationOperationHandlers } from '../../common';
import { LOCALIZATION_MOVIE_GENRE_TYPE } from './constants';
import { movieGenresReplicationHandlers } from './movie-genres-replication-handlers';

describe('movieGenresReplicationHandlers', () => {
  let config: Config;
  let handlers: ReplicationOperationHandlers;
  let defaultMovieGenre: Partial<movie_genres.JSONSelectable>;

  beforeAll(async () => {
    config = createTestConfig();
    handlers = movieGenresReplicationHandlers(config);
    defaultMovieGenre = {
      id: 1,
      title: 'Test Movie',
    };
  });

  describe('insertHandler', () => {
    it('undefined is passed -> error is thrown', async () => {
      // Act
      const error = await rejectionOf(handlers.insertHandler(undefined));

      // Assert
      expect(error).toMatchObject({
        message:
          'The data was not provided for the table "movie_genres". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it.each([
      [{}, 'id'],
      [{ id: 'test' }, 'title'],
    ])(
      'incomplete movie genre %p is passed -> error is thrown for column %p',
      async (movieGenre, missingColumn) => {
        // Act
        const error = await rejectionOf(handlers.insertHandler(movieGenre));

        // Assert
        expect(error).toMatchObject({
          message: `The column "${missingColumn}" of the table "movie_genres" is required for localization, but was not found.`,
          code: InternalErrors.ReplicaColumnNotFound.code,
        });
      },
    );

    it('movie genre is inserted -> upsert message data is returned', async () => {
      // Act
      const result = await handlers.insertHandler(defaultMovieGenre);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultMovieGenre.id?.toString(),
          entity_title: defaultMovieGenre.title,
          entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
          fields: {
            title: defaultMovieGenre.title,
          },
          service_id: config.serviceId,
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
        },
        undefined,
      ],
      [
        undefined,
        {
          id: 'test',
          title: 'test',
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
            'The data was not provided for the table "movie_genres". Have you set `REPLICA IDENTITY full` for it?',
          code: InternalErrors.ReplicaDataNotFound.code,
        });
      },
    );

    it('movie genre is updated, but properties remains the same -> undefined is returned, localization does not require an update', async () => {
      // Act
      const result = await handlers.updateHandler(
        defaultMovieGenre,
        defaultMovieGenre,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it('movie genre title is updated -> upsert message data is returned', async () => {
      // Arrange
      const updatedMovieGenre = { ...defaultMovieGenre, title: 'updated' };

      // Act
      const result = await handlers.updateHandler(
        updatedMovieGenre,
        defaultMovieGenre,
      );

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultMovieGenre.id?.toString(),
          entity_title: updatedMovieGenre.title,
          entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
          fields: { title: 'updated' },
          service_id: config.serviceId,
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
          'The data was not provided for the table "movie_genres". Have you set `REPLICA IDENTITY full` for it?',
        code: InternalErrors.ReplicaDataNotFound.code,
      });
    });

    it('movie genre is deleted -> delete message data is returned', async () => {
      // Act
      const result = await handlers.deleteHandler(defaultMovieGenre);

      // Assert
      expect(result).toEqual({
        payload: {
          entity_id: defaultMovieGenre.id?.toString(),
          entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
          service_id: config.serviceId,
        },
        settings:
          LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      });
    });
  });
});
