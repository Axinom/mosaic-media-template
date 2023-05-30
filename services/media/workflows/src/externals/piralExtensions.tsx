import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import {
  ExtensionParams,
  ImageCoverProps,
  ImageSelectExplorerProps,
  VideoSelectExplorerProps,
} from './externalTypes';
import { setGetThumbnailAndStateRenderer } from './thumbnails';

export interface Extensions {
  VideoSelectExplorer: React.FC<ExtensionParams<VideoSelectExplorerProps>>;
  ImageCover: React.FC<ExtensionParams<ImageCoverProps>>;
  ImageSelectExplorer: React.FC<ExtensionParams<ImageSelectExplorerProps>>;
  ImageSelectField: React.FC<ExtensionParams<unknown>>;
  VideoSelectField: React.FC<ExtensionParams<unknown>>;
}

const defaultValue = (): JSX.Element => <div>Extension not Loaded</div>;

export const ExtensionsContext = React.createContext<Extensions>({
  VideoSelectExplorer: defaultValue,
  ImageCover: defaultValue,
  ImageSelectExplorer: defaultValue,
  ImageSelectField: defaultValue,
  VideoSelectField: defaultValue,
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

  /** Extensions */
  const VideoSelectExplorer: React.FC = (props) => (
    <app.Extension
      name="video-select-explorer"
      empty={defaultValue}
      {...props}
    />
  );

  const ImageCover: React.FC = (props) => (
    <app.Extension name="image-cover" empty={defaultValue} {...props} />
  );

  const ImageSelectExplorer: React.FC = (props) => (
    <app.Extension
      name="image-select-explorer"
      empty={defaultValue}
      {...props}
    />
  );

  const ImageSelectField: React.FC = (props) => (
    <app.Extension
      name="image-select-field"
      empty={defaultValue}
      params={props}
    />
  );

  const VideoSelectField: React.FC = (props) => (
    <app.Extension
      name="video-select-field"
      empty={defaultValue}
      params={props}
    />
  );

  return {
    VideoSelectExplorer,
    ImageCover,
    ImageSelectExplorer,
    ImageSelectField,
    VideoSelectField,
  };
};
