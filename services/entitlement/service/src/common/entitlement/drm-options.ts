// MosaicDrmOptions.ts

// Configuration options for Mosaic DRM
// @deprecated Use `entitlement2`
export class MosaicDrmOptions {
  // Mosaic Drm service communication key to sign entitlement messages
  public mosaicDrmCommunicationKey: string;

  // Communication key id indicates the ID of the Communication Key that was used to sign an Mosaic DRM License Server Message
  public mosaicDrmCommunicationKeyId: string;

  // Mosaic DRM message options
  public drmMessageOptions: MosaicDrmMessageOptions =
    new MosaicDrmMessageOptions();
}

// MosaicDrmMessageOptions.ts

// Mosaic DRM message options
// @deprecated Use `entitlement2`
export class MosaicDrmMessageOptions {
  // Drm token expiration hours
  public expirationHours = 24;

  // Drm token expiration hours after first play
  public expirationAfterFirstPlayHours = 24;

  // PlayReady options
  public playReady: MosaicPlayReady;

  // Widevine options
  public widevine: MosaicWidevine;
}

// MosaicPlayReady.ts

// PlayReady options
// @deprecated Use `entitlement2`
export class MosaicPlayReady {
  // Minimum application security level
  public minAppSecurityLevel?: number;

  // Real time expiration enable/disable
  public realTimeExpiration: boolean;

  // Output protection level for compressed digital audio content
  public compressedDigitalAudioOpl?: number;

  // Output protection level for uncompressed digital audio content
  public uncompressedDigitalAudioOpl?: number;

  // Output protection level for compressed digital video content
  public compressedDigitalVideoOpl?: number;

  // Output protection level for uncompressed digital video content
  public uncompressedDigitalVideoOpl?: number;

  // Output protection level for analog video content
  public analogVideoOpl?: number;

  // List of IDs of technologies to which protected content is allowed to flow
  public playEnablers: string;
}

// MosaicWidevine.ts

// Widevine options
// @deprecated Use `entitlement2`
export class MosaicWidevine {
  // Allows to specify the CGMS-A rule that must be used by the device while playing the protected media.
  public cgmsA: string;

  // The ID of the device that is allowed to acquire the license.
  public deviceId: string;

  // Allows to specify the security level that the device must have in order to use the license.
  public deviceSecurityLevel?: number;

  // Allows to specify the version of HDCP that must be used in order to play protected media.
  public hdcp: string;
}
