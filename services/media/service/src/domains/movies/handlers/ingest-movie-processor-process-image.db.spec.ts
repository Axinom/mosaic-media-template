import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { insert, select } from 'zapatos/db';
import { movies, movies_images } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestMovieProcessor } from './ingest-movie-processor';

describe('IngestMovieProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestMovieProcessor;
  let movie1: movies.JSONSelectable;
  let user: AuthenticatedManagementSubject;
  const imageId = '11e1d903-49ed-4d70-8b24-90d0824741d0';

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestMovieProcessor(ctx.config);
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    await ctx.truncate('movies');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('processImage', () => {
    it('new cover image -> image relation created', async () => {
      // Act
      await ctx.executeGqlSql(user, async (dbCtx) => {
        await processor.processImage(movie1.id, imageId, 'COVER', dbCtx);
      });

      // Assert
      const images = await select('movies_images', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);

      expect(images).toEqual<movies_images.JSONSelectable[]>([
        {
          movie_id: movie1.id,
          image_id: imageId,
          image_type: 'COVER',
        },
      ]);
    });

    it('new teaser image with teaser already being assigned -> image relation updated', async () => {
      // Arrange
      await insert('movies_images', {
        movie_id: movie1.id,
        image_id: '11e1d903-49ed-4d70-8b24-000000000000',
        image_type: 'TEASER',
      }).run(ctx.ownerPool);

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) => {
        await processor.processImage(movie1.id, imageId, 'TEASER', dbCtx);
      });

      // Assert
      const images = await select('movies_images', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);

      expect(images).toEqual<movies_images.JSONSelectable[]>([
        {
          movie_id: movie1.id,
          image_id: imageId,
          image_type: 'TEASER',
        },
      ]);
    });
  });
});
