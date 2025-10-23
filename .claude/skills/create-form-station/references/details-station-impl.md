# Details Station Implementation

This document describes how to implement a Details station for editing existing entity records.

## Overview

Details stations consist of multiple files working together:
- **Details wrapper** - Extracts ID from URL params
- **DetailsForm component** - Main form with all editable fields
- **QuickEdit wrapper** - Reuses DetailsForm in explorer quick edit panel
- **Actions hook** - Defines action buttons (Delete, Publish, etc.)
- **GraphQL queries/mutations** - Fetch data and perform updates

## File Structure

```
{EntityName}Details/
├── {EntityName}Details.graphql            # Query + mutations
├── {EntityName}Details.tsx                # URL param wrapper
├── {EntityName}DetailsForm.tsx            # Main form component
├── {EntityName}DetailsQuickEdit.tsx       # Quick edit wrapper
├── {EntityName}Details.actions.ts         # Action buttons
├── {EntityName}Details.types.ts           # TypeScript types
├── {EntityName}Details.module.scss        # Optional styles
└── {EntityName}DetailsCrumb.tsx           # Breadcrumb resolver
```

## Step 1: Create GraphQL Document

Create `{EntityName}Details.graphql` with:

### 1.1 Query to Fetch Entity

```graphql
query {EntityName}($id: Int!) {
  {entityLowerCase}(id: $id) {
    # All editable fields
    title
    description
    synopsis
    externalId

    # Relationship fields
    {entity}Tags {
      nodes {
        name
      }
    }
    {entity}Images {
      nodes {
        imageType
        imageId
      }
    }

    # Metadata fields (for info panel)
    id
    createdDate
    createdUser
    updatedDate
    updatedUser
    publishStatus
    publishedDate
    publishedUser
  }
}
```

### 1.2 Delete Mutation

```graphql
mutation Delete{EntityName}($input: Delete{EntityName}Input!) {
  delete{EntityName}(input: $input) {
    clientMutationId
  }
}
```

### 1.3 Optional: Additional Action Mutations

```graphql
mutation Publish{EntityName}($id: Int!) {
  publish{EntityName}({entityLowerCase}Id: $id) {
    id
  }
}

mutation Unpublish{EntityName}($id: Int!) {
  unpublish{EntityName}({entityLowerCase}Id: $id) {
    id
  }
}
```

### 1.4 Title Query (for breadcrumb)

```graphql
query {EntityName}Title($id: Int!) {
  {entityLowerCase}(id: $id) {
    id
    title
  }
}
```

## Step 2: Create Details Wrapper

Create `{EntityName}Details.tsx`:

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { {EntityName}DetailsForm } from './{EntityName}DetailsForm';

interface UrlParams {
  {entityLowerCase}Id: string;
}

export const {EntityName}Details: React.FC = () => {
  const { {entityLowerCase}Id } = useParams<UrlParams>();

  return <{EntityName}DetailsForm {entityLowerCase}Id={Number({entityLowerCase}Id)} />;
};
```

**Purpose:** Extract ID from URL and pass to form component.

## Step 3: Create DetailsForm Component

Create `{EntityName}DetailsForm.tsx` - this is the main component.

### 3.1 Component Structure

```typescript
import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  formatDateTime,
  generateArrayMutations,
  getFormDiff,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
  SingleLineTextField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  {EntityName}Document,
  {EntityName}Query,
  UpdateCollectionInput,
  use{EntityName}Query,
} from '../../../generated/graphql';
import { use{EntityName}DetailsActions } from './{EntityName}Details.actions';
import { {EntityName}DetailsFormData } from './{EntityName}Details.types';

interface {EntityName}DetailsFormProps {
  {entityLowerCase}Id: number;
}

// Validation schema - include ALL editable fields
const {entityLowerCase}DetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<{EntityName}DetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
  description: Yup.string().nullable(),
  synopsis: Yup.string().nullable(),
  externalId: Yup.string().nullable(),
  // Add validation for all editable fields
});

