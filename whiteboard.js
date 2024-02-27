import { Client } from '@opensearch-project/opensearch';
import * as fs from 'fs';
import { createInterface } from 'readline';

class CSVToOpenSearch {
  private client: Client;
  private filePath: string;

  constructor(opensearchConfig: { node: string }, filePath: string) {
    this.client = new Client(opensearchConfig);
    this.filePath = filePath;
  }

  async *generateDocuments(indexName: string): AsyncGenerator<any, void, undefined> {
    const fileStream = fs.createReadStream(this.filePath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const [startip, endip] = line.split(','); // Adjust based on your CSV format

      if (startip && endip) {
        yield { index: { _index: indexName } };
        yield { startip, endip };
      }
    }
  }

  async bulkInsert(indexName: string): Promise<void> {
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
};

const filePath = 'path/to/your/csv/file.csv';
const indexName = 'your_index_name';

const loader = new CSVToOpenSearch(opensearchConfig, filePath);
loader.bulkInsert(indexName).catch(console.error);
