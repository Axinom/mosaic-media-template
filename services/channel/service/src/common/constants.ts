/**
 * Type name used to identify schedule that contain advertisement.
 */
export const AD_CUE_POINT_SCHEDULE_TYPE = 'AD_POD';

/**
 * Type name used to identify schedule that contain video.
 */
export const VIDEO_CUE_POINT_SCHEDULE_TYPE = 'VIDEO';

/**
 * The messaging routing key for the outbox/inbox messaging health check
 */
export const HEALTH_CHECK_ROUTING_KEY = 'channel_service.health_check';

export const DEFAULT_LOCALIZATION_NAME = 'default'; // used as fallback if localization is disabled
export const LOCALIZATION_CHANNEL_TYPE = 'channel';
export const LOCALIZATION_PROGRAM_TYPE = 'program';
export const LOCALIZATION_IS_DEFAULT_LOCALE = '@isDefaultLocale';
export const LOCALIZATION_LANGUAGE_TAG = '@languageTag';
