import { Config } from '../common';
import { IngestEntityProcessor } from '../ingest';
import { IngestMovieProcessor } from './movies';
import {
  IngestEpisodeProcessor,
  IngestSeasonProcessor,
  IngestTvshowProcessor,
} from './tvshows';

// Order of plugins is important! e.g. TvShows must be processed before Seasons, and Seasons before Episodes.
export const getIngestProcessors = (
  config: Config,
): IngestEntityProcessor[] => [
  new IngestTvshowProcessor(config),
  new IngestSeasonProcessor(config),
  new IngestEpisodeProcessor(config),
  new IngestMovieProcessor(config),
];
