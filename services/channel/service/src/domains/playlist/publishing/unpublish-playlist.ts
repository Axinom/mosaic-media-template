/* eslint-disable @typescript-eslint/no-explicit-any */
import { MosaicError } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  PlaylistUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { selectOne, update } from 'zapatos/db';
import { CommonErrors, ValidationErrors } from '../../../common';
import { buildPublishingId } from '../../../publishing';

export async function unpublishPlaylist(
  id: string,
  longLivedToken: string,
  storeOutboxMessage: StoreOutboxMessage,
  ownerClient: ClientBase,
): Promise<void> {
  const playlist = await selectOne(
    'playlists',
    { id: id },
    { columns: ['id', 'publication_state', 'channel_id'] },
  ).run(ownerClient);

  if (playlist === undefined) {
    throw new MosaicError({
      ...CommonErrors.PlaylistNotFound,
      details: { playlistId: id },
    });
  }

  if (playlist.publication_state === 'NOT_PUBLISHED') {
    throw new MosaicError(ValidationErrors.CannotUnpublishNotPublishedPlaylist);
  }

  const unpublishedEvent: PlaylistUnpublishedEvent = {
    content_id: buildPublishingId('PLAYLIST', playlist.id),
    channel_id: playlist.channel_id,
  };

  await update(
    'playlists',
    { publication_state: 'NOT_PUBLISHED', published_date: null },
    { id: id },
  ).run(ownerClient);

  // send playlist unpublished event
  await storeOutboxMessage<PlaylistUnpublishedEvent>(
    id,
    ChannelServiceMessagingSettings.PlaylistUnpublished,
    unpublishedEvent,
    ownerClient,
    {
      envelopeOverrides: { auth_token: longLivedToken },
    },
  );
}
