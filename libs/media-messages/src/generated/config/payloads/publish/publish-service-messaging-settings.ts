import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class PublishServiceMessagingSettings implements MessagingSettings {
  public static MoviePublished = new PublishServiceMessagingSettings(
    'MoviePublished', 
    'movie:published', 
    'movie.published',
    'event',
    'movie'
    );
  public static MovieUnpublished = new PublishServiceMessagingSettings(
    'MovieUnpublished', 
    'movie:unpublished', 
    'movie.unpublished',
    'event',
    'movie'
    );
  public static SeasonPublished = new PublishServiceMessagingSettings(
    'SeasonPublished', 
    'season:published', 
    'season.published',
    'event',
    'season'
    );
  public static SeasonUnpublished = new PublishServiceMessagingSettings(
    'SeasonUnpublished', 
    'season:unpublished', 
    'season.unpublished',
    'event',
    'season'
    );
  public static TvshowPublished = new PublishServiceMessagingSettings(
    'TvshowPublished', 
    'tvshow:published', 
    'tvshow.published',
    'event',
    'tvshow'
    );
  public static TvshowUnpublished = new PublishServiceMessagingSettings(
    'TvshowUnpublished', 
    'tvshow:unpublished', 
    'tvshow.unpublished',
    'event',
    'tvshow'
    );
  public static EpisodePublished = new PublishServiceMessagingSettings(
    'EpisodePublished', 
    'episode:published', 
    'episode.published',
    'event',
    'episode'
    );
  public static EpisodeUnpublished = new PublishServiceMessagingSettings(
    'EpisodeUnpublished', 
    'episode:unpublished', 
    'episode.unpublished',
    'event',
    'episode'
    );
  public static CollectionPublished = new PublishServiceMessagingSettings(
    'CollectionPublished', 
    'collection:published', 
    'collection.published',
    'event',
    'collection'
    );
  public static CollectionUnpublished = new PublishServiceMessagingSettings(
    'CollectionUnpublished', 
    'collection:unpublished', 
    'collection.unpublished',
    'event',
    'collection'
    );
  public static MovieGenresPublished = new PublishServiceMessagingSettings(
    'MovieGenresPublished', 
    'movie-genres:published', 
    'movie-genres.published',
    'event',
    'movie-genres'
    );
  public static MovieGenresUnpublished = new PublishServiceMessagingSettings(
    'MovieGenresUnpublished', 
    'movie-genres:unpublished', 
    'movie-genres.unpublished',
    'event',
    'movie-genres'
    );
  public static TvshowGenresPublished = new PublishServiceMessagingSettings(
    'TvshowGenresPublished', 
    'tvshow-genres:published', 
    'tvshow-genres.published',
    'event',
    'tvshow-genres'
    );
  public static TvshowGenresUnpublished = new PublishServiceMessagingSettings(
    'TvshowGenresUnpublished', 
    'tvshow-genres:unpublished', 
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