const { CosmosClient } = require('@azure/cosmos');

class AuditService {
  constructor() {
    this.endpoint = process.env.COSMOS_DB_ENDPOINT;
    this.key = process.env.COSMOS_DB_KEY;
    this.databaseId = process.env.COSMOS_DB_DATABASE_ID || 'docverifydb';
    this.containerId = 'audit_logs';
    
    this.client = new CosmosClient({ endpoint: this.endpoint, key: this.key });
    this.database = this.client.database(this.databaseId);
    this.container = this.database.container(this.containerId);
  }

  // Initialize audit logs container
  async initialize() {
    try {
      // Use existing database
      const database = this.client.database(this.databaseId);
      
      // Create container if not exists with partition key /userId
      await database.containers.createIfNotExists({
        id: this.containerId,
        partitionKey: { paths: ['/userId'] }
      });
      
      console.log('✅ Audit logs container initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audit logs container:', error.message);
      // Don't throw error to prevent app startup failure
    }
  }

  // Insert audit log for UPLOAD action
  async logUpload(userId, fileName, result = 'SUCCESS') {
    try {
      const auditLog = {
        id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId || 'anonymous',
        fileName: fileName,
        action: 'UPLOAD',
        result: result,
        timestamp: new Date().toISOString()
      };

      await this.container.items.create(auditLog);
      console.log('✅ Audit log saved: UPLOAD -', fileName);
      return auditLog;
    } catch (error) {
      console.error('❌ Failed to save UPLOAD audit log:', error.message);
      // Don't throw error to prevent upload failure
      return null;
    }
  }

  // Insert audit log for VERIFY action
  async logVerify(userId, fileName, result) {
    try {
      const auditLog = {
        id: `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId || 'anonymous',
        fileName: fileName,
        action: 'VERIFY',
        result: result, // 'VERIFIED' or 'TAMPERED'
        timestamp: new Date().toISOString()
      };

      await this.container.items.create(auditLog);
      console.log('✅ Audit log saved: VERIFY -', fileName, '-', result);
      return auditLog;
    } catch (error) {
      console.error('❌ Failed to save VERIFY audit log:', error.message);
      // Don't throw error to prevent verify failure
      return null;
    }
  }

  // Get all audit logs
  async getAuditLogs(limit = 50) {
    try {
      const querySpec = {
        query: 'SELECT * FROM c ORDER BY c.timestamp DESC OFFSET 0 LIMIT @limit',
        parameters: [{ name: '@limit', value: limit }]
      };

      const { resources } = await this.container.items.query(querySpec).fetchAll();
      return resources;
    } catch (error) {
      console.error('❌ Failed to fetch audit logs:', error.message);
      return [];
    }
  }
}

module.exports = AuditService;