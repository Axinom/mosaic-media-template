# Form Field Component Mapping

This document describes how to map GraphQL field types to appropriate Formik Field components from `@axinom/mosaic-ui`.

## Overview

Each GraphQL field type maps to a specific form field component. The Field component from Formik is used with the `as` prop to specify the component type.

## Basic Field Pattern

```typescript
import { Field } from 'formik';

<Field
  name="fieldName"           // Must match form data property
  label="Display Label"      // User-facing label
  as={FieldComponent}        // Component from mosaic-ui
  type="inputType"           // Optional: HTML input type
/>
```

## Field Type Mappings

### String Fields

**Single-line text:**
```graphql
title: String!
```

```typescript
import { SingleLineTextField } from '@axinom/mosaic-ui';

<Field name="title" label="Title" as={SingleLineTextField} />
```

**Multi-line text (for long strings):**
```graphql
description: String
```

```typescript
import { TextAreaField } from '@axinom/mosaic-ui';

<Field name="description" label="Description" as={TextAreaField} />
```

**Usage:**
- Use `SingleLineTextField` for short text (title, name, externalId)
- Use `TextAreaField` for long text (description, synopsis, notes)

### Number Fields (Int, Float)

**Integer:**
```graphql
index: Int!
```

```typescript
<Field
  type="number"
  name="index"
  label="Episode Index"
  as={SingleLineTextField}
/>
```

**Float:**
```graphql
rating: Float!
```

```typescript
<Field
  type="number"
  name="rating"
  label="Rating"
  as={SingleLineTextField}
/>
```

**Note:** Use `type="number"` to enable numeric input controls.

### Boolean Fields

**Checkbox:**
```graphql
isActive: Boolean!
```

```typescript
import { Checkbox } from '@axinom/mosaic-ui';

<Field name="isActive" label="Is Active" as={Checkbox} />
```

### Date Fields

**Date picker:**
```graphql
released: Date
```

```typescript
import { DatePicker } from '@axinom/mosaic-ui';

<Field name="released" label="Release Date" as={DatePicker} />
```

### UUID Fields

**UUID text input:**
```graphql
mainVideoId: UUID
```

```typescript
<Field
  name="mainVideoId"
  label="Main Video ID"
  as={SingleLineTextField}
  placeholder="00000000-0000-0000-0000-000000000000"
/>
```

**Note:** UUID validation is handled by Yup schema, not the component.

### Select/Dropdown Fields

**For enum or predefined options:**
```graphql
status: StatusEnum!
```

```typescript
import { Select } from '@axinom/mosaic-ui';

<Field
  name="status"
  label="Status"
  as={Select}
  options={[
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ]}
/>
```

## Complete Field Components Reference

| GraphQL Type | Component | Import | Additional Props |
|--------------|-----------|--------|------------------|
| `String` (short) | `SingleLineTextField` | `@axinom/mosaic-ui` | - |
| `String` (long) | `TextAreaField` | `@axinom/mosaic-ui` | `rows={4}` |
| `Int` | `SingleLineTextField` | `@axinom/mosaic-ui` | `type="number"` |
| `Float` | `SingleLineTextField` | `@axinom/mosaic-ui` | `type="number"` |
| `Boolean` | `Checkbox` | `@axinom/mosaic-ui` | - |
| `Date` | `DatePicker` | `@axinom/mosaic-ui` | - |
| `UUID` | `SingleLineTextField` | `@axinom/mosaic-ui` | `placeholder` |
| Enum | `Select` | `@axinom/mosaic-ui` | `options` |

## Field Props

### Common Props

All fields support:
```typescript
<Field
  name="fieldName"           // Required: Field name in form data
  label="Field Label"        // Required: Display label
  as={Component}             // Required: Component to render
  type="text"                // Optional: Input type (text, number, email, etc.)
  placeholder="hint text"    // Optional: Placeholder text
  disabled={false}           // Optional: Disable field
/>
```

### Component-Specific Props

**TextAreaField:**
```typescript
<Field
  name="description"
  label="Description"
  as={TextAreaField}
  rows={4}                   // Number of visible rows
/>
```

**Select:**
```typescript
<Field
  name="category"
  label="Category"
  as={Select}
  options={options}          // Array of {value, label} objects
/>
```

**DatePicker:**
```typescript
<Field
  name="released"
  label="Release Date"
  as={DatePicker}
  dateFormat="yyyy-MM-dd"    // Optional: Date format
/>
```

## Examples

### Collection Create (Single Text Field)

```typescript
import { Field } from 'formik';
import { SingleLineTextField } from '@axinom/mosaic-ui';

<Create>
  <Field name="title" label="Title" as={SingleLineTextField} />
</Create>
```

### Episode Create (Text + Number)

```typescript
import { Field } from 'formik';
import { SingleLineTextField } from '@axinom/mosaic-ui';

<Create>
  <Field name="title" label="Title" as={SingleLineTextField} />
  <Field
    type="number"
    name="index"
    label="Episode Index"
    as={SingleLineTextField}
  />
</Create>
```

### Movie Create with Date

```typescript
import { Field } from 'formik';
import { SingleLineTextField, DatePicker } from '@axinom/mosaic-ui';

<Create>
  <Field name="title" label="Title" as={SingleLineTextField} />
  <Field name="released" label="Release Date" as={DatePicker} />
</Create>
```

## Field Ordering

Order fields logically:
1. Primary identifier (title, name)
2. Other required fields
3. Dates
4. Optional fields (if any - rare in Create stations)

## Common Mistakes to Avoid

1. **Forgetting type="number"** for numeric fields
2. **Using TextAreaField for short text** - Use SingleLineTextField instead
3. **Wrong component import** - Ensure importing from `@axinom/mosaic-ui`
4. **Mismatched name** - Field `name` must match FormData property exactly
5. **Missing label** - Every field needs a user-friendly label

## Reference Implementations

- `services/media/workflows/src/Stations/Collections/CollectionCreate/CollectionCreate.tsx` (line 79)
- `services/media/workflows/src/Stations/Episodes/EpisodeCreate/EpisodeCreate.tsx` (lines 83-89)
- `services/media/workflows/src/Stations/Movies/MovieCreate/MovieCreate.tsx` (line 73)
