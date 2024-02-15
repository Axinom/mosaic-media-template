/* eslint-disable jest/no-disabled-tests */
import 'jest-extended';
import { EpisodeImageTypeEnum } from 'zapatos/custom';
import { deletes, insert, update } from 'zapatos/db';
import { episodes } from 'zapatos/schema';
import { setIsLocalizationEnabledDbFunction } from '../../common';
import { LocalizableEpisodeDbMessagingSettings } from '../../domains/tvshows';
import { createTestContext, ITestContext } from '../test-utils';

describe('Episode localizable triggers', () => {
  let ctx: ITestContext;
  let episode: episodes.JSONSelectable;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    episode = await insert('episodes', {
      id: 1,
      index: 1,
      title: 'My Episode',
    }).run(ctx.ownerPool);
    await ctx.truncateInbox();
  });

  afterEach(async () => {
    await ctx.truncate('episodes');
    await ctx.truncate('seasons');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('episodes', () => {
    it('Episode inserted with only title -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('episodes');

      // Act
      episode = await insert('episodes', {
        id: 1,
        index: 1,
        title: 'My Episode',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeCreated
              .messageType,
          metadata: null,
          payload: {
            id: episode.id,
            index: episode.index,
            title: episode.title,
          },
        },
      ]);
    });

    it('Episode inserted with title, description, synopsis -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('episodes');

      // Act
      episode = await insert('episodes', {
        id: 1,
        index: 1,
        title: 'My Episode',
        synopsis: 'My Synopsis',
        description: 'My Description',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeCreated
              .messageType,
          metadata: null,
          payload: {
            id: episode.id,
            index: episode.index,
            title: episode.title,
            synopsis: episode.synopsis,
            description: episode.description,
          },
        },
      ]);
    });

    it('Episode updated with only title -> inbox entry added', async () => {
      // Act
      const [updatedEpisode] = await update(
        'episodes',
        { title: 'My Edited Episode' },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .messageType,
          metadata: null,
          payload: {
            id: episode.id,
            index: episode.index,
            title: updatedEpisode.title,
          },
        },
      ]);
    });

    it('Episode updated with title, description, synopsis -> inbox entry added', async () => {
      // Act
      const [updatedEpisode] = await update(
        'episodes',
        {
          title: 'My Edited Episode',
          synopsis: 'My Edited Synopsis',
          description: 'My Edited Description',
        },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .messageType,
          metadata: null,
          payload: {
            id: episode.id,
            index: episode.index,
            title: updatedEpisode.title,
            synopsis: updatedEpisode.synopsis,
            description: updatedEpisode.description,
          },
        },
      ]);
    });

    it('Episode assigned to a season -> inbox entry added', async () => {
      // Arrange
      const season = await insert('seasons', {
        id: 1,
        index: 2,
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await update(
        'episodes',
        { season_id: season.id },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .messageType,
          metadata: null,
          payload: {
            id: episode.id,
            index: episode.index,
            season_id: season.id,
          },
        },
      ]);
    });

    it('Episode updated with field that is not localizable -> inbox entry not added', async () => {
      // Act
      await update(
        'episodes',
        { original_title: 'My Edited Original Title' },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode updated with title, description, synopsis of same values as currently set -> inbox entry not added', async () => {
      // Act
      await update(
        'episodes',
        {
          title: episode.title,
          synopsis: episode.synopsis,
          description: episode.description,
        },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode updated with localizable value changed from null to empty string -> inbox entry not added', async () => {
      // Act
      await update(
        'episodes',
        {
          synopsis: '',
          description: '',
        },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode updated with field that is not localizable and ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedEpisode] = await update(
        'episodes',
        {
          original_title: 'My Edited Original Title',
          ingest_correlation_id: 3,
        },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedEpisode.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: episode.id, index: episode.index },
        },
      ]);
    });

    it('Episode updated with only ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedEpisode] = await update(
        'episodes',
        { ingest_correlation_id: 3 },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedEpisode.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: episode.id, index: episode.index },
        },
      ]);
    });

    it('Episode deleted -> inbox entry added', async () => {
      // Act
      await deletes('episodes', { id: episode.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeDeleted
              .messageType,
          metadata: null,
          payload: {
            id: episode.id,
            index: episode.index,
          },
        },
      ]);
    });
  });

  describe('episodes_images', () => {
    it.each([
      'COVER' as EpisodeImageTypeEnum,
      'TEASER' as EpisodeImageTypeEnum,
    ])(
      'Episode %p inserted -> inbox entry added',
      // TEASER is expected to be skipped in the message handler
      async (imageType) => {
        // Act
        const image = await insert('episodes_images', {
          episode_id: episode.id,
          image_id: '00000000-0000-0000-0000-000000000001',
          image_type: imageType,
        }).run(ctx.ownerPool);

        // Assert
        const inbox = await ctx.getInbox();
        expect(inbox).toEqual([
          {
            aggregate_id: image.image_id,
            aggregate_type:
              LocalizableEpisodeDbMessagingSettings
                .LocalizableEpisodeImageCreated.aggregateType,
            concurrency: 'parallel',
            message_type:
              LocalizableEpisodeDbMessagingSettings
                .LocalizableEpisodeImageCreated.messageType,
            metadata: null,
            payload: {
              episode_id: image.episode_id,
              image_id: image.image_id,
              image_type: image.image_type,
            },
          },
        ]);
      },
    );

    it('Episode image updated -> inbox entry added', async () => {
      // Arrange
      await insert('episodes_images', {
        episode_id: episode.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      const [updatedImage] = await update(
        'episodes_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { episode_id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: updatedImage.image_id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageUpdated
              .messageType,
          metadata: null,
          payload: {
            episode_id: updatedImage.episode_id,
            image_id: updatedImage.image_id,
            image_type: updatedImage.image_type,
          },
        },
      ]);
    });

    it('Episode image deleted -> inbox entry added', async () => {
      // Arrange
      const image = await insert('episodes_images', {
        episode_id: episode.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('episodes_images', { episode_id: episode.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageDeleted
              .messageType,
          metadata: null,
          payload: {
            episode_id: image.episode_id,
            image_id: image.image_id,
            image_type: image.image_type,
          },
        },
      ]);
    });

    it('Episode deleted -> inbox entries added for episode and episode image', async () => {
      // Arrange
      const image = await insert('episodes_images', {
        episode_id: episode.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('episodes', { id: episode.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: episode.id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeDeleted
              .messageType,
          metadata: null,
          payload: {
            id: episode.id,
            index: episode.index,
          },
        },
        {
          // Message handler ignores this by checking if episode exists
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableEpisodeDbMessagingSettings.LocalizableEpisodeImageDeleted
              .messageType,
          metadata: null,
          payload: {
            episode_id: image.episode_id,
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

    it('Episode inserted -> inbox entry not added', async () => {
      // Arrange
      await ctx.truncate('episodes');

      // Act
      episode = await insert('episodes', {
        id: 1,
        index: 2,
        title: 'My Episode',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode updated  -> inbox entry not added', async () => {
      // Act
      await update(
        'episodes',
        { title: 'My Edited Episode' },
        { id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode deleted -> inbox entry not added', async () => {
      // Act
      await deletes('episodes', { id: episode.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode COVER inserted -> inbox entry not added', async () => {
      // Act
      await insert('episodes_images', {
        episode_id: episode.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode COVER updated -> inbox entry not added', async () => {
      // Arrange
      await insert('episodes_images', {
        episode_id: episode.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await update(
        'episodes_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { episode_id: episode.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Episode COVER deleted -> inbox entry not added', async () => {
      // Arrange
      await insert('episodes_images', {
        episode_id: episode.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await deletes('episodes_images', { episode_id: episode.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });
  });
});
