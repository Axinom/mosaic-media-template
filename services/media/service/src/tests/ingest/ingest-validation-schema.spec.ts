import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import 'jest-extended';
import { IngestDocument } from 'media-messages';
import { transformAjvErrors } from '../../common';
import * as ingestSchema from '../../ingest/schemas/ingest-validation-schema.json';

describe('ingest-validation-schema.json', () => {
  let ajv: Ajv;

  const createDocument = (data: Record<string, unknown>): IngestDocument => {
    return {
      name: 'document',
      items: [
        {
          type: 'MOVIE',
          external_id: 'some external id',
          data,
        },
      ],
    };
  };

  const whitespaceValues = [' ', '  ', '   '];
  const defaultStringTestValues = [
    ' a',
    'a ',
    ' a ',
    'a',
    'a b',
    ' a b',
    'a b ',
    ' a b ',
    'ab',
  ];

  beforeAll(async () => {
    ajv = new Ajv({ allErrors: true, validateFormats: true });
    addFormats(ajv);
  });

  describe('Document validation', () => {
    it('Empty document -> document is invalid', () => {
      // Arrange
      const doc = {};

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document" should have required property \'name\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document" should have required property \'items\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Document with undefined name -> document is invalid', () => {
      // Arrange
      const doc = { name: undefined };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document" should have required property \'name\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document" should have required property \'items\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Document with null name -> document is invalid', () => {
      // Arrange
      const doc = { name: null };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/name" should be string (line: 2, column: 11)',
          schemaPath: '#/properties/name/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document" should have required property \'items\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Document with empty name -> document is invalid', () => {
      // Arrange
      const doc = { name: '' };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/name" should NOT have fewer than 1 characters (line: 2, column: 11)',
          schemaPath: '#/properties/name/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document" should have required property \'items\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(whitespaceValues)(
      'Document with whitespace "%s" name -> document is invalid',
      (whitespace) => {
        // Arrange
        const doc = { name: whitespace };

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/name" should match pattern "^$|.*\\S.*" (line: 2, column: 11)',
            schemaPath: '#/properties/name/pattern',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document" should have required property \'items\' (line: 1, column: 1)',
            schemaPath: '#/required',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('Document with only name -> document is invalid', () => {
      // Arrange
      const doc = { name: 'document' };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document" should have required property \'items\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      ...defaultStringTestValues,
      'random test',
      'document.01.10.2020',
      'october-2020-media',
    ])(
      'Document with valid name "%s" and empty items array -> document is invalid',
      (name) => {
        // Arrange
        const doc = {
          name,
          items: [],
        };

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items" should NOT have fewer than 1 items (line: 3, column: 12)',
            schemaPath: '#/properties/items/minItems',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('The "name" property of the document has too many characters -> document is invalid', () => {
      // Arrange
      const doc = { name: 'x'.repeat(51) };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document" should have required property \'items\' (line: 1, column: 1)',
          schemaPath: '#/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/name" should NOT have more than 50 characters (line: 2, column: 11)',
          schemaPath: '#/properties/name/maxLength',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Document with empty item -> document is invalid', () => {
      // Arrange
      const doc = {
        name: 'document',
        items: [{}],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should have required property \'type\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should have required property \'external_id\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Document with null document_created -> document is valid', () => {
      // Arrange
      const doc = {
        name: 'document',
        document_created: null,
        items: [
          {
            type: 'MOVIE',
            external_id: 'some external id',
            data: { title: 'avatar' },
          },
        ],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it.each([
      '',
      ...whitespaceValues,
      'a',
      'test',
      'some date',
      '30.09.2020',
      '2020-30-09',
    ])(
      'Document with invalid document_created "%s" -> document is invalid',
      (invalidDate) => {
        // Arrange
        const doc = {
          name: 'document',
          document_created: invalidDate,
          items: [
            {
              type: 'MOVIE',
              external_id: 'some external id',
              data: { title: 'avatar' },
            },
          ],
        };

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/document_created" should match format "date-time" (line: 3, column: 23)',
            schemaPath: '#/properties/document_created/format',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('Document with valid document_created -> document is valid', () => {
      // Arrange
      const doc = {
        name: 'document',
        document_created: '2020-09-30T15:05:25.000Z',
        items: [
          {
            type: 'MOVIE',
            external_id: 'some external id',
            data: { title: 'avatar' },
          },
        ],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it('Document with 1 valid and 1 invalid item -> error for second item', () => {
      // Arrange
      const doc = {
        name: 'document',
        document_created: '2020-09-30T15:05:25.000Z',
        items: [
          {
            type: 'MOVIE',
            external_id: 'some external id',
            data: { title: 'avatar' },
          },
          {
            type: 'MOVIE',
            external_id: 'some external id 2',
            data: {},
          },
        ],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/1/data" should have required property \'title\' (line: 15, column: 15)',
          schemaPath:
            '#/properties/items/items/allOf/0/then/properties/data/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/1" should match "then" schema (line: 12, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Document with 2 invalid item -> error for both items', () => {
      // Arrange
      const doc = {
        name: 'document',
        document_created: '2020-09-30T15:05:25.000Z',
        items: [
          {
            type: 'MOVIE',
            external_id: 'some external id',
            data: {},
          },
          {
            type: 'MOVIE',
            external_id: 'some external id 2',
            data: {},
          },
        ],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data" should have required property \'title\' (line: 8, column: 15)',
          schemaPath:
            '#/properties/items/items/allOf/0/then/properties/data/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 5, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/1/data" should have required property \'title\' (line: 13, column: 15)',
          schemaPath:
            '#/properties/items/items/allOf/0/then/properties/data/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/1" should match "then" schema (line: 10, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Document with 2 invalid item as a 1-liner json -> error for both items with line 1', () => {
      // Arrange
      const doc = {
        name: 'document',
        document_created: '2020-09-30T15:05:25.000Z',
        items: [
          {
            type: 'MOVIE',
            external_id: 'some external id',
            data: {},
          },
          {
            type: 'MOVIE',
            external_id: 'some external id 2',
            data: {},
          },
        ],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, JSON.stringify(doc));

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data" should have required property \'title\' (line: 1, column: 131)',
          schemaPath:
            '#/properties/items/items/allOf/0/then/properties/data/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 1, column: 75)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/1/data" should have required property \'title\' (line: 1, column: 193)',
          schemaPath:
            '#/properties/items/items/allOf/0/then/properties/data/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/1" should match "then" schema (line: 1, column: 135)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });
  });

  describe('Item validation', () => {
    it('Item with undefined item type value -> document is invalid', () => {
      // Arrange
      const doc = {
        name: 'document',
        items: [{ type: undefined }],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should have required property \'type\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should have required property \'external_id\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      null,
      '',
      ...whitespaceValues,
      'test',
      ' MOVIE',
      'MOVIE ',
      'EBOOK',
      'COLLECTION',
      'GENRE',
      'MOVIEGENRE',
      'MOVIE_GENRE',
    ])(
      'Item with invalid item type value "%s" -> document is invalid',
      (invalidType) => {
        // Arrange
        const doc = {
          name: 'document',
          items: [{ type: invalidType }],
        };

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/required',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0/type" should be equal to one of the allowed values: MOVIE, TVSHOW, SEASON, EPISODE (line: 5, column: 15)',
            schemaPath: '#/properties/items/items/properties/type/enum',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should have required property \'external_id\' (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/required',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each(['MOVIE', 'TVSHOW', 'EPISODE', 'SEASON'])(
      'Item with valid item type value "%s" and no external_id -> document is invalid',
      (type) => {
        // Arrange
        const doc = {
          name: 'document',
          items: [{ type }],
        };

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/required',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should have required property \'external_id\' (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/required',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('Item with undefined external_id -> document is invalid', () => {
      // Arrange
      const doc = {
        name: 'document',
        items: [{ type: 'MOVIE', external_id: undefined }],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should have required property \'external_id\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Item with null external_id -> document is invalid', () => {
      // Arrange
      const doc = {
        name: 'document',
        items: [{ type: 'MOVIE', external_id: null }],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/external_id" should be string (line: 6, column: 22)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Item with empty external_id -> document is invalid', () => {
      // Arrange
      const doc = {
        name: 'document',
        items: [{ type: 'MOVIE', external_id: '' }],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/external_id" should NOT have fewer than 1 characters (line: 6, column: 22)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(whitespaceValues)(
      'Item with whitespace "%s" external_id -> document is invalid',
      (whitespace) => {
        // Arrange
        const doc = {
          name: 'document',
          items: [{ type: 'MOVIE', external_id: whitespace }],
        };

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/required',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0/external_id" should match pattern "^$|.*\\S.*" (line: 6, column: 22)',
            schemaPath: '#/definitions/non-empty-string/pattern',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each([
      ...defaultStringTestValues,
      'random test',
      'avatar.the.movie',
      'firefly_season-2_episode-1',
    ])(
      'Item with valid external_id "%s" and empty data -> document is invalid',
      (external_id) => {
        // Arrange
        const doc = {
          name: 'document',
          items: [{ type: 'MOVIE', external_id }],
        };

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0" should have required property \'data\' (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/required',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('Item with empty data -> document is invalid', () => {
      // Arrange
      const doc = {
        name: 'document',
        items: [{ type: 'MOVIE', external_id: 'some external id', data: {} }],
      };

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data" should have required property \'title\' (line: 7, column: 15)',
          schemaPath:
            '#/properties/items/items/allOf/0/then/properties/data/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });
  });

  describe('Movie Data validation', () => {
    it.each([null, true, 123, 2.34, { value: 'some value' }])(
      'Data with title of invalid type "%p" -> document is invalid',
      (invalidTitle) => {
        // Arrange
        const doc = createDocument({ title: invalidTitle });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/title" should be string (line: 8, column: 18)',
            schemaPath: '#/definitions/title/type',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('Data with empty title -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: '' });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/title" should NOT have fewer than 1 characters (line: 8, column: 18)',
          schemaPath: '#/definitions/title/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with long title -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'x'.repeat(101) });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/title" should NOT have more than 100 characters (line: 8, column: 18)',
          schemaPath: '#/definitions/title/maxLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(whitespaceValues)(
      'Data with whitespace "%s" title -> document is invalid',
      (whitespace) => {
        // Arrange
        const doc = createDocument({ title: whitespace });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/title" should match pattern "^$|.*\\S.*" (line: 8, column: 18)',
            schemaPath: '#/definitions/title/pattern',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each([
      ...defaultStringTestValues,
      'random test',
      'avatar.the.movie',
      'firefly_season-2_episode-1',
      'x'.repeat(100),
    ])('Data with valid title "%s" -> document is valid', (title) => {
      // Arrange
      const doc = createDocument({ title });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it.each([
      null,
      '',
      ...whitespaceValues,
      ...defaultStringTestValues,
      'random test',
      'avatar.the.movie',
      'firefly_season-2_episode-1',
    ])('Data with valid description %p -> document is valid', (description) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', description });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it.each([
      null,
      ...whitespaceValues,
      ...defaultStringTestValues,
      'Lorem ipsum',
    ])(
      'Data with valid original_title %p -> document is valid',
      (original_title) => {
        // Arrange
        const doc = createDocument({ title: 'avatar', original_title });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it.each([
      ...whitespaceValues,
      ...defaultStringTestValues,
      'Lorem ipsum',
      '2020',
      '01-2020',
      '01-01-2020',
      '2020-01',
      '2020-01-',
      '2020-01-00',
      '2021-02-29',
      '2021-13-12',
      '2021.12.12',
      '12.12.2021',
      '12/12/2021',
    ])('Data with invalid released %p -> document is invalid', (released) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', released });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/released" should match format "date" (line: 9, column: 21)',
          schemaPath: '#/definitions/released/format',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([null, '2020-01-01', '2020-02-29', '2021-12-13'])(
      'Data with valid released %p -> document is valid',
      (released) => {
        // Arrange
        const doc = createDocument({ title: 'avatar', released });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it.each([
      null,
      ...whitespaceValues,
      ...defaultStringTestValues,
      'Lorem ipsum',
    ])('Data with valid studio %p -> document is valid', (studio) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', studio });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it.each([
      null,
      ...whitespaceValues,
      ...defaultStringTestValues,
      'Lorem ipsum',
    ])('Data with valid synopsis %p -> document is valid', (synopsis) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', synopsis });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it('Data with null tag value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', tags: [null] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/tags/0" should be string (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with empty tag value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', tags: [''] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/tags/0" should NOT have fewer than 1 characters (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with whitespace tag value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', tags: [' '] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/tags/0" should match pattern "^$|.*\\S.*" (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/pattern',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with duplicate tag values -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        tags: ['Duplicate', 'Duplicate'],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/tags" should NOT have duplicate items (items ## 0 and 1 are identical) (line: 9, column: 17)',
          schemaPath: '#/uniqueItems', //TODO: Open issue: https://github.com/ajv-validator/ajv/issues/512
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      [null],
      [[]],
      [[' a']],
      [['a ']],
      [[' a ']],
      [['a']],
      [['a', 'b', 'c']],
    ])('Data with valid tags %j -> document is valid', (tags) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', tags });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it('Data with null genre value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', genres: [null] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/genres/0" should be string (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with empty genre value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', genres: [''] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/genres/0" should NOT have fewer than 1 characters (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with whitespace genre value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', genres: [' '] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/genres/0" should match pattern "^$|.*\\S.*" (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/pattern',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with duplicate genre values -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        genres: ['Duplicate', 'Duplicate'],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/genres" should NOT have duplicate items (items ## 0 and 1 are identical) (line: 9, column: 19)',
          schemaPath: '#/uniqueItems', //TODO: Open issue: https://github.com/ajv-validator/ajv/issues/512
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      [null],
      [[]],
      [[' a']],
      [['a ']],
      [[' a ']],
      [['a']],
      [['a', 'b', 'c']],
    ])('Data with valid genres %j -> document is valid', (genres) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', genres });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it('Data with null cast value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', cast: [null] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/cast/0" should be string (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with empty cast value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', cast: [''] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/cast/0" should NOT have fewer than 1 characters (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with whitespace cast value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', cast: [' '] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/cast/0" should match pattern "^$|.*\\S.*" (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/pattern',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with duplicate cast values -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        cast: ['Duplicate', 'Duplicate'],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/cast" should NOT have duplicate items (items ## 0 and 1 are identical) (line: 9, column: 17)',
          schemaPath: '#/uniqueItems', //TODO: Open issue: https://github.com/ajv-validator/ajv/issues/512
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      [null],
      [[]],
      [[' a']],
      [['a ']],
      [[' a ']],
      [['a']],
      [['a', 'b', 'c']],
    ])('Data with valid cast %j -> document is valid', (cast) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', cast });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it('Data with null production_countries value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        production_countries: [null],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/production_countries/0" should be string (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with empty production_countries value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        production_countries: [''],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/production_countries/0" should NOT have fewer than 1 characters (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with whitespace production_countries value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        production_countries: [' '],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/production_countries/0" should match pattern "^$|.*\\S.*" (line: 10, column: 11)',
          schemaPath: '#/definitions/non-empty-string/pattern',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with duplicate production_countries values -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        production_countries: ['EE', 'EE'],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/production_countries" should NOT have duplicate items (items ## 0 and 1 are identical) (line: 9, column: 33)',
          schemaPath: '#/uniqueItems',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      [null],
      [[]],
      [['ASD']],
      [['Estonia']],
      [['USA', 'ESP', 'DEU', 'CB', 'CUBA']],
    ])(
      'Data with valid production_countries %j -> document is valid',
      (production_countries) => {
        // Arrange
        const doc = createDocument({ title: 'avatar', production_countries });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it('Data with empty licenses object -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', licenses: [{}] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/licenses/0" should have required property \'start\' (line: 10, column: 11)',
          schemaPath: '#/definitions/licenses/items/anyOf/0/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/data/licenses/0" should have required property \'end\' (line: 10, column: 11)',
          schemaPath: '#/definitions/licenses/items/anyOf/1/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/data/licenses/0" should have required property \'countries\' (line: 10, column: 11)',
          schemaPath: '#/definitions/licenses/items/anyOf/2/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/data/licenses/0" should match some schema in anyOf (line: 10, column: 11)',
          schemaPath: '#/definitions/licenses/items/anyOf',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      ...whitespaceValues,
      ...defaultStringTestValues,
      'Lorem ipsum',
      '2020',
      '01-2020',
      '01-01-2020',
      '2020-01',
      '2020-01-',
      '2020-01-00',
      '2020-01-00T00:00:00.000+00:00',
      '2021-02-29T00:00:00.000+00:00',
      '2021-13-12T00:00:00.000+00:00',
      '2021.12.12T00:00:00.000+00:00',
      '12.12.2021T00:00:00.000+00:00',
      '12/12/2021T00:00:00.000+00:00',
    ])(
      'Data with license with invalid start and end date %p -> document is invalid',
      (date) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          licenses: [{ countries: ['EE'], start: date, end: date }],
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/licenses/0/start" should match format "date-time" (line: 14, column: 22)',
            schemaPath: '#/definitions/licenses/items/properties/start/format',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0/data/licenses/0/end" should match format "date-time" (line: 15, column: 20)',
            schemaPath: '#/definitions/licenses/items/properties/end/format',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('Data with null license countries value -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        licenses: [
          {
            start: '2020-08-01T00:00:00.000+00:00',
            end: '2020-08-01T00:00:00.000Z',
            countries: [null],
          },
        ],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/licenses/0/countries/0" should be string (line: 14, column: 15)',
          schemaPath:
            '#/definitions/licenses/items/properties/countries/items/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(['', ' ', 'CBA', 'CUBA'])(
      'Data with invalid license countries value %p -> document is invalid',
      (code) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          licenses: [
            {
              start: '2020-08-01T00:00:00.000+00:00',
              end: '2020-08-01T00:00:00.000Z',
              countries: [code],
            },
          ],
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/licenses/0/countries/0" should match pattern "^[A-Z]{2}$" (line: 14, column: 15)',
            schemaPath:
              '#/definitions/licenses/items/properties/countries/items/pattern',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it('Data with duplicate license countries values -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        licenses: [
          {
            start: '2020-08-01T00:00:00.000+00:00',
            end: '2020-08-01T00:00:00.000Z',
            countries: ['EE', 'EE'],
          },
        ],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/licenses/0/countries" should NOT have duplicate items (items ## 1 and 0 are identical) (line: 13, column: 26)',
          schemaPath:
            '#/definitions/licenses/items/properties/countries/uniqueItems',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each([
      [null],
      [[]],
      [[{ start: '2020-08-01T00:00:00.000+00:00' }]],
      [[{ end: '2020-08-01T00:00:00.000Z' }]],
      [[{ countries: ['AW'] }]],
      [[{ start: '2020-08-01T00:00:00.000+00:00', countries: ['AW'] }]],
      [[{ end: '2020-08-01T00:00:00.000Z', countries: ['AW'] }]],
      [
        [
          {
            start: '2020-08-01T00:00:00.000+00:00',
            end: '2020-08-01T00:00:00.000Z',
          },
        ],
      ],
      [
        [
          {
            start: '2020-08-01T00:00:00.000+00:00',
            end: '2020-08-01T00:00:00.000Z',
            countries: [],
          },
        ],
      ],
      [
        [
          {
            start: '2020-08-01T00:00:00.000+00:00',
            end: '2020-08-01T00:00:00.000Z',
            countries: ['AW', 'EE', 'DE'],
          },
        ],
      ],
    ])('Data with valid licenses %j -> document is valid', (licenses) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', licenses });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it('Data with main video with profile and without source -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        main_video: {
          profile: 'DEFAULT',
        },
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/main_video" should have required property \'source\' (line: 9, column: 23)',
          schemaPath: '#/dependencies/profile/required', //TODO: Open issue: https://github.com/ajv-validator/ajv/issues/512
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with main video with null source -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        main_video: {
          source: null,
        },
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/main_video/source" should be string (line: 10, column: 21)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with main video with empty source -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        main_video: {
          source: '',
        },
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/main_video/source" should NOT have fewer than 1 characters (line: 10, column: 21)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(whitespaceValues)(
      'Data with main video with whitespace "%s" source -> document is invalid',
      (whitespace) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          main_video: {
            source: whitespace,
          },
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/main_video/source" should match pattern "^$|.*\\S.*" (line: 10, column: 21)',
            schemaPath: '#/definitions/non-empty-string/pattern',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each([
      ...defaultStringTestValues,
      'random test',
      'avatar.the.movie',
      'firefly/season-2/episode-1',
    ])(
      'Data with main video with valid source "%s" -> document is valid',
      (source) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          main_video: { source },
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it('Data with main video with null profile -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        main_video: {
          source: 'valid source',
          profile: null,
        },
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/main_video/profile" should be string (line: 11, column: 22)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with main video with empty profile -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        main_video: {
          source: 'valid source',
          profile: '',
        },
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/main_video/profile" should NOT have fewer than 1 characters (line: 11, column: 22)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(whitespaceValues)(
      'Data with main video with whitespace "%s" profile -> document is invalid',
      (whitespace) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          main_video: {
            source: 'valid source',
            profile: whitespace,
          },
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/main_video/profile" should match pattern "^$|.*\\S.*" (line: 11, column: 22)',
            schemaPath: '#/definitions/non-empty-string/pattern',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each([
      ...defaultStringTestValues,
      'random test',
      'avatar.the.movie',
      'DEFAULT',
    ])(
      'Data with main video with valid profile "%s" -> document is valid',
      (profile) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          main_video: {
            source: 'valid source',
            profile,
          },
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it.each([
      null,
      {},
      { source: 'test-videos/videos/avatar_1' },
      { source: 'test-videos/videos/avatar_1', profile: 'DEFAULT' },
    ])('Data with valid main_video %p -> document is valid', (main_video) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', main_video });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });

    it('Data with null trailer -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', trailers: [null] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/trailers/0" should be object (line: 10, column: 11)',
          schemaPath: '#/items/type', //TODO: Open issue: https://github.com/ajv-validator/ajv/issues/512
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with trailer with null source -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        trailers: [{ source: null }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/trailers/0/source" should be string (line: 11, column: 23)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with trailer with empty source -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        trailers: [{ source: '' }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/trailers/0/source" should NOT have fewer than 1 characters (line: 11, column: 23)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(whitespaceValues)(
      'Data with trailer with whitespace "%s" source -> document is invalid',
      (whitespace) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          trailers: [{ source: whitespace }],
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/trailers/0/source" should match pattern "^$|.*\\S.*" (line: 11, column: 23)',
            schemaPath: '#/definitions/non-empty-string/pattern',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each([
      ...defaultStringTestValues,
      'random test',
      'avatar.the.movie',
      'firefly/season-2/episode-1',
    ])(
      'Data with trailer with valid source "%s" -> document is valid',
      (source) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          trailers: [{ source }],
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it('Data with trailer with null profile -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        trailers: [{ source: 'valid source', profile: null }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/trailers/0/profile" should be string (line: 12, column: 24)',
          schemaPath: '#/definitions/non-empty-string/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with trailer with empty profile -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        trailers: [{ source: 'valid source', profile: '' }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/trailers/0/profile" should NOT have fewer than 1 characters (line: 12, column: 24)',
          schemaPath: '#/definitions/non-empty-string/minLength',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(whitespaceValues)(
      'Data with trailer with whitespace "%s" profile -> document is invalid',
      (whitespace) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          trailers: [{ source: 'valid source', profile: whitespace }],
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/trailers/0/profile" should match pattern "^$|.*\\S.*" (line: 12, column: 24)',
            schemaPath: '#/definitions/non-empty-string/pattern',
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each([
      ...defaultStringTestValues,
      'random test',
      'avatar.the.movie',
      'DEFAULT',
    ])(
      'Data with trailer with valid profile "%s" -> document is valid',
      (profile) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          trailers: [{ source: 'valid source', profile }],
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it.each([[[{}]], [[{ profile: 'DEFAULT' }]]])(
      'Data with invalid trailers %j -> document is invalid',
      (trailers: any) => {
        // Arrange
        const doc = createDocument({ title: 'avatar', trailers });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([
          {
            message:
              'JSON path "document/items/0/data/trailers/0" should have required property \'source\' (line: 10, column: 11)',
            schemaPath: '#/items/required', //TODO: Open issue: https://github.com/ajv-validator/ajv/issues/512
            type: 'JsonSchemaValidation',
          },
          {
            message:
              'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
            schemaPath: '#/properties/items/items/allOf/0/if',
            type: 'JsonSchemaValidation',
          },
        ]);
        expect(isValid).toBe(false);
      },
    );

    it.each([
      [null],
      [[]],
      [[{ source: 'test-videos/trailers/avatar_1' }]],
      [[{ source: 'test-videos/trailers/avatar_1', profile: 'DEFAULT' }]],
      [
        [
          { source: 'test-videos/trailers/avatar_2', profile: 'DEFAULT' },
          { source: 'test-videos/trailers/avatar_2', profile: 'DEFAULT' },
        ],
      ],
    ])('Data with valid trailers %j -> document is valid', (trailers) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', trailers });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });
    //----------------------------------------------------------------

    it('Data with null image -> document is invalid', () => {
      // Arrange
      const doc = createDocument({ title: 'avatar', images: [null] });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/images/0" should be object (line: 10, column: 11)',
          schemaPath: '#/definitions/images/items/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with image with null path -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        images: [{ path: null }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/images/0/path" should be string (line: 11, column: 21)',
          schemaPath: '#/definitions/images/items/properties/path/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/data/images/0" should have required property \'type\' (line: 10, column: 11)',
          schemaPath: '#/definitions/images/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with image with empty path -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        images: [{ path: '' }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/images/0" should have required property \'type\' (line: 10, column: 11)',
          schemaPath: '#/definitions/images/items/required',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/data/images/0/path" should match pattern "^.*(.jpg|.jpeg|.png|.webp|.gif|.svg|.tiff|.avif|.heif)$" (line: 11, column: 21)',
          schemaPath: '#/definitions/images/items/properties/path/pattern',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with image with null type -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        images: [{ path: 'valid-image-path.jpg', type: null }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/images/0/type" should be string (line: 12, column: 21)',
          schemaPath: '#/definitions/images/items/properties/type/type',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0/data/images/0/type" should be equal to one of the allowed values: COVER, TEASER (line: 12, column: 21)',
          schemaPath: '#/definitions/images/items/properties/type/enum',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it('Data with image with empty type -> document is invalid', () => {
      // Arrange
      const doc = createDocument({
        title: 'avatar',
        images: [{ path: 'valid-image-path.jpg', type: '' }],
      });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([
        {
          message:
            'JSON path "document/items/0/data/images/0/type" should be equal to one of the allowed values: COVER, TEASER (line: 12, column: 21)',
          schemaPath: '#/definitions/images/items/properties/type/enum',
          type: 'JsonSchemaValidation',
        },
        {
          message:
            'JSON path "document/items/0" should match "then" schema (line: 4, column: 5)',
          schemaPath: '#/properties/items/items/allOf/0/if',
          type: 'JsonSchemaValidation',
        },
      ]);
      expect(isValid).toBe(false);
    });

    it.each(['COVER', 'TEASER'])(
      'Data with image with valid type "%s" -> document is valid',
      (type) => {
        // Arrange
        const doc = createDocument({
          title: 'avatar',
          images: [{ path: 'valid-image-path.jpg', type }],
        });

        // Act
        const isValid = ajv.validate(ingestSchema, doc);
        const errors = transformAjvErrors(ajv.errors, doc);

        // Assert
        expect(errors).toIncludeSameMembers([]);
        expect(isValid).toBe(true);
      },
    );

    it.each([
      [null],
      [[]],
      [[{ path: 'test-images/images/avatar_1.jpg', type: 'COVER' }]],
      [[{ path: 'test-images/images/avatar_1.jpeg', type: 'TEASER' }]],
      [
        [
          { path: 'test-images/images/avatar_2.png', type: 'COVER' },
          { path: 'test-images/images/avatar_2.webp', type: 'TEASER' },
        ],
      ],
      [
        [
          { path: 't.gif', type: 'COVER' },
          { path: 't.svg', type: 'TEASER' },
        ],
      ],
    ])('Data with valid images %j -> document is valid', (images) => {
      // Arrange
      const doc = createDocument({ title: 'avatar', images });

      // Act
      const isValid = ajv.validate(ingestSchema, doc);
      const errors = transformAjvErrors(ajv.errors, doc);

      // Assert
      expect(errors).toIncludeSameMembers([]);
      expect(isValid).toBe(true);
    });
  });
});
