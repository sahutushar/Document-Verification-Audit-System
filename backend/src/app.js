const express = require('express');
const cors = require('cors');
const multer = require('multer');
const documentRoutes = require('./routes/documentRoutes');
// Use real Azure services
const BlobService = require('./services/blobService');
const CosmosService = require('./services/cosmosService');
const AuditService = require('./services/auditService');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://document-verification-audit-system-2.vercel.app', 'https://document-verification-frontend-xyz.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Validate environment variables
const validateEnvironment = () => {
  console.log('🔍 Validating environment variables...');
  
  const required = [
    'AZURE_STORAGE_CONNECTION_STRING',
    'COSMOS_DB_ENDPOINT',
    'COSMOS_DB_KEY'
  ];
  
  const missing = required.filter(key => {
    const exists = !!process.env[key];
    console.log(`${exists ? '✅' : '❌'} ${key}: ${exists ? 'Set' : 'Missing'}`);
    return !exists;
  });
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('💡 Please check your .env file and ensure all required variables are set.');
    console.error('💡 Required variables:');
    required.forEach(key => {
      console.error(`   - ${key}`);
    });
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
};

// Initialize Azure services
const initializeServices = async () => {
  try {
    console.log('🚀 Starting Azure services initialization...');
    
    // Validate environment first
    if (!validateEnvironment()) {
      throw new Error('Environment validation failed');
    }
    
    console.log('✅ Environment variables validated');
    console.log('Storage Account:', process.env.AZURE_STORAGE_CONNECTION_STRING?.split(';')[1]);
    console.log('Cosmos Endpoint:', process.env.COSMOS_DB_ENDPOINT);
    
    // Initialize Blob Storage
    console.log('💾 Initializing Blob Storage...');
    const blobService = new BlobService();
    await blobService.initializeContainer();
    console.log('✅ Blob Storage initialized');
    
    // Initialize Cosmos DB
    console.log('💾 Initializing Cosmos DB...');
    const cosmosService = new CosmosService();
    await cosmosService.initialize();
    console.log('✅ Cosmos DB initialized');
    
    // Initialize Audit Service (non-critical)
    console.log('💾 Initializing Audit Service...');
    const auditService = new AuditService();
    try {
      await auditService.initialize();
      console.log('✅ Audit Service initialized');
    } catch (auditError) {
      console.log('⚠️ Audit Service initialization failed, continuing without audit logs:', auditError.message);
    }
    
    console.log('✨ All Azure services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Azure services:', error.message);
    console.error('❌ Full error:', error);
    console.error('❌ Stack trace:', error.stack);
    
    // Provide helpful error messages
    if (error.message.includes('AZURE_STORAGE_CONNECTION_STRING')) {
      console.error('💡 Check your Azure Storage connection string in .env file');
    }
    if (error.message.includes('COSMOS_DB')) {
      console.error('💡 Check your Cosmos DB configuration in .env file');
    }
    
    process.exit(1);
  }
};

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`🔄 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/documents', documentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Document Verification & Audit System API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      upload: 'POST /api/documents/upload',
      verify: 'POST /api/documents/verify',
      auditLogs: 'GET /api/documents/audit-logs',
      health: 'GET /api/documents/health'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error.message);
  console.error('❌ Stack:', error.stack);
  
  if (error instanceof multer.MulterError) {
    console.log('❌ Multer error:', error.code);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field. Use "document" as field name.' });
    }
  }
  
  // Handle file type validation errors
  if (error.message && error.message.includes('Invalid file type')) {
    console.log('❌ File type error:', error.message);
    return res.status(400).json({ error: error.message });
  }
  
  // Handle CORS errors
  if (error.message && error.message.includes('CORS')) {
    console.log('❌ CORS error:', error.message);
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = { app, initializeServices };