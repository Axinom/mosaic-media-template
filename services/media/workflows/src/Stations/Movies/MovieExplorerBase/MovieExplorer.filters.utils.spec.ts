import { describe, expect, it } from 'vitest';
import { MovieFilter } from '../../../generated/graphql';
import { applyTitleSearchFilter } from './MovieExplorer.filters.utils';

describe('applyTitleSearchFilter', () => {
  it('no filter -> no filter', () => {
    expect(applyTitleSearchFilter(undefined)).toBeUndefined();
  });

  it('no title filter -> unchanged filter', () => {
    const filter: MovieFilter = {
      studio: { includesInsensitive: 'Universal' },
      id: { notIn: [1, 2] },
    };

    expect(applyTitleSearchFilter(filter)).toBe(filter);
  });

  it.each(['', 'a', 'ab'])(
    'title term %j shorter than three characters -> unchanged filter',
    (term) => {
      const filter: MovieFilter = {
        title: { includesInsensitive: term },
        studio: { includesInsensitive: 'Universal' },
      };

      expect(applyTitleSearchFilter(filter)).toBe(filter);
    },
  );

  it.each(['abc', '%_\\', 'The Matrix'])(
    'title term %j of at least three characters -> title search field',
    (term) => {
      expect(
        applyTitleSearchFilter({ title: { includesInsensitive: term } }),
      ).toEqual({ titleIncludesInsensitive: term });
    },
  );

  it('title term with other title operators -> other title operators kept', () => {
    expect(
      applyTitleSearchFilter({
        title: { includesInsensitive: 'abc', equalTo: 'abcdef' },
      }),
    ).toEqual({
      title: { equalTo: 'abcdef' },
      titleIncludesInsensitive: 'abc',
    });
  });

  it('title term with other filters -> other filters unchanged', () => {
    const filter: MovieFilter = {
      title: { includesInsensitive: 'Matrix' },
      originalTitle: { includesInsensitive: 'Matrix' },
      moviesTags: { some: { name: { includesInsensitive: 'action' } } },
      publishStatus: { in: [] },
      released: { greaterThanOrEqualTo: '2000-01-01' },
      id: { equalTo: 5, notIn: [1, 2] },
      mainVideoId: { isNull: false },
    };

    const { title, ...otherFilters } = filter;
    expect(applyTitleSearchFilter(filter)).toEqual({
      ...otherFilters,
      titleIncludesInsensitive: title?.includesInsensitive,
    });
  });
});
