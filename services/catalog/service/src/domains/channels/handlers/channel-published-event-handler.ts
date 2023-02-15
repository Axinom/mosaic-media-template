import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { deletes, insert, IsolationLevel } from 'zapatos/db';
import { channel_images, channel_video_streams } from 'zapatos/schema';
import { Config } from '../../../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class ChannelPublishedEventHandler extends AuthenticatedMessageHandler<ChannelPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    protected readonly config: Config,
  ) {
    super(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType,
      config,
    );
  }

  async onMessage(payload: ChannelPublishedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await deletes('channel', { id: payload.id }).run(txnClient);

        const insertedChannel = await insert('channel', {
          id: payload.id,
          title: payload.title,
          description: payload.description,
        }).run(txnClient);

        if (payload.images) {
          await insert(
            'channel_images',
            payload.images.map(
              (image): channel_images.Insertable => ({
                channel_id: insertedChannel.id,
                type: image.type,
                path: image.path,
                width: image.width,
                height: image.height,
              }),
            ),
          ).run(txnClient);
        }

        if (payload.placeholder_video) {
          const {
            video_encoding: {
              video_streams,
              title,
              length_in_seconds,
              audio_languages,
              subtitle_languages,
              caption_languages,
              dash_manifest_path,
              hls_manifest_path,
              is_protected,
              output_format,
            },
          } = payload.placeholder_video;

          const channelVideo = await insert('channel_videos', {
            channel_id: insertedChannel.id,
            title: title,
            type: 'PLACEHOLDER',
            length_in_seconds: length_in_seconds,
            audio_languages: audio_languages.filter(Boolean) as string[],
            subtitle_languages: subtitle_languages.filter(Boolean) as string[],
            caption_languages: caption_languages.filter(Boolean) as string[],
            dash_manifest: dash_manifest_path,
            hls_manifest: hls_manifest_path,
            is_protected: is_protected,
            output_format: output_format,
          }).run(txnClient);

          if (video_streams !== undefined) {
            await insert(
              'channel_video_streams',
              video_streams.map(
                (videoStream): channel_video_streams.Insertable => ({
                  channel_video_id: channelVideo.id,
                  ...videoStream,
                }),
              ),
            ).run(txnClient);
          }
        }
      },
    );
  }
}
