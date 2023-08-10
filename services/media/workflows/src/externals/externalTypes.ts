import { ImageLoaderProps } from '@axinom/mosaic-ui';
import { Maybe, Scalars } from '../generated/graphql';

export type VideoID = Scalars['UUID'];
export type ImageID = Scalars['UUID'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExtensionParams<T = any> {
  /**
   * Property holding the props passed to the extension.
   */
  params: T;
}

export interface VideoSelectExplorerProps {
  /** Optional Title shown in page header (default: 'Videos') */
  title?: string;
  /** Whether or not the selection of multiple items is allowed (default: false) */
  allowBulkSelect: boolean;
  /** IDs of items which will be excluded from the explorer. Can be used to remove already selected items. */
  excludeItems?: VideoID[];
  /** Unique identifier used to store states related to explorer */
  stationKey?: string;
  /** In multiselect mode, whether the Select All button will be displayed. This is currently not fully supported. (default: false) */
  enableSelectAll?: boolean;
  /**
   * Callback called when the user finished the selection.
   * The IDs of the selected item (or items) will be passed as argument to the callback.
   */
  onSelected: (value: VideoID[]) => void;
  /** Callback called when the user cancels the selection */
  onCancel?: () => void;
}

export interface ImageCoverProps {
  /** Image Id */
  id: string;
}

export interface ImagePreviewProps extends Omit<ImageLoaderProps, 'imgSrc'> {
  /** Image Id */
  id: string;
  /** Whether to render a full size preview image or a thumbnail. default('preview') */
  type?: 'preview' | 'thumbnail';
}

export interface ImageSelectExplorerProps {
  /** Optional Title shown in page header (default: 'Images') */
  title?: string;
  /** Whether or not the selection of multiple items is allowed (default: false) */
  allowBulkSelect: boolean;
  /** IDs of items which will be excluded from the explorer. Can be used to remove already selected items. */
  excludeItems?: ImageID[];
  /** Unique identifier used to store states related to explorer */
  stationKey?: string;
  /** In multi-select mode, whether the Select All button will be displayed. This is currently not fully supported. (default: false) */
  enableSelectAll?: boolean;
  /** Image Type */
  imageType?: string;
  /**
   * Callback called when the user finished the selection.
   * The IDs of the selected item (or items) will be passed as argument to the callback.
   */
  onSelected: (value: ImageID[]) => void;
  /** Callback called when the user cancels the selection */
  onCancel?: () => void;
}

// #region Channel Service (workflows) external types - TODO: Import from service workflows
export interface ProgramEntity {
  title: Scalars['String'];
  videoId: Scalars['UUID'];
  entityId: Scalars['String'];
  imageId?: Maybe<Scalars['UUID']>;
}

export interface FastProviderData {
  type: string;
  label: string;
  selectionComponent: React.FC<{
    onClose: () => void;
    onSelected: (items: ProgramEntity[]) => void;
  }>;
  detailsResolver?: (params: {
    entityId: string;
    entityType: string;
  }) => string;
}

export type FastProviderType = 'fast-provider';

declare module '@axinom/mosaic-portal' {
  interface ProviderRegistration {
    (type: FastProviderType, data: FastProviderData): void;
  }
  interface GetProviders {
    (type: FastProviderType): FastProviderData[];
  }

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
// #endregion
