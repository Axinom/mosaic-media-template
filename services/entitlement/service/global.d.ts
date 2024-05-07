import 'geoip-country';
declare module 'geoip-country' {
  export function updateDatabase(
    license_key?: string,
    callback?: (error: Error, stdout: string, stderr: string) => void,
  ): void;
  export function updateDatabase(
    callback?: (error: Error, stdout: string, stderr: string) => void,
  ): void;
}
