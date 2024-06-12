/**
 * Opens a new browser tab using the url param
 * @param url - location
 */
export const openInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener, noreferrer');
};
