const { Client } = require('@opensearch-project/opensearch');
const fs = require('fs');
const csvParser = require('csv-parser');
const readline = require('readline');

class CSVToOpenSearch {
  constructor(opensearchConfig, filePath) {
    this.client = new Client(opensearchConfig);
    this.filePath = filePath;
  }

  async *generateDocuments(indexName) {
    const fileStream = fs.createReadStream(this.filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      // Assuming each line is a CSV with two values: startip, endip
      const [startip, endip] = line.split(','); // Adjust based on your CSV format

      // Skip empty lines or lines that don't match expected format
      if (startip && endip) {
        // Yield an action and a document for each line
        yield { index: { _index: indexName } };
        yield { startip, endip };
      }
    }
  }

  async bulkInsert(indexName) {
    const documentsGenerator = this.generateDocuments(indexName);

    try {
      const result = await this.client.helpers.bulk({
        datasource: documentsGenerator,
        onDocument(doc) {
          return { index: { _index: indexName } };
        },
        refresh: true,
      });

      console.log('Bulk insert completed:', result);
    } catch (error) {
      console.error('Bulk insert error:', error);
    }
  }
}

// Usage example
const opensearchConfig = {
  node: 'http://localhost:9200', // Your OpenSearch node URL
  // Add other authentication or configuration details as needed
};

const filePath = 'path/to/your/csv/file.csv';
const indexName = 'your_index_name';

const loader = new CSVToOpenSearch(opensearchConfig, filePath);
loader.bulkInsert(indexName).catch(console.error);
