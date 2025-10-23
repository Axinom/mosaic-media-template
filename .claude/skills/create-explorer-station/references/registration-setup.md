# Registration Setup for Explorer Stations

This document describes how to register an explorer station in the Mosaic
portal, making it accessible via navigation tiles and menu items.

## Overview

After creating an explorer station, it needs to be registered in the portal to:

1. Appear as a tile on the home page
2. Appear in the navigation menu
3. Be accessible via routes
4. Have proper permissions configured

Registration happens in two locations:

1. **Local registrations file**: `{EntityFolder}/registrations.tsx` -
   Entity-specific registration logic
2. **Global index file**: `src/index.tsx` - Imports and calls the registration
   function

## Registration File Structure

### Location

```
services/{service-name}/workflows/src/Stations/{EntityName}/registrations.tsx
```

### Basic Template

```typescript
import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { {EntityName} } from './{EntityName}Explorer/{EntityName}';

export function register(app: PiletApi, extensions: Extensions): void {
  const {entityNameLower}Nav = {
    name: '{entity-name-kebab}',
    path: '/{entity-path}',
    label: '{Entity Display Name}',
    icon: <MediaIcons icon={MediaIconName.{IconName}} />,
  };

  app.registerTile(
    {
      ...{entityNameLower}Nav,
      kind: 'home',
      type: 'large',  // or 'small' for non-primary entities
    },
    false,
  );

  app.registerNavigationItem({
    ...{entityNameLower}Nav,
    categoryName: 'Content',  // or 'Curation' for secondary entities
  });

  app.registerPage(
    '/{entity-path}',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <{EntityName} />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => '{Entity Display Name}',
      permissions: {
        'media-service': ['ADMIN', '{ENTITY}_EDIT', '{ENTITY}_VIEW'],
      },
    },
  );
}
```

## Registration Components

### 1. Navigation Object

Define the core navigation properties:

```typescript
const moviesNav = {
  name: 'movies', // Unique identifier
  path: '/movies', // Route path
  label: 'Movies', // Display text
  icon: <MediaIcons icon={MediaIconName.Movie} />, // Icon component
};
```

**Naming conventions:**

- `name`: kebab-case (e.g., 'movies', 'tv-shows', 'collections')
- `path`: URL path starting with `/` (e.g., '/movies', '/collections')
- `label`: User-friendly display text (e.g., 'Movies', 'TV Shows')
- `icon`: Use `MediaIcons` component with an existing `MediaIconName` that makes
  sense for the entity

**Icon selection:**

The icon for a new entity likely won't exist yet in `MediaIconName`. Choose an
existing icon that visually represents the entity best. Common choices:

- Content entities: `MediaIconName.Movie`, `MediaIconName.TV`
- Collections/Lists: `MediaIconName.Collections`, `MediaIconName.Playlist`
- Generic/Other: Pick the most semantically similar icon from existing options

Check available icons in `src/MediaIcons/MediaIconName.ts` or refer to existing
registrations for ideas.

### 2. Register Home Tile

Add a tile to the home page:

```typescript
app.registerTile(
  {
    ...moviesNav,
    kind: 'home',
    type: 'large', // 'large' or 'small'
  },
  false,
);
```

**Tile types:**

- `'large'`: Primary entities (Movies, TV Shows, Episodes, Seasons) - main
  content types
- `'small'`: Secondary entities (Collections, Playlists) - curation/organization
  entities

**When to use each type:**

- **Large tiles** - Core content entities that are frequently accessed
- **Small tiles** - Supporting entities, curation tools, less frequently
  accessed

### 3. Register Navigation Item

Add to the sidebar navigation menu:

```typescript
app.registerNavigationItem({
  ...moviesNav,
  categoryName: 'Content', // Navigation category
});
```

**Category names:**

- `'Content'`: Primary content entities (Movies, TV Shows, Episodes, Seasons)
- `'Curation'`: Curation/organization entities (Collections, Playlists)
- `'Settings'`: Configuration and settings entities

### 4. Register Explorer Page

Register the main explorer route:

```typescript
app.registerPage(
  '/movies',
  () => (
    <ExtensionsContext.Provider value={extensions}>
      <Movies />
    </ExtensionsContext.Provider>
  ),
  {
    breadcrumb: () => 'Movies',
    permissions: {
      'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'],
    },
  },
);
```

**Key elements:**

- **Route path**: Must match the `path` in nav object
- **Component wrapper**: Wrap in `ExtensionsContext.Provider`
- **Breadcrumb**: Function returning breadcrumb text
- **Permissions**: Service-level permissions array

**Permission patterns:**

- Admin: `'ADMIN'`
- Edit: `'{ENTITY}_EDIT'` (e.g., 'MOVIES_EDIT', 'COLLECTIONS_EDIT')
- View: `'{ENTITY}_VIEW'` (e.g., 'MOVIES_VIEW', 'COLLECTIONS_VIEW')

## Complete Example: Collections

```typescript
import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { MediaIconName } from '../../MediaIcons';
import { MediaIcons } from '../../MediaIcons/MediaIcons';
import { Collections } from './CollectionsExplorer/Collections';

export function register(app: PiletApi, extensions: Extensions): void {
  const collectionsNav = {
    name: 'collections',
    path: '/collections',
    label: 'Collections',
    icon: <MediaIcons icon={MediaIconName.Collections} />,
  };

  app.registerTile(
    {
      ...collectionsNav,
      kind: 'home',
      type: 'small', // Small because Collections is secondary/curation
    },
    false,
  );

  app.registerNavigationItem({
    ...collectionsNav,
    categoryName: 'Curation', // Curation category for organization tools
  });

  app.registerPage(
    '/collections',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <Collections />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Collections',
      permissions: {
        'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
      },
    },
  );
}
```

