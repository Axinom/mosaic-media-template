# Info Panel Configuration

This document describes how to configure the information panel in Details stations.

## Overview

The Info Panel displays read-only metadata and related entity information on the right side of the Details station.

## Panel Structure

```typescript
const Panel: React.FC = () => {
  const { values } = useFormikContext<NonNullable<{EntityName}Query['{entityLowerCase}']>>();

  return useMemo(() => {
    return (
      <InfoPanel>
        {/* Optional: Image preview section */}
        <Section>
          <ImageCover id={coverImageId} />
        </Section>

        {/* Required: Additional Information */}
        <Section title="Additional Information">
          <Paragraph title="ID">{values.id}</Paragraph>
          <Paragraph title="Created">
            {formatDateTime(values.createdDate)} by {values.createdUser}
          </Paragraph>
          <Paragraph title="Last Modified">
            {formatDateTime(values.updatedDate)} by {values.updatedUser}
          </Paragraph>
          <Paragraph title="Publishing Status">
            {getEnumLabel(values.publishStatus)}
          </Paragraph>
          {values.publishedDate ? (
            <Paragraph title="Last Published">
              {formatDateTime(values.publishedDate)} by {values.publishedUser}
            </Paragraph>
          ) : null}
        </Section>

        {/* Optional: Relationships section */}
        <Section title="Assigned Items">
          {/* Relationship counts */}
        </Section>
      </InfoPanel>
    );
  }, [/* dependencies */]);
};
```

## Required Section: Additional Information

Always include these fields:

```typescript
<Section title="Additional Information">
  <Paragraph title="ID">{values.id}</Paragraph>
  <Paragraph title="Created">
    {formatDateTime(values.createdDate)} by {values.createdUser}
  </Paragraph>
  <Paragraph title="Last Modified">
    {formatDateTime(values.updatedDate)} by {values.updatedUser}
  </Paragraph>
</Section>
```

## Optional: Publishing Status

If entity is publishable:

```typescript
<Paragraph title="Publishing Status">
  {getEnumLabel(values.publishStatus)}
</Paragraph>
{values.publishedDate ? (
  <Paragraph title="Last Published">
    {formatDateTime(values.publishedDate)} by {values.publishedUser}
  </Paragraph>
) : null}
```

## Optional: Image Preview

If entity has images:

```typescript
const { ImageCover } = useContext(ExtensionsContext);
let coverImageId: ID;

values.{entity}Images?.nodes.forEach(({ imageId, imageType }) => {
  if (imageType === {Entity}ImageType.Cover) {
    coverImageId = imageId;
  }
});

<Section>
  <ImageCover id={coverImageId} />
</Section>
```

## Optional: Relationships

Display counts of related entities:

```typescript
<Section title="Assigned Items">
  <Paragraph title="Entities">
    <div className={classes.datalist}>
      <div>Movies</div>
      <div className={classes.rightAlignment}>
        {values.movies?.totalCount} / many
      </div>
    </div>
  </Paragraph>
</Section>
```

## Reference Implementation

See `services/media/workflows/src/Stations/Collections/CollectionDetails/CollectionDetailsForm.tsx` (Panel component, lines 144-234)
