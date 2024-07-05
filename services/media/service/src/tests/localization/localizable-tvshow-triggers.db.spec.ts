/* eslint-disable jest/no-disabled-tests */
import 'jest-extended';
import { TvshowImageTypeEnum } from 'zapatos/custom';
import { deletes, insert, update } from 'zapatos/db';
import { tvshows } from 'zapatos/schema';
import { setIsLocalizationEnabledDbFunction } from '../../common';
import { LocalizableTvshowDbMessagingSettings } from '../../domains/tvshows';
import { createTestContext, ITestContext } from '../test-utils';

describe('Tvshow localizable triggers', () => {
  let ctx: ITestContext;
  let tvshow: tvshows.JSONSelectable;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    tvshow = await insert('tvshows', { id: 1, title: 'My Tvshow' }).run(
      ctx.ownerPool,
    );
    await ctx.truncateInbox();
  });

  afterEach(async () => {
    await ctx.truncate('tvshows');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('tvshows', () => {
    it('Tvshow inserted with only title -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('tvshows');

      // Act
      tvshow = await insert('tvshows', { id: 1, title: 'My Tvshow' }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowCreated
              .messageType,
          metadata: null,
          payload: {
            id: tvshow.id,
            title: tvshow.title,
          },
        },
      ]);
    });

    it('Tvshow inserted with title, description, synopsis -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('tvshows');

      // Act
      tvshow = await insert('tvshows', {
        id: 1,
        title: 'My Tvshow',
        synopsis: 'My Synopsis',
        description: 'My Description',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowCreated
              .messageType,
          metadata: null,
          payload: {
            id: tvshow.id,
            title: tvshow.title,
            synopsis: tvshow.synopsis,
            description: tvshow.description,
          },
        },
      ]);
    });

    it('Tvshow updated with only title -> inbox entry added', async () => {
      // Act
      const [updatedTvshow] = await update(
        'tvshows',
        { title: 'My Edited Tvshow' },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .messageType,
          metadata: null,
          payload: {
            id: tvshow.id,
            title: updatedTvshow.title,
          },
        },
      ]);
    });

    it('Tvshow updated with title, description, synopsis -> inbox entry added', async () => {
      // Act
      const [updatedTvshow] = await update(
        'tvshows',
        {
          title: 'My Edited Tvshow',
          synopsis: 'My Edited Synopsis',
          description: 'My Edited Description',
        },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .messageType,
          metadata: null,
          payload: {
            id: tvshow.id,
            title: updatedTvshow.title,
            synopsis: updatedTvshow.synopsis,
            description: updatedTvshow.description,
          },
        },
      ]);
    });

    it('Tvshow updated with field that is not localizable -> inbox entry not added', async () => {
      // Act
      await update(
        'tvshows',
        { original_title: 'My Edited Original Title' },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow updated with title, description, synopsis of same values as currently set -> inbox entry not added', async () => {
      // Act
      await update(
        'tvshows',
        {
          title: tvshow.title,
          synopsis: tvshow.synopsis,
          description: tvshow.description,
        },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow updated with localizable value changed from null to empty string -> inbox entry not added', async () => {
      // Act
      await update(
        'tvshows',
        {
          synopsis: '',
          description: '',
        },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow updated with field that is not localizable and ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedTvshow] = await update(
        'tvshows',
        {
          original_title: 'My Edited Original Title',
          ingest_correlation_id: 3,
        },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedTvshow.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: tvshow.id },
        },
      ]);
    });

    it('Tvshow updated with only ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedTvshow] = await update(
        'tvshows',
        { ingest_correlation_id: 3 },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedTvshow.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: tvshow.id },
        },
      ]);
    });

    it('Tvshow deleted -> inbox entry added', async () => {
      // Act
      await deletes('tvshows', { id: tvshow.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowDeleted
              .messageType,
          metadata: null,
          payload: {
            id: tvshow.id,
          },
        },
      ]);
    });
  });

  describe('tvshows_images', () => {
    it.each(['COVER' as TvshowImageTypeEnum, 'TEASER' as TvshowImageTypeEnum])(
      'Tvshow %p inserted -> inbox entry added',
      // TEASER is expected to be skipped in the message handler
      async (imageType) => {
        // Act
        const image = await insert('tvshows_images', {
          tvshow_id: tvshow.id,
          image_id: '00000000-0000-0000-0000-000000000001',
          image_type: imageType,
        }).run(ctx.ownerPool);

        // Assert
        const inbox = await ctx.getInbox();
        expect(inbox).toEqual([
          {
            aggregate_id: image.image_id,
            aggregate_type:
              LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageCreated
                .aggregateType,
            concurrency: 'parallel',
            message_type:
              LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageCreated
                .messageType,
            metadata: null,
            payload: {
              tvshow_id: image.tvshow_id,
              image_id: image.image_id,
              image_type: image.image_type,
            },
          },
        ]);
      },
    );

    it('Tvshow image updated -> inbox entry added', async () => {
      // Arrange
      await insert('tvshows_images', {
        tvshow_id: tvshow.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      const [updatedImage] = await update(
        'tvshows_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { tvshow_id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: updatedImage.image_id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageUpdated
              .messageType,
          metadata: null,
          payload: {
            tvshow_id: updatedImage.tvshow_id,
            image_id: updatedImage.image_id,
            image_type: updatedImage.image_type,
          },
        },
      ]);
    });

    it('Tvshow image deleted -> inbox entry added', async () => {
      // Arrange
      const image = await insert('tvshows_images', {
        tvshow_id: tvshow.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('tvshows_images', { tvshow_id: tvshow.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageDeleted
              .messageType,
          metadata: null,
          payload: {
            tvshow_id: image.tvshow_id,
            image_id: image.image_id,
            image_type: image.image_type,
          },
        },
      ]);
    });

    it('Tvshow deleted -> inbox entries added for tvshow and tvshow image', async () => {
      // Arrange
      const image = await insert('tvshows_images', {
        tvshow_id: tvshow.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('tvshows', { id: tvshow.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: tvshow.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowDeleted
              .messageType,
          metadata: null,
          payload: {
            id: tvshow.id,
          },
        },
        {
          // Message handler ignores this by checking if tvshow exists
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowImageDeleted
              .messageType,
          metadata: null,
          payload: {
            tvshow_id: image.tvshow_id,
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

    it('Tvshow inserted -> inbox entry not added', async () => {
      // Arrange
      await ctx.truncate('tvshows');

      // Act
      tvshow = await insert('tvshows', { id: 1, title: 'My Tvshow' }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow updated -> inbox entry not added', async () => {
      // Act
      await update(
        'tvshows',
        { title: 'My Edited Tvshow' },
        { id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow deleted -> inbox entry not added', async () => {
      // Act
      await deletes('tvshows', { id: tvshow.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow COVER inserted -> inbox entry not added', async () => {
      // Act
      await insert('tvshows_images', {
        tvshow_id: tvshow.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow COVER updated -> inbox entry not added', async () => {
      // Arrange
      await insert('tvshows_images', {
        tvshow_id: tvshow.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await update(
        'tvshows_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { tvshow_id: tvshow.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow COVER deleted -> inbox entry not added', async () => {
      // Arrange
      await insert('tvshows_images', {
        tvshow_id: tvshow.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await deletes('tvshows_images', { tvshow_id: tvshow.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });
  });
});
