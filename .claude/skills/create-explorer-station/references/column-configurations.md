# Column Configurations for Explorer Stations

This document describes how to define and configure columns for explorer
stations, including custom renderers for specialized display formats.

## Overview

Columns define what data is displayed in the explorer table and how it's
rendered. Each column is configured with properties that control its appearance,
behavior, and data rendering.

## Column Definition Structure

Columns are defined as an array of `Column<EntityData>` objects in the main
explorer component:

```typescript
import { Column } from '@axinom/mosaic-ui';

const explorerColumns: Column<CollectionData>[] = [
  // ... column definitions
];
```

## Column Properties

| Property       | Type     | Required | Description                                 |
| -------------- | -------- | -------- | ------------------------------------------- |
| `label`        | string   | Yes      | Display name in table header                |
| `propertyName` | string   | Yes      | Field name from entity data                 |
| `size`         | string   | No       | Column width (e.g., '2fr', '80px', '100px') |
| `sortable`     | boolean  | No       | Enable/disable sorting (default: true)      |
| `render`       | function | No       | Custom render function for cell content     |

## Basic Column Examples

### 1. Simple Text Column

```typescript
{
  label: 'Title',
  propertyName: 'title',
}
```

Displays the field value as-is with default text rendering.

### 2. Column with Fixed Width

```typescript
{
  label: 'External ID',
  propertyName: 'externalId',
  size: '120px',
}
```

Use `size` to control column width:

- Fixed pixels: `'80px'`, `'120px'`, `'200px'`
- Fractional units: `'1fr'`, `'2fr'` (relative sizing)
- Default: Auto-calculated based on content

### 3. Non-Sortable Column

```typescript
{
  label: 'Tags',
  propertyName: 'collectionsTags',
  sortable: false,
}
```

Set `sortable: false` for:

- Computed fields
- Connection/relationship fields
- Fields without backend sorting support

## Column Sizing Guidelines

| Column Type          | Recommended Size      | Rationale                           |
| -------------------- | --------------------- | ----------------------------------- |
| Status indicators    | `'80px'` - `'100px'`  | Small, fixed-width for icons/badges |
| Primary text (title) | `'2fr'`               | Takes more space, main identifier   |
| IDs                  | `'120px'` - `'150px'` | Fixed width for numeric/code values |
| Dates                | `'150px'` - `'180px'` | Enough for formatted date/time      |
| Tags/Lists           | `'1fr'`               | Flexible based on content           |
| Actions              | `'60px'`              | Minimal space for action buttons    |

## Custom Renderers

Use the `render` property to customize how cell data is displayed.

### 1. Date Renderer

For timestamp fields:

```typescript
import { DateRenderer } from '@axinom/mosaic-ui';

{
  label: 'Created At',
  propertyName: 'createdDate',
  render: DateRenderer,
}
```

**What it does:**

- Formats ISO timestamps to readable dates
- Handles null/undefined values gracefully
- Consistent date formatting across application

**When to use:**

- `createdDate`, `updatedDate`, `publishedDate`
- Any timestamp fields

### 2. Thumbnail and State Renderer

For displaying status with thumbnail images:

```typescript
import { createThumbnailAndStateRenderer } from '@axinom/mosaic-managed-workflow-integration';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';

{
  propertyName: 'publishStatus',
  label: 'State',
  render: createThumbnailAndStateRenderer(
    'collectionsImages',
    PublishStatusStateMap,
  ),
  size: '80px',
}
```

**What it does:**

- Shows thumbnail image with colored status indicator
- Uses state map to determine status colors
- Provides visual cue for publish status

**Parameters:**

- First argument: Property name of the images connection (e.g.,
  `'collectionsImages'`)
- Second argument: State map object defining colors for status values

**State map example:**

```typescript
import { ColumnMap } from '@axinom/mosaic-ui';
import { PublishStatus } from '../../generated/graphql';

export const PublishStatusStateMap: ColumnMap = {
  [PublishStatus.NotPublished]: '#DDDDDD',
  [PublishStatus.Changed]: '#FFC81A',
  [PublishStatus.Published]: '#95C842',
};
```

**When to use:**

- Entities with images and publish status
- Visual status indicators needed
- First column in explorer (common pattern)

### 3. Connection Renderer

For GraphQL connection fields (one-to-many relationships):

```typescript
import { createConnectionRenderer } from '@axinom/mosaic-ui';
import { CollectionsTagsConnection } from '../../../generated/graphql';

{
  label: 'Tags',
  propertyName: 'collectionsTags',
  sortable: false,
  render: createConnectionRenderer<CollectionsTagsConnection>((node) => {
    return node.name;
  }),
}
```

**What it does:**

- Extracts values from GraphQL connection nodes
- Joins multiple values with commas
- Handles empty connections gracefully

**Parameters:**

- Generic type: Connection type from generated GraphQL
- Function: Extracts display value from each node

**When to use:**

- Many-to-many relationships (tags, genres, categories)
- One-to-many connections displayed as lists
- Any GraphQL connection field

**Connection structure:**

```typescript
{
  collectionsTags: {
    nodes: [{ name: 'Action' }, { name: 'Drama' }];
  }
}
```

Renders as: "Action, Drama"

## Complete Column Example: Collections

