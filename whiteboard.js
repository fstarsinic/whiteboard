const { Client } = require('@opensearch-project/opensearch');
const https = require('https');

// Replace 'sample.com' with your actual host, and 'adminuser', 'pwd' with actual authentication details
const osearch = new Client({
  node: 'https://sample.com',
  auth: {
    username: 'adminuser',
    password: 'pwd'
  },
  ssl: {
    // This is necessary if your OpenSearch uses a self-signed certificate.
    // For production, you should use a certificate signed by a CA and possibly remove this line.
    rejectUnauthorized: false 
  }
});

// Update aliases by removing and then creating a new index
async function updateAliases() {
  try {
    // Remove alias
    await osearch.indices.updateAliases({
      body: {
        actions: [
          { remove: { index: 'xyz-data*', alias: 'xyz-current-data' } }
        ]
      }
    });

    // Create new index with current date
    const indexName = 'xyz-data-' + new Date().toISOString().slice(0, 10).replace(/-/g, '');
    await osearch.indices.create({ index: indexName });

    console.log(`Index ${indexName} created successfully.`);
  } catch (error) {
    console.error('Error updating aliases:', error);
  }
}

updateAliases();
