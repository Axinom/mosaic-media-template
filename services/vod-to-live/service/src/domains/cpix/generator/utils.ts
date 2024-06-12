import { DetailedVideo } from 'media-messages';
import { DRMKey } from '../models';

export const getDrmKeys = (video: DetailedVideo): DRMKey[] => {
  if (video.video_encoding.is_protected) {
    const streamsForParallel = video.video_encoding.video_streams?.filter(
      (vs) =>
        vs.format === 'CMAF' &&
        vs.file &&
        (vs.type === 'AUDIO' || vs.type === 'VIDEO'),
    );
    return streamsForParallel.reduce((result, entry) => {
      if (
        entry.key_id &&
        !result.find(
          (k) => k.keyId === entry.key_id && k.keyType === entry.type,
        )
      ) {
        return [
          ...result,
          new DRMKey(entry.key_id, entry.type === 'VIDEO' ? 'VIDEO' : 'AUDIO'),
        ];
      }
      return result;
    }, new Array<DRMKey>());
  }
  return [];
};
