import { IngestDocument } from 'media-messages';
import { customIngestValidation } from './ingest-validation';

describe('Ingest validation helpers', () => {
  describe('customIngestValidation', () => {
    it('Document with one item without data -> no errors', () => {
      // Arrange
      const doc: any = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with one item without videos or licenses -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: { title: 'title' },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with multiple items with same external_id but different types -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: { title: 'title' },
          },
          {
            type: 'TVSHOW',
            external_id: 'test',
            data: { title: 'title' },
          },
          {
            type: 'SEASON',
            external_id: 'test',
            data: { title: 'title' },
          },
          {
            type: 'EPISODE',
            external_id: 'test',
            data: { title: 'title' },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with single item with main video -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              main_video: {
                source: 'avatar',
                profile: 'DEFAULT',
              },
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with single item with unique video sources -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              main_video: {
                source: 'avatar',
                profile: 'DEFAULT',
              },
              trailers: [
                {
                  source: 'avatar1',
                  profile: 'DEFAULT',
                },
                {
                  source: 'trailers/avatar1',
                  profile: 'DEFAULT',
                },
              ],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with two item with duplicate video sources across items -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test1',
            data: {
              title: 'title',
              main_video: {
                source: 'avatar',
                profile: 'DEFAULT',
              },
              trailers: [
                {
                  source: 'avatar1',
                  profile: 'DEFAULT',
                },
                {
                  source: 'trailers/avatar1',
                  profile: 'DEFAULT',
                },
              ],
            },
          },
          {
            type: 'MOVIE',
            external_id: 'test2',
            data: {
              title: 'title',
              main_video: {
                source: 'avatar1',
                profile: 'DEFAULT',
              },
              trailers: [
                {
                  source: 'avatar',
                  profile: 'DEFAULT',
                },
                {
                  source: 'trailers/avatar1',
                  profile: 'DEFAULT',
                },
              ],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it.each([undefined, null, '', ' ', '  '])(
      'Document with single item with empty %p sources for trailer and main video -> no errors, validated by json schema',
      (emptyValue) => {
        // Arrange
        const doc: IngestDocument = {
          name: 'document',
          items: [
            {
              type: 'MOVIE',
              external_id: 'test',
              data: {
                title: 'title',
                main_video: {
                  source: emptyValue,
                },
                trailers: [
                  {
                    source: emptyValue,
                    profile: 'DEFAULT',
                  },
                  {
                    source: emptyValue,
                    profile: 'DEFAULT',
                  },
                ],
              },
            },
          ],
        };

        // Act
        const errors = customIngestValidation(doc);

        // Assert
        expect(errors).toEqual([]);
      },
    );

    it('Document with single item with empty main video -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              main_video: {},
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with single item with empty trailers -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              trailers: [undefined, null, {}],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with one item with unique licenses -> no errors', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              licenses: [
                {
                  start: '2020-08-01T00:00:00.000+00:00',
                  end: '2020-08-30T23:59:59.999+00:00',
                },
                {
                  start: '2020-08-01T00:00:00.000+00:00',
                },
                {
                  countries: ['EE', 'DE'],
                },
                {
                  start: '2020-08-01T00:00:00.000+00:00',
                  end: '2020-08-30T23:59:59.999+00:00',
                  countries: ['EE', 'DE'],
                },
              ],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([]);
    });

    it('Document with duplicate external_id values -> errors for each duplicate', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: { title: 'title' },
          },
          {
            type: 'MOVIE',
            external_id: 'test',
            data: { title: 'title' },
          },
          {
            type: 'EPISODE',
            external_id: 'test',
            data: { title: 'title' },
          },
          {
            type: 'EPISODE',
            external_id: 'test',
            data: { title: 'title' },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([
        {
          message:
            'Document has 2 duplicate items with type "MOVIE" and external_id "test"',
          type: 'CustomDataValidation',
        },
        {
          message:
            'Document has 2 duplicate items with type "EPISODE" and external_id "test"',
          type: 'CustomDataValidation',
        },
      ]);
    });

    it('Document with single item with duplicate source for trailers -> error', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              main_video: {
                source: 'avatar',
                profile: 'DEFAULT',
              },
              trailers: [
                {
                  source: 'avatar1',
                  profile: 'DEFAULT',
                },
                {
                  source: 'avatar1',
                  profile: 'DEFAULT',
                },
              ],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([
        {
          message:
            'Item with externalId "test" is using a video with source "avatar1" more than once.',
          type: 'CustomDataValidation',
        },
      ]);
    });

    it('Document with single item with duplicate source for trailer and main video -> error', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              main_video: {
                source: 'avatar',
                profile: 'DEFAULT',
              },
              trailers: [
                {
                  source: 'avatar',
                  profile: 'DEFAULT',
                },
                {
                  source: 'avatar1',
                  profile: 'DEFAULT',
                },
              ],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([
        {
          message:
            'Item with externalId "test" is using a video with source "avatar" more than once.',
          type: 'CustomDataValidation',
        },
      ]);
    });

    it('Document with one item with duplicate licenses -> errors for each duplicate', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              licenses: [
                {
                  start: '2020-08-01T00:00:00.000+00:00',
                  end: '2020-08-30T23:59:59.999+00:00',
                },
                {
                  end: '2020-08-30T23:59:59.999+00:00',
                  start: '2020-08-01T00:00:00.000+00:00',
                },
                {
                  start: '2020-08-01T00:00:00.000+00:00',
                },
                {
                  start: '2020-08-01T00:00:00.000+00:00',
                },
                {
                  countries: ['DE', 'EE'],
                },
                {
                  countries: ['EE', 'DE'],
                },
              ],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([
        {
          message:
            'Item with externalId "test" has 2 duplicate licenses "{"start":"2020-08-01T00:00:00.000+00:00","end":"2020-08-30T23:59:59.999+00:00"}".',
          type: 'CustomDataValidation',
        },
        {
          message:
            'Item with externalId "test" has 2 duplicate licenses "{"start":"2020-08-01T00:00:00.000+00:00"}".',
          type: 'CustomDataValidation',
        },
        {
          message:
            'Item with externalId "test" has 2 duplicate licenses "{"countries":["DE","EE"]}".',
          type: 'CustomDataValidation',
        },
      ]);
    });

    it('Document with single item with duplicate type for images -> error', () => {
      // Arrange
      const doc: IngestDocument = {
        name: 'document',
        items: [
          {
            type: 'MOVIE',
            external_id: 'test',
            data: {
              title: 'title',
              images: [
                {
                  path: 'image.jpg',
                  type: 'COVER',
                },
                {
                  path: 'other-image.jpg',
                  type: 'COVER',
                },
              ],
            },
          },
        ],
      };

      // Act
      const errors = customIngestValidation(doc);

      // Assert
      expect(errors).toEqual([
        {
          message:
            'Item with externalId "test" has 2 images with duplicate type "COVER".',
          type: 'CustomDataValidation',
        },
      ]);
    });
  });
});
