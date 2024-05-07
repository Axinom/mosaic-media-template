export const CommonErrors = {
  // Error level
  CatalogErrors: {
    message:
      "Error(s) occurred while trying to retrieve the %s with ID '%s' from the catalog service. Please contact the service support.",
    code: 'CATALOG_ERRORS',
  },
  BillingErrors: {
    message:
      'Error(s) occurred while trying to retrieve active subscription from the billing service. Please contact the service support.',
    code: 'BILLING_ERRORS',
  },
  NoMainVideo: {
    message:
      'The %s does not have a MAIN video. Please contact the service support.',
    code: 'NO_MAIN_VIDEO',
  },
  LicenseNotFound: {
    message: 'The %s does not have a license.',
    code: 'LICENSE_NOT_FOUND',
  },
  CatalogConnectionFailed: {
    message:
      'We were unable to connect to the catalog service. Please contact the service support or try again later.',
    code: 'CATALOG_CONNECTION_FAILED',
  },
  BillingConnectionFailed: {
    message:
      'We were unable to connect to the billing service. Please contact the service support or try again later.',
    code: 'BILLING_CONNECTION_FAILED',
  },
  MultipleMainVideos: {
    message:
      'The %s has multiple MAIN videos, which should not be possible. Please contact the service support.',
    code: 'MULTIPLE_MAIN_VIDEOS',
  },
  UnableToPlaybackVideo: {
    message: 'Unable to playback video.',
    code: 'UNABLE_TO_PLAYBACK_VIDEO',
  },

  // Debug level
  LicenseIsNotValid: {
    message:
      'The %s does not have a valid license in your current country (%s)',
    code: 'LICENSE_IS_NOT_VALID',
  },

  // Warn level
  InvalidClaimsInClaimSet: {
    message:
      'Unable to create or update claims set, because it contains invalid claims.',
    code: 'INVALID_CLAIMS_IN_CLAIM_SET',
  },
  ClaimSetUnpublishError: {
    message:
      'Unable to unpublish the claim set, because it is used by %s published subscription plan(s).',
    code: 'CLAIM_SET_UNPUBLISH_ERROR',
  },
  EmptyEntityId: {
    message: 'The provided entity ID is empty.',
    code: 'EMPTY_ENTITY_ID',
  },
  InvalidEntityId: {
    message:
      "The provided entity ID '%s' is invalid. It must start with 'movie-' or 'episode-' followed by a number, or start with 'channel-' followed by UUID.",
    code: 'INVALID_ENTITY_ID',
  },
  EntityNotFound: {
    message:
      'The %s cannot be retrieved. Please make sure that the %s is successfully published.',
    code: 'ENTITY_NOT_FOUND',
  },
  VideoNotProtected: {
    message:
      'The requested video for the %s is not protected. An entitlement message to receive a DRM license is therefore not required.',
    code: 'VIDEO_NOT_PROTECTED',
  },
  ChannelStreamUnavailable: {
    message:
      'The requested data for the %s does not have the required stream URLs. It is possible that the channel is still being processed.',
    code: 'CHANNEL_STREAM_UNAVAILABLE',
  },
  SubscriptionValidationError: {
    message:
      'The user either does not have an active subscription, or subscription does not allow the playback of specific video.',
    code: 'SUBSCRIPTION_VALIDATION_ERROR',
  },

  // Webhook errors
  NoStreamingPermissions: {
    message:
      'The user must have VIDEOS_STREAMING permission to request the video playback information.',
    code: 'NO_STREAMING_PERMISSION',
  },
  UnableToParseWebhookBody: {
    message:
      "Unable to parse the webhook request body. Please make sure that webhook request is sent with the header 'content-type':'application/json'.",
    code: 'UNABLE_TO_PARSE_WEBHOOK_BODY',
  },
} as const;
