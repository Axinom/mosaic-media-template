import {
  Logger,
  MosaicErrorInfo,
  mosaicErrorMappingFactory,
  normalizeRelativePath,
  skipMaskTag,
} from '@axinom/mosaic-service-common';
import {
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
} from '@azure/storage-blob';
import { AzureBlobErrors } from './azure-blob-errors';

const getAzureStorageMappedError = mosaicErrorMappingFactory(
  (
    error: Error & {
      code?: string;
      statusCode?: number;
    },
    defaultError?: MosaicErrorInfo,
  ) => {
    let errorCode: MosaicErrorInfo | undefined = undefined;

    switch (true) {
      case error?.statusCode === 401:
      case error?.statusCode === 403 && error?.code === 'AuthenticationFailed':
        errorCode = AzureBlobErrors.AuthenticationFailed;
        break;
      case error?.statusCode === 404 && error?.code === 'ContainerNotFound':
        errorCode = AzureBlobErrors.ContainerNotFound;
        break;
      case error?.statusCode === 404 && error?.code === 'BlobNotFound':
        errorCode = AzureBlobErrors.BlobNotFound;
        break;
      case error.message === 'The operation was aborted.':
        errorCode = AzureBlobErrors.OperationAborted;
        break;
    }

    if (errorCode) {
      return { ...errorCode, details: { skipMaskTag } };
    }

    return defaultError;
  },
);

export class AzureStorage {
  protected blobServiceClient!: BlobServiceClient;
  protected logger!: Logger;

  constructor(connection: string, private containerName: string) {
    try {
      this.blobServiceClient =
        BlobServiceClient.fromConnectionString(connection);
      // initializing container
      this.createStorage(this.containerName);
      this.logger = new Logger({
        context: AzureStorage.name,
      });
    } catch (error) {
      throw getAzureStorageMappedError(error);
    }
  }

  private getContainerClient = async (
    containerName: string,
  ): Promise<ContainerClient> => {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    return containerClient;
  };

  /**
   * Delete files from Azure Storage.
   * @param relativeFilePath - relative path to the file.
   */
  public deleteFile = async (relativeFilePath: string): Promise<boolean> => {
    try {
      const normalizedPath = normalizeRelativePath(relativeFilePath);
      const containerClient = await this.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlobClient(normalizedPath);
      const deleteBlockBlobResponse = await blobClient.deleteIfExists();
      return deleteBlockBlobResponse.succeeded;
    } catch (error) {
      throw getAzureStorageMappedError(error);
    }
  };

  /**
   * Deletes files from Azure Storage that have a matching directory.
   * @param relativeDirectoryPath - relative path to the directory.
   */
  public deleteFolder = async (
    relativeDirectoryPath: string,
  ): Promise<{ filePath: string; wasDeleted: boolean }[]> => {
    const results: { filePath: string; wasDeleted: boolean }[] = [];
    try {
      const normalizedPath = normalizeRelativePath(relativeDirectoryPath);
      const containerClient = await this.getContainerClient(this.containerName);
      const blobs = containerClient.listBlobsFlat({ prefix: normalizedPath });
      for await (const blob of blobs) {
        const blobClient = containerClient.getBlobClient(blob.name);
        const deleteBlockBlobResponse = await blobClient.deleteIfExists();
        results.push({
          filePath: blob.name,
          wasDeleted: deleteBlockBlobResponse.succeeded,
        });
      }
      return results;
    } catch (error) {
      throw getAzureStorageMappedError(error);
    }
  };

  /**
   * Retrieves content of the file in Azure Storage.
   * @param relativeFilePath - relative path to the file.
   * @returns file content as a string.
   */
  public getFileContent = async (relativeFilePath: string): Promise<string> => {
    try {
      const normalizedPath = normalizeRelativePath(relativeFilePath);
      const containerClient = await this.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlobClient(normalizedPath);
      const downloadBlockBlobResponse = await blobClient.download();
      if (downloadBlockBlobResponse.readableStreamBody === undefined) {
        return '';
      }
      return (
        await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
      ).toString();
    } catch (error) {
      throw getAzureStorageMappedError(error);
    }
  };

  private streamToBuffer = async (
    readableStream: NodeJS.ReadableStream,
  ): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  };

  /**
   * Creates a new file in Azure Storage.
   * @param relativeFilePath - relative path to the file.
   * @param fileContent - content of the file.
   */
  public createFile = async (
    relativeFilePath: string,
    fileContent: string,
  ): Promise<boolean> => {
    try {
      const normalizedPath = normalizeRelativePath(relativeFilePath);
      const containerClient = await this.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlockBlobClient(normalizedPath);
      const result = await blobClient.upload(
        fileContent,
        Buffer.byteLength(fileContent),
      );
      return result._response.status >= 200 && result._response.status < 300;
    } catch (error) {
      throw getAzureStorageMappedError(error);
    }
  };

  /**
   *
   * Generates a Blob Service Shared Access Signature (SAS).
   * The SAS is signed by the shared key credential of the client.
   * @param relativeFilePath - relative path to the file in the Azure Storage.
   * @param startDate - starting date for the SAS.
   * @param endDate - ending date for the SAS.
   */
  public getFileSasUrl = async (
    relativeFilePath: string,
    startDate: Date,
    endDate: Date,
  ): Promise<string> => {
    try {
      const normalizedPath = normalizeRelativePath(relativeFilePath);
      const containerClient = await this.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlobClient(normalizedPath);
      return blobClient.generateSasUrl({
        permissions: BlobSASPermissions.from({ read: true }),
        startsOn: startDate,
        expiresOn: endDate,
      });
    } catch (error) {
      throw getAzureStorageMappedError(error);
    }
  };

  /**
   * This function initializes a connection to an Azure Storage container.
   * If the specified container doesn't exist, it will be created.
   * @param containerName - name of the Azure Storage container.
   */
  public createStorage = async (containerName: string): Promise<void> => {
    try {
      // Creates a container if it does not exist.
      await this.getContainerClient(containerName);
    } catch (error) {
      throw getAzureStorageMappedError(error, {
        ...AzureBlobErrors.ContainerCreationFailed,
        details: {
          azureContainerName: containerName,
        },
      });
    }
  };
}
