import gql from 'graphql-tag';
import 'jest-extended';
import { insert } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../common';
import { createTestContext, ITestContext } from '../test-utils';

const CHANNEL_REQUEST = gql`
  query ChannelLocalization($locale: String!) {
    channels {
      nodes {
        localization(locale: $locale) {
          description
          title
        }
      }
    }
  }
`;

describe('Channel Localization Graphql Requests', () => {
  let ctx: ITestContext;
  const channelId = 'channel-1';

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('channel', { id: channelId }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    await insert('channel_localizations', {
      channel_id: channelId,
      title: 'Default title',
      description: 'Default description',
      locale: DEFAULT_LOCALE_TAG,
      is_default_locale: true,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx?.truncate('channel_localizations');
  });

  afterAll(async () => {
    await ctx?.truncate('channel');
    await ctx.dispose();
  });

  it('Channel with only default localization and empty filter -> default localization returned', async () => {
    // Act
    const resp = await ctx.runGqlQuery(CHANNEL_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.channels.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Channel with only 2 localizations and empty filter -> default localization returned', async () => {
    // Arrange
    await insert('channel_localizations', {
      channel_id: channelId,
      title: 'Localized title',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(CHANNEL_REQUEST, {
      locale: '',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.channels.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Channel with only 2 localizations and no filter -> default localization returned', async () => {
    // Arrange
    await insert('channel_localizations', {
      channel_id: channelId,
      title: 'Localized title',
      description: 'Localized description',
      locale: 'de-DE',
      is_default_locale: false,
    }).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(
      gql`
        query ChannelLocalization {
          channels {
            nodes {
              localization {
                description
                title
              }
            }
          }
        }
      `,
    );

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.channels.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          description: 'Default description',
        },
      },
    ]);
  });

  it('Channel with only 3 localizations and valid filter -> selected non-default localization returned', async () => {
    // Arrange
    await insert('channel_localizations', [
      {
        channel_id: channelId,
        title: 'Localized title',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        channel_id: channelId,
        title: 'Localized title 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(CHANNEL_REQUEST, {
      locale: 'de-DE',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.channels.nodes).toEqual([
      {
        localization: {
          title: 'Localized title',
          description: 'Localized description',
        },
      },
    ]);
  });

  it('Channel with only 3 localizations and non-existent locale filter -> default localization returned', async () => {
    // Arrange
    await insert('channel_localizations', [
      {
        channel_id: channelId,
        title: 'Localized title',
        description: 'Localized description',
        locale: 'de-DE',
        is_default_locale: false,
      },
      {
        channel_id: channelId,
        title: 'Localized title 2',
        description: 'Localized description 2',
        locale: 'et-EE',
        is_default_locale: false,
      },
    ]).run(ctx.ownerPool);

    // Act
    const resp = await ctx.runGqlQuery(CHANNEL_REQUEST, {
      locale: 'asdf',
    });

    // Assert
    expect(resp.errors).toBeFalsy();

    expect(resp?.data?.channels.nodes).toEqual([
      {
        localization: {
          title: 'Default title',
          description: 'Default description',
        },
      },
    ]);
  });
});
