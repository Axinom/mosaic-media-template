import { PiletApi } from '@axinom/mosaic-portal';
import { ColumnMap, ColumnRenderer, Data } from '@axinom/mosaic-ui';
import React from 'react';

export const thumbnailFallback = (
  thumbnailProperty: keyof Data,
  map?: ColumnMap,
): ColumnRenderer<Data> => {
  const ThumbnailFallbackRenderer = (
    _state: unknown,
    _data: any,
  ): JSX.Element => {
    return <span title="No Renderer">No Renderer</span>;
  };
  return ThumbnailFallbackRenderer;
};

export let getThumbnailAndStateRenderer = () => thumbnailFallback;

/**
 * Initializes the getThumbnailAndStateRenderer function.
 * @param app The PiletApi object.
 */
export function setGetThumbnailAndStateRenderer(app: PiletApi): void {
  getThumbnailAndStateRenderer = () =>
    app.getData('thumbnailAndStateRenderer') ?? thumbnailFallback;
}
