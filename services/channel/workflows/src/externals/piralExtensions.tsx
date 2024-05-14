import {
  bindImageExtensions,
  bindVideoExtensions,
  extensionDefaultValue,
  ImageExtensions,
  setGetThumbnailAndStateRenderer,
  setGetVideoCuePointsData,
  VideoExtensions,
} from '@axinom/mosaic-managed-workflow-integration';
import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';

export type Extensions = ImageExtensions & VideoExtensions;

export const ExtensionsContext = React.createContext<Extensions>({
  ImageCover: extensionDefaultValue,
  ImagePreview: extensionDefaultValue,
  ImageSelectExplorer: extensionDefaultValue,
  ImageSelectField: extensionDefaultValue,
  VideoSelectExplorer: extensionDefaultValue,
  VideoSelectField: extensionDefaultValue,
});

/**
 * This method is binding all externally shared items (Extensions, Data,...) that the workflows of this Pilet need.
 * The need extensions are directly returned. Other shared functions are initialized and provided through module exports.
 *
 * @param app The PiletApi object.
 * @returns An object containing all external extensions that can be used as value as `ExtensionsContext.Provider` value.
 */
export const bindExtensions = (app: PiletApi): Extensions => {
  setGetThumbnailAndStateRenderer(app);
  setGetVideoCuePointsData(app);

  /** Video Extensions */
  const { VideoSelectExplorer, VideoSelectField } = bindVideoExtensions(app);

  /** Image Extensions */
  const { ImageCover, ImagePreview, ImageSelectExplorer, ImageSelectField } =
    bindImageExtensions(app);

  return {
    ImageCover,
    ImagePreview,
    ImageSelectExplorer,
    ImageSelectField,
    VideoSelectExplorer,
    VideoSelectField,
  };
};
