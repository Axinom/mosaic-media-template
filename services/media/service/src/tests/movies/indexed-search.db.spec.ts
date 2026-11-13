import { StoreInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import gql from 'graphql-tag';
import { Client } from 'pg';
import { all, insert, select } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  createTestUser,
  ITestContext,
} from '../test-utils';

type Filter = Record<string, unknown>;

const MOVIES = gql`
  query IndexedSearchMovies($filter: MovieFilter, $after: Cursor) {
    movies(filter: $filter, orderBy: [TITLE_ASC], first: 2, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
      }
    }
  }
`;

describe('Indexed search', () => {
  let ctx: ITestContext;
  let rootClient: Client;
  let generatedSql: string[] = [];

  const seed: [title: string, originalTitle: string | null, tags: string[]][] =
    [
      ['Needle in a haystack', 'Aguja', ['needlework']],
      ['Haystack', null, ['farm']],
      ['100% Juice', 'Jugo', []],
      ['100 Percent', null, ['needle-free']],
      ['snake_case title', 'Snake', []],
      ['snakeXcase title', null, []],
    ];

  const queryMovies = async (
    filter: Filter,
    after?: string,
  ): Promise<{
    titles: string[];
    totalCount: number;
    endCursor: string;
  }> => {
    const resp = await ctx.runGqlQuery(
      MOVIES,
      { filter, after },
      createTestRequestContext(ctx.config.serviceId),
    );
    expect(resp.errors).toBeFalsy();
    return {
      titles: resp.data?.movies.nodes.map((n: { title: string }) => n.title),
      totalCount: resp.data?.movies.totalCount,
      endCursor: resp.data?.movies.pageInfo.endCursor,
    };
  };

  const allTitles = async (filter: Filter): Promise<string[]> => {
    const titles: string[] = [];
    let after: string | undefined;
    let page;
    do {
      page = await queryMovies(filter, after);
      titles.push(...page.titles);
      after = page.endCursor;
    } while (titles.length < page.totalCount);
    return titles;
  };

  const titlesWhere = (
    predicate: (row: (typeof seed)[number]) => boolean,
  ): string[] =>
    seed
      .filter(predicate)
      .map(([title]) => title)
      .sort();

  const includes = (value: string | null, term: string): boolean | null =>
    value === null ? null : value.toLowerCase().includes(term.toLowerCase());

  beforeAll(async () => {
    const storeInboxMessage: StoreInboxMessage = vi.fn(async () => undefined);
    ctx = await createTestContext({}, undefined, storeInboxMessage);
    vi.spyOn(tokenHelpers, 'getLongLivedToken').mockImplementation(
      async () => 'test-long-lived-token',
    );

    // Databases that do not allow marking texticlike as LEAKPROOF cannot use
    // trigram indexes for ILIKE under row level security.
    const rootUrl = new URL(ctx.config.pgRootConnectionString);
    rootUrl.pathname = `/${ctx.config.dbName}`;
    rootClient = new Client({ connectionString: rootUrl.toString() });
    await rootClient.connect();
    await rootClient.query(
      'ALTER FUNCTION pg_catalog.texticlike(text, text) NOT LEAKPROOF',
    );

    const query = Client.prototype.query;
    vi.spyOn(Client.prototype, 'query').mockImplementation(function (
      this: Client,
      ...args: Parameters<typeof query>
    ) {
      const config = args[0] as string | { text?: string };
      generatedSql.push(
        typeof config === 'string' ? config : (config?.text ?? ''),
      );
      return query.apply(this, args);
    } as typeof query);
  });

  beforeEach(async () => {
    for (const [title, original_title, tags] of seed) {
      const movie = await insert('movies', { title, original_title }).run(
        ctx.ownerPool,
      );
      for (const name of tags) {
        await insert('movies_tags', { movie_id: movie.id, name }).run(
          ctx.ownerPool,
        );
      }
    }
    generatedSql = [];
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('tvshows');
    await ctx.truncate('collections');
  });

  afterAll(async () => {
    vi.restoreAllMocks();
    await rootClient.query(
      'ALTER FUNCTION pg_catalog.texticlike(text, text) LEAKPROOF',
    );
    await rootClient.end();
    await ctx.dispose();
  });

  describe('results like includesInsensitive', () => {
    it.each([
      [
        'title',
        'NEEDLE',
        (r: (typeof seed)[number]) => includes(r[0], 'needle'),
      ],
      ['title', '100%', (r: (typeof seed)[number]) => includes(r[0], '100%')],
      [
        'title',
        'snake_case',
        (r: (typeof seed)[number]) => includes(r[0], 'snake_case'),
      ],
      [
        'originalTitle',
        'jug',
        (r: (typeof seed)[number]) => includes(r[1], 'jug'),
      ],
    ])('%s contains %j -> matching movies', async (field, term, predicate) => {
      expect(
        await allTitles({ [field]: { includesInsensitive: term } }),
      ).toEqual(titlesWhere((r) => predicate(r) === true));
      expect(generatedSql.join()).toContain('_candidates');
    });

    it('relation filter -> movies with a matching tag', async () => {
      expect(
        await allTitles({
          moviesTags: { some: { name: { includesInsensitive: 'needle' } } },
        }),
      ).toEqual(titlesWhere((r) => r[2].some((t) => includes(t, 'needle'))));
      expect(generatedSql.join()).toContain('movies_tags_name_candidates');
    });

    it('not on a nullable column -> excludes NULL values like ILIKE', async () => {
      expect(
        await allTitles({
          not: { originalTitle: { includesInsensitive: 'jug' } },
        }),
      ).toEqual(titlesWhere((r) => includes(r[1], 'jug') === false));
    });

    it('not, and, or -> same composition as without candidates', async () => {
      expect(
        await allTitles({
          or: [
            { title: { includesInsensitive: 'stack' } },
            {
              and: [
                { not: { title: { includesInsensitive: 'snake' } } },
                { title: { includesInsensitive: 'percent' } },
              ],
            },
          ],
        }),
      ).toEqual(['100 Percent', 'Haystack', 'Needle in a haystack']);
    });

    it('includesInsensitive with another operator -> both apply', async () => {
      expect(
        await allTitles({
          title: { includesInsensitive: 'stack', startsWith: 'Hay' },
        }),
      ).toEqual(['Haystack']);
    });

    it.each(['', 'ha', 'e '])(
      'term %j without a trigram -> original filter',
      async (term) => {
        expect(
          await allTitles({ title: { includesInsensitive: term } }),
        ).toEqual(titlesWhere((r) => includes(r[0], term) === true));
        expect(generatedSql.join()).not.toContain('_candidates');
      },
    );
  });

  it('row level security -> still applied to the final rows', async () => {
    await rootClient.query(
      `CREATE POLICY hide_haystack ON app_public.movies AS RESTRICTIVE FOR SELECT USING (title <> 'Haystack')`,
    );
    try {
      expect(
        await allTitles({ title: { includesInsensitive: 'haystack' } }),
      ).toEqual(['Needle in a haystack']);
    } finally {
      await rootClient.query('DROP POLICY hide_haystack ON app_public.movies');
    }
  });

  it('bulk action -> selects the same movies', async () => {
    const resp = await ctx.runGqlQuery(
      gql`
        mutation IndexedSearchDeleteMovies($filter: MovieFilter) {
          deleteMovies(filter: $filter) {
            affectedIds
          }
        }
      `,
      { filter: { title: { includesInsensitive: 'haystack' } } },
      createTestRequestContext(ctx.config.serviceId),
    );
    expect(resp.errors).toBeFalsy();
    const movies = await select('movies', all).run(ctx.ownerPool);
    expect(resp.data?.deleteMovies.affectedIds).toIncludeSameMembers(
      movies
        .filter((m) => m.title.toLowerCase().includes('haystack'))
        .map((m) => m.id),
    );
  });

  it('candidate function -> requires the read permission', async () => {
    await expect(
      ctx.executeGqlSql(
        createTestUser(ctx.config.serviceId, {
          permissions: { [ctx.config.serviceId]: ['COLLECTIONS_VIEW'] },
        }),
        (client) =>
          client.query(
            "SELECT * FROM app_hidden.movies_title_candidates('%needle%')",
          ),
      ),
    ).rejects.toThrow(/MOVIES_VIEW,MOVIES_EDIT,ADMIN/);
  });

  it.each([
    [
      'tvshows',
      gql`
        query ($filter: TvshowFilter) {
          tvshows(filter: $filter) {
            nodes {
              title
            }
          }
        }
      `,
      'tvshows_title_candidates',
    ],
    [
      'collections',
      gql`
        query ($filter: CollectionFilter) {
          collections(filter: $filter) {
            nodes {
              title
            }
          }
        }
      `,
      'collections_title_candidates',
    ],
  ])('%s title -> uses its candidate function', async (table, query, fn) => {
    await insert(table as 'tvshows' | 'collections', {
      title: 'Needle show',
    }).run(ctx.ownerPool);
    const resp = await ctx.runGqlQuery(
      query,
      { filter: { title: { includesInsensitive: 'needle' } } },
      createTestRequestContext(ctx.config.serviceId),
    );
    expect(resp.errors).toBeFalsy();
    expect(resp.data?.[table].nodes).toEqual([{ title: 'Needle show' }]);
    expect(generatedSql.join()).toContain(fn);
  });

  it('candidate function -> uses the trigram index that ILIKE under row level security cannot use', async () => {
    const notices: string[] = [];
    const onNotice = (notice: { message?: string }): void => {
      notices.push(notice.message ?? '');
    };
    let rowLevelSecurityPlan = '';
    rootClient.on('notice', onNotice);
    try {
      await rootClient.query('BEGIN');
      await rootClient.query(
        `INSERT INTO app_public.movies (title)
         SELECT 'Synthetic movie ' || g FROM generate_series(1, 20000) g`,
      );
      // Flush the GIN pending list of the new rows, so the planner chooses
      // the index as it would for settled data.
      await rootClient.query(
        "SELECT pg_catalog.gin_clean_pending_list('app_public.idx_trgm_movies_title')",
      );
      await rootClient.query('ANALYZE app_public.movies');
      await rootClient.query("LOAD 'auto_explain'");
      await rootClient.query('SET LOCAL auto_explain.log_min_duration = 0');
      await rootClient.query(
        'SET LOCAL auto_explain.log_nested_statements = on',
      );
      await rootClient.query("SET LOCAL auto_explain.log_level = 'notice'");
      await rootClient.query(`SET LOCAL ROLE "${ctx.config.dbGqlRole}"`);
      await rootClient.query(
        "SELECT set_config('mosaic.auth.permissions', 'ADMIN', true)",
      );
      const { rows } = await rootClient.query(
        'EXPLAIN SELECT id FROM app_public.movies WHERE title ILIKE $1',
        ['%needle%'],
      );
      rowLevelSecurityPlan = rows.map((row) => row['QUERY PLAN']).join('\n');
      await rootClient.query(
        'SELECT * FROM app_hidden.movies_title_candidates($1)',
        ['%needle%'],
      );
    } finally {
      await rootClient.query('ROLLBACK');
      rootClient.off('notice', onNotice);
    }

    expect(rowLevelSecurityPlan).not.toContain('idx_trgm_movies_title');
    expect(
      notices.find((notice) =>
        notice.includes(
          'Query Text: SELECT id FROM app_public.movies WHERE title ILIKE $1 AND',
        ),
      ),
    ).toContain('idx_trgm_movies_title');
  });
});
