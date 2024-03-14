/* eslint-disable jest/no-disabled-tests */
import 'jest-extended';
import { SeasonImageTypeEnum } from 'zapatos/custom';
import { deletes, insert, update } from 'zapatos/db';
import { seasons } from 'zapatos/schema';
import { setIsLocalizationEnabledDbFunction } from '../../common';
import { LocalizableSeasonDbMessagingSettings } from '../../domains/tvshows';
import { createTestContext, ITestContext } from '../test-utils';

describe('Season localizable triggers', () => {
  let ctx: ITestContext;
  let season: seasons.JSONSelectable;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    season = await insert('seasons', {
      id: 1,
      index: 1,
    }).run(ctx.ownerPool);
    await ctx.truncateInbox();
  });

  afterEach(async () => {
    await ctx.truncate('seasons');
    await ctx.truncate('tvshows');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('seasons', () => {
    it('Season inserted with only index -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('seasons');

      // Act
      season = await insert('seasons', {
        id: 1,
        index: 1,
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonCreated
              .messageType,
          metadata: null,
          payload: {
            id: season.id,
            index: season.index,
          },
        },
      ]);
    });

    it('Season inserted with index, description, synopsis -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('seasons');

      // Act
      season = await insert('seasons', {
        id: 1,
        index: 1,
        synopsis: 'My Synopsis',
        description: 'My Description',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonCreated
              .messageType,
          metadata: null,
          payload: {
            id: season.id,
            index: season.index,
            synopsis: season.synopsis,
            description: season.description,
          },
        },
      ]);
    });

    it('Season updated with only index -> inbox entry not added', async () => {
      // Act
      await update('seasons', { index: 5 }, { id: season.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season updated with description, synopsis -> inbox entry added', async () => {
      // Act
      const [updatedSeason] = await update(
        'seasons',
        {
          synopsis: 'My Edited Synopsis',
          description: 'My Edited Description',
        },
        { id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .messageType,
          metadata: null,
          payload: {
            id: season.id,
            index: season.index,
            synopsis: updatedSeason.synopsis,
            description: updatedSeason.description,
          },
        },
      ]);
    });

    it('Season assigned to a tvshow -> inbox entry added', async () => {
      // Arrange
      const tvshow = await insert('tvshows', {
        id: 1,
        title: 'My Tvshow',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await update('seasons', { tvshow_id: tvshow.id }, { id: season.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .messageType,
          metadata: null,
          payload: {
            id: season.id,
            index: season.index,
            tvshow_id: tvshow.id,
          },
        },
      ]);
    });

    it('Season updated with field that is not localizable -> inbox entry not added', async () => {
      // Act
      await update(
        'seasons',
        { external_id: 'My Edited External ID' },
        { id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season updated with description, synopsis of same values as currently set -> inbox entry not added', async () => {
      // Act
      await update(
        'seasons',
        {
          synopsis: season.synopsis,
          description: season.description,
        },
        { id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season updated with localizable value changed from null to empty string -> inbox entry not added', async () => {
      // Act
      await update(
        'seasons',
        {
          synopsis: '',
          description: '',
        },
        { id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season updated with field that is not localizable and ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedSeason] = await update(
        'seasons',
        {
          external_id: 'My Edited External ID',
          ingest_correlation_id: 3,
        },
        { id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedSeason.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: season.id, index: season.index },
        },
      ]);
    });

    it('Season updated with only ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedSeason] = await update(
        'seasons',
        { ingest_correlation_id: 3 },
        { id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedSeason.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: season.id, index: season.index },
        },
      ]);
    });

    it('Season deleted -> inbox entry added', async () => {
      // Act
      await deletes('seasons', { id: season.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonDeleted
              .messageType,
          metadata: null,
          payload: {
            id: season.id,
            index: season.index,
          },
        },
      ]);
    });
  });

  describe('seasons_images', () => {
    it.each(['COVER' as SeasonImageTypeEnum, 'TEASER' as SeasonImageTypeEnum])(
      'Season %p inserted -> inbox entry added',
      // TEASER is expected to be skipped in the message handler
      async (imageType) => {
        // Act
        const image = await insert('seasons_images', {
          season_id: season.id,
          image_id: '00000000-0000-0000-0000-000000000001',
          image_type: imageType,
        }).run(ctx.ownerPool);

        // Assert
        const inbox = await ctx.getInbox();
        expect(inbox).toEqual([
          {
            aggregate_id: image.image_id,
            aggregate_type:
              LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageCreated
                .aggregateType,
            concurrency: 'parallel',
            message_type:
              LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageCreated
                .messageType,
            metadata: null,
            payload: {
              season_id: image.season_id,
              image_id: image.image_id,
              image_type: image.image_type,
            },
          },
        ]);
      },
    );

    it('Season image updated -> inbox entry added', async () => {
      // Arrange
      await insert('seasons_images', {
        season_id: season.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      const [updatedImage] = await update(
        'seasons_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { season_id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: updatedImage.image_id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageUpdated
              .messageType,
          metadata: null,
          payload: {
            season_id: updatedImage.season_id,
            image_id: updatedImage.image_id,
            image_type: updatedImage.image_type,
          },
        },
      ]);
    });

    it('Season image deleted -> inbox entry added', async () => {
      // Arrange
      const image = await insert('seasons_images', {
        season_id: season.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('seasons_images', { season_id: season.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageDeleted
              .messageType,
          metadata: null,
          payload: {
            season_id: image.season_id,
            image_id: image.image_id,
            image_type: image.image_type,
          },
        },
      ]);
    });

    it('Season deleted -> inbox entries added for season and season image', async () => {
      // Arrange
      const image = await insert('seasons_images', {
        season_id: season.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('seasons', { id: season.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: season.id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonDeleted
              .messageType,
          metadata: null,
          payload: {
            id: season.id,
            index: season.index,
          },
        },
        {
          // Message handler ignores this by checking if season exists
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableSeasonDbMessagingSettings.LocalizableSeasonImageDeleted
              .messageType,
          metadata: null,
          payload: {
            season_id: image.season_id,
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

    it('Season inserted -> inbox entry not added', async () => {
      // Arrange
      await ctx.truncate('seasons');

      // Act
      season = await insert('seasons', {
        id: 1,
        index: 2,
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season updated -> inbox entry not added', async () => {
      // Act
      await update(
        'seasons',
        { synopsis: 'My Edited Synopsis' },
        { id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season deleted -> inbox entry not added', async () => {
      // Act
      await deletes('seasons', { id: season.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season COVER inserted -> inbox entry not added', async () => {
      // Act
      await insert('seasons_images', {
        season_id: season.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season COVER updated -> inbox entry not added', async () => {
      // Arrange
      await insert('seasons_images', {
        season_id: season.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await update(
        'seasons_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { season_id: season.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Season COVER deleted -> inbox entry not added', async () => {
      // Arrange
      await insert('seasons_images', {
        season_id: season.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await deletes('seasons_images', { season_id: season.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });
  });
});
