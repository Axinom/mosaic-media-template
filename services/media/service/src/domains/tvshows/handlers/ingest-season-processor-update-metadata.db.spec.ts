import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { MediaEntityType, UpdateMetadataCommand } from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import { seasons } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestSeasonProcessor } from './ingest-season-processor';

describe('IngestSeasonProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestSeasonProcessor;
  let season1: seasons.JSONSelectable;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestSeasonProcessor(ctx.config);
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    season1 = await insert('seasons', {
      external_id: 'existing1',
      index: 1,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('seasons');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  const createMessageBody = (
    element: { id: number; external_id: string | null },
    data: Record<string, unknown>,
    type: MediaEntityType = 'SEASON',
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
        const trailersBefore = await insert('seasons_trailers', [
          {
            video_id: '485ff990-c49c-488e-8169-38bf45907f40',
            season_id: season1.id,
          },
          {
            video_id: '4e430aa6-59c6-42c7-b8cf-ca67c1021d8a',
            season_id: season1.id,
          },
        ]).run(ctx.ownerPool);

        const data = {
          title: 'Element1',
          index: 1,
          trailers: value,
        };
        const body = createMessageBody(season1, data);

        // Act
        await ctx.executeGqlSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const elements = await select('seasons', all, { columns: ['id'] }).run(
          ctx.ownerPool,
        );
        const trailers = await select('seasons_trailers', {
          season_id: season1.id,
        }).run(ctx.ownerPool);

        expect(elements).toHaveLength(1);
        expect(trailers).toHaveLength(0);
        expect(trailersBefore).toHaveLength(2);
      },
    );

    it('message with undefined trailers value -> trailer assignments are retained', async () => {
      // Arrange
      const trailersBefore = await insert('seasons_trailers', [
        {
          video_id: '6f61de36-db00-4cbc-8184-1426e801fd83',
          season_id: season1.id,
        },
        {
          video_id: '4b3a63eb-71a6-48ba-a9f5-9b57b90b5ed7',
          season_id: season1.id,
        },
      ]).run(ctx.ownerPool);

      const data = {
        title: 'Element1',
        index: 1,
        trailers: undefined,
      };
      const body = createMessageBody(season1, data);

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) => {
        await processor.updateMetadata(body, dbCtx);
      });

      // Assert
      const elements = await select('seasons', all, { columns: ['id'] }).run(
        ctx.ownerPool,
      );
      const trailers = await select('seasons_trailers', {
        season_id: season1.id,
      }).run(ctx.ownerPool);

      expect(elements).toHaveLength(1);
      expect(trailers).toHaveLength(2);
      expect(trailersBefore).toEqual(trailers);
    });
  });
});
