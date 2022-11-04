import 'jest-extended';
import { deletes, insert, selectExactlyOne, update } from 'zapatos/db';
import { movies_images, movies_licenses_countries } from 'zapatos/schema';
import { createTestContext, ITestContext } from '../test-utils';

describe('Movies timestamp propagation', () => {
  let ctx: ITestContext;
  let initialTime: number;

  const tag = { movie_id: 1, name: 'Tag' };
  const trailer = {
    movie_id: 1,
    video_id: '00000000-0000-0000-0000-000000000000',
  };
  const genre = { movie_id: 1, movie_genres_id: 1 };
  const image: movies_images.JSONSelectable = {
    movie_id: 1,
    image_id: '00000000-0000-0000-0000-000000000000',
    image_type: 'TEASER',
  };
  const license = { id: 1, movie_id: 1 };
  const licenseCountry: movies_licenses_countries.JSONSelectable = {
    movies_license_id: 1,
    code: 'EE',
  };

  const getUpdatedTime = async (): Promise<number> => {
    const updatedMovie = await selectExactlyOne('movies', { id: 1 }).run(
      ctx.ownerPool,
    );
    return new Date(updatedMovie.updated_date).getTime();
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('movie_genres', {
      id: 1,
      title: 'My Genre',
      sort_order: 1,
    }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    const movie = await insert('movies', { id: 1, title: 'My Movie' }).run(
      ctx.ownerPool,
    );
    initialTime = new Date(movie.updated_date).getTime();
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('movies_tags');
    await ctx.truncate('movies_casts');
    await ctx.truncate('movies_production_countries');
    await ctx.truncate('movies_trailers');
    await ctx.truncate('movies_images');
    await ctx.truncate('movies_movie_genres');
    await ctx.truncate('movies_licenses');
    await ctx.truncate('movies_licenses_countries');
  });

  afterAll(async () => {
    await ctx.truncate('movie_genres');
    await ctx.dispose();
  });

  describe('tag changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('movies_tags', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('movies_tags', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update('movies_tags', { name: 'Changed' }, tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies_tags', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_tags', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('cast changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('movies_casts', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('movies_casts', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update('movies_casts', { name: 'Changed' }, tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies_casts', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_casts', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('production country changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('movies_production_countries', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('movies_production_countries', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update('movies_production_countries', { name: 'Changed' }, tag).run(
        ctx.ownerPool,
      );

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies_production_countries', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_production_countries', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('trailer changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('movies_trailers', trailer).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('movies_trailers', trailer).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update(
        'movies_trailers',
        { video_id: '156bd020-6862-419b-9783-e5c51af8683c' },
        trailer,
      ).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies_trailers', trailer).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_trailers', trailer).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('image changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('movies_images', image).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('movies_images', image).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update(
        'movies_images',
        { image_id: '156bd020-6862-419b-9783-e5c51af8683c' },
        image,
      ).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies_images', image).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_images', image).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('genre changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('movies_movie_genres', genre).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies_movie_genres', genre).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_movie_genres', genre).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('license changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('movies_licenses', license).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('movies_licenses', license).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update(
        'movies_licenses',
        { license_start: new Date() },
        license,
      ).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies_licenses', license).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_licenses', license).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('country inserted -> update propagated', async () => {
      // Arrange
      await insert('movies_licenses', license).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await insert('movies_licenses_countries', licenseCountry).run(
        ctx.ownerPool,
      );

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('country updated -> update propagated', async () => {
      // Arrange
      await insert('movies_licenses', license).run(ctx.ownerPool);
      await insert('movies_licenses_countries', licenseCountry).run(
        ctx.ownerPool,
      );
      initialTime = await getUpdatedTime();

      // Act
      await update(
        'movies_licenses_countries',
        { code: 'DE' },
        licenseCountry,
      ).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('country deleted -> update propagated', async () => {
      // Arrange
      await insert('movies_licenses', license).run(ctx.ownerPool);
      await insert('movies_licenses_countries', licenseCountry).run(
        ctx.ownerPool,
      );
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies_licenses_countries', licenseCountry).run(
        ctx.ownerPool,
      );

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });
});
