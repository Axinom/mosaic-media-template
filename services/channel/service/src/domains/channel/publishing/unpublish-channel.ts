/* eslint-disable @typescript-eslint/no-explicit-any */
import { MosaicError } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  ChannelUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { selectOne, update } from 'zapatos/db';
import { CommonErrors, ValidationErrors } from '../../../common';
import { buildPublishingId } from '../../../publishing';

export async function unpublishChannel(
  id: string,
  longLivedToken: string,
  storeOutboxMessage: StoreOutboxMessage,
  ownerClient: ClientBase,
): Promise<void> {
  const channel = await selectOne(
    'channels',
    { id },
    { columns: ['id', 'publication_state'] },
  ).run(ownerClient);

  if (channel === undefined) {
    throw new MosaicError({
      ...CommonErrors.ChannelNotFound,
      details: { channelId: id },
    });
  }

  if (channel.publication_state === 'NOT_PUBLISHED') {
    throw new MosaicError(ValidationErrors.CannotUnpublishNotPublishedChannel);
  }

  const unpublishedEvent: ChannelUnpublishedEvent = {
    content_id: buildPublishingId('CHANNEL', channel.id),
  };

  await update(
    'channels',
    {
      publication_state: 'NOT_PUBLISHED',
      published_date: null,
      hls_stream_url: null,
      dash_stream_url: null,
      key_id: null,
    },
    { id },
  ).run(ownerClient);

  // send channel unpublished event
  await storeOutboxMessage<ChannelUnpublishedEvent>(
    id,
    ChannelServiceMessagingSettings.ChannelUnpublished,
    unpublishedEvent,
    ownerClient,
    {
      envelopeOverrides: { auth_token: longLivedToken },
    },
  );
}
