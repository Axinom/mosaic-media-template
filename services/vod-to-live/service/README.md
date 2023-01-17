# VOD-to-Live Service

## Overview

The VOD-to-Live Service is a customizable service that is part of the Media
solution. The service implements custom logic and creates live streams using the
[Unified Virtual Channel](https://beta.docs.unified-streaming.com/documentation/virtual-channel/index.html).

The managed Channel Service provides the possibility to publish Channels and
Playlists to the customizable VOD-to-Live Service. The VOD-to-Live Service uses
the Channel Service data to create a Synchronized Multimedia Integration
Language (SMIL) file with the videos from the playlist and “empty” videos as
placeholders for the advertisement pods. Unified Virtual Channel API is used to
create advanced virtual FAST channels from the VOD sources with seamless
transition from one source to another.

## Setup

- Follow the instructions from the `README.md` file in the Media solution root
  folder.
- [Setup](https://beta.docs.unified-streaming.com/documentation/virtual-channel/gettingstarted/index.html)
  Unified Virtual Channel.
- Open configuration file `.env` for the VOD-to-Live service:
  - `VIRTUAL_CHANNEL_API_BASE_URL` - should be set to the Virtual Channel API
    url, that was setup in the previous step.
  - `PRE_PUBLISHING_WEBHOOK_SECRET` - value can be obtained by making request to
    Channel Service GraphQL mutation `generatePrePublishingWebhookSecret`. The
    access token should contain permission `Settings: Edit` for Channel Service.
  - `AZURE_STORAGE_CONNECTION` and `AZURE_BLOB_CONTAINER_NAME` are used to
    configure the Azure Storage for persisting service data.
