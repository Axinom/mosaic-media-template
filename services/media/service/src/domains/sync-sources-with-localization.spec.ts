import { OwnerPgPool, PgOutputScopedMessage } from '@axinom/mosaic-db-common';
import { SubjectType } from '@axinom/mosaic-id-guard';
import { TokenResult } from '@axinom/mosaic-id-link-be';
import { Broker } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { LocalizationServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { Dict, rejectionOf } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { Pgoutput } from 'pg-logical-replication';
import { PublicationConfig } from 'rascal';
import { v4 as uuid } from 'uuid';
import { Config, InternalErrors } from '../common';
import { createTestConfig } from '../tests/test-utils';
import {
  LOCALIZATION_MOVIE_GENRE_TYPE,
  LOCALIZATION_MOVIE_TYPE,
} from './movies';
import { syncSourcesWithLocalization } from './sync-sources-with-localization';

const serviceAccountToken = 'SERVICE_ACCOUNT_TOKEN';
jest.mock('@axinom/mosaic-id-link-be', () => {
  const originalModule = jest.requireActual('@axinom/mosaic-id-link-be');
  return {
    __esModule: true,
    ...originalModule,
    getServiceAccountToken: jest.fn(() =>
      Promise.resolve<TokenResult>({
        accessToken: serviceAccountToken,
        expiresInSeconds: 600,
        tokenType: SubjectType.ManagedServiceAccount,
      }),
    ),
  };
});

describe('syncSourcesWithLocalization', () => {
  let messages: {
    messageType: string;
    message: any;
    context: Dict<string>;
    options: PublicationConfig | undefined;
  }[] = [];
  let broker: Broker;
  let config: Config;

  beforeAll(async () => {
    config = createTestConfig();
    broker = stub<Broker>({
      publish: (
        _id: string,
        { messageType }: MessagingSettings,
        message: any,
        context: Dict<string>,
        options: PublicationConfig | undefined,
      ) => {
        messages.push({ messageType, message, context, options });
      },
    });
  });

  afterEach(async () => {
    messages = [];
    jest.resetAllMocks();
  });

  // More detailed tests are written for specific handlers, these ones do not
  // rely on the database and check the general logic and that tables/operations are supported

  it('movie is inserted -> upsert message is sent', async () => {
    // Arrange
    const movie = {
      id: uuid(),
      title: 'Test Title',
    };
    const scopedMessage: PgOutputScopedMessage = {
      operation: 'insert',
      tableName: 'movies',
      schemaName: 'app_public',
      new: movie,
    };

    // Act
    await syncSourcesWithLocalization(
      stub<OwnerPgPool>(),
      broker,
      config,
    )({ scopedMessage, fullMessage: stub<Pgoutput.Message>() });

    // Assert
    expect(messages).toEqual([
      {
        messageType:
          LocalizationServiceMultiTenantMessagingSettings
            .UpsertLocalizationSourceEntity.messageType,
        context: {
          auth_token: serviceAccountToken,
        },
        message: {
          entity_id: movie.id,
          entity_title: movie.title,
          entity_type: LOCALIZATION_MOVIE_TYPE,
          fields: {
            description: undefined,
            title: movie.title,
          },
          image_id: undefined,
          service_id: config.serviceId,
        },
        options: {
          routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
        },
      },
    ]);
  });

  it('movie is updated, but title remains the same -> upsert message is not sent', async () => {
    // Arrange
    const movie = {
      id: uuid(),
      tenant_id: uuid(),
      environment_id: uuid(),
      title: 'Test Title',
    };
    const scopedMessage: PgOutputScopedMessage = {
      operation: 'update',
      tableName: 'movies',
      schemaName: 'app_public',
      new: movie,
      old: movie,
    };

    // Act
    await syncSourcesWithLocalization(
      stub<OwnerPgPool>(),
      broker,
      config,
    )({ scopedMessage, fullMessage: stub<Pgoutput.Message>() });

    // Assert
    expect(messages).toEqual([]);
  });

  it('movie image is updated -> upsert message is sent', async () => {
    // Arrange
    const image = {
      movie_id: uuid(),
      image_id: uuid(),
      image_type: 'COVER',
    };
    const scopedMessage: PgOutputScopedMessage = {
      operation: 'update',
      tableName: 'movies_images',
      schemaName: 'app_public',
      new: image,
      // old is not relevant in this particular case
    };

    // Act
    await syncSourcesWithLocalization(
      stub<OwnerPgPool>(),
      broker,
      config,
    )({ scopedMessage, fullMessage: stub<Pgoutput.Message>() });

    // Assert
    expect(messages).toEqual([
      {
        messageType:
          LocalizationServiceMultiTenantMessagingSettings
            .UpsertLocalizationSourceEntity.messageType,
        context: {
          auth_token: serviceAccountToken,
        },
        message: {
          entity_id: image.movie_id,
          entity_title: undefined,
          entity_type: LOCALIZATION_MOVIE_TYPE,
          fields: {},
          image_id: image.image_id,
          service_id: config.serviceId,
        },
        options: {
          routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
        },
      },
    ]);
  });

  it('movie genre is deleted -> delete message is sent', async () => {
    // Arrange
    const movieGenre = {
      id: uuid(),
      title: 'Test Title',
    };
    const scopedMessage: PgOutputScopedMessage = {
      operation: 'delete',
      tableName: 'movie_genres',
      schemaName: 'app_public',
      old: movieGenre,
    };

    // Act
    await syncSourcesWithLocalization(
      stub<OwnerPgPool>(),
      broker,
      config,
    )({ scopedMessage, fullMessage: stub<Pgoutput.Message>() });

    // Assert
    expect(messages).toEqual([
      {
        messageType:
          LocalizationServiceMultiTenantMessagingSettings
            .DeleteLocalizationSourceEntity.messageType,
        context: {
          auth_token: serviceAccountToken,
        },
        message: {
          entity_id: movieGenre.id,
          entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
          service_id: config.serviceId,
        },
        options: {
          routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.delete`,
        },
      },
    ]);
  });

  it('movie tag is inserted -> error thrown because movie tag is not localizable', async () => {
    // Arrange
    const scopedMessage: PgOutputScopedMessage = {
      operation: 'insert',
      tableName: 'movies_tags',
      schemaName: 'app_public',
    };

    // Act
    const error = await rejectionOf(
      syncSourcesWithLocalization(
        stub<OwnerPgPool>(),
        broker,
        config,
      )({ scopedMessage, fullMessage: stub<Pgoutput.Message>() }),
    );

    // Assert
    expect(error).toMatchObject({
      message:
        'The logical replication event for the table "movies_tags" was received, but an explicit handling for it has not been added.',
      code: InternalErrors.UnsupportedReplicationTable.code,
    });
  });

  it('movies are truncated -> error thrown because truncate is not a supported operation', async () => {
    // Arrange
    const scopedMessage: PgOutputScopedMessage = {
      operation: 'truncate',
      tableName: 'movies',
      schemaName: 'app_public',
    };

    // Act
    const error = await rejectionOf(
      syncSourcesWithLocalization(
        stub<OwnerPgPool>(),
        broker,
        config,
      )({ scopedMessage, fullMessage: stub<Pgoutput.Message>() }),
    );

    // Assert
    expect(error).toMatchObject({
      message:
        'The logical replication event for the operation "truncate" was received, but an explicit handling for it has not been added.',
      code: InternalErrors.UnsupportedReplicationOperation.code,
    });
  });
});
