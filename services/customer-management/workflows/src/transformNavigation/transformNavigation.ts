import { NavigationItem } from '@axinom/mosaic-portal';

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
