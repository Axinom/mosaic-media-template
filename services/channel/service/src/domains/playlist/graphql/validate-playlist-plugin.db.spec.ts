import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { assertNotFalsy, MosaicError } from '@axinom/mosaic-service-common';
import gql from 'graphql-tag';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { PlaylistPublishedEvent } from 'media-messages';
import { CommonErrors } from '../../../common';
import { PublishValidationResult } from '../../../publishing';
import {
  createTestContext,
  createTestRequestContext,
  createTestUser,
  TestContext,
  TestRequestContext,
} from '../../../tests/test-utils';
import * as validation from '../publishing/validate-playlist';

const VALIDATE_PLAYLIST = gql`
  query ValidatePlaylist($id: UUID!) {
    validatePlaylist(id: $id) {
      validationStatus
      publishHash
      validationMessages {
        context
        message
        severity
      }
    }
  }
`;

describe('query validatePlaylist', () => {
  let ctx: TestContext;
  let user: AuthenticatedManagementSubject;
  let defaultRequestContext: TestRequestContext;
  const playlistId = '897ba895-ccb8-4971-9fa6-583105eea383';

  beforeAll(async () => {
    ctx = await createTestContext();

    user = createTestUser(ctx.config.serviceId, {
      role: ctx.config.dbOwner,
    });
    defaultRequestContext = createTestRequestContext(
      ctx.config.serviceId,
      user,
    );
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  it('returns an error in the GraphQL response if validation throws an error', async () => {
    // Arrange
    jest.spyOn(validation, 'validatePlaylist').mockImplementation(async () => {
      throw new MosaicError(CommonErrors.ChannelNotFound);
    });

    // Act
    const resp = await ctx.runGqlQuery(
      VALIDATE_PLAYLIST,
      { id: playlistId },
      defaultRequestContext,
    );

    // Assert
    expect(resp?.errors).toMatchObject([
      {
        message: CommonErrors.ChannelNotFound.message,
      },
    ]);
  });

  it('succeeds with issues', async () => {
    // Arrange
    const validationResult = stub<
      PublishValidationResult<PlaylistPublishedEvent>
    >({
      validations: [
        {
          message: 'not_important_in_this_case',
          context: 'METADATA',
          severity: 'ERROR',
        },
      ],
      validationStatus: 'ERRORS',
      publishHash: 'some_hash_value',
    });
    jest
      .spyOn(validation, 'validatePlaylist')
      .mockImplementation(async () => validationResult);

    // Act
    const resp = await ctx.runGqlQuery(
      VALIDATE_PLAYLIST,
      { id: playlistId },
      defaultRequestContext,
    );

    // Assert
    expect(resp?.errors).toBeFalsy();
    assertNotFalsy(resp?.data?.validatePlaylist);
    const { validationStatus, validationMessages, publishHash } =
      resp.data.validatePlaylist;
    expect(validationStatus).toBe('ERRORS');
    expect(publishHash).toBeNull();
    expect(validationMessages?.length).toBeGreaterThan(0);
  });

  it('succeeds without issues', async () => {
    // Arrange
    const validationResult = stub<
      PublishValidationResult<PlaylistPublishedEvent>
    >({
      validations: [],
      validationStatus: 'OK',
      publishHash:
        '6c0bf2cb8cc32fc82b7a71af7c7dad28779425bad247a61a9bf708787a44e22a',
    });
    jest
      .spyOn(validation, 'validatePlaylist')
      .mockImplementation(async () => validationResult);

    // Act
    const resp = await ctx.runGqlQuery(
      VALIDATE_PLAYLIST,
      { id: playlistId },
      defaultRequestContext,
    );

    // Assert
    expect(resp?.errors).toBeFalsy();
    assertNotFalsy(resp?.data?.validatePlaylist);
    const { validationStatus, validationMessages, publishHash } =
      resp.data.validatePlaylist;
    expect(validationMessages).toEqual([]);
    expect(validationStatus).toBe('OK');
    expect(publishHash).toBe(
      '6c0bf2cb8cc32fc82b7a71af7c7dad28779425bad247a61a9bf708787a44e22a',
    );
  });
});
