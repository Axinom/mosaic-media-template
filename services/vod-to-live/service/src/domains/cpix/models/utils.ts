import {
  CommonEncryptionScheme,
  ContentKey,
  ContentKeyUsageRule,
  CpixRequest,
  DRMSystem,
  DRMSystemIds,
  HLSSignalingDatum,
  Playlist,
} from './cpix-request';

export class DRMKey {
  constructor(public keyId: string, public keyType: 'VIDEO' | 'AUDIO') {}
}

export const createDashCpixRequest = (
  contentId: string,
  drmKeyIds: string[],
): CpixRequest => {
  const { ContentKey, DRMSystem, ContentKeyUsageRule } = drmKeyIds.reduce(
    (result, entry) => {
      if (!result.ContentKey.find((c) => c['@kid'] === entry)) {
        result.ContentKey.push(
          createContentKey(entry, CommonEncryptionScheme.CENC),
        );
      }
      if (!result.DRMSystem.find((d) => d['@kid'] === entry)) {
        result.DRMSystem.push(
          ...[
            createDRMSystem(
              entry,
              DRMSystemIds.PlayReady,
              undefined,
              {},
              {},
              {},
            ),
            createDRMSystem(entry, DRMSystemIds.Widevine, undefined, {}, {}),
          ],
        );
      }

      result.ContentKeyUsageRule.push(
        ...[
          createContentKeyUsageRule(entry, undefined, {}, null),
          createContentKeyUsageRule(entry, undefined, null, {}),
        ],
      );
      return result;
    },
    {
      ContentKey: new Array<ContentKey>(),
      DRMSystem: new Array<DRMSystem>(),
      ContentKeyUsageRule: new Array<ContentKeyUsageRule>(),
    },
  );

  const dashCpixRequest: CpixRequest = {
    'cpix:CPIX': {
      '@xmlns:cpix': 'urn:dashif:org:cpix',
      '@xmlns:pskc': 'urn:ietf:params:xml:ns:keyprov:pskc',
      '@contentId': contentId,
      '@version': '2.3',

      'cpix:ContentKeyList': {
        'cpix:ContentKey': ContentKey,
      },

      'cpix:DRMSystemList': {
        'cpix:DRMSystem': DRMSystem,
      },

      'cpix:ContentKeyUsageRuleList': {
        'cpix:ContentKeyUsageRule': ContentKeyUsageRule,
      },
    },
  };
  return dashCpixRequest;
};
export const createHlsCpixRequest = (
  contentId: string,
  drmKeyIds: string[],
): CpixRequest => {
  const { ContentKey, DRMSystem, ContentKeyUsageRule } = drmKeyIds.reduce(
    (result, entry) => {
      if (!result.ContentKey.find((c) => c['@kid'] === entry)) {
        result.ContentKey.push(
          createContentKey(entry, CommonEncryptionScheme.CBCS),
        );
      }
      if (!result.DRMSystem.find((c) => c['@kid'] === entry)) {
        result.DRMSystem.push(
          createDRMSystem(entry, DRMSystemIds.FairPlay, [
            {
              '@playlist': Playlist.Media,
            },
            {
              '@playlist': Playlist.Master,
            },
          ]),
        );
      }

      result.ContentKeyUsageRule.push(
        ...[
          createContentKeyUsageRule(entry, undefined, {}, undefined),
          createContentKeyUsageRule(entry, undefined, undefined, {}),
        ],
      );
      return result;
    },
    {
      ContentKey: new Array<ContentKey>(),
      DRMSystem: new Array<DRMSystem>(),
      ContentKeyUsageRule: new Array<ContentKeyUsageRule>(),
    },
  );
  const hlsCpixRequest: CpixRequest = {
    'cpix:CPIX': {
      '@xmlns:cpix': 'urn:dashif:org:cpix',
      '@xmlns:pskc': 'urn:ietf:params:xml:ns:keyprov:pskc',
      '@contentId': contentId,
      '@version': '2.3',

      'cpix:ContentKeyList': {
        'cpix:ContentKey': ContentKey,
      },
      'cpix:DRMSystemList': {
        'cpix:DRMSystem': DRMSystem,
      },
      'cpix:ContentKeyUsageRuleList': {
        'cpix:ContentKeyUsageRule': ContentKeyUsageRule,
      },
    },
  };
  return hlsCpixRequest;
};
export const createDecryptionCpixRequest = (
  contentId: string,
  drmKeys: DRMKey[],
): CpixRequest => {
  const { ContentKey, DRMSystem, ContentKeyUsageRule } = drmKeys.reduce(
    (result, entry) => {
      if (!result.ContentKey.find((c) => c['@kid'] === entry.keyId)) {
        result.ContentKey.push(
          createContentKey(entry.keyId, CommonEncryptionScheme.CBCS),
        );
      }
      if (!result.DRMSystem.find((d) => d['@kid'] === entry.keyId)) {
        result.DRMSystem.push(
          createDRMSystem(
            entry.keyId,
            DRMSystemIds.Widevine,
            [
              {
                '@playlist': Playlist.Media,
              },
              {
                '@playlist': Playlist.Master,
              },
            ],
            {},
            {},
          ),
        );
      }
      result.ContentKeyUsageRule.push(
        createContentKeyUsageRule(
          entry.keyId,
          entry.keyType,
          entry.keyType === 'VIDEO' ? {} : undefined,
          entry.keyType === 'AUDIO' ? {} : undefined,
        ),
      );
      return result;
    },
    {
      ContentKey: new Array<ContentKey>(),
      DRMSystem: new Array<DRMSystem>(),
      ContentKeyUsageRule: new Array<ContentKeyUsageRule>(),
    },
  );
  const decryptionCpixRequest: CpixRequest = {
    'cpix:CPIX': {
      '@contentId': contentId,
      '@version': '2.3',
      '@xmlns:cpix': 'urn:dashif:org:cpix',
      '@xmlns:pskc': 'urn:ietf:params:xml:ns:keyprov:pskc',
      '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
      '@xmlns:enc': 'http://www.w3.org/2001/04/xmlenc#',
      'cpix:ContentKeyList': {
        'cpix:ContentKey': ContentKey,
      },
      'cpix:DRMSystemList': {
        'cpix:DRMSystem': DRMSystem,
      },
      'cpix:ContentKeyUsageRuleList': {
        'cpix:ContentKeyUsageRule': ContentKeyUsageRule,
      },
    },
  };

  return decryptionCpixRequest;
};

