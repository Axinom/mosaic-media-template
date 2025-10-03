import { BulkEditCollectionsAsyncFormFieldsConfig } from '../../../../generated/graphql';
import { labelMapper, typeMapper } from '../../../../Util/BulkEdit';

export const CollectionsBulkEditConfig = (() => {
  const fields: Partial<
    typeof BulkEditCollectionsAsyncFormFieldsConfig.fields
  > = {
    ...BulkEditCollectionsAsyncFormFieldsConfig.fields,
  };

  labelMapper(fields, {
    collectionsTagsAdd: 'Tags (Add)',
    collectionsTagsRemove: 'Tags (Remove)',
  });

  typeMapper(fields, {
    collectionRelationsAdd: 'EntitySelection',
    collectionRelationsRemove: 'EntitySelection',
  });

  delete fields['collectionsSnapshotsAdd'];
  delete fields['collectionsSnapshotsRemove'];
  delete fields['collectionsImagesAdd'];
  delete fields['collectionsImagesRemove'];

  fields['collectionsCoverImagesAdd'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Add)',
    originalFieldName: 'collectionsImages',
    action: BulkEditCollectionsAsyncFormFieldsConfig.keys.add,
  };

  fields['collectionsCoverImagesRemove'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Remove)',
    originalFieldName: 'collectionsImages',
    action: BulkEditCollectionsAsyncFormFieldsConfig.keys.remove,
  };

  return {
    ...BulkEditCollectionsAsyncFormFieldsConfig,
    fields,
  };
})();
