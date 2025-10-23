---
name: create-form-station
description: This skill should be used when developers need to create form stations (Create or Details) for entities in a Mosaic service's workflows package. Form stations are React-based UI components built with Formik that allow users to create new records or edit existing entity data, following Axinom Mosaic design system conventions.
---

# Create Form Station

This skill guides the creation of form stations for Mosaic services. Form stations enable users to create new entity records (Create stations) or edit existing ones (Details stations).

## About Form Stations

Form stations are React components that:
- Use the `Create` or `Details` component from `@axinom/mosaic-ui`
- Built with Formik for form state management and validation
- Execute GraphQL mutations to create or update data
- Navigate users to appropriate pages after successful submission
- Follow consistent patterns across all Mosaic management systems

## Types of Form Stations

### 1. Create Stations
- **Purpose**: Create new entity records with minimum required fields
- **Convention**: Only show required fields for initial creation
- **Navigation**: After successful creation, navigate to Details station
- **Location**: `{EntityFolder}/{EntityName}Create/`

### 2. Details Stations
- **Purpose**: Edit existing entity records with all fields
- **Convention**: Show all editable fields (required and optional)
- **Navigation**: After save, stays on same page (no redirect)
- **Location**: `{EntityFolder}/{EntityName}Details/`
- **Components**: Main Details, DetailsForm, QuickEdit wrapper, Actions hook, Info Panel
- **Features**: Info panel with metadata, action buttons (Delete, Publish, etc.), image previews
- **Reusability**: Same DetailsForm used in both full page and explorer quick edit modal

**This skill supports both Create and Details stations.**

## When to Use This Skill

Use this skill when:
- A developer asks to create a "Create" form for an entity
- A developer asks to create a "Details" or "Edit" form for an entity
- An explorer station exists and needs creation or editing workflows
- A new entity needs forms for users to add/edit records

## Directory Structure

### Create Station Structure
```
services/{service-name}/workflows/src/Stations/{EntityName}/{EntityName}Create/
├── {EntityName}Create.graphql    # GraphQL create mutation
└── {EntityName}Create.tsx         # Form component
```

### Details Station Structure
```
services/{service-name}/workflows/src/Stations/{EntityName}/{EntityName}Details/
├── {EntityName}Details.graphql            # Query + mutations (delete, publish, etc.)
├── {EntityName}Details.tsx                # URL param wrapper
├── {EntityName}DetailsForm.tsx            # Main form component
├── {EntityName}DetailsQuickEdit.tsx       # Quick edit wrapper for explorer
├── {EntityName}Details.actions.ts         # Action buttons (Delete, Publish, etc.)
├── {EntityName}Details.types.ts           # TypeScript types
├── {EntityName}Details.module.scss        # Optional styles
└── {EntityName}DetailsCrumb.tsx           # Breadcrumb resolver
```

## Creation Workflows

Choose the appropriate workflow based on what the developer requested:

- **Workflow A**: Create Station - Use when developer asks to create a "Create" form for an entity
- **Workflow B**: Details Station - Use when developer asks to create a "Details" or "Edit" form for an entity

**Key Differences:**
| Aspect | Create Station | Details Station |
|--------|----------------|-----------------|
| **Fields shown** | ONLY required fields (marked with `!`) | ALL editable fields (required + optional) |
| **Purpose** | Quick creation with minimum data | Full editing with all properties |
| **Navigation** | Navigate to Details after creation | Stay on same page after save |
| **Components** | 1-2 files | 6-8 files (Form, QuickEdit, Actions, Crumb) |
| **Info Panel** | No | Yes (metadata, parent links, counts) |
| **Actions** | No | Yes (Delete, Publish, etc.) |
| **Quick Edit** | No | Yes (modal for explorer) |
| **Complexity** | Simple | Complex |

## Workflow A: Create Station (Minimum Required Fields)

### Step 1: Understand Requirements

