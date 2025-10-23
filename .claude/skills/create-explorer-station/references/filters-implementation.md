# Filters Implementation for Explorer Stations

This document describes how to implement filters for explorer stations, allowing
users to search and filter entity data.

## Overview

Filters in explorer stations enable users to narrow down data using various
criteria. The implementation consists of:

1. **Filter definitions** - UI configuration for filter fields
2. **Filter transformation** - Converting UI filter values to PostGraphile
   filter syntax

Both are implemented in a `{Entity}.filters.ts` file and exposed via a custom
hook.

## File Structure Template

```typescript
import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { {Entity}Filter } from '../../../generated/graphql';
import { {Entity}Data } from './{Entity}.types';

export function use{EntityPlural}Filters(): {
  readonly filterOptions: FilterType<{Entity}Data>[];
  readonly transformFilters: (
    filters: FilterValues<{Entity}Data>,
  ) => {Entity}Filter | undefined;
} {
  // Date range validators for from/to date filters
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<{Entity}Data>();

  // Filter definitions
  const filterOptions: FilterType<{Entity}Data>[] = [
    // ... filter definitions
  ];

  // Transform UI filters to PostGraphile format
  const transformFilters = (
    filters: FilterValues<{Entity}Data>,
  ): {Entity}Filter | undefined => {
    return filterToPostGraphileFilter<{Entity}Filter>(filters, {
      // ... transformation mappings
    });
  };

  return { filterOptions, transformFilters };
}
```

## Filter Definitions

### FilterType Structure

Each filter is defined with these properties:

| Property     | Type        | Required    | Description                           |
| ------------ | ----------- | ----------- | ------------------------------------- |
| `label`      | string      | Yes         | Display label in UI                   |
| `property`   | string      | Yes         | Field name from entity data           |
| `type`       | FilterTypes | Yes         | Type of filter input                  |
| `options`    | array       | Conditional | Required for `Options` type           |
| `onValidate` | function    | No          | Validation function (for date ranges) |

### Common Filter Types

#### 1. FreeText Filter

For searching text fields:

```typescript
{
  label: 'Title',
  property: 'title',
  type: FilterTypes.FreeText,
}
```

**When to use:**

- Text fields (title, name, description)
- Fields that support partial matching
- String searches

#### 2. Numeric Filter

For number-based filtering:

```typescript
{
  label: 'ID',
  property: 'id',
  type: FilterTypes.Numeric,
}
```

**When to use:**

- Numeric fields (id, count, duration)
- Integer or decimal values
- Exact number matching

#### 3. Date Filter

For date-based filtering:

```typescript
{
  label: 'Creation Period (From)',
  property: 'createdDate',
  type: FilterTypes.Date,
  onValidate: createFromDateFilterValidator('createdDate'),
},
{
  label: 'Creation Period (To)',
  property: 'createdDate',
  type: FilterTypes.Date,
  onValidate: createToDateFilterValidator('createdDate'),
}
```

**When to use:**

- Date/timestamp fields
- Date range queries (from/to)
- Always create pairs for range filtering

**Date range validation:**

- Use `createDateRangeFilterValidators` to ensure "from" date is before "to"
  date
- Assign validators using `createFromDateFilterValidator` and
  `createToDateFilterValidator`

#### 4. Options Filter (Enum)

For fields with predefined values:

```typescript
{
  label: 'Publication Status',
  property: 'publishStatus',
  type: FilterTypes.Options,
  options: Object.keys(PublishStatus).map((key) => ({
    value: PublishStatus[key],
    label: getEnumLabel(PublishStatus[key]),
  })),
}
```

**When to use:**

- Enum fields (status, type, category)
- Fields with fixed set of values
- Dropdown selections

**Creating options:**

- Import enum from `generated/graphql`
- Map enum keys to `{ value, label }` objects
- Use `getEnumLabel` helper for user-friendly labels (from
  `Util/StringEnumMapper`)

#### 5. Nested Field Filters

For filtering on relationship fields:

```typescript
{
  label: 'Tags',
  property: 'collectionsTags',
  type: FilterTypes.FreeText,
}
```

**When to use:**

- GraphQL connection fields
- Nested object properties
- Relationship data (tags, genres, etc.)

## Filter Transformation

The `transformFilters` function converts UI filter values into PostGraphile
filter syntax.

### Using filterToPostGraphileFilter Helper

The `filterToPostGraphileFilter` helper from `@axinom/mosaic-ui` handles the
conversion:

```typescript
const transformFilters = (
  filters: FilterValues<CollectionData>,
): CollectionFilter | undefined => {
  return filterToPostGraphileFilter<CollectionFilter>(filters, {
    title: 'includes', // Partial text match
    externalId: 'includes', // Partial text match
    collectionsTags: ['some', 'name', 'includes'], // Nested field
    publishStatus: 'in', // Enum array match
    id: 'equalTo', // Exact match
    createdDate: transformRange, // Date range
    publishedDate: transformRange, // Date range
  });
};
```

### Transformation Operators

