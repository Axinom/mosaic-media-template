import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class PublishServiceMessagingSettings implements MessagingSettings {
  public static MoviePublished = new PublishServiceMessagingSettings(
    'MoviePublished', 
    'inbox', 
    'movie.published',
    'event',
    'movie'
    );
  public static MovieUnpublished = new PublishServiceMessagingSettings(
    'MovieUnpublished', 
    'inbox', 
    'movie.unpublished',
    'event',
    'movie'
    );
  public static SeasonPublished = new PublishServiceMessagingSettings(
    'SeasonPublished', 
    'inbox', 
    'season.published',
    'event',
    'season'
    );
  public static SeasonUnpublished = new PublishServiceMessagingSettings(
    'SeasonUnpublished', 
    'inbox', 
    'season.unpublished',
    'event',
    'season'
    );
  public static TvshowPublished = new PublishServiceMessagingSettings(
    'TvshowPublished', 
    'inbox', 
    'tvshow.published',
    'event',
    'tvshow'
    );
  public static TvshowUnpublished = new PublishServiceMessagingSettings(
    'TvshowUnpublished', 
    'inbox', 
    'tvshow.unpublished',
    'event',
    'tvshow'
    );
  public static EpisodePublished = new PublishServiceMessagingSettings(
    'EpisodePublished', 
    'inbox', 
    'episode.published',
    'event',
    'episode'
    );
  public static EpisodeUnpublished = new PublishServiceMessagingSettings(
    'EpisodeUnpublished', 
    'inbox', 
    'episode.unpublished',
    'event',
    'episode'
    );
  public static CollectionPublished = new PublishServiceMessagingSettings(
    'CollectionPublished', 
    'inbox', 
    'collection.published',
    'event',
    'collection'
    );
  public static CollectionUnpublished = new PublishServiceMessagingSettings(
    'CollectionUnpublished', 
    'inbox', 
    'collection.unpublished',
    'event',
    'collection'
    );
  public static MovieGenresPublished = new PublishServiceMessagingSettings(
    'MovieGenresPublished', 
    'inbox', 
    'movie-genres.published',
    'event',
    'movie-genres'
    );
  public static MovieGenresUnpublished = new PublishServiceMessagingSettings(
    'MovieGenresUnpublished', 
    'inbox', 
    'movie-genres.unpublished',
    'event',
    'movie-genres'
    );
  public static TvshowGenresPublished = new PublishServiceMessagingSettings(
    'TvshowGenresPublished', 
    'inbox', 
    'tvshow-genres.published',
    'event',
    'tvshow-genres'
    );
  public static TvshowGenresUnpublished = new PublishServiceMessagingSettings(
    'TvshowGenresUnpublished', 
    'inbox', 
    'tvshow-genres.unpublished',
    'event',
    'tvshow-genres'
    );
  
  public readonly serviceId = 'media-service';
  
  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly routingKey: string,
    public readonly action: 'command' | 'event',
    public readonly aggregateType: string,
  ) {
    
  }

  public toString = (): string => {
    return this.messageType;
  };
}