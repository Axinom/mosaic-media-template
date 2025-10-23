# Create Station Implementation

This document describes how to implement a Create station component for creating new entity records.

## Overview

Create stations are React components built with:
- `Create` component from `@axinom/mosaic-ui`
- Formik for form state management
- Yup for validation
- GraphQL mutation hooks from code generation
- React Router for navigation

## Component Template

```typescript
import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import {
  ActionHandler,
  Create,
  ObjectSchemaDefinition,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  Create{EntityName}Mutation,
  Create{EntityName}MutationVariables,
  useCreate{EntityName}Mutation,
} from '../../../generated/graphql';

type FormData = Create{EntityName}MutationVariables['input']['{entityLowerCase}'];
type SubmitResponse = Create{EntityName}Mutation['create{EntityName}'];

const {entityLowerCase}CreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  // Validation rules for each required field
});

export const {EntityName}Create: React.FC = () => {
  const [{entityLowerCase}Create] = useCreate{EntityName}Mutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await {entityLowerCase}Create({
          variables: {
            input: {
              {entityLowerCase}: {
                // Map form data to mutation variables
              },
            },
          },
        })
      ).data?.create{EntityName};
    },
    [{entityLowerCase}Create],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.{entityLowerCase}) {
        history.push(`/{entity-path}/${submitResponse?.{entityLowerCase}.id}`);
      } else {
        throw new Error('Not expected');
      }
    },
    [history],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New {Entity Display Name}"
      subtitle="Add new {entity} metadata"
      validationSchema={{entityLowerCase}CreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/{entity-path}"
      initialData={{
        loading: false,
      }}
    >
      {/* Form fields for required fields only */}
    </Create>
  );
};

export const {EntityName}CreateCrumb: BreadcrumbResolver = () => 'Create';
```

## Key Implementation Details

### Type Definitions

Extract FormData and SubmitResponse from generated types:

```typescript
type FormData = Create{EntityName}MutationVariables['input']['{entityLowerCase}'];
type SubmitResponse = Create{EntityName}Mutation['create{EntityName}'];
```

**Why:**
- FormData = The shape of data the form collects
- SubmitResponse = The shape of data returned from mutation

### Mutation Hook

Initialize the mutation hook with apollo client:

```typescript
const [{entityLowerCase}Create] = useCreate{EntityName}Mutation({
  client: client,
  fetchPolicy: 'no-cache',
});
```

**fetchPolicy: 'no-cache'** ensures fresh data after mutation.

### saveData Callback

Transform form data into mutation variables:

```typescript
const saveData = useCallback(
  async (formData: FormData): Promise<SubmitResponse> => {
    return (
      await collectionCreate({
        variables: {
          input: {
            collection: {
              title: formData.title ?? '',
              // ... map other required fields
            },
          },
        },
      })
    ).data?.createCollection;
  },
  [collectionCreate],
);
```

**Key points:**
- Return mutation result data
- Map only required fields
- Use `??` operator for safety

### onProceed Callback

Navigate after successful creation:

```typescript
const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
  ({ submitResponse }) => {
    if (submitResponse?.{entityLowerCase}) {
      history.push(`/{entity-path}/${submitResponse?.{entityLowerCase}.id}`);
    } else {
      throw new Error('Not expected');
    }
  },
  [history],
);
```

**Navigation pattern:**
- Navigate to Details station: `/{entity-path}/{id}`
- Uses the ID from created record
- Throws error if no data returned (should never happen)

### Create Component Props

```typescript
<Create<FormData, SubmitResponse>
  title="New {Entity}"
  subtitle="Add new {entity} metadata"
  validationSchema={schema}
  saveData={saveData}
  onProceed={onProceed}
  cancelNavigationUrl="/{entity-path}"
  initialData={{ loading: false }}
>
```

**Props:**
- `title` - Page title
- `subtitle` - Descriptive subtitle
- `validationSchema` - Yup validation schema
- `saveData` - Mutation handler
- `onProceed` - Post-save navigation
- `cancelNavigationUrl` - Where to go if user cancels
- `initialData` - Initial form state

## Form Fields

Add Field components for each required field:

```typescript
<Field name="title" label="Title" as={SingleLineTextField} />
<Field name="index" label="Episode Index" type="number" as={SingleLineTextField} />
```

See `form-fields-mapping.md` for complete field type mapping.

## Examples

### Single Required Field (Collection)

```typescript
export const CollectionCreate: React.FC = () => {
  // ... setup code

  return (
    <Create<FormData, SubmitResponse>
      title="New Collection"
      subtitle="Add new collection metadata"
      validationSchema={collectionCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/collections"
      initialData={{ loading: false }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
    </Create>
  );
};
```

### Multiple Required Fields (Episode)

```typescript
export const EpisodeCreate: React.FC = () => {
  // ... setup code

  return (
    <Create<FormData, SubmitResponse>
      title="New Episode"
      subtitle="Add new episode metadata"
      validationSchema={episodeCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/episodes"
      initialData={{ loading: false }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field type="number" name="index" label="Episode Index" as={SingleLineTextField} />
    </Create>
  );
};
```

## Common Patterns

### Breadcrumb Export

Always export a breadcrumb resolver:

```typescript
export const {EntityName}CreateCrumb: BreadcrumbResolver = () => 'Create';
```

### Error Handling

Standard error handling in onProceed:

```typescript
if (submitResponse?.{entityLowerCase}) {
  // Success path
} else {
  throw new Error('Not expected');
}
```

### Type Casting for Numbers

When field is number type, cast in saveData:

```typescript
collection: {
  title: formData.title,
  index: Number(formData.index),  // Cast to number
}
```

## Reference Implementations

- `services/media/workflows/src/Stations/Collections/CollectionCreate/CollectionCreate.tsx`
- `services/media/workflows/src/Stations/Movies/MovieCreate/MovieCreate.tsx`
- `services/media/workflows/src/Stations/Episodes/EpisodeCreate/EpisodeCreate.tsx`