```typescript
import { createThumbnailAndStateRenderer } from '@axinom/mosaic-managed-workflow-integration';
import {
  Column,
  createConnectionRenderer,
  DateRenderer,
} from '@axinom/mosaic-ui';
import { CollectionsTagsConnection } from '../../../generated/graphql';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { CollectionData } from './Collections.types';

const explorerColumns: Column<CollectionData>[] = [
  {
    propertyName: 'publishStatus',
    label: 'State',
    render: createThumbnailAndStateRenderer(
      'collectionsImages',
      PublishStatusStateMap,
    ),
    size: '80px',
  },
  {
    label: 'Title',
    propertyName: 'title',
    size: '2fr',
  },
  {
    label: 'External ID',
    propertyName: 'externalId',
  },
  {
    label: 'Tags',
    propertyName: 'collectionsTags',
    sortable: false,
    render: createConnectionRenderer<CollectionsTagsConnection>((node) => {
      return node.name;
    }),
  },
  {
    label: 'Created At',
    propertyName: 'createdDate',
    render: DateRenderer,
  },
  {
    label: 'Last Modified At',
    propertyName: 'updatedDate',
    render: DateRenderer,
  },
];
```

## Common Column Patterns

### 1. Status Column (First Column)

```typescript
{
  propertyName: 'publishStatus',
  label: 'State',
  render: createThumbnailAndStateRenderer(
    '{entity}Images',  // e.g., 'moviesImages', 'collectionsImages'
    PublishStatusStateMap,
  ),
  size: '80px',
}
```

**Convention:** Status column is typically first column with thumbnail

### 2. Primary Identifier (Second Column)

```typescript
{
  label: 'Title',
  propertyName: 'title',
  size: '2fr',
}
```

**Convention:** Main identifier (title/name) gets largest width (`2fr`)

### 3. Secondary Identifiers

```typescript
{
  label: 'External ID',
  propertyName: 'externalId',
}
```

**Convention:** Additional IDs use default sizing

### 4. Relationship Fields

```typescript
{
  label: 'Tags',
  propertyName: 'collectionsTags',
  sortable: false,
  render: createConnectionRenderer<CollectionsTagsConnection>((node) => node.name),
}
```

**Convention:** Relationships are non-sortable and use connection renderer

### 5. Timestamp Columns (Last Columns)

```typescript
{
  label: 'Created At',
  propertyName: 'createdDate',
  render: DateRenderer,
},
{
  label: 'Last Modified At',
  propertyName: 'updatedDate',
  render: DateRenderer,
}
```

**Convention:** Timestamp columns typically at the end

## Column Order Guidelines

Recommended column order for consistency:

1. **Status/Thumbnail** - Visual indicator with thumbnail
2. **Primary Identifier** - Main entity name/title (widest column)
3. **Secondary Identifiers** - External IDs, codes
4. **Relationship Fields** - Tags, genres, categories
5. **Additional Fields** - Custom fields specific to entity
6. **Timestamps** - Created and updated dates

## Advanced: Custom Render Functions

For specialized rendering needs, create custom render functions:

```typescript
{
  label: 'Duration',
  propertyName: 'duration',
  render: (val) => {
    const minutes = Math.floor(val / 60);
    const seconds = val % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
}
```

**When to use custom renderers:**

- Complex formatting logic
- Computed values
- Conditional rendering
- Custom styling needs

**Render function signature:**

```typescript
(value: any, item: EntityData) => React.ReactNode;
```

**Note on type assertions:**

Custom render functions receive `val` as `unknown` type. Use type assertions when passing to utility functions:

```typescript
// With utility function
render: (val) => formatValue(val as number),

// With enum mapper
render: (val) => getEnumLabel(val as string),
```

## Integration with Explorer Component

Columns are passed to the `NavigationExplorer` component:

```typescript
<NavigationExplorer<CollectionData>
  title="Collections"
  columns={explorerColumns}
  // ... other props
/>
```

## Common Mistakes to Avoid

1. **Missing propertyName**: Every column needs a `propertyName` matching a
   field in the entity
2. **Wrong connection type**: Use the specific connection type from generated
   GraphQL (e.g., `CollectionsTagsConnection`)
3. **Forgetting sortable: false**: Connection fields and computed values need
   `sortable: false`
4. **Inconsistent sizing**: Use fractional units (`fr`) for flexible columns,
   fixed pixels for icons/status
5. **Not importing renderers**: Import renderer functions from appropriate
   packages
6. **Wrong image property name**: Ensure thumbnail renderer uses correct images
   property (e.g., `'collectionsImages'`, `'moviesImages'`)
7. **Missing DateRenderer**: Timestamp fields should use `DateRenderer`, not
   default text rendering

## Available Renderers from mosaic-ui

Core renderers from `@axinom/mosaic-ui`:

- `DateRenderer` - Format timestamps
- `createConnectionRenderer` - Render GraphQL connections
- Other renderers available in the library (explore via examples)

Specialized renderers from `@axinom/mosaic-managed-workflow-integration`:

- `createThumbnailAndStateRenderer` - Thumbnails with status indicators

## Reference Implementation

See complete working example at:
`services/media/workflows/src/Stations/Collections/CollectionsExplorer/Collections.tsx`
(lines 64-90)