Ask the developer:
1. **Entity name**: What entity is this form for? (e.g., Collections, Movies, Products)
2. **Entity table name**: What's the database table name? (usually plural lowercase, e.g., `collections`, `movies`)
3. **Service path**: Which service? (e.g., `services/media`)

If not provided, assume:
- Table name = entity name pluralized and lowercased
- Service = `services/media` (most common)

### Step 2: Parse GraphQL Schema for Mutation and Input Fields

Parse the backend GraphQL schema to find the create mutation and required fields. See `references/schema-parsing.md` for detailed guidance.

**Schema location convention:**
```
services/{service-name}/service/src/generated/graphql/schema.graphql
```

**What to extract:**
1. **Mutation name**: `create{Entity}` (e.g., `createCollection`)
2. **Input type**: `Create{Entity}Input` (e.g., `CreateCollectionInput`)
3. **Entity input type**: `{Entity}Input` (e.g., `CollectionInput`)
4. **Required fields**: Fields with `!` (non-nullable) - ignore optional fields without `!`
5. **Field constraints**: Annotations like `@maxLength`, `@notEmpty`, `@minLength`
6. **Field types**: String, Int, Date, UUID, etc.

**Example - Entity with mixed required/optional fields:**
```graphql
input SomeEntityInput {
  title: String!              # Required - INCLUDE
  description: String         # Optional - IGNORE
  count: Int                  # Optional - IGNORE
  isActive: Boolean           # Optional - IGNORE
}
```
**Result:** Only extract `title` field for the Create station.

### Step 3: Create GraphQL Mutation Document

Create the `{EntityName}Create.graphql` file with the create mutation:

```graphql
mutation Create{EntityName}($input: Create{EntityName}Input!) {
  create{EntityName}(input: $input) {
    {entityLowerCase} {
      id
      {primaryField}
    }
  }
}
```

**Example for Collection:**
```graphql
mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    collection {
      id
      title
    }
  }
}
```

**Key points:**
- Return `id` and primary field (usually `title` or `name`)
- Keep return fields minimal - Details station will show full data

After creating the GraphQL file, **immediately run codegen**:

```bash
cd services/{service-name}/workflows
yarn codegen
```

### Step 4: Create Form Component

Create the `{EntityName}Create.tsx` file. See `references/create-station-impl.md` for detailed guidance.

**Component structure:**
1. Import required dependencies
2. Define FormData and SubmitResponse types
3. Create Yup validation schema for required fields
4. Initialize mutation hook
5. Implement `saveData` callback
6. Implement `onProceed` callback (navigation after success)
7. Render `Create` component with required field components

**Type definitions:**
```typescript
type FormData = Create{EntityName}MutationVariables['input']['{entityLowerCase}'];
type SubmitResponse = Create{EntityName}Mutation['create{EntityName}'];
```

**Validation schema** - See `references/formik-validation.md`:
```typescript
const {entityLowerCase}CreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  // Add validation for required fields (fields with ! in schema)
});
```

**Form fields** - See `references/form-fields-mapping.md`:
```typescript
// Add Field components for required fields
// Example: If only 'title' is required:
<Field name="title" label="Title" as={SingleLineTextField} />
```

### Step 5: Register Create Station Route

Update the `{EntityFolder}/registrations.tsx` file to register the Create station route:

```typescript
app.registerPage('/{entity-path}/create', {EntityName}Create, {
  breadcrumb: () => 'New {Entity Display Name}',
  permissions: {
    'media-service': ['ADMIN', '{ENTITY}_EDIT', '{ENTITY}_VIEW'],
  },
});
```

**Example for Collection:**
```typescript
app.registerPage('/collections/create', CollectionCreate, {
  breadcrumb: () => 'New Collection',
  permissions: {
    'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
  },
});
```

**Note:** The explorer station should already have `onCreateAction="/collections/create"` pointing to this route.

