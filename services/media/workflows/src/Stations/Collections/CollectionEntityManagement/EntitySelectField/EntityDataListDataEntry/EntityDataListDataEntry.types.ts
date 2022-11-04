import { DynamicListDataEntryProps, UseModalResult } from '@axinom/mosaic-ui';
import { CollectionRelatedEntity } from '../../CollectionEntityManagement.types';

export interface UseEntityDataListDataEntryOptions {
  excludeItems: CollectionRelatedEntity[];
}

export interface UseEntityDataListDataEntryResult {
  EntityDataListDataEntry: React.FC<
    DynamicListDataEntryProps<CollectionRelatedEntity>
  >;
}

export interface Option extends UseModalResult {
  title: string;
}

export type UseAddOptionsResult = (
  onActionClicked: DynamicListDataEntryProps<
    CollectionRelatedEntity
  >['onActionClicked'],
  excludes: Record<string, number[]>,
  sortOrder: number,
) => Option[];
