import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../common';
import { createTestContext, ITestContext } from '../test-utils';

const COLLECTION_REQUEST = gql`
  query CollectionLocalization($locale: String!) {
    collections {
      nodes {
        localization(locale: $locale) {
          description
          synopsis
          title
        }
      }
    }
  }
`;

describe('Collection Localization Graphql Requests', () => {
  let ctx: ITestContext;
  const collectionId = 'collection-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('collection', { id: collectionId }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    await insert('collection_localizations', {
      collection_id: collectionId,
      title: 'Default title',
      description: 'Default description',
      synopsis: 'Default synopsis',
      locale: DEFAULT_LOCALE_TAG,
      is_default_locale: true,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx?.truncate('collection_localizations');
  });

  afterAll(async () => {
    await ctx?.truncate('collection');
    await ctx?.dispose();
  });

  it('Collection with only default localization and empty filter -> default localization returned', async () => {
    // Act
    const resp = await ctx.runGqlQuery(COLLECTION_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.collections.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Collection with 2 localizations and empty filter -> default localization returned', async () => {
    // Arrange
    await insert('collection_localizations', {
      collection_id: collectionId,
      title: 'Localized title',
      synopsis: 'Localized synopsis',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(COLLECTION_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.collections.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Collection with 2 localizations and no filter -> default localization returned', async () => {
    // Arrange
    await insert('collection_localizations', {
      collection_id: collectionId,
      title: 'Localized title',
      synopsis: 'Localized synopsis',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      gql`
        query CollectionLocalization {
          collections {
            nodes {
              localization {
                description
                synopsis
                title
              }
            }
          }
        }
      `,
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.collections.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Collection with 3 localizations and valid filter -> selected non-default localization returned', async () => {
    // Arrange
    await insert('collection_localizations', [
      {
        collection_id: collectionId,
        title: 'Localized title',
        synopsis: 'Localized synopsis',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        collection_id: collectionId,
        title: 'Localized title 2',
        synopsis: 'Localized synopsis 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(COLLECTION_REQUEST, {
      locale: 'de-DE',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.collections.nodes).toEqual([
      {
        localization: {
          title: 'Localized title',
          synopsis: 'Localized synopsis',
          description: 'Localized description',
        },
      },
    ]);
  });

  it('Collection with 3 localizations and non-existent locale filter -> default localization returned', async () => {
    // Arrange
    await insert('collection_localizations', [
      {
        collection_id: collectionId,
        title: 'Localized title',
        synopsis: 'Localized synopsis',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        collection_id: collectionId,
        title: 'Localized title 2',
        synopsis: 'Localized synopsis 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(COLLECTION_REQUEST, {
      locale: 'asdf',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.collections.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          synopsis: 'Default synopsis',
          description: 'Default description',
        },
      },
    ]);
  });
});