### Step 6: Verify TypeScript Compilation

Verify that the code compiles without errors:

```bash
cd services/{service-name}/workflows
yarn tsc --noEmit
```

If compilation errors occur, common issues include:
- Missing imports in the component file
- Incorrect type references from codegen
- Typos in mutation names or field names

Fix any errors before marking complete.

## Workflow B: Details Station (All Editable Fields)

### Step 1: Understand Requirements

Ask the developer:
1. **Entity name**: What entity is this form for? (e.g., Collections, Movies, Episodes)
2. **Entity table name**: What's the database table name? (usually plural lowercase)
3. **Service path**: Which service? (e.g., `services/media`)
4. **Publishable**: Is this entity publishable? (affects Info Panel and Actions)
5. **Has images**: Does this entity have associated images? (affects Info Panel)
6. **Parent entity**: Does this entity have a parent (e.g., Episode → Season)? (affects Info Panel)
7. **Related entities**: What entities are related for relationship counts? (affects Info Panel)

If not provided, assume:
- Table name = entity name pluralized and lowercased
- Service = `services/media` (most common)
- Check schema for `publishStatus` field to determine if publishable

### Step 2: Parse GraphQL Schema for All Editable Fields

Parse the backend GraphQL schema to find all fields in the entity input type. See `references/schema-parsing.md` for guidance.

**Schema location:**
```
services/{service-name}/service/src/generated/graphql/schema.graphql
```

**What to extract:**
1. **Update mutation**: `update{Entity}` (e.g., `updateCollection`)
2. **Delete mutation**: `delete{Entity}` (e.g., `deleteCollection`)
3. **Entity input type**: `{Entity}Input` (e.g., `CollectionInput`)
4. **All editable fields**: Both required (`!`) and optional fields
5. **Field constraints**: Annotations like `@maxLength`, `@notEmpty`
6. **Field types**: String, Int, Date, UUID, etc.
7. **Relationships**: Foreign keys, arrays (often handled separately)

**Example - Entity with mixed required/optional fields:**
```graphql
input CollectionInput {
  title: String!              # Required - Include
  externalId: String          # Optional - Include
  synopsis: String            # Optional - Include
  description: String         # Optional - Include
}
```
**Result:** ALL fields should be in Details station (unlike Create which only shows required).

### Step 3: Create GraphQL Document

Create the `{EntityName}Details.graphql` file with query and mutations. See `references/details-station-impl.md` for detailed guidance.

**Required queries/mutations:**
1. **Query**: Fetch entity by ID with all fields (editable + metadata + relationships)
2. **Update mutation**: Update entity fields
3. **Delete mutation**: Delete entity (required for actions)
4. **Optional**: Publish/Unpublish mutations (if entity is publishable)

**Example for Collection:**
```graphql
query Collection($id: Int!) {
  collection(id: $id) {
    id
    # Editable fields
    title
    externalId
    synopsis
    description
    # Metadata for Info Panel
    publishStatus
    publishedDate
    publishedUser
    createdDate
    createdUser
    updatedDate
    updatedUser
    # Relationships (for Info Panel counts or parent links)
    movies {
      totalCount
    }
    tvshows {
      totalCount
    }
    # Images (for Info Panel preview)
    collectionsImages {
      nodes {
        imageId
        imageType
      }
    }
  }
}

mutation UpdateCollection($input: UpdateCollectionInput!) {
  updateCollection(input: $input) {
    collection {
      id
      title
    }
  }
}

mutation DeleteCollection($input: DeleteCollectionInput!) {
  deleteCollection(input: $input) {
    collection {
      id
    }
  }
}
```

**Key points:**
- Query includes editable fields, metadata, relationships, and images
- Update mutation returns minimal data (refetch handles updates)
- Delete mutation just confirms deletion

After creating the GraphQL file, **immediately run codegen**:

```bash
cd services/{service-name}/workflows
yarn codegen
```

