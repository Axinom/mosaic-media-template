export interface ChannelLocalization {
  /**
   * Boolean flag to indicate if locale is default or not.
   */
  is_default_locale: boolean;
  /**
   * The locale for which the values are localized.
   */
  language_tag: string;
  /**
   * Title of the channel.
   */
  title: string;
  /**
   * Channel's description.
   */
  description?: string | null;
}