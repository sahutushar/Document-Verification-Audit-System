const { BlobServiceClient } = require('@azure/storage-blob');

class BlobService {
  constructor() {
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'documents';
    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
  }

  // Initialize container if it doesn't exist
  async initializeContainer() {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      await containerClient.createIfNotExists();
      console.log(`Container "${this.containerName}" is ready`);
    } catch (error) {
      console.error('Error initializing container:', error);
      throw error;
    }
  }

  // Sanitize filename for blob storage
  sanitizeFileName(fileName) {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  }

  // Upload file to blob storage
  async uploadFile(documentId, fileName, fileBuffer, contentType) {
    try {
      const sanitizedFileName = this.sanitizeFileName(fileName);
      const blobName = `${documentId}/${sanitizedFileName}`;
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: contentType
        },
        metadata: {
          documentId: documentId,
          originalName: fileName,
          sanitizedName: sanitizedFileName,
          uploadDate: new Date().toISOString()
        }
      };

      await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);
      
      return {
        blobName,
        sanitizedFileName,
        url: blockBlobClient.url,
        size: fileBuffer.length
      };
    } catch (error) {
      console.error('Error uploading file to blob storage:', error);
      throw error;
    }
  }

  // Check if file exists in blob storage
  async fileExists(documentId, fileName) {
    try {
      const sanitizedFileName = this.sanitizeFileName(fileName);
      const blobName = `${documentId}/${sanitizedFileName}`;
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      return await blockBlobClient.exists();
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  // Download file from blob storage
  async downloadFile(documentId, fileName) {
    try {
      const sanitizedFileName = this.sanitizeFileName(fileName);
      const blobName = `${documentId}/${sanitizedFileName}`;
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      const downloadResponse = await blockBlobClient.download();
      return downloadResponse.readableStreamBody;
    } catch (error) {
      console.error('Error downloading file from blob storage:', error);
      throw error;
    }
  }
}

module.exports = BlobService;