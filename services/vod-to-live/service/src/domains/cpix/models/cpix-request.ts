export enum Playlist {
  Master = 'master',
  Media = 'media',
}
export enum CommonEncryptionScheme {
  /**
   * Used for Decryption of CMAF.
   */
  CBCS = 'cbcs',
  /**
   * Used for Decryption of  DASH and DashOnDemand.
   */
  CENC = 'cenc',
}

/**
 * CPIX uses identifiers (GUIDs) assigned by https://dashif.org/identifiers/content_protection/[DASH IF]
 * to each DRM technology. The following IDs are relevant in Axinom DRM context:
 */
export enum DRMSystemIds {
  /**
   * Widevine - edef8ba9-79d6-4ace-a3c8-27dcd51d21ed
   */
  Widevine = 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed',
  /**
   * FairPlay - 94ce86fb-07ff-4f43-adb8-93d2fa968ca2
   */
  FairPlay = '94ce86fb-07ff-4f43-adb8-93d2fa968ca2',
  /**
   * PlayReady - 9a04f079-9840-4286-ab92-e65be0885f95
   */
  PlayReady = '9a04f079-9840-4286-ab92-e65be0885f95',
}

export type CpixXmlnsVersion = '2.3';
export type CpixXmlnsCpix = 'urn:dashif:org:cpix';
export type CpixXmlnsPskc = 'urn:ietf:params:xml:ns:keyprov:pskc';
export type CpixXmlnsDs = 'http://www.w3.org/2000/09/xmldsig#';
export type CpixXmlnsEnc = 'http://www.w3.org/2001/04/xmlenc#';
export type IntendedTrackType = 'VIDEO' | 'AUDIO';

export interface CpixRequest {
  'cpix:CPIX': Cpix;
}

export interface Cpix {
  'cpix:ContentKeyList': ContentKeyList;
  'cpix:DRMSystemList': DRMSystemList;
  'cpix:ContentKeyUsageRuleList': ContentKeyUsageRuleList;

  '@xmlns:cpix': CpixXmlnsCpix;
  '@xmlns:pskc': CpixXmlnsPskc;
  '@xmlns:ds'?: CpixXmlnsDs;
  '@xmlns:enc'?: CpixXmlnsEnc;
  '@contentId': string;
  '@version': CpixXmlnsVersion;
}

export interface ContentKeyList {
  'cpix:ContentKey': ContentKey[];
}

export interface ContentKey {
  '@kid': string;
  '@commonEncryptionScheme': CommonEncryptionScheme;
}

export interface ContentKeyUsageRuleList {
  'cpix:ContentKeyUsageRule': ContentKeyUsageRule[];
}

export interface ContentKeyUsageRule {
  'cpix:VideoFilter': any;
  'cpix:AudioFilter': any;
  '@kid': string;
  '@intendedTrackType': IntendedTrackType | undefined;
}

export interface DRMSystemList {
  'cpix:DRMSystem': DRMSystem[];
}

export interface DRMSystem {
  'cpix:PSSH': any;
  'cpix:ContentProtectionData': any;
  'cpix:HLSSignalingData': HLSSignalingDatum[] | undefined;
  'cpix:SmoothStreamingProtectionHeaderData': any;
  '@kid': string;
  '@systemId': DRMSystemIds;
}

export interface HLSSignalingDatum {
  '@playlist': Playlist;
}
