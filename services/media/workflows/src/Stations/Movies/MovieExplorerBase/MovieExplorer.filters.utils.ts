import { MovieFilter } from '../../../generated/graphql';

/**
 * Terms with fewer characters contain no trigram that the title search index
 * could use.
 */
const minimumTitleSearchTermLength = 3;

/**
 * Moves a title search into `titleIncludesInsensitive`, which matches the same
 * movies as `title.includesInsensitive` but can use the title search index.
 * Shorter terms keep the `title.includesInsensitive` filter.
 */
export const applyTitleSearchFilter = (
  filter: MovieFilter | undefined,
): MovieFilter | undefined => {
  const term = filter?.title?.includesInsensitive;
  if (
    filter === undefined ||
    typeof term !== 'string' ||
    term.length < minimumTitleSearchTermLength
  ) {
    return filter;
  }

  const { title, ...otherFilters } = filter;
  const { includesInsensitive, ...otherTitleFilters } = title ?? {};
  return {
    ...otherFilters,
    ...(Object.keys(otherTitleFilters).length > 0 && {
      title: otherTitleFilters,
    }),
    titleIncludesInsensitive: term,
  };
};
