import gql from 'graphql-tag';

export const START_INGEST = gql`
  mutation StartIngest($input: StartIngestInput!) {
    startIngest(input: $input) {
      ingestDocument {
        id
        name
        title
        createdDate
        createdUser
        updatedDate
        updatedUser
        status
        itemsCount
        errorCount
        successCount
        inProgressCount
        errors
        documentCreated
        document
        ingestItems {
          totalCount
          nodes {
            id
            externalId
            existsStatus
            status
            entityId
            createdDate
            updatedDate
            type
            ingestDocumentId
            item
          }
        }
      }
    }
  }
`;
