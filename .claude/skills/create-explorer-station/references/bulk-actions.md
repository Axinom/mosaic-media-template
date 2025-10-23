# Bulk Actions for Explorer Stations

This document describes how to implement bulk actions for explorer stations,
allowing users to perform operations on multiple selected items simultaneously.

## Overview

Bulk actions enable users to:

- Select multiple items in the explorer
- Apply operations to all selected items at once
- Use "Select All" to apply operations to filtered results

Common bulk actions include: Publish, Unpublish, Delete, Create Snapshots

## File Structure

Bulk actions are typically implemented in a separate file: `{Entity}.actions.ts`

```typescript
import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkDeleteCollectionsMutation,
  useBulkPublishCollectionsMutation,
  // ... other bulk mutations
} from '../../../generated/graphql';
import { useCollectionsFilters } from './Collections.filters';
import { CollectionData } from './Collections.types';

export function useCollectionsActions(): {
  readonly bulkActions: ExplorerBulkAction<CollectionData>[];
} {
  // Implementation here
}
```

## GraphQL Bulk Mutations

First, define bulk mutations in the GraphQL file:

```graphql
mutation BulkDeleteCollections($filter: CollectionFilter) {
  deleteCollections(filter: $filter) {
    affectedIds
  }
}

mutation BulkPublishCollections($filter: CollectionFilter) {
  publishCollections(filter: $filter) {
    affectedIds
  }
}

mutation BulkUnpublishCollections($filter: CollectionFilter) {
  unpublishCollections(filter: $filter) {
    affectedIds
  }
}

mutation BulkCreateCollectionSnapshots($filter: CollectionFilter) {
  createCollectionSnapshots(filter: $filter) {
    affectedIds
  }
}
```

**Convention:**

- Mutation name: `Bulk{Action}{EntityPlural}` (e.g., `BulkDeleteCollections`)
- Input parameter: `$filter: {Entity}Filter`
- Return field: `affectedIds` (array of affected entity IDs)

## Bulk Action Structure

Each bulk action is defined with:

| Property           | Type                 | Required | Description                           |
| ------------------ | -------------------- | -------- | ------------------------------------- |
| `label`            | string               | Yes      | Display name in bulk actions menu     |
| `onClick`          | function             | Yes      | Handler function for the action       |
| `actionType`       | PageHeaderActionType | Yes      | Visual style (usually `Context`)      |
| `icon`             | IconName             | No       | Icon to display next to label         |
| `confirmationMode` | string               | No       | Show confirmation dialog (`'Simple'`) |
| `reloadData`       | boolean              | Yes      | Reload explorer data after action     |

## Implementing Bulk Actions Hook

### 1. Import Required Hooks and Types

```typescript
import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkDeleteCollectionsMutation,
  useBulkPublishCollectionsMutation,
  useBulkUnpublishCollectionsMutation,
  useBulkCreateCollectionSnapshotsMutation,
} from '../../../generated/graphql';
import { useCollectionsFilters } from './Collections.filters';
import { CollectionData } from './Collections.types';
```

### 2. Initialize Mutation Hooks

```typescript
export function useCollectionsActions(): {
  readonly bulkActions: ExplorerBulkAction<CollectionData>[];
} {
  const { transformFilters } = useCollectionsFilters();

  const [bulkDeleteCollections] = useBulkDeleteCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishCollections] = useBulkPublishCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  // ... other mutations
```

**Notes:**

- Use `fetchPolicy: 'no-cache'` to ensure fresh data
- Pass the Apollo `client` instance

### 3. Define Bulk Action Handlers

Each bulk action needs a handler that supports two selection modes:

#### Selection Modes

1. **SINGLE_ITEMS**: User selected specific items
2. **SELECT_ALL**: User selected all filtered items

```typescript
const publishNowBulkAction: ExplorerBulkAction<CollectionData> = {
  label: 'Publish Now',
  onClick: async (arg?: ItemSelection<CollectionData>) => {
    switch (arg?.mode) {
      case 'SELECT_ALL':
        await bulkPublishCollections({
          variables: { filter: transformFilters(arg.filters) },
        });
        break;
      case 'SINGLE_ITEMS':
        await bulkPublishCollections({
          variables: {
            filter: {
              id: { in: arg.items?.map((item) => item.id) },
            },
          },
        });
        break;
    }
  },
  actionType: PageHeaderActionType.Context,
  confirmationMode: 'Simple',
  icon: IconName.Publish,
  reloadData: true,
};
```

#### Handler Pattern

```typescript
onClick: async (arg?: ItemSelection<CollectionData>) => {
  switch (arg?.mode) {
    case 'SELECT_ALL':
      // Use transformed filters from current explorer state
      await bulkMutation({
        variables: { filter: transformFilters(arg.filters) },
      });
      break;
    case 'SINGLE_ITEMS':
      // Use ID filter for selected items
      await bulkMutation({
        variables: {
          filter: {
            id: { in: arg.items?.map((item) => item.id) },
          },
        },
      });
      break;
  }
};
```

### 4. Return Bulk Actions Array

```typescript
  return {
    bulkActions: [
      createSnapshotsBulkAction,
      publishNowBulkAction,
      unpublishNowBulkAction,
      deleteBulkAction,
    ],
  };
}
```

## Complete Example: Collections Bulk Actions

