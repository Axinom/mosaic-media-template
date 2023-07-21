# VOD-to-Live Service

## N.B. Experimental

This service is designed to facilitate the transition from Video-on-Demand (VOD)
content to live channels, providing a seamless experience for our users. It is
based on the beta version of the Unified Streaming Virtual Channels solution.
Although in its experimental phase, the main flows of the service have been
implemented, offering a solid foundation for further development or integration
with other streaming providers.

The purpose of this service is to serve as a source for developers interested in
understanding the inner workings of a VOD-to-Live Service and how it can be
integrated with our Mosaic Channel Management Service. Please keep in mind that
as an experimental service, some refinements and improvements are likely still
needed.

If you want to learn more about the responsibilities of VOD-to-Live Services in
a
[FAST solution](https://portal.axinom.com/mosaic/documentation/media/fast-channels),
please refer to the
[VOD-to-Live Service documentation](https://portal.axinom.com/mosaic/documentation/media/vod-to-live-service).

The root `package.json` excludes the VOD-to-Live Service from the global
`build`, `clean`, and `dev:services` scripts. And the Jest tests are not run
from the root either.

## Overview

The VOD-to-Live Service is a customizable component of the Media solution that
enables custom logic implementation and creation of live streams utilizing the
[Unified Virtual Channel](https://beta.docs.unified-streaming.com/documentation/virtual-channel/index.html).

The managed Channel Service provides a way to publish Channels and Playlists to
the customizable VOD-to-Live Service. The VOD-to-Live Service uses the data from
the Channel Service to generate a Synchronized Multimedia Integration Language
(SMIL) file that incorporates the videos from the playlist along with
placeholder videos acting as fillers for advertisement pods. The Unified Virtual
Channel API is used to create advanced virtual FAST channels from the VOD
sources that seamlessly transition from one source to another.

This diagram visualizes the flow that the VOD-to-Live service is performing:
![flow](https://github.com/Axinom/mosaic-media-template/assets/10724090/f615b6fc-b740-4dcf-b680-f652174d9270)


## Features

### Validation via Pre-Publishing Webhook

The VOD-to-Live Service exposes an API endpoint `/pre-publishing` which is
compatible with the pre-publishing webhook of the Channel Service. This enables
the VOD-to-Live Service to apply a custom set of validation rules to determine
the eligibility of a Channel or Playlist for publishing from the Channel
Service.

#### Channel validation rules

- A placeholder video must be set for the channel.

#### Playlist validation rules

- The Playlist must contain at least one program.
- A warning is reported if the Playlist duration exceeds 24 hours.
- The Playlist duration should not exceed 25 hours.
- The Playlist start date should not be older than 24 hours.
- The Playlist scheduling should not start and end with an ad pod.
- All videos associated with the Playlist should have at least one common stream
  format (matching resolution, frame rate, and bitrate).

#### Video validation rules

Every video assigned to a channel or playlist must pass the following validation
rules:

- Videos must use be encoded as `H264`.
- Videos must have a separate audio stream.
- Videos must be packaged in the `CMAF` format.
- If DRM protection is enabled, DRM-protected videos must have their DRM key
  identifiers defined.
- If DRM protection is disabled, videos cannot be DRM-protected.

### Live stream creation

The main responsibility of the VOD-to-Live Service is to create a live stream
using the data published by the Managed Channel Service. Once validation is
successful and the Channel or Playlist is published, the VOD-to-Live Service
receives a RabbitMQ message containing an object representing the published
entity. The service then generates a SMIL file that can be sent to the Virtual
Channel Management API for live channel creation or update.

Here is an example of the JSON object received by the VOD-to-Live Service for a
Channel Published Event.

```json
{
  "title": "Example Channel",
  "description": "Example channel to show ...",
  "id": "3c1d6148-269a-4c76-aa4b-9d5cc065254e",
  "images": [
    {
      "height": 646,
      "id": "image-1",
      "path": "/transform/0-0/image-1.png",
      "type": "channel_logo",
      "width": 860
    }
  ],
  "placeholder_video": {
    "id": "video-1",
    "is_archived": false,
    "source_file_extension": ".mp4",
    "source_file_name": "source",
    "source_full_file_name": "placeholder_video.mp4",
    "source_location": "test",
    "source_size_in_bytes": 80788234,
    "title": "Placeholder Video",
    "video_encoding": {
      "audio_languages": ["en"],
      "caption_languages": [],
      "cmaf_size_in_bytes": 128070139,
      "dash_manifest_path": "https://example.net/video-output/example/cmaf/manifest.mpd",
      "length_in_seconds": 62,
      "encoding_state": "READY",
      "finished_date": "2022-11-25T12:26:41.396001+00:00",
      "hls_manifest_path": "https://example.net/video-output/example/cmaf/manifest.m3u8",
      "is_protected": false,
      "output_format": "CMAF",
      "output_location": "example",
      "preview_status": "NOT_PREVIEWED",
      "subtitle_languages": [],
      "title": "Placeholder Video",
      "video_streams": [
        {
          "bitrate_in_kbps": 300,
          "codecs": "H264",
          "display_aspect_ratio": "16:9",
          "file": "cmaf/video-H264-216-300k-video-avc1.mp4",
          "format": "CMAF",
          "frame_rate": 30,
          "height": 216,
          "label": "SD",
          "pixel_aspect_ratio": "1:1",
          "type": "VIDEO",
          "width": 384
          //...etc
        },
        {
          "bitrate_in_kbps": 128,
          "codecs": "AAC",
          "file": "cmaf/audio-en-audio-en-mp4a.mp4",
          "format": "CMAF",
          "label": "audio",
          "language_code": "en",
          "language_name": "English",
          "sampling_rate": 48000,
          "type": "AUDIO"
          //...etc
        }
      ]
    },
    "videos_tags": ["vod2live"]
  }
}
```

SMIL example generated by the VOD-to-Live Service to communicate with USP
Virtual Channel API.

```xml
<?xml version='1.0' encoding='UTF-8'?>
<smil xmlns="http://www.w3.org/2001/SMIL20/Language">
	<head>
		<meta name="vod2live" content="true"/>
		<meta name="vod2live_start_time" content="2023-04-04T09:31:32.184Z"/>
		<meta name="splice_media" content="false"/>
		<meta name="timed_metadata" content="true"/>
		<meta name="mpd_segment_template" content="time"/>
		<meta name="hls_client_manifest_version" content="5"/>
		<meta name="mosaic_channel_id" content="example-channel-1"/>
	</head>
	<body>
		<seq>
			<par>
				<audio src="https://example.net/video-output/example/cmaf/audio-en-AAC-2ch-128k-audio-en-mp4a.mp4"/>
				<video src="https://example.net/video-output/example/cmaf/video-H264-216-300k-video-avc1.mp4"/>
			</par>
		</seq>
	</body>
</smil>

```

#### DRM protection

DRM protection can be enabled for the Channel's live stream by configuring the
service and setting the appropriate DRM variables.

```
The service uses the Axinom DRM Key Service to request the DRM encryption key.
The DRM settings for the VOD-to-Live Service should be aligned with the DRM settings used for the encryption of the used VOD assets.
```

When DRM is enabled DRM-protected VODs can be included in playlists. To decrypt
the protected content and encrypt the newly created live stream, CPIX files are
created and stored in Azure Storage. Access to the files is granted to the USP
using shared access signatures (SAS) with time-based limitations.

A new DRM key will be created for each Channel through the Axinom Key Service
API. The key identifier for the Channel will be sent in a RabbitMQ message of
the type `LiveStreamProtectionKeyCreatedEvent`. This identifier will be stored
with the Channel's metadata in Azure Storage.

#### Playlist prolongation

When the Playlist prolongation feature is enabled, the VOD-to-Live Service will
automatically extend the duration of any playlist that has a duration of less
than 24 hours, so that it is exactly 24 hours long. This is achieved by using a
placeholder video to fill the remaining time.

## Setup

- Prerequisites: The
  [Unified Virtual Channel](https://beta.docs.unified-streaming.com/documentation/virtual-channel/gettingstarted/index.html)
  should be set up.
- Follow the instructions from the `README.md` file in the Media Solution root
  folder.
- Open the configuration file `.env` for the service and set missing values
  accordingly.

### Service configuration

#### General settings

`PRE_PUBLISHING_WEBHOOK_SECRET` - This is a mandatory setting. The secret key is
used to sign validation messages between the Managed Channel and VOD-to-Live
services. It can be retrieved from the Admin portal when setting up the
Pre-Publishing webhook for the Channel Service.

`CATCH_UP_DURATION_IN_MINUTES` - This setting defaults to 60 minutes and adds
this duration to the playlist to create smoother transitions between playlists.

`PROLONG_PLAYLIST_TO_24_HOURS` - This feature is enabled by default and prolongs
the playlist duration to 24 hours.

`CHANNEL_PROCESSING_WAIT_TIME_IN_SECONDS` - By default, this setting is set to
10 minutes and determines the amount of time the VOD-to-Live service waits
before the channel goes live.

#### USP Virtual Channel API settings

`VIRTUAL_CHANNEL_MANAGEMENT_API_BASE_URL` - This is the mandatory setting for
the base URL of the Unified Virtual Channel Management API.

`VIRTUAL_CHANNEL_MANAGEMENT_API_KEY` - This is an optional API key used for
authorization with the Virtual Channel Management API.

`VIRTUAL_CHANNEL_ORIGIN_BASE_URL` - This is the mandatory setting for the base
URL of the Unified Streaming Origin or the CDN for Origin.

#### Azure Storage settings

`AZURE_STORAGE_CONNECTION` - This is the mandatory setting for the connection
string of the Azure storage.

`AZURE_BLOB_CONTAINER_NAME` - This is the mandatory setting. Name of the
container in Azure Storage where the service will store channel data.

#### DRM settings

To enable DRM protection of the live stream, fill out the configurations below
with the values available on the Axinom Portal.

`KEY_SERVICE_API_BASE_URL` - This setting is optional.

`KEY_SERVICE_TENANT_ID` - This setting is optional.

`KEY_SERVICE_MANAGEMENT_KEY` - This setting is optional.

`DRM_KEY_SEED_ID` - This setting is optional.
