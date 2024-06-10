import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class PublishServiceMessagingSettings implements MessagingSettings {
  /**
   * Defines the messaging settings for the event with message type 
   * "MoviePublished" and aggregate type "movie".
   * The aggregate ID field contains the value of the "movie ID" field.
   */
  public static MoviePublished = new PublishServiceMessagingSettings(
    'MoviePublished', 
    'inbox', 
    'movie.published',
    'event',
    'movie'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "MovieUnpublished" and aggregate type "movie".
   * The aggregate ID field contains the value of the "movie ID" field.
   */
  public static MovieUnpublished = new PublishServiceMessagingSettings(
    'MovieUnpublished', 
    'inbox', 
    'movie.unpublished',
    'event',
    'movie'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "SeasonPublished" and aggregate type "season".
   * The aggregate ID field contains the value of the "season ID" field.
   */
  public static SeasonPublished = new PublishServiceMessagingSettings(
    'SeasonPublished', 
    'inbox', 
    'season.published',
    'event',
    'season'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "SeasonUnpublished" and aggregate type "season".
   * The aggregate ID field contains the value of the "season ID" field.
   */
  public static SeasonUnpublished = new PublishServiceMessagingSettings(
    'SeasonUnpublished', 
    'inbox', 
    'season.unpublished',
    'event',
    'season'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "TvshowPublished" and aggregate type "tvshow".
   * The aggregate ID field contains the value of the "tvshow ID" field.
   */
  public static TvshowPublished = new PublishServiceMessagingSettings(
    'TvshowPublished', 
    'inbox', 
    'tvshow.published',
    'event',
    'tvshow'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "TvshowUnpublished" and aggregate type "tvshow".
   * The aggregate ID field contains the value of the "tvshow ID" field.
   */
  public static TvshowUnpublished = new PublishServiceMessagingSettings(
    'TvshowUnpublished', 
    'inbox', 
    'tvshow.unpublished',
    'event',
    'tvshow'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "EpisodePublished" and aggregate type "episode".
   * The aggregate ID field contains the value of the "episode ID" field.
   */
  public static EpisodePublished = new PublishServiceMessagingSettings(
    'EpisodePublished', 
    'inbox', 
    'episode.published',
    'event',
    'episode'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "EpisodeUnpublished" and aggregate type "episode".
   * The aggregate ID field contains the value of the "episode ID" field.
   */
  public static EpisodeUnpublished = new PublishServiceMessagingSettings(
    'EpisodeUnpublished', 
    'inbox', 
    'episode.unpublished',
    'event',
    'episode'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "CollectionPublished" and aggregate type "collection".
   * The aggregate ID field contains the value of the "collection ID" field.
   */
  public static CollectionPublished = new PublishServiceMessagingSettings(
    'CollectionPublished', 
    'inbox', 
    'collection.published',
    'event',
    'collection'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "CollectionUnpublished" and aggregate type "collection".
   * The aggregate ID field contains the value of the "collection ID" field.
   */
  public static CollectionUnpublished = new PublishServiceMessagingSettings(
    'CollectionUnpublished', 
    'inbox', 
    'collection.unpublished',
    'event',
    'collection'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "MovieGenresPublished" and aggregate type "movie-genres".
   * The aggregate ID is not known (yet) so the field contains the value "UNDEFINED_ID".
   */
  public static MovieGenresPublished = new PublishServiceMessagingSettings(
    'MovieGenresPublished', 
    'inbox', 
    'movie-genres.published',
    'event',
    'movie-genres'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "MovieGenresUnpublished" and aggregate type "movie-genres".
   * The aggregate ID is not known (yet) so the field contains the value "UNDEFINED_ID".
   */
  public static MovieGenresUnpublished = new PublishServiceMessagingSettings(
    'MovieGenresUnpublished', 
    'inbox', 
    'movie-genres.unpublished',
    'event',
    'movie-genres'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "TvshowGenresPublished" and aggregate type "tvshow-genres".
   * The aggregate ID is not known (yet) so the field contains the value "UNDEFINED_ID".
   */
  public static TvshowGenresPublished = new PublishServiceMessagingSettings(
    'TvshowGenresPublished', 
    'inbox', 
    'tvshow-genres.published',
    'event',
    'tvshow-genres'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "TvshowGenresUnpublished" and aggregate type "tvshow-genres".
   * The aggregate ID is not known (yet) so the field contains the value "UNDEFINED_ID".
   */
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