```typescript
import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkCreateCollectionSnapshotsMutation,
  useBulkDeleteCollectionsMutation,
  useBulkPublishCollectionsMutation,
  useBulkUnpublishCollectionsMutation,
} from '../../../generated/graphql';
import { useCollectionsFilters } from './Collections.filters';
import { CollectionData } from './Collections.types';

export function useCollectionsActions(): {
  readonly bulkActions: ExplorerBulkAction<CollectionData>[];
} {
  const { transformFilters } = useCollectionsFilters();

  const [bulkDeleteCollections] = useBulkDeleteCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishCollections] = useBulkPublishCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkUnpublishCollections] = useBulkUnpublishCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkCreateCollectionSnapshots] =
    useBulkCreateCollectionSnapshotsMutation({
      client: client,
      fetchPolicy: 'no-cache',
    });

  const createSnapshotsBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Create Snapshot(s)',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkCreateCollectionSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkCreateCollectionSnapshots({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    icon: IconName.Snapshot,
    reloadData: true,
  };

  const publishNowBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkPublishCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkPublishCollections({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Publish,
    reloadData: true,
  };

  const unpublishNowBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkUnpublishCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkUnpublishCollections({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Unpublish,
    reloadData: true,
  };

  const deleteBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkDeleteCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkDeleteCollections({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Delete,
    reloadData: true,
  };

  return {
    bulkActions: [
      createSnapshotsBulkAction,
      publishNowBulkAction,
      unpublishNowBulkAction,
      deleteBulkAction,
    ],
  };
}
```

## Common Bulk Actions

### 1. Delete Action

```typescript
{
  label: 'Delete',
  onClick: async (arg?: ItemSelection<CollectionData>) => {
    // ... handler implementation
  },
  actionType: PageHeaderActionType.Context,
  confirmationMode: 'Simple',
  icon: IconName.Delete,
  reloadData: true,
}
```

**Properties:**

- Always use `confirmationMode: 'Simple'` for destructive actions
- Use `IconName.Delete` icon
- Set `reloadData: true` to refresh the explorer

### 2. Publish Action

```typescript
{
  label: 'Publish Now',
  onClick: async (arg?: ItemSelection<CollectionData>) => {
    // ... handler implementation
  },
  actionType: PageHeaderActionType.Context,
  confirmationMode: 'Simple',
  icon: IconName.Publish,
  reloadData: true,
}
```

### 3. Unpublish Action

```typescript
{
  label: 'Unpublish',
  onClick: async (arg?: ItemSelection<CollectionData>) => {
    // ... handler implementation
  },
  actionType: PageHeaderActionType.Context,
  confirmationMode: 'Simple',
  icon: IconName.Unpublish,
  reloadData: true,
}
```

### 4. Create Snapshots Action

```typescript
{
  label: 'Create Snapshot(s)',
  onClick: async (arg?: ItemSelection<CollectionData>) => {
    // ... handler implementation
  },
  actionType: PageHeaderActionType.Context,
  icon: IconName.Snapshot,
  reloadData: true,
}
```

**Note:** Snapshot creation typically doesn't need confirmation

## Integration with Explorer Component

Import and use the bulk actions hook in the main explorer component:

```typescript
import { useCollectionsActions } from './Collections.actions';

export const Collections: React.FC = () => {
  const { bulkActions } = useCollectionsActions();

  return (
    <NavigationExplorer<CollectionData>
      // ... other props
      bulkActions={bulkActions}
    />
  );
};
```

## Available Icons

Common icons from `IconName` enum:

- `IconName.Delete` - Trash/delete icon
- `IconName.Publish` - Publish/upload icon
- `IconName.Unpublish` - Unpublish/download icon
- `IconName.Snapshot` - Camera/snapshot icon
- Explore others in the `@axinom/mosaic-ui` package

## Confirmation Modes

| Mode       | Behavior                                      |
| ---------- | --------------------------------------------- |
| `'Simple'` | Shows basic confirmation dialog before action |
| (none)     | No confirmation, action executes immediately  |

**When to use confirmation:**

- Destructive actions (delete, unpublish)
- Actions that significantly change state (publish)
- **When NOT to use:** Non-destructive actions (create snapshots, export)

## Common Mistakes to Avoid

1. **Missing SELECT_ALL case**: Always handle both `SELECT_ALL` and
   `SINGLE_ITEMS` modes
2. **Wrong filter transformation**: Use `transformFilters(arg.filters)` for
   SELECT_ALL
3. **Forgetting reloadData**: Set `reloadData: true` to refresh explorer after
   action
4. **Wrong actionType**: Use `PageHeaderActionType.Context` for standard bulk
   actions
5. **Missing confirmation**: Destructive actions should have
   `confirmationMode: 'Simple'`
6. **Forgetting mutations in GraphQL**: Ensure bulk mutations are defined in
   `.graphql` file
7. **Not running codegen**: Run `yarn codegen` after adding mutations

## Backend Requirements

For bulk actions to work, the backend GraphQL API must support:

1. Bulk mutation resolvers (e.g., `deleteCollections`, `publishCollections`)
2. Filter parameter support on mutations
3. Return `affectedIds` field to indicate which entities were affected

If backend doesn't support a specific bulk operation, omit that action from the
explorer.

## Reference Implementation

See complete working example at:
`services/media/workflows/src/Stations/Collections/CollectionsExplorer/Collections.actions.ts`
