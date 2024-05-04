import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { MediaEntityType, UpdateMetadataCommand } from 'media-messages';
import { all, insert, select, update } from 'zapatos/db';
import { episodes } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestEpisodeProcessor } from './ingest-episode-processor';

describe('IngestEpisodeProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestEpisodeProcessor;
  let episode1: episodes.JSONSelectable;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestEpisodeProcessor(ctx.config);
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    episode1 = await insert('episodes', {
      title: 'Entity1',
      external_id: 'existing1',
      index: 1,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('episodes');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  const createMessageBody = (
    element: { id: number; external_id: string | null },
    data: Record<string, unknown>,
    type: MediaEntityType = 'EPISODE',
  ): UpdateMetadataCommand => {
    return {
      entity_id: element.id,
      item: {
        external_id: element.external_id as string,
        type,
        data,
      },
    };
  };

  describe('updateMetadata', () => {
    it.each`
      mainVideoValue | trailersValue
      ${{}}          | ${[]}
      ${null}        | ${null}
    `(
      'message with video value "$mainVideoValue" and trailers value "$trailersValue" -> video assignments are cleared',
      async ({ mainVideoValue, trailersValue }) => {
        // Arrange
        const [elementWithVideo] = await update(
          'episodes',
          { main_video_id: 'e6913dba-3091-4b3a-9c33-d0112bb2ef32' },
          { id: episode1.id },
        ).run(ctx.ownerPool);

        const trailersBefore = await insert('episodes_trailers', [
          {
            video_id: '617f99ed-321b-4da3-9758-fbe6231ae519',
            episode_id: episode1.id,
          },
          {
            video_id: 'aadbe276-5b2b-45f1-9d41-3289465e186c',
            episode_id: episode1.id,
          },
        ]).run(ctx.ownerPool);

        const data = {
          title: 'Element1',
          index: 1,
          main_video: mainVideoValue,
          trailers: trailersValue,
        };
        const body = createMessageBody(episode1, data);

        // Act
        await ctx.executeGqlSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const elements = await select('episodes', all, {
          columns: ['main_video_id'],
        }).run(ctx.ownerPool);
        const trailers = await select('episodes_trailers', {
          episode_id: episode1.id,
        }).run(ctx.ownerPool);

        expect(elements).toHaveLength(1);
        expect(trailers).toHaveLength(0);
        expect(trailersBefore).toHaveLength(2);

        expect(elements[0].main_video_id).toBeNull();
        expect(elements[0].main_video_id).not.toEqual(
          elementWithVideo.main_video_id,
        );
      },
    );

    it('message with undefined video assignment -> video assignment is retained', async () => {
      // Arrange
      const [elementWithVideo] = await update(
        'episodes',
        { main_video_id: '2efdc8d6-8709-4958-85ab-a8dad3e03056' },
        { id: episode1.id },
      ).run(ctx.ownerPool);

      const data = {
        title: 'Element1',
        index: 1,
        main_video: undefined,
      };
      const body = createMessageBody(episode1, data);

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) => {
        await processor.updateMetadata(body, dbCtx);
      });

      // Assert
      const elements = await select(
        'episodes',
        { id: episode1.id },
        { columns: ['main_video_id'] },
      ).run(ctx.ownerPool);

      expect(elements).toHaveLength(1);

      expect(elements[0].main_video_id).not.toBeNull();
      expect(elements[0].main_video_id).toEqual(elementWithVideo.main_video_id);
    });

    it('message with undefined trailers value -> trailer assignments are retained', async () => {
      // Arrange
      const trailersBefore = await insert('episodes_trailers', [
        {
          video_id: '6f61de36-db00-4cbc-8184-1426e801fd83',
          episode_id: episode1.id,
        },
        {
          video_id: '4b3a63eb-71a6-48ba-a9f5-9b57b90b5ed7',
          episode_id: episode1.id,
        },
      ]).run(ctx.ownerPool);

      const data = {
        title: 'Element1',
        index: 1,
        trailers: undefined,
      };
      const body = createMessageBody(episode1, data);

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) => {
        await processor.updateMetadata(body, dbCtx);
      });

      // Assert
      const elements = await select('episodes', all, { columns: ['id'] }).run(
        ctx.ownerPool,
      );
      const trailers = await select('episodes_trailers', {
        episode_id: episode1.id,
      }).run(ctx.ownerPool);

      expect(elements).toHaveLength(1);
      expect(trailers).toHaveLength(2);
      expect(trailersBefore).toEqual(trailers);
    });
  });
});
