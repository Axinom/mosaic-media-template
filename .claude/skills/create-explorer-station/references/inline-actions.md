# Inline Actions for Explorer Stations

This document describes how to implement inline actions (per-row action menus)
for explorer stations, allowing users to perform operations on individual items.

## Overview

Inline actions provide a context menu for each row in the explorer, offering
quick access to common operations on individual items. These actions appear as a
menu icon on each row that expands when clicked.

Common inline actions include:

- Navigate to detail pages
- Publish/Unpublish individual items
- Delete individual items
- Create snapshots
- Custom entity-specific actions

## Implementation Location

Inline actions are defined directly in the main `{Entity}.tsx` component, not in
a separate file (unlike bulk actions).

## GraphQL Mutations

First, ensure individual mutations exist in the GraphQL file:

```graphql
mutation DeleteCollection($input: DeleteCollectionInput!) {
  deleteCollection(input: $input) {
    collection {
      id
    }
  }
}

mutation PublishCollection($id: Int!) {
  publishCollection(id: $id) {
    id
  }
}

mutation UnpublishCollection($id: Int!) {
  unpublishCollection(id: $id) {
    id
  }
}

mutation CreateCollectionSnapshot($collectionId: Int!) {
  createCollectionSnapshot(collectionId: $collectionId) {
    id
  }
}
```

**Note:** These are single-item mutations, different from bulk mutations.

## Action Structure

Each inline action is an `ActionData` object with:

| Property           | Type     | Required    | Description                           |
| ------------------ | -------- | ----------- | ------------------------------------- |
| `label`            | string   | Yes         | Display text in menu                  |
| `onActionSelected` | function | Conditional | Handler function (for actions)        |
| `path`             | string   | Conditional | Navigation path (for links)           |
| `icon`             | IconName | No          | Icon to display next to label         |
| `confirmationMode` | string   | No          | Show confirmation dialog (`'Simple'`) |

**Note:** Provide either `onActionSelected` OR `path`, not both.

## Implementing Inline Actions

### 1. Import Required Dependencies

```typescript
import { ActionData, IconName } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router-dom';
import {
  useCreateCollectionSnapshotMutation,
  useDeleteCollectionMutation,
  usePublishCollectionMutation,
  useUnpublishCollectionMutation,
} from '../../../generated/graphql';
import { client } from '../../../apolloClient';
```

### 2. Initialize Mutation Hooks

Inside the component, initialize mutation hooks:

```typescript
export const Collections: React.FC = () => {
  const history = useHistory();

  const [createCollectionSnapshotMutation] =
    useCreateCollectionSnapshotMutation({
      client,
      fetchPolicy: 'no-cache',
    });
  const [publishCollectionMutation] = usePublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishCollectionMutation] = useUnpublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteCollectionMutation] = useDeleteCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // ... rest of component
```

### 3. Create Action Generator Function

Define a function that generates actions for each row:

```typescript
const generateInlineMenuActions: (data: CollectionData) => ActionData[] = ({
  id,
}) => {
  return [
    {
      label: 'Create Snapshot',
      onActionSelected: async () => {
        await createCollectionSnapshotMutation({
          variables: { collectionId: id },
        });
        history.push('/collections');
      },
      icon: IconName.Snapshot,
    },
    {
      label: 'Publish Now',
      onActionSelected: async () => {
        await publishCollectionMutation({ variables: { id } });
        history.push('/collections');
      },
      icon: IconName.Publish,
      confirmationMode: 'Simple',
    },
    {
      label: 'Unpublish',
      onActionSelected: async () => {
        await unpublishCollectionMutation({ variables: { id } });
        history.push('/collections');
      },
      icon: IconName.Unpublish,
      confirmationMode: 'Simple',
    },
    {
      label: 'Delete',
      onActionSelected: async () => {
        await deleteCollectionMutation({ variables: { input: { id } } });
        history.push('/collections');
      },
      icon: IconName.Delete,
      confirmationMode: 'Simple',
    },
    {
      label: 'Open Details',
      path: `/collections/${id}`,
    },
  ];
};
```

