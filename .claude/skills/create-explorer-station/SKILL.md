---
name: create-explorer-station
description:
  This skill should be used when developers need to create a new explorer
  station (entity overview screen) within a Mosaic service's workflows package.
  Explorer stations are React-based UI components that display tabular data with
  filtering, sorting, pagination, and optional bulk operations, following the
  Axinom Mosaic design system conventions.
---

# Create Explorer Station

This skill guides the creation of explorer stations for Mosaic services.
Explorer stations are entity overview screens that display data in a tabular
format with filtering, sorting, and pagination capabilities, built using the
`@axinom/mosaic-ui` library.

## About Explorer Stations

Explorer stations are React components that:

- Display entity data in a table format using the `NavigationExplorer` component
  from `@axinom/mosaic-ui`
- Pull data via GraphQL queries (typically PostGraphile-based APIs)
- Support filtering, sorting, and pagination out of the box
- Follow consistent patterns across all Mosaic management systems
- Can optionally include bulk actions, inline actions, quick edit panels, and
  bulk edit functionality

## When to Use This Skill

Use this skill when:

- A developer asks to create a new explorer station for an entity
- A developer provides a GraphQL query and asks to build the UI for it
- A developer needs to add an overview/list screen for a new entity type in a
  service's workflows package

## Directory Structure

Explorer stations are conventionally located at:

```
services/{service-name}/workflows/src/Stations/{EntityName}/{EntityName}Explorer/
```

Example for Collections:

```
services/media/workflows/src/Stations/Collections/CollectionsExplorer/
├── Collections.graphql         # GraphQL query, fragments, mutations
├── Collections.tsx              # Main explorer component
├── Collections.filters.ts       # Filter definitions
├── Collections.actions.ts       # Bulk actions (optional)
├── Collections.types.ts         # TypeScript type definitions
└── BulkEdit/                    # Bulk edit components (optional)
```

## Creation Workflow

### Step 1: Understand Requirements

Ask the developer:

1. **Entity name**: What entity is being displayed? (e.g., Collections, Movies,
   Products)
2. **GraphQL query**: Provide the base GraphQL query or ask if one exists
3. **Optional features**: Which features are needed?
   - Bulk actions (publish, unpublish, delete, etc.)
   - Inline actions (per-row action menus)
   - Quick edit panels (side panel editing)
   - Bulk edit (multi-select editing)

If the developer doesn't specify optional features, **only implement the core
explorer** (query, filters, columns, main component). Filters are always
included by default.

### Step 2: Structure the GraphQL Query

Transform the provided GraphQL query into the professional structure. See
`references/graphql-query-structure.md` for detailed guidance.

Key requirements:

- Create a fragment with entity properties
- Structure query with `$filter`, `$orderBy`, `$after` parameters
- Include `filtered` and `nonFiltered` results
- Include pagination fields (`totalCount`, `pageInfo`, `hasNextPage`,
  `endCursor`)
- Query should request 30 items per page (`first: 30`)

After creating the GraphQL file, **immediately run codegen**:

```bash
cd services/{service-name}/workflows
yarn codegen
```

This generates TypeScript types and React hooks that will be used in subsequent
steps.

### Step 3: Create TypeScript Type Definition

Create the `{Entity}.types.ts` file that extracts the TypeScript type from the
generated GraphQL query:

```typescript
import { {EntityName}Query } from '../../../generated/graphql';

export type {EntityName}Data = NonNullable<
  {EntityName}Query['filtered']
>['nodes'][number];
```

**Note:** This uses the types generated in the previous step.

### Step 4: Define Explorer Columns

Define columns in the main `{Entity}.tsx` component. See
`references/column-configurations.md` for detailed guidance.

Key properties:

- `label`: Display name
- `propertyName`: Field name from GraphQL
- `size`: Optional column width (e.g., '2fr', '80px')
- `sortable`: Enable/disable sorting (default: true)
- `render`: Custom renderer function (optional)

Common renderers from `@axinom/mosaic-ui`:

- `DateRenderer`: Format dates
- `createConnectionRenderer`: Render GraphQL connection fields
- `createThumbnailAndStateRenderer` (from
  `@axinom/mosaic-managed-workflow-integration`): Show thumbnails with status
  indicators

### Step 5: Implement Filters

Create the `{Entity}.filters.ts` file with filter definitions. See
`references/filters-implementation.md` for detailed guidance.

Key components:

- `filterOptions` array defining available filters
- `transformFilters` function converting UI filters to PostGraphile filter
  syntax
- Use `createDateRangeFilterValidators` for date range filters
- Common filter types: `FreeText`, `Numeric`, `Date`, `Options`

### Step 6: Create the Main Explorer Component

Create the `{Entity}.tsx` file with the following structure:

