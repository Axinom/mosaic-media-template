import { Broker } from '@axinom/mosaic-message-bus';
import {
  DeclareCuePointTypesCommand,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Config, requestServiceAccountToken } from '../common';

export const videoCuePointTypes = [
  { key: 'INTRO_OUT', title: 'Intro out' },
  { key: 'CHAPTER_MARKER', title: 'Chapter marker' },
  { key: 'OUTRO_IN', title: 'Outro in' },
];

export const registerVideoCuePointTypes = async (
  broker: Broker,
  config: Config,
): Promise<void> => {
  const serviceAccountToken = await requestServiceAccountToken(config);
  await broker.publish<DeclareCuePointTypesCommand>(
    config.environmentId,
    VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes,
    {
      service_id: config.serviceId,
      cue_point_types: videoCuePointTypes,
    },
    {
      auth_token: serviceAccountToken.accessToken,
    },
    {
      routingKey:
        VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes.getEnvironmentRoutingKey(
          {
            tenantId: config.tenantId,
            environmentId: config.environmentId,
          },
        ),
    },
  );
};
