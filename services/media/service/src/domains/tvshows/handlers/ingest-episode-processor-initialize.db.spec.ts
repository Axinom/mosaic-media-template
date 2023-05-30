import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { IngestItem } from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestEpisodeProcessor } from './ingest-episode-processor';

describe('IngestEpisodeProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestEpisodeProcessor;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestEpisodeProcessor();
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    await insert('seasons', {
      index: 1,
      external_id: 'existing_season',
    }).run(ctx.ownerPool);
    const tvshow1 = await insert('tvshows', {
      title: 'TvShow Title',
      external_id: 'existing_tvshow',
    }).run(ctx.ownerPool);
    await insert('seasons', {
      index: 2,
      external_id: 'existing_season2',
      tvshow_id: tvshow1.id,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('episodes');
    await ctx.truncate('seasons');
    await ctx.truncate('tvshows');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('processVideo', () => {
    it.each([
      ['not_existing_season', 'Episode 1: test1_title'],
      ['existing_season', 'Episode 1: test1_title (Season 1)'],
      ['existing_season2', 'Episode 1: test1_title (Season 2, TvShow Title)'],
    ])(
      'message with 1 new episode with parent external id %p -> episode created',
      async (parentExternalId, expectedDisplayTitle) => {
        // Arrange
        const item: IngestItem = {
          type: 'EPISODE',
          external_id: 'test1_external_id',
          data: {
            title: 'test1_title',
            index: 1,
            parent_external_id: parentExternalId,
          },
        };

        // Act
        const result = await ctx.executeGqlSql(user, async (dbCtx) => {
          return processor.initializeMedia([item], dbCtx);
        });

        // Assert
        const episodes = await select('episodes', all, {
          columns: ['id', 'index', 'external_id'],
          order: [{ by: 'id', direction: 'ASC' }],
        }).run(ctx.ownerPool);

        expect(episodes).toIncludeSameMembers([
          {
            id: episodes[0].id,
            external_id: item.external_id,
            index: item.data.index,
          },
        ]);

        expect(result).toMatchObject({
          createdMedia: [
            {
              external_id: item.external_id,
              id: episodes[0].id,
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