```typescript
import {
  Column,
  DateRenderer,
  ExplorerDataProvider,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { client } from '../../../apolloClient';
import {
  {EntityName}Document,
  {EntityName}OrderBy,
  {EntityName}Query,
  {EntityName}QueryVariables,
} from '../../../generated/graphql';
import { use{EntityName}Filters } from './{Entity}.filters';
import { {EntityName}Data } from './{Entity}.types';

export const {EntityName}: React.FC = () => {
  const { transformFilters, filterOptions } = use{EntityName}Filters();

  // Define columns (see Step 5)
  const explorerColumns: Column<{EntityName}Data>[] = [
    // ... column definitions
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<{EntityName}Data> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      const result = await client.query<
        {EntityName}Query,
        {EntityName}QueryVariables
      >({
        query: {EntityName}Document,
        variables: {
          filter: transformFilters(filters),
          orderBy: sortToPostGraphileOrderBy(sorting, {EntityName}OrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.filtered?.nodes ?? [],
        totalCount: result.data.nonFiltered?.totalCount as number,
        filteredCount: result.data.filtered?.totalCount as number,
        hasMoreData: result.data.filtered?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.filtered?.pageInfo.endCursor,
      };
    },
  };

  return (
    <NavigationExplorer<{EntityName}Data>
      title="{EntityName}"
      stationKey="{EntityName}Explorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) => `/{entity-path}/${item.id}`}
      onCreateAction="/{entity-path}/create"
      filterOptions={filterOptions}
      defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
    />
  );
};
```

### Step 7: Register the Explorer Station

Register the explorer station to make it accessible in the portal. See
`references/registration-setup.md` for detailed guidance.

**Ask the developer** (if not already specified):

1. Is this a primary entity (Movies, TV Shows) or secondary entity (Collections,
   Playlists)?
2. What category should it appear under? (Content, Curation, Settings)
3. What permissions should be required?

**Create two files:**

1. **Local registration file**: `{EntityFolder}/registrations.tsx`

   - Define navigation object (name, path, label, icon)
   - Register home tile (`type: 'large'` for primary, `'small'` for secondary)
   - Register navigation menu item
   - Register explorer page route with permissions

2. **Update global registration**: `src/index.tsx`
   - Import the registration function
   - Call it during setup with `app` and `extensions`

**Default assumptions if not specified:**

- Secondary entity → `type: 'small'`, `categoryName: 'Curation'`
- Permissions: `['ADMIN', '{ENTITY}_EDIT', '{ENTITY}_VIEW']`

### Step 8: Verify TypeScript Compilation

Verify that the code compiles without errors:

```bash
cd services/{service-name}/workflows
yarn tsc --noEmit
```

If compilation errors occur, common issues include:
- Missing imports in component files
- Incorrect type usage from codegen
- Typos in entity names or field references

Fix any errors before proceeding.

### Step 9: Add Optional Features (If Requested)

Only implement these if the developer explicitly requests them:

#### Bulk Actions

See `references/bulk-actions.md` for implementing bulk operations like publish,
unpublish, delete on multiple selected items.

#### Inline Actions

See `references/inline-actions.md` for implementing per-row action menus with
operations like publish, delete, navigate to details.

#### Quick Edit Panels

Quick edit panels allow editing entities in a side panel without navigating
away. These are typically pre-existing components that just need to be
registered:

```typescript
quickEditRegistrations={[
  {
    component: <{Entity}DetailsQuickEdit />,
    label: '{Entity} Details',
  },
]}
```

#### Bulk Edit

Bulk edit allows editing multiple items simultaneously. This requires additional
components and configuration - typically follow existing patterns in the
codebase.

## Reference Files

The following reference files contain detailed implementation guidance:

- `references/graphql-query-structure.md` - GraphQL query patterns and
  conventions
- `references/column-configurations.md` - Column definitions and renderers
- `references/filters-implementation.md` - Filter definitions and
  transformations
- `references/registration-setup.md` - Portal registration (tiles, navigation,
  routes)
- `references/bulk-actions.md` - Bulk action implementations (optional)
- `references/inline-actions.md` - Inline menu actions (optional)

**Load reference files only when needed** for specific implementation details.

## Example Explorer Stations

Reference these existing implementations for patterns and examples:

- `services/media/workflows/src/Stations/Collections/CollectionsExplorer/` -
  Full-featured example with all optional features
- `services/media/workflows/src/Stations/Movies/MoviesExplorer/` - Movie
  explorer implementation
- `services/media/workflows/src/Stations/TvShows/TvShowsExplorer/` - TV show
  explorer implementation
- `services/media/workflows/src/Stations/Episodes/EpisodesExplorer/` - Episode
  explorer implementation

## Key Conventions

1. **Use mosaic-ui components**: Rely on `@axinom/mosaic-ui` library components
   for consistency
2. **PostGraphile patterns**: Queries follow PostGraphile filter/ordering
   conventions
3. **30 items per page**: Standard pagination size
4. **Filters always included**: Even if not explicitly requested
5. **Fragment-based queries**: Use fragments for reusability and maintainability
6. **Consistent naming**: `{Entity}Explorer`, `{Entity}Data`,
   `use{Entity}Filters`, etc.
7. **Default sort**: Usually `updatedDate desc` for recently modified items
   first
8. **Run codegen immediately**: After creating/modifying GraphQL files, run
   `yarn codegen` before proceeding
9. **No non-null assertions**: Never use `!` operator (e.g., `value!`) - handle
   null/undefined explicitly or use optional chaining

## Common Pitfalls to Avoid

1. Don't add subscriptions unless explicitly requested (advanced feature)
2. Don't implement all optional features by default - ask first
3. Don't forget to run `yarn codegen` immediately after creating/modifying
   GraphQL files
4. Don't hardcode filter transformations - use `filterToPostGraphileFilter`
   helper
5. Ensure the GraphQL query matches the entity's actual schema fields
6. Use existing icons from `MediaIconName` - don't assume new icons exist for
   new entities
