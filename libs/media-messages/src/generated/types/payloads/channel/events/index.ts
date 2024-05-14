export * from './channel-published-event';
export * from './channel-unpublished-event';
export * from './playlist-published-event';
export * from './playlist-unpublished-event';

export enum ChannelEventsSchemas {
  ChannelPublishedEvent = 'payloads/channel/events/channel-published-event.json',
  ChannelUnpublishedEvent = 'payloads/channel/events/channel-unpublished-event.json',
  PlaylistPublishedEvent = 'payloads/channel/events/playlist-published-event.json',
  PlaylistUnpublishedEvent = 'payloads/channel/events/playlist-unpublished-event.json'
}

export enum ChannelEventsTypes {
  ChannelPublishedEvent = 'ChannelPublishedEvent',
  ChannelUnpublishedEvent = 'ChannelUnpublishedEvent',
  PlaylistPublishedEvent = 'PlaylistPublishedEvent',
  PlaylistUnpublishedEvent = 'PlaylistUnpublishedEvent'
}