import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { MosaicError } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelPublishedEvent,
  ChannelServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { update } from 'zapatos/db';
import { Config, ValidationErrors } from '../../../common';
import { validateChannel } from './validate-channel';

export async function publishChannel(
  id: string,
  formerPublishHash: string,
  jwtToken: string,
  longLivedToken: string,
  storeOutboxMessage: StoreOutboxMessage,
  ownerClient: ClientBase,
  config: Config,
  subject: AuthenticatedManagementSubject,
): Promise<void> {
  const { publishHash, publishPayload, validationStatus, validations } =
    await validateChannel(id, jwtToken, ownerClient, config);
  if (formerPublishHash !== publishHash) {
    throw new MosaicError(ValidationErrors.ChannelChangedSinceValidation);
  }
  if (validationStatus === 'ERRORS') {
    throw new MosaicError({
      ...ValidationErrors.FailedChannelPrePublishValidation,
      details: {
        errors: validations.filter((wv) => wv.severity === 'ERROR'),
        warnings: validations.filter((wv) => wv.severity === 'WARNING'),
      },
    });
  }
  // Set publish date, state, and user for the channel
  const publishedDate = new Date().toUTCString();
  await update(
    'channels',
    {
      publication_state: 'PUBLISHED',
      published_date: publishedDate,
      published_user: subject.name,
    },
    {
      id,
    },
  ).run(ownerClient);

  // send channel published event
  await storeOutboxMessage<ChannelPublishedEvent>(
    id,
    ChannelServiceMessagingSettings.ChannelPublished,
    publishPayload,
    ownerClient,
    {
      envelopeOverrides: { auth_token: longLivedToken },
    },
  );
}
