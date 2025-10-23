# GraphQL Schema Parsing for Form Stations

This document describes how to parse the backend GraphQL schema to extract mutation definitions, input types, and field metadata needed for form station generation.

## Overview

The backend GraphQL schema contains all the information needed to generate form stations:
- Mutation names and signatures
- Input types and nested structures
- Required vs optional fields
- Field constraints (maxLength, notEmpty, etc.)
- Field data types

## Schema Location

The GraphQL schema is conventionally located at:
```
services/{service-name}/service/src/generated/graphql/schema.graphql
```

**Example:**
- Service: `media`
- Schema path: `services/media/service/src/generated/graphql/schema.graphql`

**Note:** This is a very large file (20,000+ lines). Don't read the entire file - use targeted grep/search commands.

## Schema Structure

### Root Mutation Type

All mutations are defined in the `Mutation` type:

```graphql
"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single `Collection`."""
  createCollection(
    input: CreateCollectionInput!
  ): CreateCollectionPayload

  # ... other mutations
}
```

**Finding Mutations:**
1. Search for the exact line: `type Mutation {`
2. Mutations start immediately after this line
3. Look for mutations following pattern: `create{Entity}(`

### Create Mutation Pattern

All create mutations follow this convention:

```graphql
"""Creates a single `{Entity}`."""
create{Entity}(
  """
  The exclusive input argument for this mutation. An object type, make sure to see documentation for this object's fields.
  """
  input: Create{Entity}Input!
): Create{Entity}Payload
```

**Examples:**
- `createCollection(input: CreateCollectionInput!): CreateCollectionPayload`
- `createMovie(input: CreateMovieInput!): CreateMoviePayload`
- `createEpisode(input: CreateEpisodeInput!): CreateEpisodePayload`

### Input Type Structure

Each create mutation has two input types:

#### 1. Create Input Wrapper

```graphql
input CreateCollectionInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The `Collection` to be created by this mutation."""
  collection: CollectionInput!
}
```

**Pattern:**
- Name: `Create{Entity}Input`
- Has optional `clientMutationId` field (ignore this)
- Has required `{entityLowerCase}` field of type `{Entity}Input!`

#### 2. Entity Input Type

```graphql
"""An input for mutations affecting `Collection`"""
input CollectionInput {
  """
  @maxLength(100)
  @notEmpty()
  """
  title: String!
  externalId: String
  synopsis: String
  description: String
}
```

**Pattern:**
- Name: `{Entity}Input`
- Contains actual entity fields
- Required fields marked with `!`
- Optional fields without `!`
- Annotations in field descriptions

## Extracting Mutation Information

### Step 1: Find the Create Mutation

**Search for the mutation definition:**

Look for the mutation comment or definition in the schema file:
- Pattern: `"""Creates a single \`{Entity}\`"""`
- Or search for: `create{Entity}(`

**Example for Collection:**
- Search for: `"""Creates a single \`Collection\`"""`
- Or search for: `createCollection(`

This locates where the mutation is defined in the schema.

### Step 2: Find the Create Input Type

**Search for the input type definition:**

Look for the input type that wraps the entity:
- Pattern: `input Create{Entity}Input`

**Example for Collection:**
- Search for: `input CreateCollectionInput`

Read ~10-15 lines from this location to see the structure:
- Extract the entity field name (usually `{entityLowerCase}`)
- Extract the entity input type (usually `{Entity}Input!`)

### Step 3: Find the Entity Input Type

**Search for the entity's main input type:**

Look for the core input type definition:
- Pattern: `input {Entity}Input {`

**Example for Collection:**
- Search for: `input CollectionInput`

Read from this location until the closing `}` to extract all field definitions.

## Parsing Field Metadata

### Required vs Optional Fields

**Required field** (has `!`):
```graphql
title: String!
index: Int!
```

**Optional field** (no `!`):
```graphql
externalId: String
synopsis: String
released: Date
```

**Important:** Only required fields (with `!`) should appear in Create stations. Optional fields belong in Details stations.

### Field Annotations

Annotations appear in the field description comment block:

```graphql
"""
@maxLength(100)
@notEmpty()
"""
title: String!
```

**Common annotations:**
- `@maxLength(N)` - Maximum string length
- `@minLength(N)` - Minimum string length
- `@notEmpty()` - String cannot be empty
- Others may exist but these are most common

**Parsing annotations:**
Use regex to extract from description:
- `@maxLength\((\d+)\)` → Extract max length value
- `@minLength\((\d+)\)` → Extract min length value
- `@notEmpty\(\)` → Boolean flag

### Field Data Types

**Scalar types:**
- `String` → Text field
- `Int` → Number field (integer)
- `Float` → Number field (decimal)
- `Boolean` → Checkbox/toggle
- `Date` → Date picker
- `UUID` → Text field (with UUID validation)

**Custom types** (usually indicate relationships):
- If field type is not a scalar, it's likely a foreign key or complex object
- For Create stations, these are usually optional and can be ignored

## Complete Parsing Example: Collection

### Step 1: Find Mutation
```bash
grep -n "createCollection(" schema.graphql
```
Returns: Line 14271

### Step 2: Read Mutation
```graphql
"""Creates a single `Collection`."""
createCollection(
  input: CreateCollectionInput!
): CreateCollectionPayload
```

**Extracted:**
- Mutation name: `createCollection`
- Input type: `CreateCollectionInput`

