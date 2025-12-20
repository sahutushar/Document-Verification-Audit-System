const { CosmosClient } = require('@azure/cosmos');

class CosmosService {
  constructor() {
    this.endpoint = process.env.COSMOS_DB_ENDPOINT;
    this.key = process.env.COSMOS_DB_KEY;
    this.databaseId = process.env.COSMOS_DB_DATABASE_ID || 'docverifydb';
    this.documentsContainerId = 'Documents';
    this.auditLogsContainerId = 'audit_logs';
    
    this.client = new CosmosClient({ endpoint: this.endpoint, key: this.key });
  }

  // Initialize database and containers
  async initialize() {
    try {
      console.log('🚀 Initializing Cosmos DB...');
      console.log('Database ID:', this.databaseId);
      console.log('Endpoint:', this.endpoint);
      
      // Just connect to existing database - don't create containers
      const database = this.client.database(this.databaseId);
      
      // Test connection by trying to read from containers
      try {
        const documentsContainer = database.container(this.documentsContainerId);
        await documentsContainer.read();
        console.log('✅ Documents container accessible');
      } catch (error) {
        console.log('⚠️ Documents container not found, will be created on first use');
      }

      try {
        const auditContainer = database.container(this.auditLogsContainerId);
        await auditContainer.read();
        console.log('✅ audit_logs container accessible');
      } catch (error) {
        console.log('⚠️ audit_logs container not found:', error.message);
      }

      console.log('✅ Cosmos DB initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Cosmos DB:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }

  // Store document metadata
  async storeDocument(documentData) {
    try {
      const database = this.client.database(this.databaseId);
      
      // Ensure container exists
      try {
        await database.containers.createIfNotExists({
          id: this.documentsContainerId,
          partitionKey: { paths: ['/documentId'] }
        });
      } catch (containerError) {
        console.log('Container creation skipped:', containerError.message);
      }
      
      const container = database.container(this.documentsContainerId);
      
      const document = {
        id: documentData.documentId,
        documentId: documentData.documentId,
        fileName: documentData.fileName,
        fileSize: documentData.fileSize,
        contentType: documentData.contentType,
        hash: documentData.hash,
        blobUrl: documentData.blobUrl,
        uploadTimestamp: new Date().toISOString(),
        lastVerified: null,
        verificationCount: 0
      };

      const { resource } = await container.items.create(document);
      return resource;
    } catch (error) {
      console.error('Error storing document:', error);
      throw error;
    }
  }

  // Get document by hash (for verification)
  async getDocumentByHash(hash) {
    try {
      const container = this.client.database(this.databaseId).container(this.documentsContainerId);
      
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.hash = @hash',
        parameters: [{ name: '@hash', value: hash }]
      };

      const { resources } = await container.items.query(querySpec).fetchAll();
      return resources.length > 0 ? resources[0] : null;
    } catch (error) {
      console.error('Error getting document by hash:', error);
      throw error;
    }
  }

  // Update document verification info
  async updateDocumentVerification(documentId, verificationResult) {
    try {
      const container = this.client.database(this.databaseId).container(this.documentsContainerId);
      
      const { resource: document } = await container.item(documentId, documentId).read();
      
      document.lastVerified = new Date().toISOString();
      document.verificationCount = (document.verificationCount || 0) + 1;
      document.lastVerificationResult = verificationResult;

      const { resource } = await container.item(documentId, documentId).replace(document);
      return resource;
    } catch (error) {
      console.error('Error updating document verification:', error);
      throw error;
    }
  }

  // Store audit log
  async storeAuditLog(logData) {
    try {
      const database = this.client.database(this.databaseId);
      const container = database.container(this.auditLogsContainerId);
      
      const auditLog = {
        id: Date.now().toString(),
        documentId: logData.documentId,
        documentName: logData.documentName,
        action: logData.action,
        status: logData.status,
        timestamp: new Date().toISOString(),
        hash: logData.hash,
        details: logData.details || {}
      };

      const { resource } = await container.items.create(auditLog);
      console.log('✅ Audit log stored:', resource.id);
      return resource;
    } catch (error) {
      console.error('❌ Audit log error:', error.message);
      return null;
    }
  }

  // Get audit logs
  async getAuditLogs(limit = 50) {
    try {
      const database = this.client.database(this.databaseId);
      const container = database.container(this.auditLogsContainerId);
      
      const { resources } = await container.items.query('SELECT * FROM c').fetchAll();
      
      return resources
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Get audit logs error:', error.message);
      return [];
    }
  }
}

module.exports = CosmosService;