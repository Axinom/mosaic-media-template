import { DynamicListDataEntryProps, UseModalResult } from '@axinom/mosaic-ui';
import { MovieRelatedCollections } from '../../CollectionEntityManagement.types';

export interface UseEntityDataListDataEntryOptions {
  excludeItems: MovieRelatedCollections[];
}

export interface UseEntityDataListDataEntryResult {
  EntityDataListDataEntry: React.FC<
    DynamicListDataEntryProps<MovieRelatedCollections>
  >;
}

export interface Option extends UseModalResult {
  title: string;
}

export type UseAddOptionsResult = (
  onActionClicked: DynamicListDataEntryProps<MovieRelatedCollections>['onActionClicked'],
  excludes: Record<string, number[]>,
  sortOrder: number,
) => Option[];
