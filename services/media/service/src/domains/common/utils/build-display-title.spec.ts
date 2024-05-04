import 'jest-extended';
import { buildDisplayTitle } from './build-display-title';

describe('buildDisplayTitle', () => {
  describe('MOVIE', () => {
    it.each([undefined, null, {}, { title: undefined }, { title: null }])(
      'call with invalid media %p -> expected display title generated with empty value',
      (media) => {
        // Act
        const result = buildDisplayTitle('MOVIE', media as any);

        // Assert
        expect(result).toEqual('');
      },
    );

    it.each([
      ['', ''],
      ['Test', 'Test'],
      [' Test', 'Test'],
      ['Test ', 'Test'],
      [' Test ', 'Test'],
      ['\tTest', 'Test'],
      ['\nThe Matrix', 'The Matrix'],
    ])(
      'call with valid title %p -> expected display title generated with value %p',
      (mediaTitle, expectedTitle) => {
        // Act
        const result = buildDisplayTitle('MOVIE', { title: mediaTitle });

        // Assert
        expect(result).toEqual(expectedTitle);
      },
    );
  });

  describe('TVSHOW', () => {
    it.each([undefined, null, {}, { title: undefined }, { title: null }])(
      'call with invalid media %p -> expected display title generated with empty value',
      (media) => {
        // Act
        const result = buildDisplayTitle('TVSHOW', media as any);

        // Assert
        expect(result).toEqual('');
      },
    );

    it.each([
      ['', ''],
      ['Test', 'Test'],
      [' Test', 'Test'],
      ['Test ', 'Test'],
      [' Test ', 'Test'],
      ['\tTest', 'Test'],
      ['\nThe Mandalorian', 'The Mandalorian'],
    ])(
      'call with valid title %p -> expected display title generated with value %p',
      (mediaTitle, expectedTitle) => {
        // Act
        const result = buildDisplayTitle('TVSHOW', { title: mediaTitle });

        // Assert
        expect(result).toEqual(expectedTitle);
      },
    );
  });

  describe('SEASON', () => {
    it.each([undefined, null, {}, { index: undefined }, { index: null }])(
      'call with invalid media %p without tvshow -> expected display title generated with empty value',
      (media) => {
        // Act
        const result = buildDisplayTitle('SEASON', media as any);

        // Assert
        expect(result).toEqual('');
      },
    );

    it.each([undefined, null, {}, { index: undefined }, { index: null }])(
      'call with invalid media %p with valid tvshow -> expected display title generated with empty value',
      (media) => {
        // Act
        const result = buildDisplayTitle('SEASON', media as any, {
          title: 'Test',
        });

        // Assert
        expect(result).toEqual('');
      },
    );

    it.each([
      [0, 'Season 0'],
      [1, 'Season 1'],
      [11, 'Season 11'],
    ])(
      'call with valid index %p without tvshow -> expected display title generated with value %p',
      (index, expectedTitle) => {
        // Act
        const result = buildDisplayTitle('SEASON', { index });

        // Assert
        expect(result).toEqual(expectedTitle);
      },
    );

    it.each([
      [0, 'Season 0 (Test)'],
      [1, 'Season 1 (Test)'],
      [11, 'Season 11 (Test)'],
    ])(
      'call with valid index %p with valid tvshow -> expected display title generated with value %p',
      (index, expectedTitle) => {
        // Act
        const result = buildDisplayTitle(
          'SEASON',
          { index },
          { title: 'Test' },
        );

        // Assert
        expect(result).toEqual(expectedTitle);
      },
    );
  });

  describe('EPISODE', () => {
    it.each([
      undefined,
      null,
      {},
      { index: undefined },
      { index: null },
      { title: undefined },
      { title: null },
      { title: undefined, index: undefined },
      { title: null, index: null },
      { title: '' },
    ])(
      'call with invalid media %p without tvshow -> expected display title generated with empty value',
      (media) => {
        // Act
        const result = buildDisplayTitle('EPISODE', media as any);

        // Assert
        expect(result).toEqual('');
      },
    );

    it.each([
      undefined,
      null,
      {},
      { index: undefined },
      { index: null },
      { title: undefined },
      { title: null },
      { title: undefined, index: undefined },
      { title: null, index: null },
      { title: '' },
    ])(
      'call with invalid media %p with valid season -> expected display title generated with empty value',
      (media) => {
        // Act
        const result = buildDisplayTitle('EPISODE', media as any, { index: 1 });

        // Assert
        expect(result).toEqual('');
      },
    );

    it.each([
      undefined,
      null,
      {},
      { index: undefined },
      { index: null },
      { title: undefined },
      { title: null },
      { title: undefined, index: undefined },
      { title: null, index: null },
      { title: '' },
    ])(
      'call with invalid media %p with valid season and valid tvshow -> expected display title generated with empty value',
      (media) => {
        // Act
        const result = buildDisplayTitle(
          'EPISODE',
          media as any,
          { index: 1 },
          { title: 'Test' },
        );

        // Assert
        expect(result).toEqual('');
      },
    );

    it.each([
      [{ index: 1 }, 'Episode 1 (Season 1, Test)'],
      [{ index: 0 }, 'Episode 0 (Season 1, Test)'],
      [{ title: 'Pilot' }, 'Pilot (Season 1, Test)'],
      [{ title: ' Pilot ', index: 1 }, 'Episode 1: Pilot (Season 1, Test)'],
      [{ title: '\nPilot\t', index: 0 }, 'Episode 0: Pilot (Season 1, Test)'],
    ])(
      'call with valid episode %p with valid season and valid tvshow -> expected display title generated with value %p',
      (media, expectedTitle) => {
        // Act
        const result = buildDisplayTitle(
          'EPISODE',
          media,
          { index: 1 },
          { title: 'Test' },
        );

        // Assert
        expect(result).toEqual(expectedTitle);
      },
    );

    it.each([
      [{ index: 1 }, 'Episode 1 (Season 1)'],
      [{ index: 0 }, 'Episode 0 (Season 1)'],
      [{ title: 'Pilot' }, 'Pilot (Season 1)'],
      [{ title: ' Pilot ', index: 1 }, 'Episode 1: Pilot (Season 1)'],
      [{ title: '\nPilot\t', index: 0 }, 'Episode 0: Pilot (Season 1)'],
    ])(
      'call with valid episode %p with valid season and without tvshow -> expected display title generated with value %p',
      (media, expectedTitle) => {
        // Act
        const result = buildDisplayTitle('EPISODE', media, { index: 1 });

        // Assert
        expect(result).toEqual(expectedTitle);
      },
    );

    it.each([
      [{ index: 1 }, 'Episode 1'],
      [{ index: 0 }, 'Episode 0'],
      [{ title: 'Pilot' }, 'Pilot'],
      [{ title: ' Pilot ', index: 1 }, 'Episode 1: Pilot'],
      [{ title: '\nPilot\t', index: 0 }, 'Episode 0: Pilot'],
    ])(
      'call with valid episode %p without season and  tvshow -> expected display title generated with value %p',
      (media, expectedTitle) => {
        // Act
        const result = buildDisplayTitle('EPISODE', media);

        // Assert
        expect(result).toEqual(expectedTitle);
      },
    );
  });

  describe('Unsupported type', () => {
    it('call with invalid type -> expected display title generated with empty value', () => {
      // Act
      expect(() => {
        buildDisplayTitle('Some Random Type' as any, {} as any);
      }).toThrow(
        "Unable to generate display title for ingest item. Ingest media type 'Some Random Type' is not supported.",
      );
    });
  });
});
