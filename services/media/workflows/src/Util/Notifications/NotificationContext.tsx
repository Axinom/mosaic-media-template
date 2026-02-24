import { PiletApi } from '@axinom/mosaic-portal';
import { createContext, useContext } from 'react';

const noop: PiletApi['showNotification'] = () => '';

const NotificationContext = createContext<PiletApi['showNotification']>(noop);

export const NotificationProvider = NotificationContext.Provider;

export const useNotification = (): PiletApi['showNotification'] =>
  useContext(NotificationContext);
