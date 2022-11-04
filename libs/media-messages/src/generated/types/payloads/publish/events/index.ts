export * from './collection-published-event';
export * from './collection-unpublished-event';
export * from './episode-published-event';
export * from './episode-unpublished-event';
export * from './movie-genres-published-event';
export * from './movie-genres-unpublished-event';
export * from './movie-published-event';
export * from './movie-unpublished-event';
export * from './season-published-event';
export * from './season-unpublished-event';
export * from './tvshow-genres-published-event';
export * from './tvshow-genres-unpublished-event';
export * from './tvshow-published-event';
export * from './tvshow-unpublished-event';

export enum PublishEventsSchemas {
  CollectionPublishedEvent = 'payloads/publish/events/collection-published-event.json',
  CollectionUnpublishedEvent = 'payloads/publish/events/collection-unpublished-event.json',
  EpisodePublishedEvent = 'payloads/publish/events/episode-published-event.json',
  EpisodeUnpublishedEvent = 'payloads/publish/events/episode-unpublished-event.json',
  MovieGenresPublishedEvent = 'payloads/publish/events/movie-genres-published-event.json',
  MovieGenresUnpublishedEvent = 'payloads/publish/events/movie-genres-unpublished-event.json',
  MoviePublishedEvent = 'payloads/publish/events/movie-published-event.json',
  MovieUnpublishedEvent = 'payloads/publish/events/movie-unpublished-event.json',
  SeasonPublishedEvent = 'payloads/publish/events/season-published-event.json',
  SeasonUnpublishedEvent = 'payloads/publish/events/season-unpublished-event.json',
  TvshowGenresPublishedEvent = 'payloads/publish/events/tvshow-genres-published-event.json',
  TvshowGenresUnpublishedEvent = 'payloads/publish/events/tvshow-genres-unpublished-event.json',
  TvshowPublishedEvent = 'payloads/publish/events/tvshow-published-event.json',
  TvshowUnpublishedEvent = 'payloads/publish/events/tvshow-unpublished-event.json'
}

export enum PublishEventsTypes {
  CollectionPublishedEvent = 'CollectionPublishedEvent',
  CollectionUnpublishedEvent = 'CollectionUnpublishedEvent',
  EpisodePublishedEvent = 'EpisodePublishedEvent',
  EpisodeUnpublishedEvent = 'EpisodeUnpublishedEvent',
  MovieGenresPublishedEvent = 'MovieGenresPublishedEvent',
  MovieGenresUnpublishedEvent = 'MovieGenresUnpublishedEvent',
  MoviePublishedEvent = 'MoviePublishedEvent',
  MovieUnpublishedEvent = 'MovieUnpublishedEvent',
  SeasonPublishedEvent = 'SeasonPublishedEvent',
  SeasonUnpublishedEvent = 'SeasonUnpublishedEvent',
  TvshowGenresPublishedEvent = 'TvshowGenresPublishedEvent',
  TvshowGenresUnpublishedEvent = 'TvshowGenresUnpublishedEvent',
  TvshowPublishedEvent = 'TvshowPublishedEvent',
  TvshowUnpublishedEvent = 'TvshowUnpublishedEvent'
}