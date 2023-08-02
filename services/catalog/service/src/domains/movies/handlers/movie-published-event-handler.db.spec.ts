import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { MoviePublishedEvent } from 'media-messages';
import { insert, select, selectOne } from 'zapatos/db';
import { movie } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  createMoviePublishedEvent,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { MoviePublishedEventHandler } from './movie-published-event-handler';

describe('MoviePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MoviePublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MoviePublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('movie');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new movie is published without localizations', async () => {
      // Arrange
      const message = createMoviePublishedEvent('movie-1');
      message.localizations = undefined;
      const messageInfo = stub<MessageInfo<MoviePublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const movie = await selectOne('movie', { id: message.content_id }).run(
        ctx.ownerPool,
      );
      expect(movie).toEqual<movie.JSONSelectable>({
        id: message.content_id,
        movie_cast: message.cast ?? null,
        original_title: message.original_title ?? null,
        production_countries: message.production_countries ?? null,
        released: message.released ?? null,
        studio: message.studio ?? null,
        tags: message.tags ?? null,
      });

      const images = await select('movie_images', {
        movie_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(images).toMatchObject(message.images!);

      // Remove `video_streams` array from `video` object
      const expectedVideos = message.videos.map((video) => {
        return Object.fromEntries(
          Object.entries(video).filter(
            ([key, _value]) => key !== 'video_streams' && key !== 'cue_points',
          ),
        );
      });
      const videos = await select('movie_videos', {
        movie_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const movieVideoStreams = (
        await select('movie_video_streams', {
          movie_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, movie_video_id, ...stream }) => stream);
      expect(movieVideoStreams).toIncludeSameMembers(
        message.videos[0].video_streams!,
      );

      const videoCuePoints = (
        await select('movie_video_cue_points', {
          movie_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, movie_video_id, ...cuePoint }) => cuePoint);
      expect(videoCuePoints).toIncludeSameMembers(
        message.videos[0].cue_points!,
      );

      const licenses = await select('movie_licenses', {
        movie_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);

      const genreRelations = await select(
        'movie_genres_relation',
        {
          movie_id: message.content_id,
        },
        {
          order: {
            by: 'order_no',
            direction: 'ASC',
          },
        },
      ).run(ctx.ownerPool);
      expect(genreRelations.map((g) => g.movie_genre_id)).toEqual(
        message.genre_ids,
      );
      const localizations = await select(
        'movie_localizations',
        { movie_id: message.content_id },
        {
          columns: [
            'title',
            'description',
            'synopsis',
            'locale',
            'is_default_locale',
          ],
        },
      ).run(ctx.ownerPool);
      expect(localizations).toEqual([
        {
          title: message.title,
          description: message.description ?? null,
          synopsis: message.synopsis ?? null,
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
      ]);
    });

    test('A new movie is published with localizations', async () => {
      // Arrange
      const message = createMoviePublishedEvent('movie-1');
      const messageInfo = stub<MessageInfo<MoviePublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const movie = await selectOne('movie', { id: message.content_id }).run(
        ctx.ownerPool,
      );
      expect(movie).toEqual<movie.JSONSelectable>({
        id: message.content_id,
        movie_cast: message.cast ?? null,
        original_title: message.original_title ?? null,
        production_countries: message.production_countries ?? null,
        released: message.released ?? null,
        studio: message.studio ?? null,
        tags: message.tags ?? null,
      });

      const images = await select('movie_images', {
        movie_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(images).toMatchObject(message.images!);

      // Remove `video_streams` array from `video` object
      const expectedVideos = message.videos.map((video) => {
        return Object.fromEntries(
          Object.entries(video).filter(
            ([key, _value]) => key !== 'video_streams' && key !== 'cue_points',
          ),
        );
      });
      const videos = await select('movie_videos', {
        movie_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const movieVideoStreams = (
        await select('movie_video_streams', {
          movie_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, movie_video_id, ...stream }) => stream);
      expect(movieVideoStreams).toIncludeSameMembers(
        message.videos[0].video_streams!,
      );

      const videoCuePoints = (
        await select('movie_video_cue_points', {
          movie_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, movie_video_id, ...cuePoint }) => cuePoint);
      expect(videoCuePoints).toIncludeSameMembers(
        message.videos[0].cue_points!,
      );

      const licenses = await select('movie_licenses', {
        movie_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);

      const genreRelations = await select(
        'movie_genres_relation',
        {
          movie_id: message.content_id,
        },
        {
          order: {
            by: 'order_no',
            direction: 'ASC',
          },
        },
      ).run(ctx.ownerPool);
      expect(genreRelations.map((g) => g.movie_genre_id)).toEqual(
        message.genre_ids,
      );
      const localizations = await select(
        'movie_localizations',
        { movie_id: message.content_id },
        {
          columns: [
            'title',
            'description',
            'synopsis',
            'locale',
            'is_default_locale',
          ],
        },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.localizations!.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });

    test('An existing movie is republished', async () => {
      // Arrange
      await insert('movie', {
        id: 'movie-1',
        original_title: 'Incorrect original title',
      }).run(ctx.ownerPool);
      await insert('movie_localizations', {
        movie_id: 'movie-1',
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createMoviePublishedEvent('movie-1');
      const messageInfo = stub<MessageInfo<MoviePublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const movie = await selectOne('movie', { id: message.content_id }).run(
        ctx.ownerPool,
      );

      expect(movie?.original_title).toEqual('Movie title');
      const localizations = await select(
        'movie_localizations',
        { movie_id: 'movie-1' },
        {
          columns: [
            'title',
            'description',
            'synopsis',
            'locale',
            'is_default_locale',
          ],
        },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.localizations!.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });
  });
});
