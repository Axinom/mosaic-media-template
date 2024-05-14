# About

The Channel Service is used to create and manage FAST channels, allowing users
to curate and publish dynamic content streams based on VOD entities. Once
published, these channels and their playlists become available int the Catalog
Service, enabling frontends to browse and discover available content.
Additionally, the playlists are published to the VOD-to-Live Service,
transforming video-on-demand content into live streams.

FAST channels are composed of media entities, which can include both movies and
episodes sourced from the Media Service. The Channel Service ensures the
validity of channels and playlists, providing validation mechanisms to ensure
the referenced video assets are encoded with the required settings.

This service uses PostgreSQL as a database and PostGraphile as an API engine.
Background operations use a message-bus based on RabbitMQ and the transactional
outbox and inbox pattern.

# Setup

- Check the root `README.md` file and follow the setup instructions.
- Potential customizations/deviations: check the file `.env` and modify any of
  the variables that might be different in your development environment.
- Run `yarn dev` to start (only) this service. Otherwise run `yarn dev:services`
  on the root to start all backend services.
- For more info on working with database migrations see
  [the corresponding `README`](../service/migrations/README.md).
- Execute `yarn util:token` command to receive a token with appropriate
  permissions to access the Channel Service.
- Open the GrapiQL endpoint and add that token into the Header like this:
  ```
  {
    "Authorization": "Bearer eyJhbGc..."
  }
  ```
- Service endpoints are ready to be used for testing and development.

# Validation

The Channel Service validates the channel, playlist and the used videos to
determine the eligibility of a Channel or Playlist for publishing from the
Channel Service.

A placeholder video must be set for the channel. This is used when no playlist
is currently active.

## Playlist validation rules

- The playlist must contain at least one program.
- A warning is reported if the playlist duration exceeds 24 hours.
- The playlist duration must not exceed 25 hours.
- The playlist start date must not be older than 24 hours.
- The playlist scheduling must not start and end with an ad pod.
- All videos associated with the playlist must have at least one common stream
  format (matching resolution, frame rate, and bitrate).

## Video validation rules

Every video assigned to a channel or playlist must pass the following validation
rules:

- Videos must use be encoded as `H264`.
- Videos must have a separate audio stream.
- Videos must be packaged in the `CMAF` format.
- If DRM protection is enabled, DRM-protected videos must have their DRM key
  identifiers defined.
- If DRM protection is disabled, videos cannot be DRM-protected.
