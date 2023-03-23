import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { EpisodeExplorer } from '../Stations/Episodes/EpisodeExplorerBase/EpisodeExplorer';
import { MovieExplorer } from '../Stations/Movies/MovieExplorerBase/MovieExplorer';

export function register(app: PiletApi): void {
  app.addProvider('fast-provider', {
    type: 'Movie',
    label: 'Movie',
    selectionComponent: ({ onSelected }) => (
      <MovieExplorer
        kind="SelectionExplorer"
        title="Select Movie"
        stationKey="FASTMovieSelection"
        allowBulkSelect={false}
        enableSelectAll={false}
        defaultFilterValues={{
          mainVideoId: true,
        }}
        onSelection={(selection) => {
          const items =
            selection.mode === 'SINGLE_ITEMS' ? selection.items ?? [] : [];
          onSelected(
            items.map((e) => ({
              title: e.title,
              videoId: e.mainVideoId,
              entityId: String(e.id),
              imageId: e.moviesImages?.nodes?.[0]?.imageId,
            })),
          );
        }}
      />
    ),
    detailsResolver: ({ entityId }) => `/movies/${entityId}`,
  });

  app.addProvider('fast-provider', {
    type: 'Episode',
    label: 'Episode',
    selectionComponent: ({ onSelected }) => (
      <EpisodeExplorer
        kind="SelectionExplorer"
        title="Select Episode"
        stationKey="FASTEpisodeSelection"
        allowBulkSelect={false}
        enableSelectAll={false}
        defaultFilterValues={{
          mainVideoId: true,
        }}
        onSelection={(selection) => {
          const items =
            selection.mode === 'SINGLE_ITEMS' ? selection.items ?? [] : [];
          onSelected(
            items.map((e) => ({
              title: e.title,
              videoId: e.mainVideoId,
              entityId: String(e.id),
              imageId: e.episodesImages?.nodes?.[0]?.imageId,
            })),
          );
        }}
      />
    ),
    detailsResolver: ({ entityId }) => `/episodes/${entityId}`,
  });
}