### Step 4: Create Type Definitions

Create `{EntityName}Details.types.ts` to define form data types.

**Template:**
```typescript
export interface {EntityName}DetailsFormData {
  title: string;
  description?: string | null;
  externalId?: string | null;
  // ... all other editable fields (required and optional)
}
```

**Note:** Include all editable fields from the schema in this interface.

### Step 5: Create Details Wrapper Component

Create the `{EntityName}Details.tsx` file. This component extracts the ID from URL params and renders the DetailsForm.

**Template:**
```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { {EntityName}DetailsForm } from './{EntityName}DetailsForm';

export const {EntityName}Details: React.FC = () => {
  const { {entityLowerCase}Id } = useParams<{
    {entityLowerCase}Id: string;
  }>();

  return <{EntityName}DetailsForm {entityLowerCase}Id={Number({entityLowerCase}Id)} />;
};
```

### Step 6: Create DetailsForm Component

Create the `{EntityName}DetailsForm.tsx` file. See `references/details-station-impl.md` and `references/info-panel-config.md` for detailed guidance.

**Key sections:**
1. **FormData type**: All editable entity fields (required AND optional)
2. **Validation schema**: Validation for all fields (required marked, optional nullable)
3. **Query hook**: Fetch entity data by ID
4. **Update mutation**: Save changes
5. **Info Panel component**: Display metadata, parent links, relationship counts
6. **Form component**: All editable fields organized in sections
7. **Actions integration**: Use actions hook for Delete, Publish buttons

**Component structure:**
```typescript
import { Details, InfoPanel, Section, Paragraph, formatDateTime } from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import { use{EntityName}DetailsActions } from './{EntityName}Details.actions';

export const {EntityName}DetailsForm: React.FC<{
  {entityLowerCase}Id: number;
}> = ({ {entityLowerCase}Id }) => {
  const { loading, data, error } = use{EntityName}Query({
    client,
    variables: { id: {entityLowerCase}Id },
    fetchPolicy: 'network-only',
  });

  const onSubmit = useCallback(async (formData, initialData) => {
    // Create update mutation with only changed fields
    const patch = createUpdateDto(formData, initialData.data);
    await client.mutate({
      mutation: UpdateDocument,
      variables: { input: { id: {entityLowerCase}Id, patch } },
      refetchQueries: [{EntityName}Document],
    });
  }, [{entityLowerCase}Id]);

  const { actions } = use{EntityName}DetailsActions({entityLowerCase}Id);

  return (
    <Details
      defaultTitle="{Entity}"
      titleProperty="title"
      subtitle="Properties"
      validationSchema={schema}
      saveData={onSubmit}
      infoPanel={<Panel />}
      actions={actions}
      initialData={{
        data: data?.{entityLowerCase},
        loading,
        entityNotFound: data?.{entityLowerCase} === null,
        error: error?.message,
      }}
    >
      <Form />
    </Details>
  );
};

const Panel: React.FC = () => {
  const { values } = useFormikContext<NonNullable<{EntityName}Query['{entityLowerCase}']>>();

  return (
    <InfoPanel>
      {/* Optional: Parent entity link (e.g., Episode → Season) */}
      {values.parent && (
        <Section title="Parent Entity">
          <InfoPanelParent
            path={`/parents/${values.parent.id}`}
            title={values.parent.title}
          />
        </Section>
      )}

      {/* Required: Metadata */}
      <Section title="Additional Information">
        <Paragraph title="ID">{values.id}</Paragraph>
        <Paragraph title="Created">
          {formatDateTime(values.createdDate)} by {values.createdUser}
        </Paragraph>
        <Paragraph title="Last Modified">
          {formatDateTime(values.updatedDate)} by {values.updatedUser}
        </Paragraph>
        {values.publishStatus && (
          <Paragraph title="Publishing Status">
            {getEnumLabel(values.publishStatus)}
          </Paragraph>
        )}
      </Section>

      {/* Optional: Relationship counts */}
      {values.relatedEntities && (
        <Section title="Assigned Items">
          <Paragraph title="Related">
            {values.relatedEntities.totalCount}
          </Paragraph>
        </Section>
      )}
    </InfoPanel>
  );
};

const Form: React.FC = () => {
  return (
    <>
      {/* ALL editable fields - both required and optional */}
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="externalId" label="External ID" as={SingleLineTextField} />
      <Field name="synopsis" label="Synopsis" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      {/* ... all other editable fields */}
    </>
  );
};
```

