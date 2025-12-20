// Manual Cosmos DB Container Creation Script
require('dotenv').config({ path: './backend/.env' });
const { CosmosClient } = require('@azure/cosmos');

async function createContainers() {
  try {
    const client = new CosmosClient({ 
      endpoint: process.env.COSMOS_DB_ENDPOINT, 
      key: process.env.COSMOS_DB_KEY 
    });

    console.log('🔗 Connecting to Cosmos DB...');
    console.log('Endpoint:', process.env.COSMOS_DB_ENDPOINT);

    // Create database without throughput (serverless)
    const databaseId = process.env.COSMOS_DB_DATABASE_ID || 'docverifydb';
    const { database } = await client.databases.createIfNotExists({
      id: databaseId
    });
    console.log(`✅ Database created/exists: ${databaseId}`);

    // Create containers without individual throughput (uses shared)
    await database.containers.createIfNotExists({
      id: 'Documents',
      partitionKey: { paths: ['/documentId'] }
    });
    console.log('✅ Documents container created/exists');

    await database.containers.createIfNotExists({
      id: 'audit_logs', 
      partitionKey: { paths: ['/userId'] }
    });
    console.log('✅ audit_logs container created/exists');

    console.log('🎉 All containers ready!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createContainers();