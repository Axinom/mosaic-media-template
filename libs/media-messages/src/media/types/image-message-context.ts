import { IngestMessageContext } from './ingest-message-context';

export interface ImageMessageContext extends IngestMessageContext {
  imageType:
    | 'MOVIE_COVER_1x1'
    | 'MOVIE_COVER_16x9'
    | 'MOVIE_CLEAN_COVER_1x1'
    | 'MOVIE_CLEAN_COVER_16x9'
    | 'MOVIE_LIST_9x13'
    | 'MOVIE_LIST_1x1'
    | 'TVSHOW_COVER_1x1'
    | 'TVSHOW_COVER_16x9'
    | 'TVSHOW_CLEAN_COVER_1x1'
    | 'TVSHOW_CLEAN_COVER_16x9'
    | 'TVSHOW_LIST_9x13'
    | 'TVSHOW_LIST_1x1'
    | 'SEASON_COVER_1x1'
    | 'SEASON_COVER_16x9'
    | 'SEASON_CLEAN_COVER_1x1'
    | 'SEASON_CLEAN_COVER_16x9'
    | 'SEASON_LIST_9x13'
    | 'SEASON_LIST_1x1'
    | 'EPISODE_COVER_1x1'
    | 'EPISODE_COVER_16x9'
    | 'EPISODE_CLEAN_COVER_1x1'
    | 'EPISODE_CLEAN_COVER_16x9'
    | 'EPISODE_LIST_9x13'
    | 'EPISODE_LIST_1x1'
    | 'COLLECTION_COVER_1x1'
    | 'COLLECTION_COVER_4x1'
    | 'COLLECTION_CLEAN_COVER_1x1'
    | 'COLLECTION_CLEAN_COVER_4x1'
    | 'COLLECTION_LIST_15x16'
    | 'COLLECTION_LIST_1x1';
  isLocalization?: boolean;
  languageTag?: string;
}
