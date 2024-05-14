import { useCallback, useState } from 'react';

/**
 * `useOpenItems` is a custom React Hook that manages open states of items.
 * The items' open states are stored in an object where the item's track ID is the key and a boolean represents its open state.
 *
 * @returns {Object} The returned object includes:
 * - `openItems`: An object that holds the open states of all items.
 * - `isAnyOpen`: A boolean value indicating if any item is open.
 * - `toggleAll`: A function that toggles the open state of all items.
 * - `toggleItem`: A function that toggles the open state of a specific item.
 *
 * @example
 * const { openItems, isAnyOpen, toggleAll, toggleItem } = useOpenItems();
 * // To toggle all items open
 * toggleAll(true);
 * // To toggle a specific item open or closed
 * toggleItem('trackId1', true);
 */
export const useOpenItems = (): {
  readonly openItems: {
    [trackId: string]: boolean;
  };
  readonly isAnyOpen: boolean;
  readonly toggleAll: (isOpen: boolean) => void;
  readonly toggleItem: (trackId: string, isOpen: boolean | null) => void;
} => {
  const [openItems, setOpenItems] = useState<{ [trackId: string]: boolean }>(
    {},
  );

  /**
   * Updates the openItems state when an item's toggle button is clicked.
   * @param {string} trackId - The unique identifier of the item.
   * @param {boolean | null} isOpen - The new open state of the item. Pass null when the item unmounts.
   */
  const toggleItem = useCallback(
    (trackId: string, isOpen: boolean | null): void => {
      setOpenItems((prev) => {
        if (isOpen === null) {
          const { [trackId]: _, ...rest } = prev;
          return rest;
        } else {
          return {
            ...prev,
            [trackId]: isOpen,
          };
        }
      });
    },
    [],
  );

  const isAnyOpen = Object.values(openItems).some((val) => val === true);

  /**
   * Toggles the open state of all items.
   * @param {boolean} isOpen - The open state to set for all items.
   */
  const toggleAll = (isOpen: boolean): void => {
    setOpenItems((prev) => {
      const newOpenItems = { ...prev };
      for (const uuid in newOpenItems) {
        newOpenItems[uuid] = isOpen;
      }
      return newOpenItems;
    });
  };

  return {
    openItems,
    isAnyOpen,
    toggleAll,
    toggleItem,
  } as const;
};
