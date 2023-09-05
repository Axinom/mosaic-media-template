import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../common';
import { createTestContext, ITestContext } from '../test-utils';

const TVSHOW_GENRE_REQUEST = gql`
  query TvshowGenreLocalization($locale: String!) {
    tvshowGenres {
      nodes {
        localization(locale: $locale) {
          title
        }
      }
    }
  }
`;

describe('Tvshow genre Localization Graphql Requests', () => {
  let ctx: ITestContext;
  const tvshowGenreId = 'tvshow-genre-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('tvshow_genre', { id: tvshowGenreId }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    await insert('tvshow_genre_localizations', {
      tvshow_genre_id: tvshowGenreId,
      title: 'Default title',
      locale: DEFAULT_LOCALE_TAG,
      is_default_locale: true,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx?.truncate('tvshow_genre_localizations');
  });

  afterAll(async () => {
    await ctx?.truncate('tvshow_genre');
    await ctx?.dispose();
  });

  it('Tvshow genre with only default localization and empty filter -> default localization returned', async () => {
    // Act
    const resp = await ctx.runGqlQuery(TVSHOW_GENRE_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.tvshowGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });

  it('Tvshow genre with 2 localizations and empty filter -> default localization returned', async () => {
    // Arrange
    await insert('tvshow_genre_localizations', {
      tvshow_genre_id: tvshowGenreId,
      title: 'Localized title',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(TVSHOW_GENRE_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.tvshowGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });

  it('Tvshow genre with 2 localizations and no filter -> default localization returned', async () => {
    // Arrange
    await insert('tvshow_genre_localizations', {
      tvshow_genre_id: tvshowGenreId,
      title: 'Localized title',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      gql`
        query TvshowGenreLocalization {
          tvshowGenres {
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

    expect(resp?.data?.tvshowGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });

  it('Tvshow genre with 3 localizations and valid filter -> selected non-default localization returned', async () => {
    // Arrange
    await insert('tvshow_genre_localizations', [
      {
        tvshow_genre_id: tvshowGenreId,
        title: 'Localized title',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        tvshow_genre_id: tvshowGenreId,
        title: 'Localized title 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(TVSHOW_GENRE_REQUEST, {
      locale: 'de-DE',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.tvshowGenres.nodes).toEqual([
      {
        localization: {
          title: 'Localized title',
        },
      },
    ]);
  });

  it('Tvshow genre with 3 localizations and non-existent locale filter -> default localization returned', async () => {
    // Arrange
    await insert('tvshow_genre_localizations', [
      {
        tvshow_genre_id: tvshowGenreId,
        title: 'Localized title',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        tvshow_genre_id: tvshowGenreId,
        title: 'Localized title 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(TVSHOW_GENRE_REQUEST, {
      locale: 'asdf',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.tvshowGenres.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
        },
      },
    ]);
  });
});
