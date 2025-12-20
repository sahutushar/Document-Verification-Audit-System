const express = require('express');
const multer = require('multer');
const DocumentController = require('../controllers/documentController');

const router = express.Router();
const documentController = new DocumentController();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX files are allowed.'));
    }
  }
});

// Routes with error handling
router.post('/upload', (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      console.error('❌ Upload middleware error:', err);
      return res.status(400).json({ error: err.message });
    }
    documentController.uploadDocument(req, res);
  });
});

router.post('/verify', (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      console.error('❌ Verify middleware error:', err);
      return res.status(400).json({ error: err.message });
    }
    documentController.verifyDocument(req, res);
  });
});

router.get('/audit-logs', async (req, res) => {
  try {
    console.log('🔍 API: Getting audit logs...');
    await documentController.getAuditLogs(req, res);
  } catch (error) {
    console.error('❌ API: Audit logs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Document Verification API'
  });
});

// Test audit log creation
router.get('/test-audit', async (req, res) => {
  try {
    const AuditService = require('../services/auditService');
    const auditService = new AuditService();
    
    // Create test upload log
    await auditService.logUpload('testuser', 'test-document.pdf', 'SUCCESS');
    
    // Create test verify log
    await auditService.logVerify('testuser', 'test-document.pdf', 'VERIFIED');
    
    // Get all logs
    const logs = await auditService.getAuditLogs(10);
    
    res.json({ 
      success: true,
      message: 'Test audit logs created',
      totalLogs: logs.length,
      logs: logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;