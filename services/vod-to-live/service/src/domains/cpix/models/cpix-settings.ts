/**
 * This interface provides the path to the CPIX files required for video decryption and live stream encryption.
 */
export interface CpixSettings {
  decryptionCpixFile: string | null | undefined;
  encryptionHlsCpixFile: string | null | undefined;
  encryptionDashCpixFile: string | null | undefined;
}
