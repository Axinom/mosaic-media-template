import { CollectionsQuery } from '../../../generated/graphql';

export type CollectionData = NonNullable<
  CollectionsQuery['filtered']
>['nodes'][number];
