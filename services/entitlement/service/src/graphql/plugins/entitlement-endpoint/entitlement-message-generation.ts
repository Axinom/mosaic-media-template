import * as jwt from 'jsonwebtoken';
import { Config } from '../../../common';
import { ENABLE_VIDEOS_DOWNLOAD } from '../../../domains';
import {
  EpisodeVideoStream,
  MovieVideoStream,
} from '../../../generated/graphql/catalog';

export const generateEntitlementMessageJwt = (
  drmKeyIds: (MovieVideoStream | EpisodeVideoStream)['drmKeyId'][],
  claims: string[],
  config: Config,
): string => {
  const envelope = {
    version: 1,
    com_key_id: config.drmLicenseCommunicationKeyId,
    message: {
      version: 2,
      type: 'entitlement_message',
      license: {
        allow_persistence: claims.includes(ENABLE_VIDEOS_DOWNLOAD), // Allows to specify whether the license can be persisted on the playback device.
      },
      content_keys_source: {
        inline: [...new Set(drmKeyIds ?? [])].map((id) => ({
          id,
          usage_policy: 'Policy A',
        })),
      },
      content_key_usage_policies: [
        {
          name: 'Policy A',
          playready: {
            // 150 during development to guarantee working in most cases.
            // Strongly recommended to set to 2000 or more in production for
            // better security!
            min_device_security_level: config.isDev ? 150 : 2000,
            play_enablers: ['786627D8-C2A6-44BE-8F88-08AE255B01A7'], // Supports playback when output type is unknown
          },
        },
      ],
    },
  };
  return jwt.sign(envelope, config.drmLicenseCommunicationKeyBuffer, {
    algorithm: 'HS256',
    noTimestamp: true,
  });
};
