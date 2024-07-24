import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { MosaicError } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  PlaylistPublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { Config, ValidationErrors } from '../../../common';
import { validatePlaylist } from './validate-playlist';

export async function publishPlaylist(
  id: string,
  publishHash: string,
  jwtToken: string,
  longLivedToken: string,
  storeOutboxMessage: StoreOutboxMessage,
  ownerClient: ClientBase,
  config: Config,
  subject: AuthenticatedManagementSubject,
): Promise<void> {
  // perform validation
  const validationResult = await validatePlaylist(
    id,
    jwtToken,
    ownerClient,
    config,
  );

  if (publishHash !== validationResult.publishHash) {
    throw new MosaicError(ValidationErrors.PlaylistChangedSinceValidation);
  }

  if (validationResult.validationStatus === 'ERRORS') {
    throw new MosaicError({
      ...ValidationErrors.FailedPlaylistPrePublishValidation,
      details: {
        errors: validationResult.validations.filter(
          (wv) => wv.severity === 'ERROR',
        ),
        warnings: validationResult.validations.filter(
          (wv) => wv.severity === 'WARNING',
        ),
      },
    });
  }

  // set publish date, state and user for the playlist
  const publishedDate = new Date().toUTCString();
  await update(
    'playlists',
    {
      publication_state: 'PUBLISHED',
      published_date: publishedDate,
      published_user: subject.name,
    },
    {
      id: id,
    },
  ).run(ownerClient);

  // send playlist published event
  await storeOutboxMessage<PlaylistPublishedEvent>(
    id,
    ChannelServiceMessagingSettings.PlaylistPublished,
    validationResult.publishPayload,
    ownerClient,
    {
      envelopeOverrides: {
        auth_token: longLivedToken,
      },
    },
  );
}
