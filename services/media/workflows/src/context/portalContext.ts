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

export const usePortal = (): PortalProps => {
  const context = React.useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
