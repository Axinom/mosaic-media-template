import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import {
  DEFAULT_LOCALE_TAG,
  MOSAIC_LOCALE_HEADER_KEY,
  syncInMemoryLocales,
} from '../../common';
import { createTestContext, ITestContext } from '../test-utils';

const MOVIE_REQUEST = gql`
  query MovieLocalization {
    movies {
      nodes {
        description
        synopsis
        title
      }
    }
  }
`;

describe('Movie Localization Graphql Requests', () => {
  let ctx: ITestContext;
  const movieId = 'movie-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('movie', { id: movieId }).run(ctx.ownerPool);
    await syncInMemoryLocales(
      [
        { language_tag: DEFAULT_LOCALE_TAG, is_default_locale: true },
        { language_tag: 'de-DE', is_default_locale: false },
        { language_tag: 'et-EE', is_default_locale: false },
      ],
      ctx.ownerPool,
    );
  });

  beforeEach(async () => {
    await insert('movie_localizations', {
      movie_id: movieId,
      title: 'Default title',
      description: 'Default description',
      synopsis: 'Default synopsis',
      locale: DEFAULT_LOCALE_TAG,
      is_default_locale: true,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx?.truncate('movie_localizations');
  });

  afterAll(async () => {
    await ctx?.truncate('movie');
    await ctx?.dispose();
  });

  const getRequestContext = (locale: string) => {
    return {
      headers: {
        [MOSAIC_LOCALE_HEADER_KEY]: locale,
      },
    };
  };

  it('Movie with only default localization and empty filter -> default localization returned', async () => {
    // Act
    const resp = await ctx.runGqlQuery(
      MOVIE_REQUEST,
      {},
      getRequestContext(''),
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movies.nodes).toEqual([
      {
        title: 'Default title',
        synopsis: 'Default synopsis',
        description: 'Default description',
      },
    ]);
  });

  it('Movie with 2 localizations and empty filter -> default localization returned', async () => {
    // Arrange
    await insert('movie_localizations', {
      movie_id: movieId,
      title: 'Localized title',
      synopsis: 'Localized synopsis',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      MOVIE_REQUEST,
      {},
      getRequestContext(''),
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movies.nodes).toEqual([
      {
        title: 'Default title',
        synopsis: 'Default synopsis',
        description: 'Default description',
      },
    ]);
  });

  it('Movie with 2 localizations and no filter -> default localization returned', async () => {
    // Arrange
    await insert('movie_localizations', {
      movie_id: movieId,
      title: 'Localized title',
      synopsis: 'Localized synopsis',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(MOVIE_REQUEST);

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movies.nodes).toEqual([
      {
        title: 'Default title',
        synopsis: 'Default synopsis',
        description: 'Default description',
      },
    ]);
  });

  it('Movie with 3 localizations and valid filter -> selected non-default localization returned', async () => {
    // Arrange
    await insert('movie_localizations', [
      {
        movie_id: movieId,
        title: 'Localized title',
        synopsis: 'Localized synopsis',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        movie_id: movieId,
        title: 'Localized title 2',
        synopsis: 'Localized synopsis 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      MOVIE_REQUEST,
      {},
      getRequestContext('de-DE'),
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movies.nodes).toEqual([
      {
        title: 'Localized title',
        synopsis: 'Localized synopsis',
        description: 'Localized description',
      },
    ]);
  });

  it('Movie with 3 localizations and non-existent locale filter -> default localization returned', async () => {
    // Arrange
    await insert('movie_localizations', [
      {
        movie_id: movieId,
        title: 'Localized title',
        synopsis: 'Localized synopsis',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        movie_id: movieId,
        title: 'Localized title 2',
        synopsis: 'Localized synopsis 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      MOVIE_REQUEST,
      {},
      getRequestContext('asdf'),
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movies.nodes).toEqual([
      {
        title: 'Default title',
        synopsis: 'Default synopsis',
        description: 'Default description',
      },
    ]);
  });
});
