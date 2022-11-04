import {
  parseContentId,
  parsePublishMessageType,
  pascalCaseToKebabCase,
} from './utils';

describe('parseContentType', () => {
  // TODO: Maybe cover all content types?
  test('Parse valid content ID', () => {
    // Arrange & Act
    const type = parseContentId('movie-123');

    // Assert
    expect(type).toBe('movie');
  });

  test('Parse invalid content ID', () => {
    // Arrange & Act
    const type = parseContentId('in_valid-123');

    // Assert
    expect(type).toBeUndefined();
  });
});

describe('pascalCaseToKebabCase', () => {
  // Arrange
  test.each`
    input                | expected
    ${'SomeString'}      | ${'some-string'}
    ${'SomeXString'}     | ${'some-x-string'}
    ${'S'}               | ${'s'}
    ${'not-pascal-case'} | ${'not-pascal-case'}
    ${'notPascal-case'}  | ${'notPascal-case'}
  `(
    'pascalCaseToKebabCase($input) should convert to $expected',
    ({ input, expected }) => {
      // Act & Assert
      expect(pascalCaseToKebabCase(input)).toEqual(expected);
    },
  );
});

describe('parsePublishMessageType', () => {
  test('Valid input', () => {
    // Arrange & Act
    const result = parsePublishMessageType('MovieGenrePublishedEvent');

    // Assert
    expect(result).toEqual({
      contentType: 'movie-genre',
      publishOperation: 'published',
    });
  });

  test('Invalid input', () => {
    // Arrange
    const action = () => parsePublishMessageType('SomeBadString');

    // Act & Assert
    expect(action).toThrow(Error);
  });
});