| Operator                         | Usage              | PostGraphile Filter                                                |
| -------------------------------- | ------------------ | ------------------------------------------------------------------ |
| `'includes'`                     | Partial text match | `{ field: { includes: "value" } }`                                 |
| `'equalTo'`                      | Exact match        | `{ field: { equalTo: value } }`                                    |
| `'in'`                           | Match any in array | `{ field: { in: [value1, value2] } }`                              |
| `transformRange`                 | Date range         | `{ field: { greaterThanOrEqualTo: from, lessThanOrEqualTo: to } }` |
| `['some', 'nested', 'includes']` | Nested field path  | `{ field: { some: { nested: { includes: "value" } } } }`           |

### Nested Field Transformation

For GraphQL connections (one-to-many relationships), use array syntax:

```typescript
collectionsTags: ['some', 'name', 'includes'];
```

This creates:

```typescript
{
  collectionsTags: {
    some: {
      name: {
        includes: 'searchValue';
      }
    }
  }
}
```

**Path breakdown:**

- `some` - At least one related record matches
- `name` - Field in the related table
- `includes` - Partial match operator

## Complete Example: Collections Filters

```typescript
import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { CollectionFilter, PublishStatus } from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { CollectionData } from './Collections.types';

export function useCollectionsFilters(): {
  readonly filterOptions: FilterType<CollectionData>[];
  readonly transformFilters: (
    filters: FilterValues<CollectionData>,
  ) => CollectionFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<CollectionData>();

  const filterOptions: FilterType<CollectionData>[] = [
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'collectionsTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Publication Status',
      property: 'publishStatus',
      type: FilterTypes.Options,
      options: Object.keys(PublishStatus).map((key) => ({
        value: PublishStatus[key],
        label: getEnumLabel(PublishStatus[key]),
      })),
    },
    {
      label: 'Publication Period (From)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('publishedDate'),
    },
    {
      label: 'Publication Period (To)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('publishedDate'),
    },
    {
      label: 'Creation Period (From)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('createdDate'),
    },
    {
      label: 'Creation Period (To)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('createdDate'),
    },
    {
      label: 'ID',
      property: 'id',
      type: FilterTypes.Numeric,
    },
  ];

  const transformFilters = (
    filters: FilterValues<CollectionData>,
  ): CollectionFilter | undefined => {
    return filterToPostGraphileFilter<CollectionFilter>(filters, {
      title: 'includes',
      externalId: 'includes',
      collectionsTags: ['some', 'name', 'includes'],
      publishStatus: 'in',
      id: 'equalTo',
      createdDate: transformRange,
      publishedDate: transformRange,
    });
  };

  return { filterOptions, transformFilters };
}
```

## Common Filter Patterns

### 1. Basic Entity Filters

Most entities have these standard filters:

```typescript
// Text search on primary field
{ label: 'Title', property: 'title', type: FilterTypes.FreeText }

// Unique identifier search
{ label: 'External ID', property: 'externalId', type: FilterTypes.FreeText }

// Numeric ID lookup
{ label: 'ID', property: 'id', type: FilterTypes.Numeric }

// Creation date range
{
  label: 'Creation Period (From)',
  property: 'createdDate',
  type: FilterTypes.Date,
  onValidate: createFromDateFilterValidator('createdDate'),
}
{
  label: 'Creation Period (To)',
  property: 'createdDate',
  type: FilterTypes.Date,
  onValidate: createToDateFilterValidator('createdDate'),
}
```

### 2. Publish Status Filter

For publishable entities:

```typescript
{
  label: 'Publication Status',
  property: 'publishStatus',
  type: FilterTypes.Options,
  options: Object.keys(PublishStatus).map((key) => ({
    value: PublishStatus[key],
    label: getEnumLabel(PublishStatus[key]),
  })),
}
```

With transformation:

```typescript
publishStatus: 'in';
```

### 3. Tag/Genre Filters

For entities with many-to-many relationships:

```typescript
{
  label: 'Tags',
  property: 'collectionsTags',
  type: FilterTypes.FreeText,
}
```

With transformation:

```typescript
collectionsTags: ['some', 'name', 'includes'];
```

## Integration with Explorer Component

The filters hook is used in the main explorer component:

```typescript
import { use{EntityPlural}Filters } from './{Entity}.filters';

export const {EntityPlural}: React.FC = () => {
  const { transformFilters, filterOptions } = use{EntityPlural}Filters();

  // Pass to data provider
  const dataProvider: ExplorerDataProvider<{Entity}Data> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      const result = await client.query({
        query: {EntityPlural}Document,
        variables: {
          filter: transformFilters(filters),  // Transform here
          // ...
        },
      });
      // ...
    },
  };

  return (
    <NavigationExplorer
      // ...
      filterOptions={filterOptions}  // Pass filter definitions
      dataProvider={dataProvider}
    />
  );
};
```

## Common Mistakes to Avoid

1. **Missing date range validators**: Always use `createFromDateFilterValidator`
   / `createToDateFilterValidator` for date pairs
2. **Wrong transformation operator**: Use `'includes'` for text search, not
   `'equalTo'`
3. **Forgetting nested path**: Connection fields need array path like
   `['some', 'name', 'includes']`
4. **Inconsistent property names**: Ensure filter `property` matches GraphQL
   field name exactly
5. **Missing enum import**: Import enum types from `generated/graphql`
6. **Not using getEnumLabel**: Enum values need human-readable labels via
   `getEnumLabel` helper

## Reference Implementation

See complete working example at:
`services/media/workflows/src/Stations/Collections/CollectionsExplorer/Collections.filters.ts`