**Function signature:**

```typescript
(data: EntityData) => ActionData[]
```

### 4. Integrate with NavigationExplorer

Pass the action generator to the `NavigationExplorer` component:

```typescript
<NavigationExplorer<CollectionData>
  // ... other props
  inlineMenuActions={generateInlineMenuActions}
/>
```

## Complete Example: Collections Inline Actions

```typescript
export const Collections: React.FC = () => {
  const history = useHistory();
  const { transformFilters, filterOptions } = useCollectionsFilters();
  const { bulkActions } = useCollectionsActions();

  const [createCollectionSnapshotMutation] =
    useCreateCollectionSnapshotMutation({
      client,
      fetchPolicy: 'no-cache',
    });
  const [publishCollectionMutation] = usePublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishCollectionMutation] = useUnpublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteCollectionMutation] = useDeleteCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // ... columns and dataProvider definitions

  const generateInlineMenuActions: (data: CollectionData) => ActionData[] = ({
    id,
  }) => {
    return [
      {
        label: 'Create Snapshot',
        onActionSelected: async () => {
          await createCollectionSnapshotMutation({
            variables: { collectionId: id },
          });
          history.push('/collections');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          await publishCollectionMutation({ variables: { id } });
          history.push('/collections');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          await unpublishCollectionMutation({ variables: { id } });
          history.push('/collections');
        },
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteCollectionMutation({ variables: { input: { id } } });
          history.push('/collections');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/collections/${id}`,
      },
    ];
  };

  return (
    <NavigationExplorer<CollectionData>
      title="Collections"
      stationKey="CollectionsExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) => `/collections/${item.id}`}
      onCreateAction="/collections/create"
      bulkActions={bulkActions}
      filterOptions={filterOptions}
      defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
```

## Common Inline Actions

### 1. Navigation Action

Navigate to a detail page:

```typescript
{
  label: 'Open Details',
  path: `/collections/${id}`,
}
```

**Note:** No icon needed for navigation actions (optional)

### 2. Publish Action

```typescript
{
  label: 'Publish Now',
  onActionSelected: async () => {
    await publishCollectionMutation({ variables: { id } });
    history.push('/collections');
  },
  icon: IconName.Publish,
  confirmationMode: 'Simple',
}
```

**Key points:**

- Use `confirmationMode: 'Simple'` for state-changing actions
- Navigate back after mutation completes
- Use appropriate icon

### 3. Unpublish Action

```typescript
{
  label: 'Unpublish',
  onActionSelected: async () => {
    await unpublishCollectionMutation({ variables: { id } });
    history.push('/collections');
  },
  icon: IconName.Unpublish,
  confirmationMode: 'Simple',
}
```

### 4. Delete Action

```typescript
{
  label: 'Delete',
  onActionSelected: async () => {
    await deleteCollectionMutation({ variables: { input: { id } } });
    history.push('/collections');
  },
  icon: IconName.Delete,
  confirmationMode: 'Simple',
}
```

**Note:** Delete often requires `input` wrapper object

### 5. Create Snapshot Action

```typescript
{
  label: 'Create Snapshot',
  onActionSelected: async () => {
    await createCollectionSnapshotMutation({
      variables: { collectionId: id },
    });
    history.push('/collections');
  },
  icon: IconName.Snapshot,
}
```

**Note:** No confirmation needed for non-destructive actions

## Action Order Guidelines

Recommended order for consistency:

1. **Non-destructive actions** (Create Snapshot, Export, etc.)
2. **State-changing actions** (Publish, Unpublish)
3. **Destructive actions** (Delete)
4. **Navigation actions** (Open Details)

## Available Icons

Common icons from `IconName` enum:

- `IconName.Snapshot` - Camera/snapshot icon
- `IconName.Publish` - Publish/upload icon
- `IconName.Unpublish` - Unpublish/download icon
- `IconName.Delete` - Trash/delete icon
- `IconName.Edit` - Edit/pencil icon
- Additional icons available in `@axinom/mosaic-ui`

## Navigation After Actions

After mutation actions, navigate to refresh the view:

```typescript
onActionSelected: async () => {
  await someMutation({ variables: { id } });
  history.push('/collections'); // Refresh current page
};
```

**Why navigate after mutations:**

- Triggers data reload
- Updates UI with latest state
- Provides visual feedback that action completed

**Alternative patterns:**

- Navigate to detail page: `history.push(\`/collections/${id}\`)`
- Stay on current page: `history.push(history.location.pathname)`

## Conditional Actions

Show actions based on entity state:

```typescript
const generateInlineMenuActions: (data: CollectionData) => ActionData[] = ({
  id,
  publishStatus,
}) => {
  const actions: ActionData[] = [
    {
      label: 'Create Snapshot',
      onActionSelected: async () => {
        await createCollectionSnapshotMutation({
          variables: { collectionId: id },
        });
        history.push('/collections');
      },
      icon: IconName.Snapshot,
    },
  ];

  // Only show publish if not published
  if (publishStatus !== PublishStatus.Published) {
    actions.push({
      label: 'Publish Now',
      onActionSelected: async () => {
        await publishCollectionMutation({ variables: { id } });
        history.push('/collections');
      },
      icon: IconName.Publish,
      confirmationMode: 'Simple',
    });
  }

  // Only show unpublish if published
  if (publishStatus === PublishStatus.Published) {
    actions.push({
      label: 'Unpublish',
      onActionSelected: async () => {
        await unpublishCollectionMutation({ variables: { id } });
        history.push('/collections');
      },
      icon: IconName.Unpublish,
      confirmationMode: 'Simple',
    });
  }

  // Always show delete and details
  actions.push(
    {
      label: 'Delete',
      onActionSelected: async () => {
        await deleteCollectionMutation({ variables: { input: { id } } });
        history.push('/collections');
      },
      icon: IconName.Delete,
      confirmationMode: 'Simple',
    },
    {
      label: 'Open Details',
      path: `/collections/${id}`,
    },
  );

  return actions;
};
```

## Confirmation Modes

| Mode       | Behavior                                      |
| ---------- | --------------------------------------------- |
| `'Simple'` | Shows basic confirmation dialog before action |
| (none)     | No confirmation, action executes immediately  |

**When to use confirmation:**

- Destructive actions (delete)
- State-changing actions (publish, unpublish)
- Actions that cannot be easily undone

**When NOT to use confirmation:**

- Non-destructive actions (create snapshot, export)
- Navigation actions (open details)

## Common Mistakes to Avoid

1. **Missing history import**: Import `useHistory` from `react-router-dom`
2. **Not navigating after mutation**: Always navigate to trigger data reload
3. **Wrong mutation variables**: Check GraphQL mutation signature (some use
   `input` wrapper)
4. **Missing confirmation**: Destructive actions should have
   `confirmationMode: 'Simple'`
5. **Forgetting fetchPolicy**: Use `fetchPolicy: 'no-cache'` for mutations
6. **Missing icon imports**: Import `IconName` from `@axinom/mosaic-ui`
7. **Both path and onActionSelected**: Provide only one, not both

## Integration with Row Click Navigation

Inline actions work alongside row click navigation:

```typescript
<NavigationExplorer<CollectionData>
  calculateNavigateUrl={(item) => `/collections/${item.id}`} // Row click
  inlineMenuActions={generateInlineMenuActions} // Menu actions
/>
```

**Behavior:**

- Clicking the row navigates to the detail page
- Clicking the menu icon shows inline actions
- Menu actions can override or supplement row click behavior

## Reference Implementation

See complete working example at:
`services/media/workflows/src/Stations/Collections/CollectionsExplorer/Collections.tsx`
(lines 148-194)
