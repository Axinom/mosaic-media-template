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

- Prerequisites: The
  [Unified Virtual Channel](https://beta.docs.unified-streaming.com/documentation/virtual-channel/gettingstarted/index.html)
  should be setup.
- Follow the instructions from the `README.md` file in the Media solution root
  folder.
- Open configuration file `.env` for the VOD-to-Live service:

  - `VIRTUAL_CHANNEL_MANAGEMENT_API_BASE_URL` - should be set to the Virtual
    Channel Management API url.
  - `VIRTUAL_CHANNEL_MANAGEMENT_API_KEY` - optional. Should be set to API_KEY
  - `VIRTUAL_CHANNEL_ORIGIN_BASE_URL` - should be set to the Origin base url.
    configured for the USP Virtual Channel API.
  - `PRE_PUBLISHING_WEBHOOK_SECRET` - value for this configuration can be
    obtained in the Mosaic Admin Portal when setting up the pre publishing
    webhook for the Channel Service.
  - `AZURE_STORAGE_CONNECTION` and `AZURE_BLOB_CONTAINER_NAME` should be setup
    to Azure Storage.
  - DRM configurations `KEY_SERVICE_API_BASE_URL`, `KEY_SERVICE_TENANT_ID`,
    `KEY_SERVICE_MANAGEMENT_KEY`, `DRM_KEY_SEED_ID` are optional. And should be
    configured in case if the DRM protected VODs are used for the channel
    creation. Values for for DRM decryption and protection are available in the
    Axinom Portal.
  - `PROLONG_PLAYLIST_TO_24_HOURS` is a feature flag. When set ti TRUE every
    playlist with duration under 24 hours will be automatically prolonged to hit
    24 hour duration.
  - `CATCH_UP_DURATION_IN_MINUTES` a catch up duration. If
    `PROLONG_PLAYLIST_TO_24_HOURS` is set to TRUE, this duration is added on top
    of the 24h mark for smoother transition between playlists. If
    `PROLONG_PLAYLIST_TO_24_HOURS` is set to FALSE, the catch up duration is
    added to the playlist transition time, when playlist start date is in the
    PAST.
