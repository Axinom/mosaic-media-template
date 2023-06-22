export const AzureBlobErrors = {
  AuthenticationFailed: {
    message: 'Unable to authenticate access to the Azure Storage.',
    code: 'AZURE_BLOB_AUTHENTICATION_FAILED',
  },
  ContainerNotFound: {
    message: 'The configured Azure Storage container does not exist.',
    code: 'AZURE_BLOB_CONTAINER_NOT_FOUND',
  },
  ContainerCreationFailed: {
    message: 'The creation of the Azure Storage container has failed.',
    code: 'AZURE_BLOB_CONTAINER_CREATION_FAILED',
  },
  BlobNotFound: {
    message: 'File was not found in the Azure Storage.',
    code: 'AZURE_BLOB_BLOB_NOT_FOUND',
  },
  OperationAborted: {
    message: 'Azure Storage operation was aborted.',
    code: 'AZURE_BLOB_OPERATION_ABORTED',
  },
} as const;
