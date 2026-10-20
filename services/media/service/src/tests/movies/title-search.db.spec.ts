import { StoreInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { GraphQLInputObjectType } from 'graphql';
import gql from 'graphql-tag';
import { Client } from 'pg';
import { insert } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  createTestUser,
  ITestContext,
  TestRequestContext,
} from '../test-utils';

type MovieFilter = Record<string, unknown>;
type TitleClause = (term: string) => MovieFilter;

const legacy: TitleClause = (term) => ({
  title: { includesInsensitive: term },
});
const indexed: TitleClause = (term) => ({ titleIncludesInsensitive: term });

const MOVIES = gql`
  query TitleSearchMovies(
    $filter: MovieFilter
    $first: Int
    $after: Cursor
    $orderBy: [MoviesOrderBy!]
  ) {
    movies(filter: $filter, first: $first, after: $after, orderBy: $orderBy) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
        }
      }
    }
  }
`;

const MOVIES_TAGS = gql`
  query TitleSearchMoviesTags($filter: MoviesTagFilter) {
    moviesTags(filter: $filter, orderBy: [MOVIE_ID_ASC, NAME_ASC]) {
      nodes {
        movieId
        name
      }
    }
  }
`;

const DELETE_MOVIES = gql`
  mutation TitleSearchDeleteMovies($filter: MovieFilter) {
    deleteMovies(filter: $filter) {
      affectedIds
    }
  }
`;

const CREATE_MOVIE_SNAPSHOTS = gql`
  mutation TitleSearchCreateMovieSnapshots($filter: MovieFilter) {
    createMovieSnapshots(filter: $filter) {
      affectedIds
    }
  }
`;

const BULK_EDIT_MOVIES = gql`
  mutation TitleSearchBulkEditMovies($filter: MovieFilter) {
    bulkEditMoviesAsync(filter: $filter, set: { studio: "Edited" }) {
      filterMatchedIds
    }
  }
`;