export const {EntityName}DetailsForm: React.FC<{EntityName}DetailsFormProps> = ({
  {entityLowerCase}Id,
}) => {
  const { loading, data, error } = use{EntityName}Query({
    client,
    variables: { id: {entityLowerCase}Id },
    fetchPolicy: 'network-only',
  });

  const { actions } = use{EntityName}DetailsActions({entityLowerCase}Id);

  const onSubmit = useCallback(
    async (
      formData: {EntityName}DetailsFormData,
      initialData: DetailsProps<{EntityName}DetailsFormData>['initialData'],
    ): Promise<void> => {
      // Update mutation logic
      const patch = createUpdateDto(formData, initialData.data);

      const GqlMutationDocument = gql\`mutation Update{EntityName}($input: Update{EntityName}Input!) {
          update{EntityName}(input: $input) {
            clientMutationId
            {entityLowerCase} {
              id
              title
            }
          }
        }\`;

      await client.mutate<unknown, { input: Update{EntityName}Input }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: {entityLowerCase}Id, patch } },
        refetchQueries: [{EntityName}Document],
        awaitRefetchQueries: true,
      });
    },
    [{entityLowerCase}Id],
  );

  return (
    <Details<{EntityName}DetailsFormData>
      defaultTitle="{EntityName}"
      titleProperty="title"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={{entityLowerCase}DetailSchema}
      initialData={{
        data: data?.{entityLowerCase},
        loading,
        entityNotFound: data?.{entityLowerCase} === null,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel />}
    >
      <Form />
    </Details>
  );
};

// Info Panel component
const Panel: React.FC = () => {
  const { values } = useFormikContext<NonNullable<{EntityName}Query['{entityLowerCase}']>>();

  return useMemo(() => {
    return (
      <InfoPanel>
        {/* Image preview if entity has images */}
        <Section title="Additional Information">
          <Paragraph title="ID">{values.id}</Paragraph>
          <Paragraph title="Created">
            {formatDateTime(values.createdDate)} by {values.createdUser}
          </Paragraph>
          <Paragraph title="Last Modified">
            {formatDateTime(values.updatedDate)} by {values.updatedUser}
          </Paragraph>
          {/* Add publishing status if applicable */}
        </Section>
      </InfoPanel>
    );
  }, [values.id, values.createdDate, values.createdUser, values.updatedDate, values.updatedUser]);
};

// Form fields component
const Form: React.FC = () => {
  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="synopsis" label="Synopsis" as={TextAreaField} />
      <Field name="description" label="Description" as={TextAreaField} />
      <Field name="externalId" label="External ID" as={SingleLineTextField} />
      {/* Add all other editable fields */}
    </>
  );
};

function createUpdateDto(
  currentValues: {EntityName}DetailsFormData,
  initialValues?: {EntityName}DetailsFormData | null,
): {EntityName}DetailsFormData {
  return getFormDiff(currentValues, initialValues);
}
```

## Step 4: Create QuickEdit Wrapper

Create `{EntityName}DetailsQuickEdit.tsx`:

```typescript
import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { {EntityName}Data } from '../{EntityName}Explorer/{EntityName}.types';
import { {EntityName}DetailsForm } from './{EntityName}DetailsForm';

export const {EntityName}DetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<{EntityName}Data>>(QuickEditContext);

  return <{EntityName}DetailsForm {entityLowerCase}Id={selectedItem.id} />;
};
```

**Purpose:** Reuses the same DetailsForm in explorer quick edit panel.

## Step 5: Create Actions Hook

See `references/details-actions.md` for detailed guidance.

## Step 6: Create Type Definitions

Create `{EntityName}Details.types.ts`:

```typescript
import { {EntityName}Query } from '../../../generated/graphql';

export type {EntityName}DetailsFormData = Pick<
  NonNullable<{EntityName}Query['{entityLowerCase}']>,
  | 'title'
  | 'description'
  | 'synopsis'
  | 'externalId'
  // Include all editable fields
>;
```

## Step 7: Create Breadcrumb Resolver

Create `{EntityName}DetailsCrumb.tsx`:

```typescript
import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  {EntityName}TitleDocument,
  {EntityName}TitleQuery,
  {EntityName}TitleQueryVariables,
} from '../../../generated/graphql';

export const {EntityName}DetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<
      {EntityName}TitleQuery,
      {EntityName}TitleQueryVariables
    >({
      query: {EntityName}TitleDocument,
      variables: { id: Number(params['{entityLowerCase}Id']) },
      errorPolicy: 'ignore',
    });
    return response.data.{entityLowerCase}?.title || 'Details';
  };
};
```

## Key Differences from Create Station

| Aspect | Create Station | Details Station |
|--------|----------------|-----------------|
| **Fields** | Only required fields | All editable fields |
| **Component** | `Create` from mosaic-ui | `Details` from mosaic-ui |
| **Mutation** | Create mutation | Update mutation |
| **Query** | None | Query to fetch existing data |
| **Info Panel** | None | Shows metadata, images, relationships |
| **Actions** | None | Delete, Publish, custom actions |
| **Quick Edit** | N/A | Can be used in explorer panel |
| **Validation** | Required fields only | All editable fields (optional fields use `.nullable()`) |

## Info Panel Sections

See `references/info-panel-config.md` for detailed guidance.

Common sections:
1. **Image Preview** (if entity has images)
2. **Additional Information** (ID, Created, Modified, Status)
3. **Relationships** (Counts of related entities)

## Reference Implementations

- `services/media/workflows/src/Stations/Collections/CollectionDetails/` - Complete example with images, tags, relationships
- `services/media/workflows/src/Stations/Movies/MovieDetails/` - Movie details implementation
- `services/media/workflows/src/Stations/Episodes/EpisodeDetails/` - Episode details implementation
