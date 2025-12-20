#!/usr/bin/env node

/**
 * Diagnostic script for Document Verification System
 * Checks environment, connectivity, and service health
 */

require('dotenv').config();
const axios = require('axios');
const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

console.log('🔍 Document Verification System - Diagnostics');
console.log('==============================================');
console.log(`📅 Timestamp: ${new Date().toISOString()}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('==============================================\n');

const runDiagnostics = async () => {
  let allPassed = true;

  // 1. Environment Variables Check
  console.log('📋 1. Environment Variables Check');
  console.log('----------------------------------');
  
  const requiredEnvVars = [
    'AZURE_STORAGE_CONNECTION_STRING',
    'COSMOS_DB_ENDPOINT',
    'COSMOS_DB_KEY',
    'COSMOS_DB_DATABASE_ID'
  ];

  requiredEnvVars.forEach(envVar => {
    const exists = !!process.env[envVar];
    console.log(`${exists ? '✅' : '❌'} ${envVar}: ${exists ? 'Set' : 'Missing'}`);
    if (!exists) allPassed = false;
  });

  const optionalEnvVars = [
    'PORT',
    'FRONTEND_URL',
    'AZURE_STORAGE_CONTAINER_NAME'
  ];

  console.log('\nOptional variables:');
  optionalEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    console.log(`ℹ️  ${envVar}: ${value || 'Not set (using default)'}`);
  });

  console.log('');

  // 2. Azure Blob Storage Check
  console.log('📋 2. Azure Blob Storage Check');
  console.log('-------------------------------');
  
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      console.log('❌ Connection string not found');
      allPassed = false;
    } else {
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'documents';
      
      // Test connection
      const containerClient = blobServiceClient.getContainerClient(containerName);
      await containerClient.createIfNotExists();
      
      console.log('✅ Blob Storage connection successful');
      console.log(`✅ Container "${containerName}" is accessible`);
    }
  } catch (error) {
    console.log('❌ Blob Storage connection failed:', error.message);
    allPassed = false;
  }

  console.log('');

  // 3. Azure Cosmos DB Check
  console.log('📋 3. Azure Cosmos DB Check');
  console.log('----------------------------');
  
  try {
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;
    const databaseId = process.env.COSMOS_DB_DATABASE_ID || 'docverifydb';
    
    if (!endpoint || !key) {
      console.log('❌ Cosmos DB credentials not found');
      allPassed = false;
    } else {
      const client = new CosmosClient({ endpoint, key });
      const database = client.database(databaseId);
      
      // Test connection
      await database.read();
      console.log('✅ Cosmos DB connection successful');
      console.log(`✅ Database "${databaseId}" is accessible`);
      
      // Check containers
      const containers = ['Documents', 'audit_logs'];
      for (const containerId of containers) {
        try {
          const container = database.container(containerId);
          await container.read();
          console.log(`✅ Container "${containerId}" is accessible`);
        } catch (containerError) {
          console.log(`⚠️  Container "${containerId}" not found (will be created on first use)`);
        }
      }
    }
  } catch (error) {
    console.log('❌ Cosmos DB connection failed:', error.message);
    allPassed = false;
  }

  console.log('');

  // 4. Server Health Check (if running)
  console.log('📋 4. Server Health Check');
  console.log('--------------------------');
  
  const port = process.env.PORT || 5003;
  const serverUrl = `http://localhost:${port}`;
  
  try {
    const healthResponse = await axios.get(`${serverUrl}/api/documents/health`, {
      timeout: 5000
    });
    console.log('✅ Server is running and healthy');
    console.log(`✅ Health check response:`, healthResponse.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Server is not running');
      console.log(`💡 Start the server with: npm run debug`);
    } else {
      console.log('❌ Server health check failed:', error.message);
      allPassed = false;
    }
  }

  console.log('');

  // 5. Summary
  console.log('📋 5. Diagnostic Summary');
  console.log('-------------------------');
  
  if (allPassed) {
    console.log('🎉 All critical checks passed!');
    console.log('💡 Your system should be ready to run.');
    console.log('💡 Start the server with: npm run debug');
  } else {
    console.log('❌ Some checks failed.');
    console.log('💡 Please fix the issues above before starting the server.');
    console.log('💡 Check your .env file and Azure service configurations.');
  }

  console.log('\n==============================================');
  console.log('🔍 Diagnostics completed');
  console.log('==============================================');
};

// Run diagnostics
runDiagnostics().catch(error => {
  console.error('\n💥 Diagnostic script failed:', error);
  process.exit(1);
});