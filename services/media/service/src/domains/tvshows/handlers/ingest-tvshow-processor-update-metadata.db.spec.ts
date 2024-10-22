import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { MediaEntityType, UpdateMetadataCommand } from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import { tvshows } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestTvshowProcessor } from './ingest-tvshow-processor';

describe('IngestTvshowProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestTvshowProcessor;
  let tvshow1: tvshows.JSONSelectable;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestTvshowProcessor(ctx.config);
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    tvshow1 = await insert('tvshows', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('tvshows');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  const createMessageBody = (
    element: { id: number; external_id: string | null },
    data: Record<string, unknown>,
    type: MediaEntityType = 'TVSHOW',
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
    it.each([[[]], [null]])(
      'message with trailers value %p -> video assignments are cleared',
      async (value) => {
        // Arrange
        const trailersBefore = await insert('tvshows_trailers', [
          {
            video_id: '485ff990-c49c-488e-8169-38bf45907f40',
            tvshow_id: tvshow1.id,
          },
          {
            video_id: '4e430aa6-59c6-42c7-b8cf-ca67c1021d8a',
            tvshow_id: tvshow1.id,
          },
        ]).run(ctx.ownerPool);

        const data = {
          title: 'Element1',
          index: 1,
          trailers: value,
        };
        const body = createMessageBody(tvshow1, data);

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const elements = await select('tvshows', all, { columns: ['id'] }).run(
          ctx.ownerPool,
        );
        const trailers = await select('tvshows_trailers', {
          tvshow_id: tvshow1.id,
        }).run(ctx.ownerPool);

        expect(elements).toHaveLength(1);
        expect(trailers).toHaveLength(0);
        expect(trailersBefore).toHaveLength(2);
      },
    );

    it('message with undefined trailers value -> trailer assignments are retained', async () => {
      // Arrange
      const trailersBefore = await insert('tvshows_trailers', [
        {
          video_id: '6f61de36-db00-4cbc-8184-1426e801fd83',
          tvshow_id: tvshow1.id,
        },
        {
          video_id: '4b3a63eb-71a6-48ba-a9f5-9b57b90b5ed7',
          tvshow_id: tvshow1.id,
        },
      ]).run(ctx.ownerPool);

      const data = {
        title: 'Element1',
        index: 1,
        trailers: undefined,
      };
      const body = createMessageBody(tvshow1, data);

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) => {
        await processor.updateMetadata(body, dbCtx);
      });

      // Assert
      const elements = await select('tvshows', all, { columns: ['id'] }).run(
        ctx.ownerPool,
      );
      const trailers = await select('tvshows_trailers', {
        tvshow_id: tvshow1.id,
      }).run(ctx.ownerPool);

      expect(elements).toHaveLength(1);
      expect(trailers).toHaveLength(2);
      expect(trailersBefore).toEqual(trailers);
    });
  });
});
