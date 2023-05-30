import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class PublishServiceMessagingSettings implements MessagingSettings {
  public static MoviePublished = new PublishServiceMessagingSettings(
    'MoviePublished', 
    'movie:published', 
    'movie.published'
    );
  public static MovieUnpublished = new PublishServiceMessagingSettings(
    'MovieUnpublished', 
    'movie:unpublished', 
    'movie.unpublished'
    );
  public static SeasonPublished = new PublishServiceMessagingSettings(
    'SeasonPublished', 
    'season:published', 
    'season.published'
    );
  public static SeasonUnpublished = new PublishServiceMessagingSettings(
    'SeasonUnpublished', 
    'season:unpublished', 
    'season.unpublished'
    );
  public static TvshowPublished = new PublishServiceMessagingSettings(
    'TvshowPublished', 
    'tvshow:published', 
    'tvshow.published'
    );
  public static TvshowUnpublished = new PublishServiceMessagingSettings(
    'TvshowUnpublished', 
    'tvshow:unpublished', 
    'tvshow.unpublished'
    );
  public static EpisodePublished = new PublishServiceMessagingSettings(
    'EpisodePublished', 
    'episode:published', 
    'episode.published'
    );
  public static EpisodeUnpublished = new PublishServiceMessagingSettings(
    'EpisodeUnpublished', 
    'episode:unpublished', 
    'episode.unpublished'
    );
  public static CollectionPublished = new PublishServiceMessagingSettings(
    'CollectionPublished', 
    'collection:published', 
    'collection.published'
    );
  public static CollectionUnpublished = new PublishServiceMessagingSettings(
    'CollectionUnpublished', 
    'collection:unpublished', 
    'collection.unpublished'
    );
  public static MovieGenresPublished = new PublishServiceMessagingSettings(
    'MovieGenresPublished', 
    'movie-genres:published', 
    'movie-genres.published'
    );
  public static MovieGenresUnpublished = new PublishServiceMessagingSettings(
    'MovieGenresUnpublished', 
    'movie-genres:unpublished', 
    'movie-genres.unpublished'
    );
  public static TvshowGenresPublished = new PublishServiceMessagingSettings(
    'TvshowGenresPublished', 
    'tvshow-genres:published', 
    'tvshow-genres.published'
    );
  public static TvshowGenresUnpublished = new PublishServiceMessagingSettings(
    'TvshowGenresUnpublished', 
    'tvshow-genres:unpublished', 
    'tvshow-genres.unpublished'
    );
  
  public readonly serviceId = 'media-service';
  
  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly routingKey: string,
  ) {
    
  }

  public toString = (): string => {
    return this.messageType;
  };
}