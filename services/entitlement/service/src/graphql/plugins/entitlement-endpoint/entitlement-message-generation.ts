import { Dict, UnreachableCaseError } from '@axinom/mosaic-service-common';
import jwt from 'jsonwebtoken';
import { Config } from '../../../common';
import { ENABLE_VIDEOS_DOWNLOAD } from '../../../domains';

type PolicyMode = 'DEFAULT' | 'DEV' | 'STRICT';

export const getPolicy = (mode: PolicyMode): Dict<unknown> => {
  // Some policy properties below are set explicitly to their default values and
  // can be omitted. See more details in documentation: https://portal.axinom.com/mosaic/documentation/drm/entitlement-message
  switch (mode) {
    case 'DEV':
      return {
        fairplay: {
          hdcp: 'NONE',
        },
        widevine: {
          device_security_level: 'SW_SECURE_CRYPTO',
          disable_analog_output: false,
        },
        playready: {
          // 150 during development to guarantee working in most cases.
          min_device_security_level: 150,
          play_enablers: ['786627D8-C2A6-44BE-8F88-08AE255B01A7'], // Supports playback when output type is unknown
        },
      };
    case 'DEFAULT':
      return {
        fairplay: {
          hdcp: 'TYPE0',
        },
        widevine: {
          device_security_level: 'SW_SECURE_CRYPTO',
          disable_analog_output: false,
        },
        playready: {
          // Strongly recommended to set to 2000 or more in production for better security!
          min_device_security_level: 2000,
        },
      };
    case 'STRICT':
      return {
        fairplay: {
          hdcp: 'TYPE1_STRICT',
        },
        widevine: {
          // for added security you can change this to 'HW_SECURE_ALL', but this will restrict the playback to only specific devices.
          device_security_level: 'SW_SECURE_CRYPTO',
          // for added security you can change this to '2.2', but this will restrict the playback to only specific devices.
          hdcp: '1.0',
          disable_analog_output: true,
        },
        playready: {
          // for added security you can change this to 3000, but this will restrict the playback to only specific devices.
          min_device_security_level: 2000,
          uncompressed_digital_video_opl: 300, // should require HDCP
          analog_video_opl: 201, // 201+ should prevent any analog output
        },
      };

    default:
      throw new UnreachableCaseError(mode);
  }
};

export const generateEntitlementMessageJwt = (
  keyIds: string[],
  claims: string[],
  config: Config,
  policyMode: PolicyMode,
): string => {
  const policy = getPolicy(policyMode);
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
        inline: keyIds.map((id) => ({
          id,
          usage_policy: 'Policy A',
        })),
      },
      content_key_usage_policies: [
        {
          name: 'Policy A',
          ...policy,
        },
      ],
    },
  };
  return jwt.sign(envelope, config.drmLicenseCommunicationKeyBuffer, {
    algorithm: 'HS256',
    noTimestamp: true,
  });
};