**Note on read-only fields:** Some fields like `id`, `createdDate`, `updatedDate` are read-only and shown in the Info Panel as labels, never as editable fields. Parent entity relationships are also shown in Info Panel as clickable links, not as editable fields in the form.

### Step 7: Create QuickEdit Wrapper

Create the `{EntityName}DetailsQuickEdit.tsx` file for explorer quick edit panel.

**Template:**
```typescript
import { Modal, ModalBody, ModalHeader } from '@axinom/mosaic-ui';
import React from 'react';
import { {EntityName}DetailsForm } from './{EntityName}DetailsForm';

export const {EntityName}DetailsQuickEdit: React.FC<{
  {entityLowerCase}Id: number;
  onClose: () => void;
}> = ({ {entityLowerCase}Id, onClose }) => {
  return (
    <Modal
      onClose={onClose}
      contentStyle={{ maxWidth: '800px', width: '100%' }}
    >
      <ModalHeader
        title="Edit {Entity Display Name}"
        onClose={onClose}
      />
      <ModalBody>
        <{EntityName}DetailsForm {entityLowerCase}Id={{entityLowerCase}Id} />
      </ModalBody>
    </Modal>
  );
};
```

This wrapper reuses the DetailsForm component inside a modal for explorer quick edit.

### Step 8: Create Actions Hook

Create the `{EntityName}Details.actions.ts` file. See `references/details-actions.md` for detailed guidance.

**Required actions:**
- **Delete** (always include with confirmation)
- **Publish/Unpublish** (if entity is publishable)
- **Navigate to related screens** (e.g., Manage Images, Manage Videos)

**Template:**
```typescript
import { ActionData } from '@axinom/mosaic-ui';
import { useMemo } from 'react';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import { useDelete{EntityName}Mutation } from '../../../generated/graphql';

export function use{EntityName}DetailsActions(id: number): {
  readonly actions: ActionData[];
} {
  const history = useHistory();
  const [deleteMutation] = useDelete{EntityName}Mutation({ client, fetchPolicy: 'no-cache' });

  return useMemo(() => {
    const deleteEntity = async (): Promise<void> => {
      await deleteMutation({ variables: { input: { id } } });
      history.push('/{entity-path}');
    };

    const actions: ActionData[] = [
      // Navigation actions first
      // { label: 'Manage Images', path: `/{entity-path}/${id}/images` },

      // Delete last (with confirmation)
      {
        label: 'Delete',
        confirmationMode: 'Simple',
        onActionSelected: deleteEntity,
      },
    ];

    return { actions } as const;
  }, [deleteMutation, history, id]);
}
```

### Step 9: Create Breadcrumb Resolver

Create `{EntityName}DetailsCrumb.tsx` to resolve breadcrumb title from entity data.

**Template:**
```typescript
import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  {EntityName}Document,
  {EntityName}Query,
  {EntityName}QueryVariables,
} from '../../../generated/graphql';

export const {EntityName}DetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<{EntityName}Query, {EntityName}QueryVariables>({
      query: {EntityName}Document,
      variables: { id: Number(params['{entityLowerCase}Id']) },
      errorPolicy: 'ignore',
    });
    return response.data.{entityLowerCase}?.title ?? 'Details';
  };
};
```

### Step 10: Register Details Station Routes