### Step 3: Find Create Input

Search for `input CreateCollectionInput` in the schema file.

Located at line 15774:

```graphql
input CreateCollectionInput {
  clientMutationId: String
  collection: CollectionInput!
}
```

**Extracted:**
- Entity field name: `collection`
- Entity input type: `CollectionInput`

### Step 4: Find Entity Input

Search for `input CollectionInput` in the schema file.

Located at line 15786:

```graphql
input CollectionInput {
  """
  @maxLength(100)
  @notEmpty()
  """
  title: String!
  externalId: String
  synopsis: String
  description: String
}
```

**Extracted fields:**

| Field | Type | Required | Annotations | Include in Create? |
|-------|------|----------|-------------|-------------------|
| title | String | Yes (!) | @maxLength(100), @notEmpty() | Yes |
| externalId | String | No | None | No (optional) |
| synopsis | String | No | None | No (optional) |
| description | String | No | None | No (optional) |

**Result:** Only `title` field should be in Create station.

## Complete Parsing Example: Episode

### Step 1-4: Parse Schema

```graphql
input EpisodeInput {
  seasonId: Int
  index: Int!

  """
  @maxLength(100)
  @notEmpty()
  """
  title: String!
  externalId: String
  originalTitle: String
  synopsis: String
  description: String
  studio: String
  released: Date
  mainVideoId: UUID
}
```

**Extracted fields:**

| Field | Type | Required | Annotations | Include in Create? |
|-------|------|----------|-------------|-------------------|
| seasonId | Int | No | None | No (optional) |
| index | Int | Yes (`!`) | None | Yes |
| title | String | Yes (`!`) | `@maxLength(100)`, `@notEmpty()` | Yes |
| externalId | String | No | None | No (optional) |
| ... | ... | No | None | No (all optional) |

**Result:** `title` and `index` fields should be in Create station.

## Efficient Schema Parsing Strategy

To avoid reading the entire 20,000+ line schema file:

### 1. Use Targeted Search

Search for specific patterns to locate the definitions:
- Mutation: Search for `"""Creates a single \`{Entity}\`"""`
- Create input: Search for `input Create{Entity}Input`
- Entity input: Search for `input {Entity}Input {`

### 2. Read Only Necessary Sections

Once you locate the definitions, read only the relevant sections:
- Mutation: Read 5-10 lines from the located position
- CreateInput: Read 10-15 lines from the located position
- EntityInput: Read until closing `}` (usually 10-30 lines)

### 3. Extract Field Information

For each field in EntityInput:
1. Check if required (has `!`)
2. Extract data type
3. Parse annotations from description
4. Add to list if required

### 4. Generate Mutation Document

Use extracted information to generate:
```graphql
mutation Create${ENTITY}($input: Create${ENTITY}Input!) {
  create${ENTITY}(input: $input) {
    ${entityLowerCase} {
      id
      ${primaryRequiredField}
    }
  }
}
```

## Naming Conventions

| Convention | Pattern | Example |
|------------|---------|---------|
| Entity (PascalCase) | `Collection` | Collection |
| Entity (camelCase) | `collection` | collection |
| Entity (lowercase) | `collection` | collection |
| Mutation name | `create{Entity}` | createCollection |
| Create input | `Create{Entity}Input` | CreateCollectionInput |
| Entity input | `{Entity}Input` | CollectionInput |
| Payload type | `Create{Entity}Payload` | CreateCollectionPayload |

## Common Edge Cases

### Multiple Required Fields

If entity has multiple required fields, include all in Create station:
```graphql
input EpisodeInput {
  index: Int!       # Required
  title: String!    # Required
  # ... optional fields
}
```
→ Create station should have both `index` and `title` fields.

### Foreign Key Fields

Foreign keys may be required but represent relationships:
```graphql
input EpisodeInput {
  seasonId: Int     # Optional foreign key
  index: Int!
  title: String!
}
```
→ `seasonId` is optional, so not in Create station.

If a foreign key IS required:
```graphql
input SomeInput {
  parentId: Int!    # Required foreign key
  name: String!
}
```
→ Include in Create station (will need appropriate selector component).

### No Required Fields

If entity has no required fields (rare):
```graphql
input SomeInput {
  name: String
  value: String
}
```
→ Still create the Create station, but no fields will have validation. The form will just have a "Create" button. This is unusual but valid.

## Required vs Optional Fields

**Important:** Only include fields marked with `!` (required) in Create stations.

Example:
```graphql
input SomeEntityInput {
  title: String!              # Required - include
  description: String         # Optional - skip
  count: Int                  # Optional - skip
  isAbridged: Boolean         # Optional - skip
}
```

**Create Station Result:**
- Include: `title` field only
- Skip: `description`, `count`, `isAbridged`

**Validation Schema:**
```typescript
{
  title: Yup.string().required('Title is a required field').max(100),
  // Skip optional fields
}
```

**Form Fields:**
```typescript
<Field name="title" label="Title" as={SingleLineTextField} />
// Skip optional fields
```

## Reference Implementation

See complete schema file at:
`services/media/service/src/generated/graphql/schema.graphql`

Examples of well-formed inputs to study:
- `CollectionInput` (line ~15786) - Single required field example
- `MovieInput` (line ~16439) - Single required field example
- `EpisodeInput` (line ~15938) - Multiple required fields example
