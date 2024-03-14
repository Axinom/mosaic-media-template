/* eslint-disable jest/no-disabled-tests */
import 'jest-extended';
import { deletes, insert, update } from 'zapatos/db';
import { collections } from 'zapatos/schema';
import { setIsLocalizationEnabledDbFunction } from '../../common';
import { LocalizableCollectionDbMessagingSettings } from '../../domains/collections';
import { createTestContext, ITestContext } from '../test-utils';

describe('Collection localizable triggers', () => {
  let ctx: ITestContext;
  let collection: collections.JSONSelectable;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    collection = await insert('collections', {
      id: 1,
      title: 'My Collection',
    }).run(ctx.ownerPool);
    await ctx.truncateInbox();
  });

  afterEach(async () => {
    await ctx.truncate('collections');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('collections', () => {
    it('Collection inserted with only title -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('collections');

      // Act
      collection = await insert('collections', {
        id: 1,
        title: 'My Collection',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: collection.id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionCreated.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionCreated.messageType,
          metadata: null,
          payload: {
            id: collection.id,
            title: collection.title,
          },
        },
      ]);
    });

    it('Collection inserted with title, description, synopsis -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('collections');

      // Act
      collection = await insert('collections', {
        id: 1,
        title: 'My Collection',
        synopsis: 'My Synopsis',
        description: 'My Description',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: collection.id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionCreated.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionCreated.messageType,
          metadata: null,
          payload: {
            id: collection.id,
            title: collection.title,
            synopsis: collection.synopsis,
            description: collection.description,
          },
        },
      ]);
    });

    it('Collection updated with only title -> inbox entry added', async () => {
      // Act
      const [updatedCollection] = await update(
        'collections',
        { title: 'My Edited Collection' },
        { id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: collection.id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionUpdated.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionUpdated.messageType,
          metadata: null,
          payload: {
            id: collection.id,
            title: updatedCollection.title,
          },
        },
      ]);
    });

    it('Collection updated with title, description, synopsis -> inbox entry added', async () => {
      // Act
      const [updatedCollection] = await update(
        'collections',
        {
          title: 'My Edited Collection',
          synopsis: 'My Edited Synopsis',
          description: 'My Edited Description',
        },
        { id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: collection.id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionUpdated.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionUpdated.messageType,
          metadata: null,
          payload: {
            id: collection.id,
            title: updatedCollection.title,
            synopsis: updatedCollection.synopsis,
            description: updatedCollection.description,
          },
        },
      ]);
    });

    it('Collection updated with field that is not localizable -> inbox entry not added', async () => {
      // Act
      await update(
        'collections',
        { external_id: 'Edited External ID' },
        { id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection updated with title, description, synopsis of same values as currently set -> inbox entry not added', async () => {
      // Act
      await update(
        'collections',
        {
          title: collection.title,
          synopsis: collection.synopsis,
          description: collection.description,
        },
        { id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection updated with localizable value changed from null to empty string -> inbox entry not added', async () => {
      // Act
      await update(
        'collections',
        {
          synopsis: '',
          description: '',
        },
        { id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection deleted -> inbox entry added', async () => {
      // Act
      await deletes('collections', { id: collection.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: collection.id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionDeleted.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionDeleted.messageType,
          metadata: null,
          payload: {
            id: collection.id,
          },
        },
      ]);
    });
  });

  describe('collections_images', () => {
    it('Collection COVER inserted -> inbox entry added', async () => {
      // Act
      const image = await insert('collections_images', {
        collection_id: collection.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: image.image_id,
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageCreated.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageCreated.messageType,
          metadata: null,
          payload: {
            collection_id: image.collection_id,
            image_id: image.image_id,
            image_type: image.image_type,
          },
        },
      ]);
    });

    it('Collection image updated -> inbox entry added', async () => {
      // Arrange
      await insert('collections_images', {
        collection_id: collection.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      const [updatedImage] = await update(
        'collections_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { collection_id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: updatedImage.image_id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageUpdated.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageUpdated.messageType,
          metadata: null,
          payload: {
            collection_id: updatedImage.collection_id,
            image_id: updatedImage.image_id,
            image_type: updatedImage.image_type,
          },
        },
      ]);
    });

    it('Collection image deleted -> inbox entry added', async () => {
      // Arrange
      const image = await insert('collections_images', {
        collection_id: collection.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('collections_images', { collection_id: collection.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageDeleted.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageDeleted.messageType,
          metadata: null,
          payload: {
            collection_id: image.collection_id,
            image_id: image.image_id,
            image_type: image.image_type,
          },
        },
      ]);
    });

    it('Collection deleted -> inbox entries added for collection and collection image', async () => {
      // Arrange
      const image = await insert('collections_images', {
        collection_id: collection.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('collections', { id: collection.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: collection.id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionDeleted.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionDeleted.messageType,
          metadata: null,
          payload: {
            id: collection.id,
          },
        },
        {
          // Message handler ignores this by checking if collection exists
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageDeleted.aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableCollectionDbMessagingSettings
              .LocalizableCollectionImageDeleted.messageType,
          metadata: null,
          payload: {
            collection_id: image.collection_id,
            image_id: image.image_id,
            image_type: image.image_type,
          },
        },
      ]);
    });
  });

  describe('localization is disabled', () => {
    beforeEach(async () => {
      await setIsLocalizationEnabledDbFunction(false, ctx.ownerPool);
    });

    afterEach(async () => {
      await setIsLocalizationEnabledDbFunction(true, ctx.ownerPool);
    });

    it('Collection inserted -> inbox entry not added', async () => {
      // Arrange
      await ctx.truncate('collections');

      // Act
      collection = await insert('collections', {
        id: 1,
        title: 'My Collection',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection updated -> inbox entry not added', async () => {
      // Act
      await update(
        'collections',
        { title: 'My Edited Collection' },
        { id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection deleted -> inbox entry not added', async () => {
      // Act
      await deletes('collections', { id: collection.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection COVER inserted -> inbox entry not added', async () => {
      // Act
      await insert('collections_images', {
        collection_id: collection.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection COVER updated -> inbox entry not added', async () => {
      // Arrange
      await insert('collections_images', {
        collection_id: collection.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await update(
        'collections_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { collection_id: collection.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Collection COVER deleted -> inbox entry not added', async () => {
      // Arrange
      await insert('collections_images', {
        collection_id: collection.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await deletes('collections_images', { collection_id: collection.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });
  });
});
