import { DynamicListDataEntryProps, UseModalResult } from '@axinom/mosaic-ui';
import { TvshowRelatedCollections } from '../../CollectionEntityManagement.types';

export interface UseEntityDataListDataEntryOptions {
  excludeItems: TvshowRelatedCollections[];
}

export interface UseEntityDataListDataEntryResult {
  EntityDataListDataEntry: React.FC<
    DynamicListDataEntryProps<TvshowRelatedCollections>
  >;
}

export interface Option extends UseModalResult {
  title: string;
}

export type UseAddOptionsResult = (
  onActionClicked: DynamicListDataEntryProps<TvshowRelatedCollections>['onActionClicked'],
  excludes: Record<string, number[]>,
  sortOrder: number,
) => Option[];
