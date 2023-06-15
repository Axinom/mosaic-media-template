import {
  getFirstMockResult,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import { ClientError } from 'graphql-request';
import {
  GraphQLRequestContext,
  GraphQLResponse,
} from 'graphql-request/dist/types';
import gql from 'graphql-tag';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { v4 as uuid } from 'uuid';
import { insert } from 'zapatos/db';
import { CommonErrors } from '../../common';
import {
  ENTITY_TYPE_CHANNELS,
  ENTITY_TYPE_EPISODES,
  ENTITY_TYPE_MOVIES,
} from '../../domains';
import {
  getSdk as getBillingSdk,
  Sdk as BillingSdk,
} from '../../generated/graphql/billing';
import {
  getSdk as getCatalogSdk,
  Sdk as CatalogSdk,
} from '../../generated/graphql/catalog';
import {
  createTestContext,
  createTestEndUser,
  ITestContext,
  TestRequestContext,
} from '../../tests/test-utils';
import { getPolicy } from './entitlement-endpoint/entitlement-message-generation';

// mock the sdk to return values to be tested, emulating catalog response
let catalogCall: any = () => undefined;
jest.mock('../../generated/graphql/catalog');
const catalogStub = stub<CatalogSdk>({
  GetEpisodeMainVideo: () => catalogCall(),
  GetMovieMainVideo: () => catalogCall(),
  GetChannelVideo: () => catalogCall(),
});
const catalogMock = getCatalogSdk as jest.MockedFunction<typeof getCatalogSdk>;
catalogMock.mockReturnValue(catalogStub);

// mock the sdk to return values to be tested, emulating billing response
let billingCall: any = () => undefined;
jest.mock('../../generated/graphql/billing');
const billingStub = stub<BillingSdk>({
  GetActiveSubscription: () => billingCall(),
});
const billingMock = getBillingSdk as jest.MockedFunction<typeof getBillingSdk>;
billingMock.mockReturnValue(billingStub);

let countryCode: string | undefined = 'LK';
// Mock geoip-country.lookup which is used in entitlement-endpoint.
jest.mock('geoip-country', () => ({
  lookup: (_ip: string) => {
    return { country: countryCode };
  },
}));

const ENTITLEMENT_REQUEST = gql`
  query Entitlement($input: EntitlementInput) {
    entitlement(input: $input) {
      entitlementMessageJwt
    }
  }
`;

describe('EntitlementEndpointPlugin', () => {
  let ctx: ITestContext;
  let ipTestCtx: ITestContext;
  let errorOverride: jest.SpyInstance;
  let warnOverride: jest.SpyInstance;
  let debugOverride: jest.SpyInstance;
  let expectedJwtPayload: (persistence: boolean, keyIds?: string[]) => unknown;
  const jwtRegex =
    /([A-Za-z0-9]{36,})\.([A-Za-z0-9]{100,})\.([A-Za-z0-9-_]{40,})/gi;
  let defaultRequestContext: TestRequestContext;
  const subscriptionPlanId = 'fadf7cc2-f84c-42ac-8de1-7884b08873b2';
  const keyId1 = '68945fc1-2337-4685-8dac-31cb808dc747';
  const keyId2 = '856358bf-f44b-4f26-a18e-d427ef50acc2';
  const videoStreams = {
    nodes: [
      {
        keyId: keyId1,
        file: 'dash/audio-de.mp4',
        format: 'DASH_ON_DEMAND',
        label: 'audio',
        bitrateInKbps: null,
        iv: 'E32805950106648E',
        languageCode: 'de',
      },
      {
        keyId: keyId2,
        file: 'dash/video-H264-240-300k.mp4',
        format: 'DASH_ON_DEMAND',
        label: 'SD',
        bitrateInKbps: 300,
        iv: 'E32805950106648E',
        languageCode: null,
      },
      {
        keyId: null,
        file: 'dash/subtitle-de_init.mp4',
        format: 'DASH',
        label: 'subtitle',
        bitrateInKbps: 0,
        iv: null,
        languageCode: 'de',
      },
      {
        keyId: undefined,
        file: 'dash/caption-en_init.mp4',
        format: 'DASH',
        label: 'closed-caption',
        bitrateInKbps: 0,
        iv: null,
        languageCode: 'en',
      },
      {
        keyId: '',
        file: 'dash/caption-de_init.mp4',
        format: 'DASH',
        label: 'closed-caption',
        bitrateInKbps: 0,
        iv: null,
        languageCode: 'de',
      },
    ],
  };
  const channelId = uuid();

  beforeAll(async () => {
    ctx = await createTestContext({
      MOSAIC_TESTING_IP_ENABLED: 'false',
      DRM_LICENSE_COMMUNICATION_KEY: 'secret_key',
    });
    ipTestCtx = await createTestContext({
      MOSAIC_TESTING_IP_ENABLED: 'true',
      DRM_LICENSE_COMMUNICATION_KEY: 'secret_key',
    });
    defaultRequestContext = {
      ip: '95.235.33.161', // IT
      authContext: {
        subject: createTestEndUser(),
      },
      token: 'mock_token',
    };

    const policy = getPolicy('DEFAULT');
    expectedJwtPayload = (persistence: boolean, keyIds = [keyId1, keyId2]) => ({
      version: 1,
      com_key_id: ctx.config.drmLicenseCommunicationKeyId,
      message: {
        type: 'entitlement_message',
        version: 2,
        license: {
          allow_persistence: persistence,
        },
        content_keys_source: {
          inline: keyIds.map((keyId) => ({
            id: keyId,
            usage_policy: 'Policy A',
          })),
        },
        content_key_usage_policies: [
          {
            name: 'Policy A',
            ...policy,
          },
        ],
      },
    });

    await insert('subscription_plans', {
      id: subscriptionPlanId,
      title: 'Test Plan',
      claim_set_keys: ['TEST'],
    }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    errorOverride = jest
      .spyOn(console, 'error')
      .mockImplementation((obj) => JSON.parse(obj));
    warnOverride = jest
      .spyOn(console, 'warn')
      .mockImplementation((obj) => JSON.parse(obj));
    debugOverride = jest
      .spyOn(console, 'debug')
      .mockImplementation((obj) => JSON.parse(obj));
    catalogCall = () => undefined;
    billingCall = () => ({
      data: { subscriptions: { nodes: [{ subscriptionPlanId }] } },
    });
    await insert('claim_sets', {
      key: 'TEST',
      title: 'test',
      claims: [ENTITY_TYPE_MOVIES, ENTITY_TYPE_CHANNELS, ENTITY_TYPE_EPISODES],
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('claim_sets');
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await ctx.truncate('subscription_plans');
    await ctx.dispose();
    await ipTestCtx.dispose();
  });

  describe('Error cases', () => {
    it.each(['', ' '])(
      'Request with empty id -> error thrown and logged as WARN',
      async (entityId) => {
        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message: 'The provided entity ID is empty.',
            code: CommonErrors.EmptyEntityId.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(warnOverride);
        expect(loggedObject).toMatchObject({
          message: 'The provided entity ID is empty.',
          loglevel: 'WARN',
        });
      },
    );

    it.each([
      'season-1',
      'movie-',
      'episode-',
      '-234',
      'movie-21474836470', // Maximum numeric value is 2147483647, from SQL int4 type, which is 10 digits long. Checking 11 digits here.
      '68945fc1-237-4685-8dac-31cb808dc74d', // invalid uuid
    ])(
      'Request with invalid id -> error thrown and logged as WARN',
      async (entityId) => {
        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message: `The provided entity ID '${entityId}' is invalid. It must be either a UUID, or start with 'movie-' or 'episode-' followed by a number.`,
            code: CommonErrors.InvalidEntityId.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(warnOverride);
        expect(loggedObject).toMatchObject({
          message: `The provided entity ID '${entityId}' is invalid. It must be either a UUID, or start with 'movie-' or 'episode-' followed by a number.`,
          loglevel: 'WARN',
        });
      },
    );

    it.each([
      {
        errors: [{ message: 'Some catalog error occurred.' }],
        status: 200,
      },
      {
        data: { movie: null },
        errors: [{ message: 'Some catalog error occurred.' }],
        status: 200,
      },
    ])(
      'Response with catalog errors -> error thrown and logged as ERROR',
      async (response) => {
        // Arrange
        catalogCall = () => {
          throw new ClientError(response, {
            query: '',
          });
        };

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message:
              "Error(s) occurred while trying to retrieve the movie with ID 'movie-1' from the catalog service. Please contact the service support.",
            code: CommonErrors.CatalogErrors.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(errorOverride);
        expect(loggedObject).toMatchObject({
          message:
            "Error(s) occurred while trying to retrieve the movie with ID 'movie-1' from the catalog service. Please contact the service support.",
          loglevel: 'ERROR',
          error: {
            logInfo: { errors: [{ message: 'Some catalog error occurred.' }] },
          },
        });
      },
    );

    it.each([
      {
        errors: [{ message: 'Some billing error occurred.' }],
        status: 200,
      },
      {
        data: { movie: null },
        errors: [{ message: 'Some billing error occurred.' }],
        status: 200,
      },
    ])(
      'Response with billing errors -> error thrown and logged as ERROR',
      async (response) => {
        // Arrange
        catalogCall = () => ({
          data: {
            movie: {
              videos: {
                nodes: [{ isProtected: true, videoStreams }],
              },
            },
          },
        });
        billingCall = () => {
          throw new ClientError(response, {
            query: '',
          });
        };

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message:
              'Error(s) occurred while trying to retrieve active subscription from the billing service. Please contact the service support.',
            code: CommonErrors.BillingErrors.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(errorOverride);
        expect(loggedObject).toMatchObject({
          message:
            'Error(s) occurred while trying to retrieve active subscription from the billing service. Please contact the service support.',
          loglevel: 'ERROR',
          error: {
            logInfo: {
              errors: [{ message: 'Some billing error occurred.' }],
            },
          },
        });
      },
    );

    it('Response with null movie -> error thrown and logged as WARN', async () => {
      // Arrange
      catalogCall = () => ({
        data: { movie: null },
      });

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: 'movie-1' } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.entitlement).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          message:
            "The movie with ID 'movie-1' cannot be retrieved. Please make sure that the movie is successfully published.",
          code: CommonErrors.EntityNotFound.code,
          path: ['entitlement'],
          details: undefined,
        },
      ]);

      const loggedObject = getFirstMockResult<any>(warnOverride);
      expect(loggedObject).toMatchObject({
        message:
          "The movie with ID 'movie-1' cannot be retrieved. Please make sure that the movie is successfully published.",
        loglevel: 'WARN',
      });
    });

    it('Response with null channel -> error thrown and logged as WARN', async () => {
      // Arrange
      catalogCall = () => ({
        data: { channel: null },
      });

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: channelId } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.entitlement).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          message: `The channel with ID '${channelId}' cannot be retrieved. Please make sure that the channel is successfully published.`,
          code: CommonErrors.EntityNotFound.code,
          path: ['entitlement'],
          details: undefined,
        },
      ]);

      const loggedObject = getFirstMockResult<any>(warnOverride);
      expect(loggedObject).toMatchObject({
        message: `The channel with ID '${channelId}' cannot be retrieved. Please make sure that the channel is successfully published.`,
        loglevel: 'WARN',
      });
    });

    it('Response with movie without videos -> error thrown and logged as ERROR', async () => {
      // Arrange
      catalogCall = () => ({
        data: { movie: { videos: { nodes: [] } } },
      });

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: 'movie-1' } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.entitlement).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          message:
            "The movie with ID 'movie-1' does not have a MAIN video. Please contact the service support.",
          code: CommonErrors.NoMainVideo.code,
          path: ['entitlement'],
          details: undefined,
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message:
          "The movie with ID 'movie-1' does not have a MAIN video. Please contact the service support.",
        loglevel: 'ERROR',
      });
    });

    it.each([{}, { keyId: null }])(
      'Response with channel with missing keyId -> error thrown and logged as WARN',
      async (channel) => {
        // Arrange
        catalogCall = () => ({
          data: { channel },
        });

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: channelId } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message: `The requested video for the channel with ID '${channelId}' is not protected. An entitlement message to receive a DRM license is therefore not required.`,
            code: CommonErrors.VideoNotProtected.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(warnOverride);
        expect(loggedObject).toMatchObject({
          message: `The requested video for the channel with ID '${channelId}' is not protected. An entitlement message to receive a DRM license is therefore not required.`,
          loglevel: 'WARN',
        });
      },
    );

    it.each([
      { keyId: 'test-value' },
      { keyId: 'test-value', dashStreamUrl: 'test-value' },
      { keyId: 'test-value', hlsStreamUrl: 'test-value' },
      { keyId: 'test-value', dashStreamUrl: 'test-value', hlsStreamUrl: null },
    ])(
      'Response with channel with missing stream urls -> error thrown and logged as WARN',
      async (channel) => {
        // Arrange
        catalogCall = () => ({
          data: { channel },
        });

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: channelId } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message: `The requested data for the channel with ID '${channelId}' does not have the required stream URLs. It is possible that the channel is still being processed.`,
            code: CommonErrors.ChannelStreamUnavailable.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(warnOverride);
        expect(loggedObject).toMatchObject({
          message: `The requested data for the channel with ID '${channelId}' does not have the required stream URLs. It is possible that the channel is still being processed.`,
          loglevel: 'WARN',
        });
      },
    );

    it('Response with no billing subscriptions -> error thrown and logged as ERROR', async () => {
      // Arrange
      catalogCall = () => ({
        data: {
          movie: {
            videos: {
              nodes: [{ isProtected: true, videoStreams }],
            },
          },
        },
      });
      billingCall = () => ({
        data: { subscriptions: { nodes: [] } },
      });

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: 'movie-1' } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.entitlement).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          message: 'User does not have an active subscription.',
          code: CommonErrors.SubscriptionValidationError.code,
          path: ['entitlement'],
          details: undefined,
        },
      ]);

      const loggedObject = getFirstMockResult<any>(warnOverride);
      expect(loggedObject).toMatchObject({
        message: 'User does not have an active subscription.',
        loglevel: 'WARN',
      });
    });

    it('Response with movie with multiple videos -> error thrown and logged as ERROR', async () => {
      // Arrange
      catalogCall = () => ({
        data: {
          movie: {
            videos: { nodes: [{ isProtected: true }, { isProtected: true }] },
          },
        },
      });

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: 'movie-1' } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.entitlement).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          message:
            "The movie with ID 'movie-1' has multiple MAIN videos, which should not be possible. Please contact the service support.",
          code: CommonErrors.MultipleMainVideos.code,
          path: ['entitlement'],
          details: undefined,
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message:
          "The movie with ID 'movie-1' has multiple MAIN videos, which should not be possible. Please contact the service support.",
        loglevel: 'ERROR',
      });
    });

    it.each([
      { isProtected: false },
      { isProtected: true },
      { isProtected: true, videoStreams: { nodes: null } },
      { isProtected: true, videoStreams: { nodes: [] } },
      {
        isProtected: true,
        videoStreams: {
          nodes: [
            {
              file: 'dash/audio-de.mp4',
              format: 'DASH_ON_DEMAND',
              label: 'audio',
              bitrateInKbps: null,
              iv: 'E32805950106648E',
              languageCode: 'de',
            },
          ],
        },
      },
      {
        isProtected: true,
        videoStreams: {
          nodes: [
            {
              ...videoStreams.nodes[0],
              keyId: undefined,
            },
          ],
        },
      },
      {
        isProtected: true,
        videoStreams: {
          nodes: [
            {
              ...videoStreams.nodes[0],
              keyId: null,
            },
          ],
        },
      },
    ])(
      'Response with movie with unprotected video -> error thrown and logged as WARN',
      async (node) => {
        // Arrange
        catalogCall = () => ({
          data: {
            movie: {
              videos: { nodes: [node] },
            },
          },
        });

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message:
              "The requested video for the movie with ID 'movie-1' is not protected. An entitlement message to receive a DRM license is therefore not required.",
            code: CommonErrors.VideoNotProtected.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(warnOverride);
        expect(loggedObject).toMatchObject({
          message:
            "The requested video for the movie with ID 'movie-1' is not protected. An entitlement message to receive a DRM license is therefore not required.",
          loglevel: 'WARN',
        });
      },
    );

    it.each(['ECONNREFUSED', 'ENOTFOUND'])(
      'Request to catalog service which is down or incorrectly configured -> error thrown and logged as WARN',
      async (code) => {
        // Arrange
        catalogCall = () => {
          const error = new Error('Custom request error');
          (error as any).code = code;
          throw error;
        };

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message:
              'We were unable to connect to the catalog service. Please contact the service support or try again later.',
            code: CommonErrors.CatalogConnectionFailed.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(errorOverride);
        expect(loggedObject).toMatchObject({
          message:
            'We were unable to connect to the catalog service. Please contact the service support or try again later.',
          loglevel: 'ERROR',
          error: {
            innerError: {
              code,
              message: 'Custom request error',
            },
          },
        });
      },
    );

    it.each(['ECONNREFUSED', 'ENOTFOUND'])(
      'Request to billing service which is down or incorrectly configured -> error thrown and logged as WARN',
      async (code) => {
        // Arrange
        catalogCall = () => ({
          data: {
            movie: {
              videos: {
                nodes: [{ isProtected: true, videoStreams }],
              },
            },
          },
        });
        billingCall = () => {
          const error = new Error('Custom request error');
          (error as any).code = code;
          throw error;
        };

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message:
              'We were unable to connect to the billing service. Please contact the service support or try again later.',
            code: CommonErrors.BillingConnectionFailed.code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(errorOverride);
        expect(loggedObject).toMatchObject({
          message:
            'We were unable to connect to the billing service. Please contact the service support or try again later.',
          loglevel: 'ERROR',
          error: {
            innerError: {
              code,
              message: 'Custom request error',
            },
          },
        });
      },
    );

    it('Request where 3rd party component throws an object -> error thrown and logged as ERROR', async () => {
      // Arrange
      catalogCall = () => {
        // throws an object that is not of type 'Error'.
        throw { message: 'Custom request error' };
      };

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: 'movie-1' } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.entitlement).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          ...MosaicErrors.UnhandledError,
          path: ['entitlement'],
          details: undefined,
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        message: MosaicErrors.UnhandledError.message,
        loglevel: 'ERROR',
        details: { code: MosaicErrors.UnhandledError.code },
        error: {
          innerError: {
            details: {
              originalError: {
                message: 'Custom request error',
              },
            },
          },
        },
      });
    });

    it.each([
      [
        'LICENSE_IS_NOT_VALID',
        'The movie does not have a valid license in your current country (DE)',
      ],
      [
        'LICENSE_IS_NOT_VALID',
        'The episode does not have a valid license in your current country (DE)',
      ],
    ])(
      'Request where catalog returns an error that is thrown as ClientError -> error thrown and logged as DEBUG',
      async (code, message) => {
        // Arrange
        const errors = [
          {
            code,
            message: message,
            path: ['movie'],
          },
        ];
        catalogCall = () => {
          throw new ClientError(
            stub<GraphQLResponse>({ errors }),
            stub<GraphQLRequestContext>({}),
          );
        };

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message: errors[0].message,
            code: errors[0].code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(debugOverride);
        expect(loggedObject).toMatchObject({
          message: errors[0].message,
          loglevel: 'DEBUG',
          details: { code: errors[0].code },
          error: {
            logInfo: {
              errors,
            },
          },
        });
      },
    );

    it.each([
      ['LICENSE_NOT_FOUND', 'The movie does not have a license.'],
      ['LICENSE_NOT_FOUND', 'The episode does not have a license.'],
    ])(
      'Request where catalog returns an error that is thrown as ClientError -> error thrown and logged as ERROR',
      async (code, message) => {
        // Arrange
        const errors = [
          {
            code,
            message: message,
            path: ['movie'],
          },
        ];
        catalogCall = () => {
          throw new ClientError(
            stub<GraphQLResponse>({ errors }),
            stub<GraphQLRequestContext>({}),
          );
        };

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.entitlement).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            message: errors[0].message,
            code: errors[0].code,
            path: ['entitlement'],
            details: undefined,
          },
        ]);

        const loggedObject = getFirstMockResult<any>(errorOverride);
        expect(loggedObject).toMatchObject({
          message: errors[0].message,
          loglevel: 'ERROR',
          details: { code: errors[0].code },
          error: {
            logInfo: { errors },
          },
        });
      },
    );

    it('Request where ip is not present in headers -> error thrown and logged as ERROR', async () => {
      // Arrange
      catalogCall = () => ({
        data: {
          movie: {
            videos: {
              nodes: [{ isProtected: true, videoStreams }],
            },
          },
        },
      });
      countryCode = undefined;

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        {
          input: { entityId: 'movie-1' },
        },
        {
          authContext: {
            subject: createTestEndUser(),
          },
          token: 'mock_token',
        },
      );

      // Assert
      expect(resp.data?.entitlement).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          ...CommonErrors.UnableToPlaybackVideo,
          path: ['entitlement'],
          details: undefined,
        },
      ]);

      const loggedObject = getFirstMockResult<any>(errorOverride);
      expect(loggedObject).toMatchObject({
        logtime: resp.errors?.[0].timestamp,
        loglevel: 'ERROR',
        retention: 'medium',
        context: 'TestContext',
        component: 'entitlement-service_test',
        message: 'Unable to playback video.',
        details: {
          code: CommonErrors.UnableToPlaybackVideo.code,
          request: {
            path: ['entitlement'],
          },
        },
        error: {
          ...CommonErrors.UnableToPlaybackVideo,
          logInfo: {
            clientIpAddress: '******',
            hint: 'The location of the user could not be confirmed based on his IP address.',
          },
        },
      });
      expect(Object.keys(loggedObject)).toHaveLength(8);
      expect(Object.keys(loggedObject.error)).toHaveLength(5);
      expect(Object.keys(loggedObject.details)).toHaveLength(2);
    });
  });

  describe('Success cases', () => {
    it.each(['movie', 'episode'])(
      'valid response received from catalog in prod mode for %p - no error, expected jwt returned',
      async (type) => {
        // Arrange
        catalogCall = () => ({
          data: {
            [type]: {
              videos: {
                nodes: [{ isProtected: true, videoStreams }],
              },
            },
          },
        });
        countryCode = 'EE';

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          { input: { entityId: 'movie-1' } },
          {
            ip: '89.219.153.70', // EE
            authContext: {
              subject: createTestEndUser(),
            },
          },
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.entitlement.entitlementMessageJwt).toMatch(jwtRegex);
        const jwtParts = resp?.data?.entitlement.entitlementMessageJwt
          .split('.')
          .map((part: string) => Buffer.from(part, 'base64').toString());
        expect(JSON.parse(jwtParts[0])).toEqual({
          alg: 'HS256',
          typ: 'JWT',
        });
        expect(JSON.parse(jwtParts[1])).toEqual(expectedJwtPayload(false));
      },
    );

    it.each([true, false])(
      'valid response received from catalog in prod mode for channel - no error, expected jwt returned',
      async (allowPersistence) => {
        // Arrange
        catalogCall = () => ({
          data: {
            channel: {
              keyId: keyId1,
              dashStreamUrl: 'test-value',
              hlsStreamUrl: 'test-value',
            },
          },
        });
        countryCode = 'EE';

        // Act
        const resp = await ctx.runGqlQuery(
          ENTITLEMENT_REQUEST,
          // allowPersistance is ignored for channels
          { input: { entityId: channelId, allowPersistence } },
          {
            ip: '89.219.153.70', // EE
            authContext: {
              subject: createTestEndUser(),
            },
          },
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        expect(resp?.data?.entitlement.entitlementMessageJwt).toMatch(jwtRegex);
        const jwtParts = resp?.data?.entitlement.entitlementMessageJwt
          .split('.')
          .map((part: string) => Buffer.from(part, 'base64').toString());
        expect(JSON.parse(jwtParts[0])).toEqual({
          alg: 'HS256',
          typ: 'JWT',
        });
        expect(JSON.parse(jwtParts[1])).toEqual(
          expectedJwtPayload(false, [keyId1]),
        );
      },
    );

    it('valid response received from catalog in prod mode - with duplicate drm key ids, no error, expected jwt returned with de-duplicated drm key ids', async () => {
      // Arrange
      catalogCall = () => ({
        data: {
          movie: {
            videos: {
              nodes: [
                {
                  isProtected: true,
                  videoStreams: {
                    nodes: [
                      ...videoStreams.nodes,
                      {
                        keyId: keyId1,
                        file: 'dash/audio-en.mp4',
                        format: 'DASH_ON_DEMAND',
                        label: 'audio',
                        bitrateInKbps: null,
                        iv: 'E32805950106648E',
                        languageCode: 'en',
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      });
      countryCode = 'EE';

      // Act
      const resp = await ctx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: 'movie-1' } },
        {
          ip: '89.219.153.70', // EE
          authContext: {
            subject: createTestEndUser(),
          },
          token: 'mock_token',
        },
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.entitlement.entitlementMessageJwt).toMatch(jwtRegex);
      const jwtParts = resp?.data?.entitlement.entitlementMessageJwt
        .split('.')
        .map((part: string) => Buffer.from(part, 'base64').toString());
      expect(JSON.parse(jwtParts[0])).toEqual({
        alg: 'HS256',
        typ: 'JWT',
      });
      expect(JSON.parse(jwtParts[1])).toEqual(expectedJwtPayload(false));
    });

    it('valid response received from catalog in test mode - no error, expected jwt returned, ip overridden', async () => {
      // Arrange
      const headers = {
        'mosaic-testing-ip': '2a05:4f46:c14:5700:fcee:3dcb:301c:fed5', // HR
      };
      const requestContext = {
        headers,
        authContext: {
          subject: createTestEndUser(),
        },
        token: 'mock_token',
      };
      countryCode = 'HR';

      catalogCall = () => ({
        data: {
          movie: {
            videos: {
              nodes: [{ isProtected: true, videoStreams }],
            },
          },
        },
      });

      // Act
      const resp = await ipTestCtx.runGqlQuery(
        ENTITLEMENT_REQUEST,
        { input: { entityId: 'movie-1' } },
        requestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      expect(resp?.data?.entitlement.entitlementMessageJwt).toMatch(jwtRegex);
      const jwtParts = resp?.data?.entitlement.entitlementMessageJwt
        .split('.')
        .map((part: string) => Buffer.from(part, 'base64').toString());
      expect(JSON.parse(jwtParts[0])).toEqual({
        alg: 'HS256',
        typ: 'JWT',
      });
      expect(JSON.parse(jwtParts[1])).toEqual(expectedJwtPayload(false));

      expect(debugOverride).toHaveBeenCalledTimes(1);

      const loggedObject = getFirstMockResult<any>(debugOverride);
      expect(loggedObject).toMatchObject({
        message:
          'Debug info on IP-related request information. This is helpful to make sure that correct ip address is being populated by Kubernetes or other proxy.',
        loglevel: 'DEBUG',
        details: { headers },
      });
    });
  });
});
