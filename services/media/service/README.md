# Media Service

## Overview

This is the backend service with a focus on media management. It uses PostgreSQL
as a database and PostGraphile as the GraphQL API engine. Background operations
are using a message-bus based on RabbitMQ.

## Setup and Startup

- Check the root `README.md` file and follow the setup instructions.
- Potential customizations/deviations: check the file `.env` and modify any of
  the variables that might be different in your development environment.
- Run `yarn dev` to start (only) this service. Otherwise run `yarn dev:services`
  on the root to start all backend services.
- For more info on working with database migrations see
  [the corresponding `README`](../service/migrations/README.md).

## (Optional) Generating test Ingest files

Media service has a dedicated script to generate working ingest document files:
`yarn util:ingest-gen`.

If simplified, the script execution process looks like this:

- Request existing encoding processing profiles from configured encoding service
  URL
- Request existing genres from the media service database
- Generate random image files and put them into the configured blob storage
  container
- Make multiple copies of the sample video file and put them into the configured
  blob storage container
- Generate Ingest Document JSON file using data from requested encoding
  profiles, genres, generated videos, images, and pseudo-random metadata
- Save this file into the `services/media/service/ingest-gen` folder, which is
  excluded from source control by default.

To make sure that the script is fully functional, some configurations must be
set in `.env` file in `media/service`

```
DEV_IMAGE_BLOB_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=accountKey;EndpointSuffix=core.windows.net
DEV_IMAGE_BLOB_STORAGE_CONTAINER=source-images
DEV_VIDEO_BLOB_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=accountKey;EndpointSuffix=core.windows.net
DEV_VIDEO_BLOB_STORAGE_CONTAINER=source-videos
```

- Both connection strings and containers must match information from Image/Video
  Acquisition profiles, otherwise ingest process will simply not find the files.
- If values are not specified - files processing will be skipped and the
  resulting ingest document file will have no image/video file references.
- Connection string value can also be a SAS connection string of the following
  format:
  `BlobEndpoint=https://myaccount.blob.core.windows.net/;QueueEndpoint=https://myaccount.queue.core.windows.net/;FileEndpoint=https://myaccount.file.core.windows.net/;TableEndpoint=https://myaccount.table.core.windows.net/;SharedAccessSignature=sasString`
- Because the script also makes requests to encoding service API and media
  service database - appropriate values must be configured as well, but they
  should have default values. Otherwise - errors would be thrown, indicating the
  problem.

The script will make the best effort to generate valid metadata, meaning
prioritizing assigning videos as main videos, and only after using leftover
videos for trailers. Similarly, the first images are allocated for Cover
assignment, and only later for Teaser.

By default, ingest file will be generated with the following distribution:

- 50 entities
- 100 images
- 100 videos
- ingest name - `default` (used as an identifier for files, external_id values,
  and ingest file name)

These parameters can be explicitly overridden (but the number of entities cannot
be less than 4, 1 per entity type). Script call with overrides would look like
this:

```
yarn util:ingest-gen --entitiesCount=100 --imagesCount=200 --videosCount=200 --ingestName=custom-name
```

Each parameter has an alias and same script can also be represented using this
form:

```
yarn util:ingest-gen --e=100 --i=200 --v=200 --n=custom-name
```

Extra notes:

- Generated image/video files will always be put into a dedicated `_ingest-gen`
  folder in blob storage root and have a subfolder named using `ingestName`
  parameter.
- If an image/video file already exists - it will not be created/overridden
- No matter the videos count, it will always be the same as specified (leftover
  videos processed and assigned as trailers). But each entity can only have 2
  images, so if the script is called with 2 entities and 10 images - only 4
  images will be used (2 per entity).
- generated ingest document fille will always have at least one entity of each
  type.
- Keep in mind, that there is always a possibility to get an out-of-memory error
  in case of huge numbers. For example, specifying 1 million entities, 2 million
  images, and 2 million videos will upload the files to blob storages correctly,
  but the resulting ingest document would be over 2GB and there might not be
  enough memory to save it to file in the current implementation. In addition,
  the whole generation process might take a few days.
