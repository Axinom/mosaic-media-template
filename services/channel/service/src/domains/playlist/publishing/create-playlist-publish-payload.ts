import { DetailedImage, DetailedVideo } from '@axinom/mosaic-messages';
import { PlaylistPublishedEvent } from 'media-messages';
import { buildPublishingId } from '../../../publishing';
import { LocalizedPlaylistPublishDto } from './aggregate-playlist-publish-dto';

export const createPlaylistPublishPayload = (
  dto: LocalizedPlaylistPublishDto,
  images: DetailedImage[],
  videos: DetailedVideo[],
): PlaylistPublishedEvent => {
  return {
    content_id: buildPublishingId('PLAYLIST', dto.id),
    channel_id: buildPublishingId('CHANNEL', dto.channel_id),
    start_date_time: dto.start_date_time,
    end_date_time: dto.calculated_end_date_time,
    programs: dto.programs.map((pr) => ({
      content_id: buildPublishingId('PROGRAM', pr.id),
      entity_content_id: buildPublishingId(pr.entity_type, pr.entity_id),
      sort_index: pr.sort_index,
      image: images.filter((image) => image.id === pr.image_id)[0],
      video: videos.filter((video) => video.id === pr.video_id)[0],
      video_duration_in_seconds: pr.video_duration_in_seconds,
      program_cue_points: pr.program_cue_points
        .filter((cp) => cp.cue_point_schedules.length > 0)
        .map((cp) => ({
          id: cp.id,
          time_in_seconds: cp.time_in_seconds,
          type: cp.type,
          value: cp.value,
          schedules: cp.cue_point_schedules.map((s) => ({
            id: s.id,
            sort_index: s.sort_index,
            duration_in_seconds: s.duration_in_seconds,
            video: videos.filter((video) => video.id === s.video_id)[0],
            type: s.type,
          })),
        })),
      localizations: pr.localizations,
    })),
  };
};