Update the `{EntityFolder}/registrations.tsx` file to register the Details station route and quick edit.

**Details page route:**
```typescript
app.registerPage(
  '/{entity-path}/:{entityLowerCase}Id',
  () => (
    <ExtensionsContext.Provider value={extensions}>
      <{EntityName}Details />
    </ExtensionsContext.Provider>
  ),
  {
    breadcrumb: {EntityName}DetailsCrumb,
    permissions: {
      'media-service': ['ADMIN', '{ENTITY}_EDIT', '{ENTITY}_VIEW'],
    },
  },
);
```

**Quick edit registration (for explorer):**
```typescript
app.registerQuickEdit<{ id: number }>(
  '{entity-path}',
  (props) => (
    <ExtensionsContext.Provider value={extensions}>
      <{EntityName}DetailsQuickEdit {entityLowerCase}Id={props.id} onClose={props.onClose} />
    </ExtensionsContext.Provider>
  ),
);
```

**Explorer integration:**
The explorer component should have:
```typescript
calculateNavigateUrl={(item) => `/{entity-path}/${item.id}`}
quickEditRegistrations="/{entity-path}"
```

**Example for Collection:**
```typescript
// Details page
app.registerPage(
  '/collections/:collectionId',
  () => (
    <ExtensionsContext.Provider value={extensions}>
      <CollectionDetails />
    </ExtensionsContext.Provider>
  ),
  {
    breadcrumb: CollectionDetailsCrumb,
    permissions: {
      'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
    },
  },
);

// Quick edit
app.registerQuickEdit<{ id: number }>(
  'collections',
  (props) => (
    <ExtensionsContext.Provider value={extensions}>
      <CollectionDetailsQuickEdit collectionId={props.id} onClose={props.onClose} />
    </ExtensionsContext.Provider>
  ),
);
```

### Step 11: Verify TypeScript Compilation

Verify that all components compile without errors:

```bash
cd services/{service-name}/workflows
yarn tsc --noEmit
```

If compilation errors occur, review:
- Import statements in all created files
- Type definitions match codegen output
- Action hooks reference correct mutations
- Registration imports match file exports

Fix any errors before marking complete.

## Complete Example: Collection Create Station

### GraphQL Mutation (`CollectionCreate.graphql`):
```graphql
mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    collection {
      id
      title
    }
  }
}
```

### Component (`CollectionCreate.tsx`):
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
  CreateCollectionMutation,
  CreateCollectionMutationVariables,
  useCreateCollectionMutation,
} from '../../../generated/graphql';

type FormData = CreateCollectionMutationVariables['input']['collection'];
type SubmitResponse = CreateCollectionMutation['createCollection'];

const collectionCreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

export const CollectionCreate: React.FC = () => {
  const [collectionCreate] = useCreateCollectionMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await collectionCreate({
          variables: {
            input: {
              collection: {
                title: formData.title ?? '',
              },
            },
          },
        })
      ).data?.createCollection;
    },
    [collectionCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.collection) {
        history.push(`/collections/${submitResponse?.collection.id}`);
      } else {
        throw new Error('Not expected');
      }
    },
    [history],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New Collection"
      subtitle="Add new collection metadata"
      validationSchema={collectionCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/collections"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
    </Create>
  );
};

