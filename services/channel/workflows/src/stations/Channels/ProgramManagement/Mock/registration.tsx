import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { TestMovieSelectionExplorer } from './TestMovieSelectionExplorer';

export function registerMockExtensions(app: PiletApi): void {
  // movies
  app.addProvider('fast-provider', {
    type: 'MOVIE',
    label: 'Movie',
    selectionComponent: ({ onSelected, onClose }) => (
      <TestMovieSelectionExplorer
        onClose={onClose}
        onSelection={(selection) => {
          const items =
            selection.mode === 'SINGLE_ITEMS' ? selection.items ?? [] : [];
          onSelected(
            items.map((e) => ({
              title: e.title,
              videoId: e.videoId,
              entityId: e.entityId,
              imageId: e.imageId,
            })),
          );
        }}
      />
    ),
    detailsResolver: ({ entityId, entityType }) =>
      `https://www.google.com/${entityType}/${entityId}`,
  });
}
