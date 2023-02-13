/**
 * Interface provides path to CPIX files for decryption of the Videos and encryption of live stream.
 */
export interface CpixSettings {
  decryptionCpixFile: string | null | undefined;
  encryptionHlsCpixFile: string | null | undefined;
  encryptionDashCpixFile: string | null | undefined;
}
