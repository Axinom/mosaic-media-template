import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../common';
import { createTestContext, ITestContext } from '../test-utils';

const SEASON_REQUEST = gql`
  query SeasonLocalization($locale: String!) {
    seasons {
      nodes {
        localization(locale: $locale) {
          description
          synopsis
        }
      }
    }
  }
`;

describe('Season Localization Graphql Requests', () => {
  let ctx: ITestContext;
  const seasonId = 'season-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('season', { id: seasonId }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    await insert('season_localizations', {
      season_id: seasonId,
      description: 'Default description',
      synopsis: 'Default synopsis',
      locale: DEFAULT_LOCALE_TAG,
      is_default_locale: true,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx?.truncate('season_localizations');
  });

  afterAll(async () => {
    await ctx?.truncate('season');
    await ctx?.dispose();
  });

  it('Season with only default localization and empty filter -> default localization returned', async () => {
    // Act
    const resp = await ctx.runGqlQuery(SEASON_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.seasons.nodes).toEqual([
      {
        localization: {
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Season with 2 localizations and empty filter -> default localization returned', async () => {
    // Arrange
    await insert('season_localizations', {
      season_id: seasonId,
      synopsis: 'Localized synopsis',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(SEASON_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.seasons.nodes).toEqual([
      {
        localization: {
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Season with 2 localizations and no filter -> default localization returned', async () => {
    // Arrange
    await insert('season_localizations', {
      season_id: seasonId,
      synopsis: 'Localized synopsis',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      gql`
        query SeasonLocalization {
          seasons {
            nodes {
              localization {
                description
                synopsis
              }
            }
          }
        }
      `,
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.seasons.nodes).toEqual([
      {
        localization: {
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Season with 3 localizations and valid filter -> selected non-default localization returned', async () => {
    // Arrange
    await insert('season_localizations', [
      {
        season_id: seasonId,
        synopsis: 'Localized synopsis',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        season_id: seasonId,
        synopsis: 'Localized synopsis 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(SEASON_REQUEST, {
      locale: 'de-DE',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.seasons.nodes).toEqual([
      {
        localization: {
          synopsis: 'Localized synopsis',
          description: 'Localized description',
        },
      },
    ]);
  });

  it('Season with 3 localizations and non-existent locale filter -> default localization returned', async () => {
    // Arrange
    await insert('season_localizations', [
      {
        season_id: seasonId,
        synopsis: 'Localized synopsis',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        season_id: seasonId,
        synopsis: 'Localized synopsis 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(SEASON_REQUEST, {
      locale: 'asdf',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.seasons.nodes).toEqual([
      {
        localization: {
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });
});
