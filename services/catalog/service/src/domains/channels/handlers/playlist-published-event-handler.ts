import { Dict, Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  PlaylistPublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert, upsert } from 'zapatos/db';
import { program, program_images, program_localizations } from 'zapatos/schema';
import { Config } from '../../../common';
import { EPISODE_ID_PREFIX, MOVIE_ID_PREFIX } from '../common';

export class PlaylistPublishedEventHandler extends TransactionalInboxMessageHandler<
  PlaylistPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      ChannelServiceMessagingSettings.PlaylistPublished,
      new Logger({
        config,
        context: PlaylistPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<PlaylistPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    const playlist_id = payload.content_id;
    await upsert(
      'playlist',
      {
        id: playlist_id,
        channel_id: payload.channel_id,
        start_date_time: payload.start_date_time,
        end_date_time: payload.end_date_time,
      },
      ['id'],
    ).run(txnClient);

    await deletes('program', { playlist_id }).run(txnClient);
    const localizations: {
      sort_index: number;
      value: program_localizations.Insertable;
    }[] = [];
    const images: {
      sort_index: number;
      value: program_images.Insertable;
    }[] = [];
    if (payload.programs) {
      const programs = await insert(
        'program',
        payload.programs.map((p): program.Insertable => {
          localizations.push(
            ...p.localizations.map((l) => ({
              sort_index: p.sort_index,
              value: {
                locale: l.language_tag,
                is_default_locale: l.is_default_locale,
                title: l.title,
              },
            })),
          );
          if (p.image) {
            images.push({
              sort_index: p.sort_index,
              value: {
                type: p.image.type,
                path: p.image.path,
                width: p.image.width,
                height: p.image.height,
              },
            });
          }
          return {
            playlist_id,
            episode_id: p.entity_content_id.startsWith(EPISODE_ID_PREFIX)
              ? p.entity_content_id
              : null,
            movie_id: p.entity_content_id.startsWith(MOVIE_ID_PREFIX)
              ? p.entity_content_id
              : null,
            sort_index: p.sort_index,
          };
        }),
        {
          returning: ['id', 'sort_index'],
        },
      ).run(txnClient);

      const programMappings = programs.reduce((acc: Dict<number>, cur) => {
        acc[cur.sort_index] = cur.id;
        return acc;
      }, {});

      if (localizations) {
        await insert(
          'program_localizations',
          localizations.map((l): program_localizations.Insertable => {
            return {
              program_id: programMappings[l.sort_index],
              ...l.value,
            };
          }),
        ).run(txnClient);
      }
      if (images) {
        await insert(
          'program_images',
          images.map((l): program_images.Insertable => {
            return {
              program_id: programMappings[l.sort_index],
              ...l.value,
            };
          }),
        ).run(txnClient);
      }
    }
  }
}
