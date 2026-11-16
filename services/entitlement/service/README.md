# Entitlement Service

## Overview

This is the backend service with a focus on checking wether a client is entitled
to playback videos. It uses PostgreSQL as a database and PostGraphile as the
GraphQL API engine

## License note

This service uses the geoip-country npm package to lookup country codes based on
the IP address of the user to determine if the movie or episode has a valid
playback license. This library, in turn, uses a MaxMind (https://www.maxmind.com
) GeoLite2 Free Geolocation Data internally. This database is free but has
certain licensing conditions that you should follow. Most notable are providing
attribution to MaxMind (same as the reference to their website above) and
keeping the geolocation databases up-to-date. This can be done by periodically
updating the geoip-country npm package or by specifying a GeoLite2 license key
in the GEOLITE2_LICENSE_KEY env variable. This will enable automatic DB updates
during service runtime. Please have a look at their EULA
(https://www.maxmind.com/en/geolite2/eula ).

## Setup and Startup

- Prerequisite: enable the DRM Service for your environment in the Management
  System (Settings / DRM Service) and create a communication key there.
- Check the root `README.md` file and follow the setup instructions. The
  `yarn setup` script creates a service account for this service with the
  `ax-drm-service: ADMIN` permission, writes its credentials
  (`SERVICE_ACCOUNT_CLIENT_ID` and `SERVICE_ACCOUNT_CLIENT_SECRET`) to the
  `.env` file, and checks that the DRM Service is enabled.
- Potential customizations/deviations: check the file `.env` and modify any of
  the variables that might be different in your development environment.
  - `DRM_SERVICE_BASE_URL` points to the DRM Service of your Mosaic stage. The
    `LICENSE_SERVICE_*_URL` variables default to the production License Service.
  - Sign up for a free GeoLite2 account at
    https://dev.maxmind.com/geoip/geolite2-free-geolocation-data, generate a
    license key and set it as the value for the GEOLITE2_LICENSE_KEY. If your
    service(s) run into the Maxmind daily download limit you can set up your own
    GEO database (proxy) cache or repository. You can set the URL to this
    service/DB as the `GEOLITE2_DOWNLOAD_URL` in your environment variables.
  - (Optionally) run `yarn setup:webhooks` to generate webhook secrets and set
    related values in `.env` file. This will enable `/entitlement` and
    `/manifest` webhook endpoints to be able to authenticate requests.
- Run `yarn dev` to start (only) this service. Otherwise run `yarn dev:services`
  on the root to start all backend services.
- For more info on working with database migrations see
  [the corresponding `README`](../service/migrations/README.md).

## DRM settings

The service reads the DRM settings of its environment from the Mosaic DRM
Service at runtime, with its own service account:

- The **communication key** signs the entitlement messages. A new key needs up
  to 10 minutes to become active in the License Service. The service therefore
  ignores keys younger than 10 minutes and uses the newest of the remaining
  keys. If all keys are younger than 10 minutes, it uses the oldest of them. To
  replace a key, create the new key first and delete the old key only after the
  service has switched to the new one (about 15 minutes later).
- The **DRM tenant ID** is used to build the License Service URLs returned by
  the `/entitlement` webhook.
- The **FairPlay certificate** returned by the `/entitlement` webhook is the
  first FairPlay dataset, or the Axinom test certificate while it may still be
  used.

The settings are loaded at startup and refreshed in the background every 5
minutes. Requests always use the current settings and never wait for a refresh.
If a refresh fails, the service keeps the last known settings and retries with
backoff.

At startup, the service reports itself ready once the settings are loaded, or
after 15 seconds at the latest, so it also starts in environments without the
DRM Service. Until the settings are loaded, protected content fails with the
error `DRM_SERVICE_REQUEST_FAILED`, and the service retries at least every 30
seconds. Clear content doesn't need the DRM Service: the GraphQL `entitlement`
query rejects it before the lookup, and the Video Service calls the
`/entitlement` webhook only for protected videos.

## Development and Testing notes

The service has one API endpoint `entitlement` and it expects catalog service to
be running and to have published movies or episodes with protected videos
associated with them. In addition to that, `entitlement` service will try to
determine the current country of the user, based on his IP address and this
country will be used to check if a movie or episode has a valid license. During
development and in a test environment, it might be desirable to simulate the
behavior of being located in different countries and test license validation
logic for licenses that have different country codes.

To do this, `MOSAIC_TESTING_IP_ENABLED` can be used. Setting this flag to true
allows to pass any IP address (v4 or v6) as a custom header, and that value will
override the actual IP. To summarize, GraphQL request can look like this:

```
query Entitlement {
  entitlement(input: { entityId: "movie-1" }) {
    entitlementMessageJwt
  }
}
```

And passed with headers like this:

```
{
  "Authorization": "Bearer jwt_value_placeholder",
  "mosaic-testing-ip":"2a05:4f46:c14:5700:fcee:3dcb:301c:fed5"
}
```

Different IP address ranges for specific countries can be found in google. To
get the jwt value during development, `yarn util:token` can be executed.

## Setting up webhook secrets for production environment

The `yarn setup:webhooks` script is used for development environments. To get
the values for `ENTITLEMENT_WEBHOOK_SECRET` and `MANIFEST_WEBHOOK_SECRET` env
variables for the production environment, the following mutation must be
launched against the Video Service GraphQL API. You can use GraphiQL UI for that
(https://video.service.eu.axinom.net/graphiql):

```
  mutation GenerateSecrets {
    generateEntitlementWebhookSecret {
      secret
    }
    generateManifestWebhookSecret {
      secret
    }
  }
```

To authenticate the request, you would need an appropriate JWT. To get the JWT -
the Portal Admin UI can be used (https://admin.service.eu.axinom.com). You would
need to create or use an existing service account for your environment, make
sure it has `Settings: Edit` permission for the Video Service, and generate a
JWT on a dedicated `Access Token` station. More info here:
https://docs.axinom.com/platform/core/identity/authenticate-serviceaccount