describe('Movie title search filter', () => {
  let ctx: ITestContext;
  let rootClient: Client;
  let originalTexticlikeLeakproof: boolean;
  let defaultRequestContext: TestRequestContext;
  const ids: Record<string, number> = {};

  const seed: [key: string, title: string, studio: string][] = [
    ['needleHaystack', 'Needle in a haystack', 'A'],
    ['needle', 'needle', 'B'],
    ['haystack', 'Haystack', 'A'],
    ['percentJuice', '100% Juice', 'B'],
    ['percentWord', '100 Percent', 'A'],
    ['underscore', 'snake_case title', 'A'],
    ['noUnderscore', 'snakeXcase title', 'B'],
    ['backslash', 'back\\slash', 'A'],
    ['quoteNeedle', "O'Brien NEEDLE", 'Hidden'],
    ['other', 'Other', 'B'],
  ];

  const queryMovies = async (
    filter: MovieFilter,
    variables: Record<string, unknown> = { orderBy: ['ID_ASC'] },
    requestContext = defaultRequestContext,
  ): Promise<{ ids: number[]; result: Record<string, unknown> }> => {
    const resp = await ctx.runGqlQuery(
      MOVIES,
      { filter, ...variables },
      requestContext,
    );
    expect(resp.errors).toBeFalsy();
    const result = resp.data?.movies;
    return {
      ids: result.edges.map(
        (edge: { node: { id: number } }) => edge.node.id,
      ),
      result,
    };
  };

  const idsOf = (...keys: string[]): number[] =>
    keys.map((key) => ids[key]).sort((a, b) => a - b);

  const callCandidateFunction = async (
    permission: string,
    pattern: string,
  ): Promise<number[]> =>
    ctx.executeGqlSql(
      createTestUser(ctx.config.serviceId, {
        permissions: { [ctx.config.serviceId]: [permission] },
      }),
      async (client) => {
        const { rows } = await client.query(
          'SELECT app_hidden.movie_ids_matching_title($1) AS id',
          [pattern],
        );
        return rows.map((row) => row.id as number).sort((a, b) => a - b);
      },
    );

  beforeAll(async () => {
    const storeInboxMessage: StoreInboxMessage = vi.fn(async () => undefined);
    ctx = await createTestContext({}, undefined, storeInboxMessage);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    vi.spyOn(tokenHelpers, 'getLongLivedToken').mockImplementation(
      async () => 'test-long-lived-token',
    );

    // Reproduce providers such as Aurora where pg_catalog.texticlike is not
    // LEAKPROOF. This only changes the isolated database of this spec file.
    const rootUrl = new URL(ctx.config.pgRootConnectionString);
    rootUrl.pathname = `/${ctx.config.dbName}`;
    rootClient = new Client({ connectionString: rootUrl.toString() });
    await rootClient.connect();
    const { rows } = await rootClient.query(
      `SELECT proleakproof FROM pg_proc WHERE oid = 'pg_catalog.texticlike(text, text)'::regprocedure`,
    );
    originalTexticlikeLeakproof = rows[0].proleakproof;
    await rootClient.query(
      'ALTER FUNCTION pg_catalog.texticlike(text, text) NOT LEAKPROOF',
    );
  });

  beforeEach(async () => {
    for (const [key, title, studio] of seed) {
      const movie = await insert('movies', { title, studio }).run(
        ctx.ownerPool,
      );
      ids[key] = movie.id;
    }
    await insert('movies_tags', [
      { movie_id: ids.needleHaystack, name: 'tagged' },
      { movie_id: ids.haystack, name: 'tagged' },
      { movie_id: ids.needle, name: 'other' },
    ]).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await rootClient.query(
      `ALTER FUNCTION pg_catalog.texticlike(text, text) ${
        originalTexticlikeLeakproof ? 'LEAKPROOF' : 'NOT LEAKPROOF'
      }`,
    );
    await rootClient.end();
    await ctx.dispose();
  });

  describe('schema', () => {
    it('adds titleIncludesInsensitive only to MovieFilter', () => {
      const movieFilter = ctx.schema.getType(
        'MovieFilter',
      ) as GraphQLInputObjectType;
      const field = movieFilter.getFields().titleIncludesInsensitive;
      expect(field.type.toString()).toBe('String');
      expect(movieFilter.getFields().title.type.toString()).toBe(
        'StringFilter',
      );

      for (const typeName of ['StringFilter', 'TvshowFilter', 'EpisodeFilter']) {
        const type = ctx.schema.getType(typeName) as GraphQLInputObjectType;
        expect(Object.keys(type.getFields())).not.toContain(
          'titleIncludesInsensitive',
        );
      }
    });

    it('does not expose the candidate function as a GraphQL field', () => {
      const rootFields = [
        ...Object.keys(ctx.schema.getQueryType()?.getFields() ?? {}),
        ...Object.keys(ctx.schema.getMutationType()?.getFields() ?? {}),
      ];
      expect(
        rootFields.filter((name) => /matchingTitle/i.test(name)),
      ).toEqual([]);
    });
  });

  describe('matching', () => {
    it.each([
      ['needle', ['needleHaystack', 'needle', 'quoteNeedle']],
      ['NEEDLE', ['needleHaystack', 'needle', 'quoteNeedle']],
      ['hay', ['needleHaystack', 'haystack']],
      ['%', ['percentJuice']],
      ['100%', ['percentJuice']],
      ['_', ['underscore']],
      ['e_c', ['underscore']],
      ["'", ['quoteNeedle']],
      ["' OR 1=1 --", []],
      ['zz-no-match', []],
      ['needle in a haystack plus', []],
    ])(
      'term %j -> same movies as title.includesInsensitive',
      async (term, expectedKeys) => {
        const [actual, expected] = await Promise.all([
          queryMovies(indexed(term)),
          queryMovies(legacy(term)),
        ]);
        expect(actual.ids).toEqual(idsOf(...expectedKeys));
        expect(actual.result).toEqual(expected.result);
      },
    );

    it.each(['\\', 'k\\s', '\\%', ''])(
      'term %j -> same movies as title.includesInsensitive',
      async (term) => {
        const [actual, expected] = await Promise.all([
          queryMovies(indexed(term)),
          queryMovies(legacy(term)),
        ]);
        expect(actual.result).toEqual(expected.result);
      },
    );

    it('empty term -> matches every movie like title.includesInsensitive', async () => {
      const { ids: actual } = await queryMovies(indexed(''));
      expect(actual).toEqual(Object.values(ids).sort((a, b) => a - b));
    });

    it('null term -> rejected like title.includesInsensitive', async () => {
      const [actual, expected] = await Promise.all([
        ctx.runGqlQuery(
          MOVIES,
          { filter: { titleIncludesInsensitive: null } },
          defaultRequestContext,
        ),
        ctx.runGqlQuery(
          MOVIES,
          { filter: { title: { includesInsensitive: null } } },
          defaultRequestContext,
        ),
      ]);
      expect(actual.errors?.[0].message).toBe(
        'Null literals are forbidden in filter argument input.',
      );
      expect(actual.errors?.[0].message).toBe(expected.errors?.[0].message);
    });
  });

  describe('composition', () => {
    it.each<[string, (t: TitleClause) => MovieFilter]>([
      ['implicit and', (t) => ({ ...t('needle'), studio: { equalTo: 'A' } })],
      ['and', (t) => ({ and: [t('needle'), { studio: { equalTo: 'A' } }] })],
      ['or', (t) => ({ or: [t('needle'), { studio: { equalTo: 'B' } }] })],
      ['not', (t) => ({ not: t('needle') })],
      ['not or', (t) => ({ not: { or: [t('hay'), t('100')] } })],
      [
        'backward relation',
        (t) => ({
          ...t('needle'),
          moviesTags: { some: { name: { equalTo: 'tagged' } } },
        }),
      ],
      [
        'or inside backward relation sibling',
        (t) => ({
          or: [
            { moviesTags: { some: { name: { equalTo: 'other' } } } },
            t('hay'),
          ],
        }),
      ],
    ])('%s -> same movies as legacy filter', async (_name, build) => {
      const [actual, expected] = await Promise.all([
        queryMovies(build(indexed)),
        queryMovies(build(legacy)),
      ]);
      expect(actual.ids.length).toBeGreaterThan(0);
      expect(actual.result).toEqual(expected.result);
    });

    it('forward relation filter -> same movie tags as legacy filter', async () => {
      const [actual, expected] = await Promise.all([
        ctx.runGqlQuery(
          MOVIES_TAGS,
          { filter: { movie: indexed('needle') } },
          defaultRequestContext,
        ),
        ctx.runGqlQuery(
          MOVIES_TAGS,
          { filter: { movie: legacy('needle') } },
          defaultRequestContext,
        ),
      ]);
      expect(actual.errors).toBeFalsy();
      expect(actual.data?.moviesTags.nodes).toEqual([
        { movieId: ids.needleHaystack, name: 'tagged' },
        { movieId: ids.needle, name: 'other' },
      ]);
      expect(actual.data).toEqual(expected.data);
    });

    it('ordered pages -> same counts, cursors and pages as legacy filter', async () => {
      const page = async (
        t: TitleClause,
        after?: string,
      ): Promise<Record<string, unknown>> =>
        (
          await queryMovies(t('e'), {
            orderBy: ['TITLE_ASC'],
            first: 3,
            after,
          })
        ).result;

      const firstPage = await page(indexed);
      expect(firstPage).toEqual(await page(legacy));
      expect(firstPage.totalCount).toBe(8);

      const cursor = (firstPage.pageInfo as { endCursor: string }).endCursor;
      const secondPage = await page(indexed, cursor);
      expect(secondPage).toEqual(await page(legacy, cursor));
      expect(secondPage.edges).toHaveLength(3);
    });
  });

  describe('bulk actions', () => {
    const filter = {
      or: [indexed('needle'), { studio: { equalTo: 'Hidden' } }],
    };

    it('deleteMovies -> selects the filtered movies', async () => {
      const resp = await ctx.runGqlQuery(
        DELETE_MOVIES,
        { filter },
        defaultRequestContext,
      );
      expect(resp.errors).toBeFalsy();
      expect(resp.data?.deleteMovies.affectedIds).toIncludeSameMembers(
        idsOf('needleHaystack', 'needle', 'quoteNeedle'),
      );
    });

    it('createMovieSnapshots -> selects the filtered movies', async () => {
      const resp = await ctx.runGqlQuery(
        CREATE_MOVIE_SNAPSHOTS,
        { filter },
        defaultRequestContext,
      );
      expect(resp.errors).toBeFalsy();
      expect(
        resp.data?.createMovieSnapshots.affectedIds,
      ).toIncludeSameMembers(idsOf('needleHaystack', 'needle', 'quoteNeedle'));
    });

    it('bulkEditMoviesAsync -> selects the filtered movies', async () => {
      const resp = await ctx.runGqlQuery(
        BULK_EDIT_MOVIES,
        { filter },
        defaultRequestContext,
      );
      expect(resp.errors).toBeFalsy();
      expect(
        resp.data?.bulkEditMoviesAsync.filterMatchedIds.map(Number),
      ).toIncludeSameMembers(idsOf('needleHaystack', 'needle', 'quoteNeedle'));
    });
  });

  describe('authorization', () => {
    it('user without movie permissions -> query is denied', async () => {
      const resp = await ctx.runGqlQuery(
        MOVIES,
        { filter: indexed('needle') },
        createTestRequestContext(
          ctx.config.serviceId,
          createTestUser(ctx.config.serviceId, {
            permissions: { [ctx.config.serviceId]: ['SETTINGS_VIEW'] },
          }),
        ),
      );
      expect(resp.errors?.length).toBeGreaterThan(0);
      expect(resp.data?.movies).toBeFalsy();
    });

    it('candidate function without movie permissions -> raises an error', async () => {
      await expect(
        callCandidateFunction('SETTINGS_VIEW', '%needle%'),
      ).rejects.toThrow(
        'At least one of these permissions must be granted: MOVIES_VIEW,MOVIES_EDIT,ADMIN',
      );
      await expect(
        callCandidateFunction('MOVIES_VIEW', '%needle%'),
      ).resolves.toEqual(idsOf('needleHaystack', 'needle', 'quoteNeedle'));
    });

    it('additional restrictive policy -> applied to the filtered movies', async () => {
      await ctx.ownerPool.query(
        `CREATE POLICY title_search_spec_restriction ON app_public.movies AS RESTRICTIVE FOR SELECT
         USING (studio IS DISTINCT FROM 'Hidden')`,
      );
      try {
        const [actual, expected] = await Promise.all([
          queryMovies(indexed('needle')),
          queryMovies(legacy('needle')),
        ]);
        expect(actual.ids).toEqual(idsOf('needleHaystack', 'needle'));
        expect(actual.result).toEqual(expected.result);

        // The candidate IDs themselves are not restricted by additional
        // policies. Only the outer movies query applies them.
        await expect(
          callCandidateFunction('ADMIN', '%needle%'),
        ).resolves.toEqual(idsOf('needleHaystack', 'needle', 'quoteNeedle'));
      } finally {
        await ctx.ownerPool.query(
          'DROP POLICY title_search_spec_restriction ON app_public.movies',
        );
      }
    });

    it('candidate function -> definer rights, fixed search path and no public execute', async () => {
      const { rows } = await ctx.ownerPool.query(
        `SELECT
           p.prosecdef,
           p.proconfig,
           p.proleakproof,
           owner.rolsuper AS owner_is_superuser,
           owner.rolbypassrls AS owner_bypasses_rls,
           p.proowner = c.relowner AS owned_by_table_owner,
           c.relrowsecurity,
           c.relforcerowsecurity,
           has_function_privilege($1, p.oid, 'EXECUTE') AS gql_role_can_execute,
           p.proacl IS NULL
             OR EXISTS (SELECT 1 FROM aclexplode(p.proacl) acl WHERE acl.grantee = 0) AS public_can_execute
         FROM pg_proc p
         JOIN pg_roles owner ON owner.oid = p.proowner
         CROSS JOIN pg_class c
         WHERE p.oid = 'app_hidden.movie_ids_matching_title(text)'::regprocedure
           AND c.oid = 'app_public.movies'::regclass`,
        [ctx.config.dbGqlRole],
      );
      expect(rows).toEqual([
        {
          prosecdef: true,
          proconfig: ['search_path=pg_catalog, pg_temp'],
          proleakproof: false,
          owner_is_superuser: false,
          owner_bypasses_rls: false,
          owned_by_table_owner: true,
          relrowsecurity: true,
          relforcerowsecurity: false,
          gql_role_can_execute: true,
          public_can_execute: false,
        },
      ]);
    });
  });

  describe('trigram index without LEAKPROOF texticlike', () => {
    it('texticlike is not leakproof in this database', async () => {
      const { rows } = await rootClient.query(
        `SELECT proleakproof FROM pg_proc WHERE oid = 'pg_catalog.texticlike(text, text)'::regprocedure`,
      );
      expect(rows[0].proleakproof).toBe(false);
    });

    it('selective term on a larger table -> only the candidate function uses the trigram index', async () => {
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
        rowLevelSecurityPlan = rows
          .map((row) => row['QUERY PLAN'])
          .join('\n');
        await rootClient.query(
          'SELECT app_hidden.movie_ids_matching_title($1)',
          ['%needle%'],
        );
      } finally {
        await rootClient.query('ROLLBACK');
        rootClient.off('notice', onNotice);
      }

      expect(rowLevelSecurityPlan).toContain('Seq Scan on movies');
      expect(rowLevelSecurityPlan).not.toContain('idx_trgm_movies_title');
      expect(
        notices.find((notice) =>
          notice.includes(
            'Query Text: SELECT id FROM app_public.movies WHERE title ILIKE',
          ),
        ),
      ).toContain('Bitmap Index Scan on idx_trgm_movies_title');
    });
  });
});
