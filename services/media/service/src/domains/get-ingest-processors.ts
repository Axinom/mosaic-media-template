import { Config } from '../common';
import { IngestEntityProcessor } from '../ingest';
import { IngestCollectionProcessor } from './collections';
import { IngestMovieProcessor } from './movies';
import {
  IngestEpisodeProcessor,
  IngestSeasonProcessor,
  IngestTvshowProcessor,
} from './tvshows';

// Order of plugins is important! e.g. TvShows must be processed before Seasons, and Seasons before Episodes.
// Collections should be processed last, as they may depend on other entities.
export const getIngestProcessors = (
  config: Config,
): IngestEntityProcessor[] => [
  new IngestTvshowProcessor(config),
  new IngestSeasonProcessor(config),
  new IngestEpisodeProcessor(config),
  new IngestMovieProcessor(config),
  new IngestCollectionProcessor(config),
];
