const { Client } = require('@opensearch-project/opensearch');
const fs = require('fs-extra');
const glob = require('glob-promise');

// Initialize OpenSearch client
const client = new Client({
  node: 'yourOpensearchHost',
  auth: {
    username: 'yourUsername',
    password: 'yourPassword',
  },
});

// Function to insert a single document into the OpenSearch database
async function insertDocument(filePath) {
  try {
    const content = await fs.readJson(filePath);
    const response = await client.index({
      index: 'nuclei',
      body: content,
      refresh: true, // Ensure that documents are indexed immediately for the sake of the example
    });

    console.log(`Document from '${filePath}' has been indexed. Response ID: ${response.body._id}`);
  } catch (error) {
    console.error(`Error inserting document from '${filePath}':`, error);
  }
}

// Function to find and insert documents from .yaml.json files
async function insertDocumentsFromYamlJsonFiles(startPath) {
  try {
    // Find all .yaml.json files in the directory and subdirectories
    const files = await glob(`${startPath}/**/*.yaml.json`);

    for (let file of files) {
      await insertDocument(file); // Call insertDocument for each file
    }
  } catch (error) {
    console.error('An error occurred while searching for files:', error);
  }
}

// Replace 'yourStartDirectory' with the path of your directory
const startDirectory = 'yourStartDirectory';
insertDocumentsFromYamlJsonFiles(startDirectory);
