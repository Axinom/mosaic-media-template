import { Scalars } from '../generated/graphql';

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
