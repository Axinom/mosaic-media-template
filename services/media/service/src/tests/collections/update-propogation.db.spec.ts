import 'jest-extended';
import { deletes, insert, selectExactlyOne, update } from 'zapatos/db';
import { collections_images } from 'zapatos/schema';
import { createTestContext, ITestContext } from '../test-utils';

describe('Collections timestamp propagation', () => {
  let ctx: ITestContext;
  let initialTime: number;

  const tag = { collection_id: 1, name: 'Tag' };
  const movie = { id: 1, title: 'My Movie' };
  const collection_relation = { collection_id: 1, movie_id: 1, sort_order: 1 };
  const image: collections_images.JSONSelectable = {
    collection_id: 1,
    image_id: '00000000-0000-0000-0000-000000000000',
    image_type: 'COVER',
  };

  const getUpdatedTime = async (): Promise<number> => {
    const updatedCollection = await selectExactlyOne('collections', {
      id: 1,
    }).run(ctx.ownerPool);
    return new Date(updatedCollection.updated_date).getTime();
  };

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    const collection = await insert('collections', {
      id: 1,
      title: 'My Collection',
    }).run(ctx.ownerPool);
    initialTime = new Date(collection.updated_date).getTime();
  });

  afterEach(async () => {
    await ctx.truncate('collections');
    await ctx.truncate('collections_tags');
    await ctx.truncate('collections_images');
    await ctx.truncate('collection_relations');
    await ctx.truncate('movies');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('tag changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('collections_tags', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('collections_tags', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update('collections_tags', { name: 'Changed' }, tag).run(
        ctx.ownerPool,
      );

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('collections_tags', tag).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('collections_tags', tag).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('image changes', () => {
    it('insert -> update propagated', async () => {
      // Act
      await insert('collections_images', image).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('collections_images', image).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await update(
        'collections_images',
        { image_id: '156bd020-6862-419b-9783-e5c51af8683c' },
        image,
      ).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('collections_images', image).run(ctx.ownerPool);
      initialTime = await getUpdatedTime();

      // Act
      await deletes('collections_images', image).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });

  describe('relation changes', () => {
    it('insert -> update propagated', async () => {
      //Arrange
      await insert('movies', movie).run(ctx.ownerPool);

      // Act
      await insert('collection_relations', collection_relation).run(
        ctx.ownerPool,
      );

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('update -> update propagated', async () => {
      // Arrange
      await insert('movies', movie).run(ctx.ownerPool);
      await insert('collection_relations', collection_relation).run(
        ctx.ownerPool,
      );
      initialTime = await getUpdatedTime();

      // Act
      await update(
        'collection_relations',
        { sort_order: 99 },
        collection_relation,
      ).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('delete -> update propagated', async () => {
      // Arrange
      await insert('movies', movie).run(ctx.ownerPool);
      await insert('collection_relations', collection_relation).run(
        ctx.ownerPool,
      );
      initialTime = await getUpdatedTime();

      // Act
      await deletes('collection_relations', collection_relation).run(
        ctx.ownerPool,
      );

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });

    it('related entity delete -> update propagated', async () => {
      // Arrange
      await insert('movies', movie).run(ctx.ownerPool);
      await insert('collection_relations', collection_relation).run(
        ctx.ownerPool,
      );
      initialTime = await getUpdatedTime();

      // Act
      await deletes('movies', movie).run(ctx.ownerPool);

      // Assert
      expect(await getUpdatedTime()).toBeGreaterThan(initialTime);
    });
  });
});
