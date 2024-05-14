import { GetProviders, PiletApi } from '@axinom/mosaic-portal';

export let getProviders: GetProviders;

/**
 * Sets getProvider from app api
 * @param app The PiletApi object.
 */
export function setGetProviders(app: PiletApi): void {
  getProviders = app.getProviders;
}
