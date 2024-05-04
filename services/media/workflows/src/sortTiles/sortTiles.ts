import { HomeTileData } from '@axinom/mosaic-portal';

/**
 * The order defined here will be the order the tiles are shown,
 * the tiles which are not defined here will be tailed in to the end in alphabetical order.
 */
const tilesOrder = [
  'Movies',
  'TV Shows',
  'Seasons',
  'Episodes',
  'Videos',
  'Images',
  'Collections',
  'Ingest',
  'Snapshot Registry',
  'Monetization',
  'Settings',
];

export const sortTiles = (data: HomeTileData[]): HomeTileData[] => {
  const orderDefinedElements: HomeTileData[] = [];
  const orderNotDefinedElements: HomeTileData[] = [];

  data.forEach((element) => {
    if (tilesOrder.includes(element.label)) {
      orderDefinedElements.push(element);
    } else {
      orderNotDefinedElements.push(element);
    }
  });

  return [
    ...orderDefinedElements.sort(comparePatternBased),
    ...orderNotDefinedElements.sort(compareAlphabetical),
  ];
};

/**
 * The array is sorted maintaining the given order in tileOrder array
 * @param a first element to compare
 * @param b second element to compare
 */
const comparePatternBased = (a: HomeTileData, b: HomeTileData): number => {
  return tilesOrder.indexOf(a.label) - tilesOrder.indexOf(b.label);
};

/**
 * The array is sorted in alphabetical order
 * @param a first element to compare
 * @param b second element to compare
 */
const compareAlphabetical = (a: HomeTileData, b: HomeTileData): number => {
  if (a.label > b.label) {
    return 1;
  }
  return -1;
};
