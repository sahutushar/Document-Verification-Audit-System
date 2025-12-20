const HashService = require('../services/hashService');
// Use real Azure services
const BlobService = require('../services/blobService');
const CosmosService = require('../services/cosmosService');
const AuditService = require('../services/auditService');

class DocumentController {
  constructor() {
    this.blobService = new BlobService();
    this.cosmosService = new CosmosService();
    this.auditService = new AuditService();
  }

  // Upload document
  async uploadDocument(req, res) {
    try {
      console.log('📤 Upload request received');
      
      if (!req.file) {
        console.log('❌ No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('📁 File details:', {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      });

      // Validate file size (additional check)
      if (req.file.size > 10 * 1024 * 1024) {
        console.log('❌ File too large:', req.file.size);
        return res.status(400).json({ error: 'File size exceeds 10MB limit' });
      }

      const file = req.file;
      const documentId = HashService.generateDocumentId();
      const hash = HashService.generateHash(file.buffer);
      
      console.log('🔐 Generated hash:', hash);
      console.log('🆔 Document ID:', documentId);

      // Check if document already exists
      console.log('🔍 Checking for existing document...');
      const existingDoc = await this.cosmosService.getDocumentByHash(hash);
      if (existingDoc) {
        console.log('⚠️ Document already exists:', existingDoc.documentId);
        // Insert audit log for duplicate upload attempt
        try {
          await this.auditService.logUpload('user1', file.originalname, 'DUPLICATE');
        } catch (auditError) {
          console.error('❌ Audit log failed:', auditError.message);
        }

        return res.status(409).json({ 
          error: 'Document already exists',
          existingDocumentId: existingDoc.documentId,
          hash: hash
        });
      }

      // Upload to blob storage
      console.log('☁️ Uploading to blob storage...');
      const blobResult = await this.blobService.uploadFile(
        documentId,
        file.originalname,
        file.buffer,
        file.mimetype
      );
      console.log('✅ Blob upload successful:', blobResult.url);

      // Store metadata in Cosmos DB
      console.log('💾 Storing metadata in Cosmos DB...');
      const documentData = {
        documentId: documentId,
        fileName: file.originalname,
        fileSize: file.size,
        contentType: file.mimetype,
        hash: hash,
        blobUrl: blobResult.url
      };

      const storedDocument = await this.cosmosService.storeDocument(documentData);
      console.log('✅ Document metadata stored');

      // Insert audit log for successful upload
      try {
        await this.auditService.logUpload('user1', file.originalname, 'SUCCESS');
      } catch (auditError) {
        console.error('❌ Audit log failed:', auditError.message);
      }

      const response = {
        message: 'Document uploaded successfully',
        documentId: documentId,
        hash: hash,
        fileName: file.originalname,
        fileSize: file.size,
        timestamp: storedDocument.uploadTimestamp
      };
      
      console.log('✅ Upload completed successfully');
      res.status(201).json(response);

    } catch (error) {
      console.error('❌ Upload error details:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Failed to upload document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Verify document
  async verifyDocument(req, res) {
    try {
      console.log('🔍 Verify request received');
      
      if (!req.file) {
        console.log('❌ No file in verify request');
        return res.status(400).json({ error: 'No file uploaded for verification' });
      }

      console.log('📁 Verify file details:', {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      });

      // Validate file size (additional check)
      if (req.file.size > 10 * 1024 * 1024) {
        console.log('❌ Verify file too large:', req.file.size);
        return res.status(400).json({ error: 'File size exceeds 10MB limit' });
      }

      const file = req.file;
      const currentHash = HashService.generateHash(file.buffer);
      console.log('🔐 Generated verify hash:', currentHash);

      // Find original document by hash
      console.log('🔍 Looking for original document...');
      const originalDocument = await this.cosmosService.getDocumentByHash(currentHash);

      if (!originalDocument) {
        console.log('❌ Document not found in system');
        // Insert audit log for unknown document verification
        try {
          await this.auditService.logVerify('user1', file.originalname, 'NOT_FOUND');
        } catch (auditError) {
          console.error('❌ Audit log failed:', auditError.message);
        }

        return res.status(404).json({ 
          error: 'Document not found in system',
          currentHash: currentHash
        });
      }

      console.log('✅ Original document found:', originalDocument.documentId);

      // Compare hashes
      const isVerified = HashService.compareHashes(originalDocument.hash, currentHash);
      const verificationStatus = isVerified ? 'VERIFIED' : 'TAMPERED';
      
      console.log('🔐 Hash comparison result:', {
        original: originalDocument.hash,
        current: currentHash,
        verified: isVerified
      });

      // Update document verification info
      console.log('💾 Updating verification info...');
      await this.cosmosService.updateDocumentVerification(
        originalDocument.documentId, 
        verificationStatus
      );

      // Insert audit log for verification result
      try {
        await this.auditService.logVerify('user1', file.originalname, verificationStatus);
      } catch (auditError) {
        console.error('❌ Audit log failed:', auditError.message);
      }

      const response = {
        verified: isVerified,
        status: verificationStatus,
        hash: currentHash,
        originalHash: originalDocument.hash,
        documentId: originalDocument.documentId,
        originalTimestamp: originalDocument.uploadTimestamp,
        verificationTimestamp: new Date().toISOString(),
        fileName: originalDocument.fileName
      };
      
      console.log('✅ Verification completed:', verificationStatus);
      res.json(response);

    } catch (error) {
      console.error('❌ Verification error:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Failed to verify document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get audit logs
  async getAuditLogs(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const logs = await this.auditService.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  }
}

module.exports = DocumentController;