## Complete Example: Movies (Primary Entity)

```typescript
import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { Movies } from './MoviesExplorer/Movies';

export function register(app: PiletApi, extensions: Extensions): void {
  const moviesNav = {
    name: 'movies',
    path: '/movies',
    label: 'Movies',
    icon: <MediaIcons icon={MediaIconName.Movie} />,
  };

  app.registerTile(
    {
      ...moviesNav,
      kind: 'home',
      type: 'large', // Large because Movies is primary content
    },
    false,
  );

  app.registerNavigationItem({
    ...moviesNav,
    categoryName: 'Content', // Content category for primary entities
  });

  app.registerPage(
    '/movies',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <Movies />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Movies',
      permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
    },
  );
}
```

## Registering in Global Index

After creating the local registration file, register it globally in
`src/index.tsx`:

### Step 1: Import the Registration Function

```typescript
import { register as register{EntityName} } from './Stations/{EntityName}/registrations';
```

### Step 2: Call During Setup

```typescript
export function setup(app: PiletApi): void {
  // ... initialization code

  const extensions = bindExtensions(app);

  // Register all stations
  registerMovies(app, extensions);
  registerTvShows(app, extensions);
  registerCollections(app, extensions);
  register{EntityName}(app, extensions);  // Add your new registration
}
```

**Example for Collections:**

```typescript
import { register as registerCollections } from './Stations/Collections/registrations';

// Later in setup function:
registerCollections(app, extensions);
```

## Icon Selection

Icons are defined in `MediaIconName` enum. For new entities, **use an existing
icon** that makes the most sense semantically.

Common existing icons:

| Icon Name                   | Use Case                     |
| --------------------------- | ---------------------------- |
| `MediaIconName.Movie`       | Movies, video content        |
| `MediaIconName.TV`          | TV Shows, series content     |
| `MediaIconName.Collections` | Collections, grouped items   |
| `MediaIconName.Playlist`    | Playlists, ordered lists     |
| `MediaIconName.Channel`     | Channels, streaming entities |

**For new entities:** Choose the most visually appropriate icon from the
existing set. Check `src/MediaIcons/MediaIconName.ts` for the complete list of
available icons.

**Note:** Creating new icons requires additional assets and enum updates, so
prefer reusing existing icons unless specifically needed.

## Permission Naming Conventions

Permissions follow the pattern: `{ENTITY_UPPER}_{ACTION}`

| Permission      | Purpose                    |
| --------------- | -------------------------- |
| `ADMIN`         | Full administrative access |
| `{ENTITY}_EDIT` | Edit permission for entity |
| `{ENTITY}_VIEW` | View permission for entity |

**Examples:**

- Movies: `'MOVIES_EDIT'`, `'MOVIES_VIEW'`
- Collections: `'COLLECTIONS_EDIT'`, `'COLLECTIONS_VIEW'`
- TV Shows: `'TVSHOWS_EDIT'`, `'TVSHOWS_VIEW'`

## Decision Guide: Tile Type and Category

### Use `type: 'large'` + `categoryName: 'Content'` when:

- Entity represents primary content (Movies, TV Shows, Episodes, Seasons)
- Entity is frequently accessed
- Entity is core to the media management workflow

### Use `type: 'small'` + `categoryName: 'Curation'` when:

- Entity is for organization/curation (Collections, Playlists, Channels)
- Entity is secondary or supporting
- Entity is accessed less frequently

## Optional: Route Resolvers

For entities that need programmatic route resolution (e.g., for deep linking):

```typescript
app.setRouteResolver(
  'collection-details',
  (
    dynamicRouteSegments?: Record<string, string> | string,
  ): string | undefined => {
    const collectionId =
      typeof dynamicRouteSegments === 'string'
        ? dynamicRouteSegments
        : dynamicRouteSegments?.collectionId;

    return collectionId ? `/collections/${collectionId}` : undefined;
  },
);
```

**When to add route resolvers:**

- Entity has detail pages that need to be linked from other stations
- Deep linking support is required
- Cross-station navigation exists

## Common Mistakes to Avoid

1. **Forgetting ExtensionsContext**: Always wrap component in
   `<ExtensionsContext.Provider value={extensions}>`
2. **Inconsistent naming**: Ensure `name`, `path`, and permissions match
   conventions
3. **Wrong tile type**: Use 'large' for primary entities, 'small' for secondary
4. **Missing global registration**: Don't forget to import and call in
   `src/index.tsx`
5. **Wrong category**: Use 'Content' for primary entities, 'Curation' for
   organization tools
6. **Typo in permissions**: Permission names must exactly match backend
   configuration
7. **Missing icon**: Ensure icon exists in `MediaIconName` enum

## Reference Implementations

See complete working examples:

- Collections (small tile):
  `services/media/workflows/src/Stations/Collections/registrations.tsx`
- Movies (large tile):
  `services/media/workflows/src/Stations/Movies/registrations.tsx`
- TV Shows (large tile):
  `services/media/workflows/src/Stations/TvShows/registrations.tsx`
- Global registration: `services/media/workflows/src/index.tsx`
