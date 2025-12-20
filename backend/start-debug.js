#!/usr/bin/env node

/**
 * Debug startup script for Document Verification Backend
 * This script helps identify and fix common startup issues
 */

require('dotenv').config();
const { app, initializeServices } = require('./src/app');

const PORT = process.env.PORT || 5003;

console.log('🔧 Document Verification System - Debug Startup');
console.log('================================================');
console.log(`📅 Timestamp: ${new Date().toISOString()}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🚪 Port: ${PORT}`);
console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
console.log('================================================\n');

// Enhanced startup with better error handling
const startServer = async () => {
  try {
    console.log('🚀 Starting server initialization...\n');
    
    // Step 1: Initialize Azure services
    console.log('📋 Step 1: Initializing Azure services...');
    await initializeServices();
    console.log('✅ Azure services initialized successfully\n');
    
    // Step 2: Start HTTP server
    console.log('📋 Step 2: Starting HTTP server...');
    const server = app.listen(PORT, () => {
      console.log('✅ HTTP server started successfully');
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/documents/health`);
      console.log('================================================');
      console.log('🎉 Server is ready to accept requests!');
      console.log('================================================\n');
      
      // Test endpoints after startup
      setTimeout(() => {
        console.log('💡 You can now test the endpoints:');
        console.log('   - Upload: POST /api/documents/upload');
        console.log('   - Verify: POST /api/documents/verify');
        console.log('   - Audit: GET /api/documents/audit-logs');
        console.log('   - Health: GET /api/documents/health\n');
      }, 1000);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error('💡 Try using a different port or stop the existing process');
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('\n❌ Failed to start server');
    console.error('❌ Error:', error.message);
    
    if (error.stack) {
      console.error('❌ Stack trace:', error.stack);
    }
    
    // Provide specific troubleshooting tips
    console.error('\n🔧 Troubleshooting Tips:');
    
    if (error.message.includes('AZURE_STORAGE_CONNECTION_STRING')) {
      console.error('   1. Check your Azure Storage connection string in .env file');
      console.error('   2. Ensure the storage account exists and is accessible');
    }
    
    if (error.message.includes('COSMOS_DB')) {
      console.error('   1. Check your Cosmos DB endpoint and key in .env file');
      console.error('   2. Ensure the Cosmos DB account exists and is accessible');
      console.error('   3. Verify the database name is correct');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('   1. Check your internet connection');
      console.error('   2. Verify Azure service endpoints are correct');
      console.error('   3. Check if Azure services are running');
    }
    
    console.error('   4. Ensure all required environment variables are set');
    console.error('   5. Check .env file exists and is properly formatted');
    console.error('\n');
    
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n📡 Received ${signal}. Shutting down gracefully...`);
  console.log('👋 Goodbye!');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:', error);
  console.error('💥 Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled Rejection at:', promise);
  console.error('💥 Reason:', reason);
  process.exit(1);
});

// Start the server
startServer();