import { IngestEntityProcessor } from '../ingest';
import { IngestMovieProcessor } from './movies';
import {
  IngestEpisodeProcessor,
  IngestSeasonProcessor,
  IngestTvshowProcessor,
} from './tvshows';

// Order of plugins is important! e.g. TvShows must be processed before Seasons, and Seasons before Episodes.
export const ingestProcessors: IngestEntityProcessor[] = [
  new IngestTvshowProcessor(),
  new IngestSeasonProcessor(),
  new IngestEpisodeProcessor(),
  new IngestMovieProcessor(),
];
