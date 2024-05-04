import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import { CommonErrors } from '../../../common';

/**
 * Function that builds a display title for episode.
 */
export function buildDisplayTitle(
  type: 'EPISODE',
  episode: { title?: string; index?: number },
  season?: { index?: number },
  tvshow?: { title?: string },
): string;

/**
 * Function that builds a display title for season.
 */
export function buildDisplayTitle(
  type: 'SEASON',
  season: { index?: number },
  tvshow?: { title?: string },
): string;

/**
 * Function that builds a display title for media entity without parent entities, e.g. movie or tvshow
 */
export function buildDisplayTitle(
  type: 'MOVIE' | 'TVSHOW',
  media: { title?: string },
): string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildDisplayTitle(...args: any[]): string {
  switch (args[0]) {
    case 'MOVIE':
    case 'TVSHOW': {
      return args[1]?.title?.trim() ?? '';
    }
    case 'SEASON': {
      const seasonTitle = isNullOrWhitespace(args[2]?.title)
        ? ''
        : ` (${args[2].title?.trim()})`;
      return args[1]?.index !== null && args[1]?.index !== undefined
        ? `Season ${args[1]?.index}${seasonTitle}`
        : '';
    }
    case 'EPISODE': {
      const tvshowTitle = isNullOrWhitespace(args[3]?.title)
        ? ''
        : `, ${args[3]?.title?.trim()}`;
      const seasonAndTvshowTitle =
        args[2]?.index === null || args[2]?.index === undefined
          ? ''
          : ` (Season ${args[2].index}${tvshowTitle})`;
      const episodeTitle =
        args[1]?.index !== null &&
        args[1]?.index !== undefined &&
        !isNullOrWhitespace(args[1]?.title)
          ? `Episode ${args[1]?.index}: ${args[1]?.title?.trim()}`
          : args[1]?.index !== null && args[1]?.index !== undefined
          ? `Episode ${args[1]?.index}`
          : !isNullOrWhitespace(args[1]?.title)
          ? args[1]?.title?.trim()
          : '';
      return episodeTitle !== ''
        ? `${episodeTitle}${seasonAndTvshowTitle}`
        : '';
    }
    default: {
      throw new MosaicError({
        ...CommonErrors.UnsupportedIngestMediaType,
        messageParams: [args[0]],
      });
    }
  }
}
