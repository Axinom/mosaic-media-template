import '@axinom/mosaic-portal';
declare module '@axinom/mosaic-portal' {
  /**
   * Route resolver registration function.
   */
  interface RegistrationFunction {
    (
      station: string,
      resolver: (
        dynamicRouteSegments?: Record<string, string> | string,
      ) => void,
    ): string | undefined;
  }
}
