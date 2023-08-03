import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../common';
import { createTestContext, ITestContext } from '../test-utils';

const MOVIE_GENRE_REQUEST = gql`
  query MovieGenreLocalization($locale: String!) {
    movieGenres {
      nodes {
        localization(locale: $locale) {
          title
        }
      }
    }
  }
`;

describe('Movie genre Localization Graphql Requests', () => {
  let ctx: ITestContext;
  const movieGenreId = 'movie-genre-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('movie_genre', { id: movieGenreId }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    await insert('movie_genre_localizations', {
      movie_genre_id: movieGenreId,
      title: 'Default title',
      locale: DEFAULT_LOCALE_TAG,
      is_default_locale: true,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx?.truncate('movie_genre_localizations');
  });

  afterAll(async () => {
    await ctx?.truncate('movie_genre');
    await ctx?.dispose();
  });

  it('Movie genre with only default localization and empty filter -> default localization returned', async () => {
    // Act
    const resp = await ctx.runGqlQuery(MOVIE_GENRE_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movieGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });

  it('Movie genre with 2 localizations and empty filter -> default localization returned', async () => {
    // Arrange
    await insert('movie_genre_localizations', {
      movie_genre_id: movieGenreId,
      title: 'Localized title',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(MOVIE_GENRE_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movieGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });

  it('Movie genre with 2 localizations and no filter -> default localization returned', async () => {
    // Arrange
    await insert('movie_genre_localizations', {
      movie_genre_id: movieGenreId,
      title: 'Localized title',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      gql`
        query MovieGenreLocalization {
          movieGenres {
            nodes {
              localization {
                title
              }
            }
          }
        }
      `,
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movieGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });

  it('Movie genre with 3 localizations and valid filter -> selected non-default localization returned', async () => {
    // Arrange
    await insert('movie_genre_localizations', [
      {
        movie_genre_id: movieGenreId,
        title: 'Localized title',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        movie_genre_id: movieGenreId,
        title: 'Localized title 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(MOVIE_GENRE_REQUEST, {
      locale: 'de-DE',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movieGenres.nodes).toEqual([
      {
        localization: {
          title: 'Localized title',
        },
      },
    ]);
  });

  it('Movie genre with 3 localizations and non-existent locale filter -> default localization returned', async () => {
    // Arrange
    await insert('movie_genre_localizations', [
      {
        movie_genre_id: movieGenreId,
        title: 'Localized title',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        movie_genre_id: movieGenreId,
        title: 'Localized title 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(MOVIE_GENRE_REQUEST, {
      locale: 'asdf',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.movieGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });
});
