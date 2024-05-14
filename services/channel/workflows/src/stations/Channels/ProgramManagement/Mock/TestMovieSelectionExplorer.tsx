import { SelectionExplorerProps } from '@axinom/mosaic-ui';
import React from 'react';

export interface Movie {
  title: string;
  videoId: string;
  entityId: string;
  imageId?: string;
}

export const TestMovieSelectionExplorer: React.FC<
  Pick<SelectionExplorerProps<Movie>, 'onSelection'> & { onClose: () => void }
> = ({ onSelection, onClose }) => (
  <div>
    <button
      type="button"
      onClick={() => {
        onSelection?.({
          mode: 'SINGLE_ITEMS',
          items: [
            {
              title: 'Movie 1',
              videoId: 'db034cff-6dd3-446d-bda7-bf138b767163',
              entityId: 'entityId1',
              imageId: '69c7ea1d-c637-4cd6-aafc-2f1d8ff3500e',
            },
          ],
        });
      }}
    >
      Select
    </button>
    <button type="button" onClick={onClose}>
      Close
    </button>
  </div>
);
