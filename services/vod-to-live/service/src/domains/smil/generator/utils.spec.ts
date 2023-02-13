import { CuePointSchedule } from '@axinom/mosaic-messages';
import { URL } from 'url';
import { createTestVideo } from '../../../tests';
import {
  createEventStream,
  createParallel,
  createReference,
  transformSecondsToWallClock,
} from '../models';
import {
  createAdPlaceholders,
  createPlaylistEventStream,
  videoToSmilParallelReferences,
} from './utils';

describe('smil-utils', () => {
  describe('createPlaylistEventStream', () => {
    it('getting out of network -> changes indicator to 1 and increases splice id', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 0; //in network
      const newOutOfNetworkIndicator = 1; //jump out of network
      const previousSpliceId = 0;
      const eventDuration = 60; // duration of the event 60 sec
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
      );
      // Assert
      expect(result.eventStream).not.toBeUndefined();
      expect(result.eventStream).toMatchObject(
        createEventStream(
          newOutOfNetworkIndicator,
          eventDuration,
          `${previousSpliceId + 1}`,
        ),
      );
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId + 1);
    });
    it('getting in to network -> changes indicator to 0 and does not increases splice id', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 1; //out of network
      const newOutOfNetworkIndicator = 0; //jump into network
      const previousSpliceId = 0;
      const eventDuration = 0;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
      );
      // Assert
      expect(result.eventStream).not.toBeUndefined();
      expect(result.eventStream).toMatchObject(
        createEventStream(
          newOutOfNetworkIndicator,
          eventDuration,
          `${previousSpliceId}`,
        ),
      );
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
    it('staying in network -> does not generate event stream', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 0; //in network
      const newOutOfNetworkIndicator = 0; //staying in network
      const previousSpliceId = 0;
      const eventDuration = 300;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
      );
      // Assert
      expect(result.eventStream).toBeUndefined();
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
    it('staying out of network -> does not generate event stream', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 1; // out of network
      const newOutOfNetworkIndicator = 1; //staying out of network
      const previousSpliceId = 0;
      const eventDuration = 100;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
      );
      // Assert
      expect(result.eventStream).toBeUndefined();
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
  });

  describe('createAdPlaceholders', () => {
    const PLACEHOLDER_VIDEO_LENGTH = 10;
    const PLACEHOLDER_PARALLEL = createParallel({
      audio: [createReference('test/path/to/placeholder/video_audio.mp4')],
      video: [createReference('test/path/to/placeholder/video.mp4')],
    });

    it('if `AD_POD` duration is less than placeholder length -> one parallel with clipEnd is created', () => {
      // Arrange
      const schedule: CuePointSchedule = {
        type: 'AD_POD',
        duration_in_seconds: 3,
        sort_index: 0,
        id: '1',
      };
      // Act
      const result = createAdPlaceholders(
        schedule,
        PLACEHOLDER_PARALLEL,
        PLACEHOLDER_VIDEO_LENGTH,
        createEventStream(1, schedule.duration_in_seconds, `1`),
      );
      // Assert
      expect(result).toHaveLength(1);
      const parallel = result[0];
      expect(parallel['@clipEnd']).toEqual(transformSecondsToWallClock(3));
      expect(parallel.EventStream).not.toBeUndefined();
    });

    it.each([
      {
        adPodDuration: 10,
        expectedParallels: 1,
        clipEndOfLastParallel: transformSecondsToWallClock(),
      },
      {
        adPodDuration: 20,
        expectedParallels: 2,
        clipEndOfLastParallel: transformSecondsToWallClock(),
      },
      {
        adPodDuration: 53,
        expectedParallels: 6,
        clipEndOfLastParallel: transformSecondsToWallClock(3),
      },
      {
        adPodDuration: 157,
        expectedParallels: 16,
        clipEndOfLastParallel: transformSecondsToWallClock(7),
      },
    ])(
      'if `AD_POD` duration is bigger than placeholder length -> placeholder is looped to fill the schedule duration',
      ({ adPodDuration, expectedParallels, clipEndOfLastParallel }) => {
        // Arrange
        const schedule: CuePointSchedule = {
          type: 'AD_POD',
          duration_in_seconds: adPodDuration,
          sort_index: 0,
          id: '1',
        };
        // Act
        const result = createAdPlaceholders(
          schedule,
          PLACEHOLDER_PARALLEL,
          PLACEHOLDER_VIDEO_LENGTH,
          createEventStream(1, schedule.duration_in_seconds, `1`),
        );
        // Assert
        expect(result).toHaveLength(expectedParallels);

        // first parallel has event stream object
        const firstParallel = result.shift();
        expect(firstParallel?.EventStream).not.toBeUndefined();

        // last parallel has `clipEnd` timing, if required
        const lastParallel = result.pop();
        expect(lastParallel?.['@clipEnd']).toEqual(clipEndOfLastParallel);

        // all parallels, except last one do not have @clipEnd and @clipBegin set
        result.forEach((parallel) => {
          expect(parallel).toMatchObject({
            '@clipEnd': undefined,
            '@clipBegin': undefined,
          });
        });
      },
    );
  });

  describe('videoToSmilParallelReferences', () => {
    it.each([true, false])(
      'parallel references are generated',
      (isDrmProtected: boolean) => {
        // Arrange
        const testVideo = createTestVideo(isDrmProtected);
        // Act
        const result = videoToSmilParallelReferences(testVideo);
        // Assert
        expect(result).not.toBeNull();
        expect(result.audio).toHaveLength(
          testVideo.video_encoding.video_streams.filter(
            (s) => s.type === 'AUDIO',
          ).length,
        );
        expect(result.video).toHaveLength(
          testVideo.video_encoding.video_streams.filter(
            (s) => s.type === 'VIDEO',
          ).length,
        );
        const expectedReferences = testVideo.video_encoding.video_streams
          .map((s) =>
            new URL(
              s.file!,
              'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/',
            ).toString(),
          )
          .sort();
        const retrievedReferences = [
          ...result.audio.map((a) => a['@src']),
          ...result.video.map((a) => a['@src']),
        ].sort();

        expect(retrievedReferences).toMatchObject(expectedReferences);
      },
    );
  });
});