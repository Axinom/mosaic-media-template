# Details Station Actions

This document describes how to implement action buttons for Details stations.

## Overview

Actions appear in the Details station's action panel and provide operations like Delete, Publish, Unpublish, and navigation to related screens.

## Actions Hook Structure

Create `{EntityName}Details.actions.ts`:

```typescript
import { ActionData } from '@axinom/mosaic-ui';
import { useMemo } from 'react';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDelete{EntityName}Mutation,
  // Add other mutation hooks as needed
} from '../../../generated/graphql';

export function use{EntityName}DetailsActions(id: number): {
  readonly actions: ActionData[];
} {
  const history = useHistory();

  const [delete{EntityName}Mutation] = useDelete{EntityName}Mutation({
    client,
    fetchPolicy: 'no-cache',
  });

  return useMemo(() => {
    const delete{EntityName} = async (): Promise<void> => {
      await delete{EntityName}Mutation({ variables: { input: { id } } });
      history.push('/{entity-path}');
    };

    const actions: ActionData[] = [
      // Navigation actions
      {
        label: 'Manage Related Items',
        path: `/{entity-path}/${id}/related`,
      },
      // Mutation actions
      {
        label: 'Delete',
        confirmationMode: 'Simple',
        onActionSelected: delete{EntityName},
      },
    ];

    return { actions } as const;
  }, [delete{EntityName}Mutation, history, id]);
}
```

## Action Types

### 1. Navigation Actions

Navigate to related screens:

```typescript
{
  label: 'Manage Entities',
  path: `/{entity-path}/${id}/entities`,
}
```

### 2. Mutation Actions

Execute GraphQL mutations:

```typescript
{
  label: 'Delete',
  confirmationMode: 'Simple',  // Shows confirmation dialog
  onActionSelected: async () => {
    await deleteMutation({ variables: { input: { id } } });
    history.push('/{entity-path}');  // Navigate back after delete
  },
}
```

## Common Actions

### Delete Action (Always Include)

```typescript
const deleteEntity = async (): Promise<void> => {
  await deleteEntityMutation({ variables: { input: { id } } });
  history.push('/{entity-path}');
};

{
  label: 'Delete',
  confirmationMode: 'Simple',
  onActionSelected: deleteEntity,
}
```

**Convention:**
- Always use `confirmationMode: 'Simple'`
- Navigate to explorer after successful delete
- Mutation name: `delete{EntityName}`

### Publish/Unpublish Actions (If Applicable)

```typescript
{
  label: 'Publish Now',
  confirmationMode: 'Simple',
  onActionSelected: async () => {
    await publishMutation({ variables: { id } });
  },
},
{
  label: 'Unpublish',
  confirmationMode: 'Simple',
  onActionSelected: async () => {
    await unpublishMutation({ variables: { id } });
  },
}
```

### Manage Related Items

```typescript
{
  label: 'Manage Images',
  path: `/{entity-path}/${id}/images`,
},
{
  label: 'Manage Videos',
  path: `/{entity-path}/${id}/videos`,
}
```

### Publishing Snapshots

```typescript
{
  label: 'Publishing Snapshots',
  path: `/{entity-path}/${id}/snapshots`,
}
```

## Action Order Convention

1. Navigate to related management screens
2. Publish/Unpublish actions
3. Publishing Snapshots
4. Delete (always last)

## Reference Implementation

See `services/media/workflows/src/Stations/Collections/CollectionDetails/CollectionDetails.actions.ts`
