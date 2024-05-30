import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { IngestItem } from 'media-messages';
import { all, insert, JSONOnlyColsForTable, select } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestSeasonProcessor } from './ingest-season-processor';

describe('IngestSeasonProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestSeasonProcessor;
  let season1: JSONOnlyColsForTable<
    'seasons',
    ('id' | 'index' | 'external_id')[]
  >;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestSeasonProcessor(ctx.config);
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    await insert('tvshows', {
      title: 'Entity1',
      external_id: 'existing_tvshow',
    }).run(ctx.ownerPool);
    season1 = await insert(
      'seasons',
      {
        index: 1,
        external_id: 'existing1',
      },
      { returning: ['id', 'index', 'external_id'] },
    ).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('seasons');
    await ctx.truncate('tvshows');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('processVideo', () => {
    it.each([
      ['not_existing_tvshow', 'Season 1'],
      ['existing_tvshow', 'Season 1 (Entity1)'],
    ])(
      'message with 1 new season with parent external id %p -> season created',
      async (parentExternalId, expectedDisplayTitle) => {
        // Arrange
        const item: IngestItem = {
          type: 'SEASON',
          external_id: 'test1_external_id',
          data: { index: 1, parent_external_id: parentExternalId },
        };

        // Act
        const result = await ctx.executeGqlSql(user, async (dbCtx) => {
          return processor.initializeMedia([item], dbCtx);
        });

        // Assert
        const seasons = await select('seasons', all, {
          columns: ['id', 'index', 'external_id'],
          order: [{ by: 'id', direction: 'ASC' }],
        }).run(ctx.ownerPool);

        expect(seasons).toIncludeSameMembers([
          season1,
          {
            id: seasons[1].id,
            external_id: item.external_id,
            index: item.data.index,
          },
        ]);

        expect(result).toMatchObject({
          createdMedia: [
            {
              external_id: item.external_id,
              id: seasons[1].id,
            },
          ],
          displayTitleMappings: [
            {
              display_title: expectedDisplayTitle,
              external_id: item.external_id,
              index: item.data.index,
            },
          ],
          existedMedia: [],
        });
      },
    );
  });
});