const createContentKey = (
  drmKeyId: string,
  encryptionScheme: CommonEncryptionScheme,
): ContentKey => {
  return {
    '@kid': drmKeyId,
    '@commonEncryptionScheme': encryptionScheme,
  };
};

const createDRMSystem = (
  drmKeyId: string,
  drmSystemId: DRMSystemIds,
  hlsSignalingData?: HLSSignalingDatum[],
  pssh?: unknown,
  contentProtectionData?: unknown,
  smoothStreamingProtectionHeaderData?: unknown,
): DRMSystem => {
  return {
    'cpix:PSSH': pssh ?? undefined,
    'cpix:ContentProtectionData': contentProtectionData ?? undefined,
    'cpix:SmoothStreamingProtectionHeaderData':
      smoothStreamingProtectionHeaderData ?? undefined,
    'cpix:HLSSignalingData': hlsSignalingData ?? undefined,
    '@kid': drmKeyId,
    '@systemId': drmSystemId,
  };
};

const createContentKeyUsageRule = (
  keyId: string,
  keyType?: 'VIDEO' | 'AUDIO',
  videoFilter?: unknown,
  audioFilter?: unknown,
): ContentKeyUsageRule => {
  return {
    '@kid': keyId,
    '@intendedTrackType': keyType ?? undefined,
    'cpix:VideoFilter': videoFilter ?? undefined,
    'cpix:AudioFilter': audioFilter ?? undefined,
  };
};