export const CollectionCreateCrumb: BreadcrumbResolver = () => 'Create';
```

## Reference Files

The following reference files contain detailed implementation guidance:

**Create Station References:**
- `references/schema-parsing.md` - Parse GraphQL schema for mutations and field metadata
- `references/create-station-impl.md` - Create station component implementation details
- `references/formik-validation.md` - Generate Yup validation schemas from GraphQL types
- `references/form-fields-mapping.md` - Map GraphQL types to form field components

**Details Station References:**
- `references/details-station-impl.md` - Details station component implementation guide
- `references/details-actions.md` - Action buttons (Delete, Publish, etc.)
- `references/info-panel-config.md` - Info Panel configuration for metadata display

**Load reference files only when needed** for specific implementation details.

## Example Implementations

### Create Stations

Reference these existing implementations for patterns and examples:

- `services/media/workflows/src/Stations/Collections/CollectionCreate/` - Single required field (title)
- `services/media/workflows/src/Stations/Movies/MovieCreate/` - Single required field (title)
- `services/media/workflows/src/Stations/Episodes/EpisodeCreate/` - Multiple required fields (title, index)
- `services/media/workflows/src/Stations/TvShows/TvShowCreate/` - Single required field (title)

### Details Stations

Reference these existing implementations for complete Details station examples:

- `services/media/workflows/src/Stations/Collections/CollectionDetails/` - Full Details with images, relationships, Info Panel
- `services/media/workflows/src/Stations/Movies/MovieDetails/` - Complex Details with genres, cast, production countries
- `services/media/workflows/src/Stations/Episodes/EpisodeDetails/` - Details with parent entity (Season) link
- `services/media/workflows/src/Stations/TvShows/TvShowDetails/` - Details with seasons relationship

## Key Conventions

### Create Station Conventions
1. **Minimal fields**: Only show required fields in Create stations
2. **Navigate to Details**: After creation, navigate to Details station for full editing
3. **Validation matches schema**: Use GraphQL schema annotations for Yup validation
4. **Consistent naming**: `{Entity}Create`, `create{Entity}`, `{EntityName}CreateCrumb`
5. **Run codegen immediately**: After creating GraphQL files, run `yarn codegen` before proceeding
6. **No-cache policy**: Always use `fetchPolicy: 'no-cache'` for mutations
7. **Error handling**: Throw error if mutation succeeds but no data returned
8. **No non-null assertions**: Never use `!` operator (e.g., `value!`) - handle null/undefined explicitly or use optional chaining

### Details Station Conventions
1. **All editable fields**: Show ALL editable fields (both required and optional) in Details stations
2. **Read-only in Info Panel**: Metadata fields (`id`, `createdDate`, `updatedDate`) shown ONLY in Info Panel as labels
3. **Parent links**: Parent entity relationships shown in Info Panel with clickable links
4. **Component reuse**: DetailsForm reused for both full Details page and quick edit modal
5. **Consistent naming**: `{Entity}Details`, `{Entity}DetailsForm`, `{Entity}DetailsQuickEdit`, `{Entity}DetailsCrumb`
6. **Delete always included**: Delete action always present in actions panel with confirmation
7. **Network-only fetch**: Use `fetchPolicy: 'network-only'` for queries to avoid stale data
8. **Refetch after update**: Always refetch query after update mutation completes
9. **No non-null assertions**: Never use `!` operator (e.g., `value!`) - handle null/undefined explicitly or use optional chaining

## Common Pitfalls to Avoid

### Create Station Pitfalls
1. Don't add optional fields to Create stations - keep them minimal
2. Don't forget to run `yarn codegen` after creating GraphQL mutation
3. Don't hardcode navigation URLs - use variables/paths consistently
4. Ensure validation schema matches GraphQL field constraints exactly
5. Use correct field component for each data type (see form-fields-mapping reference)
6. Don't forget to export the breadcrumb resolver
7. Ensure permissions match the entity permissions pattern

### Details Station Pitfalls
1. Don't omit optional fields from Details stations - include ALL editable fields
2. Don't add editable fields for read-only metadata (`id`, `createdDate`, etc.) - these go in Info Panel only
3. Don't forget to register both the Details page route AND quick edit registration
4. Don't forget to run `yarn codegen` after creating GraphQL documents
5. Don't use `no-cache` for queries - use `network-only` instead
6. Don't forget to refetch queries after update mutations
7. Don't forget Delete action in actions hook
8. Don't forget to wrap Details and QuickEdit with `ExtensionsContext.Provider`
