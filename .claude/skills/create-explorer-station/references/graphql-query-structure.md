# GraphQL Query Structure for Explorer Stations

This document describes the professional structure for GraphQL queries used in
explorer stations.

## Overview

Explorer station GraphQL queries follow a consistent pattern that supports
filtering, sorting, and pagination using PostGraphile conventions. The query
structure includes both filtered and non-filtered results to display accurate
counts.

## Query Structure Template

```graphql
fragment {Entity}ExplorerProperties on {Entity} {
  id
  # ... other fields from the entity
  createdDate
  updatedDate
  # ... relationship fields
}

query {EntityPlural}(
  $filter: {Entity}Filter
  $orderBy: [{EntityPlural}OrderBy!]
  $after: Cursor
) {
  filtered: {entityPlural}(
    filter: $filter
    orderBy: $orderBy
    first: 30
    after: $after
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...{Entity}ExplorerProperties
    }
  }
  nonFiltered: {entityPlural} {
    totalCount
  }
}
```

## Key Components

### 1. Fragment Definition

The fragment encapsulates all properties needed for the explorer view:

```graphql
fragment CollectionExplorerProperties on Collection {
  id
  title
  externalId
  collectionsTags {
    nodes {
      name
    }
  }
  publishedDate
  createdDate
  updatedDate
  publishStatus
  collectionsImages {
    nodes {
      imageId
    }
  }
}
```

**Benefits:**

- Reusability across queries, subscriptions, and mutations
- Single source of truth for explorer fields
- Easier maintenance when fields need to be added/removed

**Common fields to include:**

- `id` (required)
- Entity-specific fields (title, name, description, etc.)
- Relationship connections (images, tags, etc.)
- Timestamp fields (createdDate, updatedDate, publishedDate)
- Status fields (publishStatus, etc.)

### 2. Query Parameters

The query accepts three standard parameters:

```graphql
query Collections(
  $filter: CollectionFilter      # Filtering criteria
  $orderBy: [CollectionsOrderBy!] # Sorting specification
  $after: Cursor                  # Pagination cursor
)
```

**Parameter purposes:**

- `$filter`: PostGraphile filter object for WHERE conditions
- `$orderBy`: Array of sort criteria (multiple columns supported)
- `$after`: Cursor for pagination (opaque string token)

### 3. Filtered Results

The main query result with all filters, sorting, and pagination applied:

```graphql
filtered: collections(
  filter: $filter
  orderBy: $orderBy
  first: 30              # Fixed page size
  after: $after
) {
  totalCount             # Count of filtered results
  pageInfo {
    hasNextPage          # Whether more pages exist
    endCursor            # Cursor for next page
  }
  nodes {
    ...CollectionExplorerProperties
  }
}
```

**Why 30 items?**

- Standard page size across Mosaic explorers
- Balance between performance and user experience
- Consistent pagination behavior

### 4. Non-Filtered Results

A second query without filters to show total count:

```graphql
nonFiltered: collections {
  totalCount
}
```

**Purpose:**

- Display "Showing X of Y total" to users
- Helps users understand their filter's impact
- Performance: only requests totalCount, not data

## Transforming User-Provided Queries

When a developer provides a basic query, transform it into the professional
structure:

### Example Input Query

```graphql
query GetAllCollections {
  collections {
    nodes {
      id
      title
      externalId
      collectionsTags {
        nodes {
          name
        }
      }
      publishedDate
      createdDate
      updatedDate
      publishStatus
      collectionsImages {
        nodes {
          imageId
        }
      }
    }
  }
}
```

### Transform Steps

1. **Extract entity fields** → Create fragment
2. **Add query parameters** → `$filter`, `$orderBy`, `$after`
3. **Apply parameters to query** → Add to query arguments
4. **Add pagination fields** → `totalCount`, `pageInfo`
5. **Add non-filtered query** → Total count without filters
6. **Use fragment in nodes** → Replace inline fields with fragment

### Transformed Output

```graphql
fragment CollectionExplorerProperties on Collection {
  id
  title
  externalId
  collectionsTags {
    nodes {
      name
    }
  }
  publishedDate
  createdDate
  updatedDate
  publishStatus
  collectionsImages {
    nodes {
      imageId
    }
  }
}

query Collections(
  $filter: CollectionFilter
  $orderBy: [CollectionsOrderBy!]
  $after: Cursor
) {
  filtered: collections(
    filter: $filter
    orderBy: $orderBy
    first: 30
    after: $after
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...CollectionExplorerProperties
    }
  }
  nonFiltered: collections {
    totalCount
  }
}
```

## Naming Conventions

| Element       | Pattern                      | Example                        |
| ------------- | ---------------------------- | ------------------------------ |
| Fragment name | `{Entity}ExplorerProperties` | `CollectionExplorerProperties` |
| Query name    | `{EntityPlural}`             | `Collections`                  |
| Filter type   | `{Entity}Filter`             | `CollectionFilter`             |
| OrderBy type  | `{EntityPlural}OrderBy`      | `CollectionsOrderBy`           |
| Query field   | `{entityPluralLowerCase}`    | `collections`                  |

## Optional: Subscriptions

Subscriptions enable real-time updates but are **optional and advanced**. Only
add if explicitly requested:

```graphql
subscription CollectionsMutated {
  collectionMutated {
    id
    eventKey
    collection {
      ...CollectionExplorerProperties
    }
  }
}
```

**When to include subscriptions:**

- User explicitly requests real-time updates
- The backend service supports the mutation subscription
- Performance requirements allow for subscriptions

## Optional: Bulk Mutations

Bulk mutations are used for bulk actions. Only include if bulk actions are
requested:

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
```

**Common bulk mutations:**

- `delete{EntityPlural}` - Bulk delete
- `publish{EntityPlural}` - Bulk publish
- `unpublish{EntityPlural}` - Bulk unpublish
- `create{Entity}Snapshots` - Bulk snapshot creation

## Real-World Example

See the complete implementation at:
`services/media/workflows/src/Stations/Collections/CollectionsExplorer/Collections.graphql`

This file shows all components working together, including optional
subscriptions and bulk mutations.

## Common Mistakes to Avoid

1. **Forgetting pagination fields**: Always include `totalCount`,
   `pageInfo.hasNextPage`, `pageInfo.endCursor`
2. **Wrong page size**: Use `first: 30`, not other values
3. **Missing nonFiltered query**: Required for showing total counts
4. **Inconsistent naming**: Follow the naming conventions strictly
5. **Inline fields instead of fragments**: Always use fragments for
   maintainability
6. **Adding subscriptions by default**: Only add when explicitly requested
