import { NavigationItem, NavigationPanelCategory } from '@axinom/mosaic-portal';

const processingCategoryItemName = 'videos';
const contentCategoryItemName = 'images';
const curationCategoryItemNames = [
  'monetization',
  'monetization-subscriptionplans',
  'monetization-claimsets',
  'channels',
];

export const transformNavigationItems = (
  items: NavigationItem[],
): NavigationItem[] => {
  // move managed solution navigation items
  // that are in "Workflows" category
  // to their own categories (content, processing or curation)
  items.forEach((item) => {
    if (item.name === contentCategoryItemName) {
      item.categoryName = 'Content';
    } else if (item.name === processingCategoryItemName) {
      item.categoryName = 'Processing';
    } else if (curationCategoryItemNames.includes(item.name)) {
      item.categoryName = 'Curation';
    }
  });
  return items;
};

export const transformNavigationTree = (
  tree: NavigationPanelCategory[],
): NavigationPanelCategory[] => {
  const sortedTree = [...tree].sort(alphabeticalObjectSorter('categoryName'));

  const settingsIndex = sortedTree.findIndex(
    ({ categoryName }) => categoryName === 'Settings',
  );

  // move Settings to the end of the list
  const transformedTree = [
    ...sortedTree.slice(0, settingsIndex),
    ...sortedTree.slice(settingsIndex + 1),
    sortedTree[settingsIndex],
  ];

  // sort items in each category
  transformedTree.forEach(categoryItemSorter);

  return transformedTree;
};

const CategoryItemOrder = {
  Content: ['movies', 'tvshows', 'seasons', 'episodes', 'images'],
  Curation: ['collections', 'channels', 'monetization'],
  Processing: ['ingest', 'videos', 'snapshots'],
};

const categoryItemSorter = (
  category: NavigationPanelCategory,
): NavigationPanelCategory => {
  const predefinedOrder = CategoryItemOrder[category.categoryName] || [];
  return {
    ...category,
    items: predefinedOrderSorter(predefinedOrder, category.items, 'name'),
  };
};

/**
 * Sorts objects alphabetically by property
 * @param propName - property to sort by
 * @returns sort function
 */
const alphabeticalObjectSorter =
  <T>(propName: keyof T) =>
  (a: T, b: T): number =>
    String(a[propName]).localeCompare(String(b[propName]));

/**
 * Sorts items by predefined order, then alphabetically
 * @param predefinedOrder - predefined order of items
 * @param items - items to sort
 * @param sortProperty - property to sort by
 * @returns sorted items
 */
const predefinedOrderSorter = <T>(
  predefinedOrder: T[keyof T][] = [],
  items: T[] = [],
  sortProperty: keyof T,
): T[] => {
  return items.sort((a, b) => {
    const aIndex = predefinedOrder.indexOf(a[sortProperty]);
    const bIndex = predefinedOrder.indexOf(b[sortProperty]);

    return aIndex === -1 && bIndex === -1
      ? 0 // neither a nor b are in the predefined order, sort alphabetically
      : aIndex === -1
      ? 1 // a is not in the predefined order, b is, b comes first
      : bIndex === -1
      ? -1 // b is not in the predefined order, a is, a comes first
      : aIndex - bIndex; // both a and b are in the predefined order, sort by index
  });
};
