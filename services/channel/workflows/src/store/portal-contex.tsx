import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';

interface PortalProps {
  resolveRoute: PiletApi['resolveRoute'];
}

export const PortalContext = React.createContext<PortalProps>({
  resolveRoute: (
    _station: string,
    _dynamicRouteSegments?: Record<string, string> | string,
  ): string | undefined => undefined,
});
