import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { Client } from '@opensearch-project/opensearch'; // Adjust import according to your OpenSearch client

class YourOpenSearchClass {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async insertBulkFromFilePath(pathToFiles: string, indexName: string, batchSize: number): Promise<void> {
    try {
      const files = await readdir(pathToFiles);
      for (let i = 0; i < files.length; i += batchSize) {
        const batchFiles = files.slice(i, i + batchSize);
        const bulkBody: string[] = [];

        for (const file of batchFiles) {
          const filePath = join(pathToFiles, file);
          const document = await readFile(filePath, { encoding: 'utf-8' });
          const action = { index: { _index: indexName } };

          bulkBody.push(JSON.stringify(action));
          bulkBody.push(document);
        }

        const { body } = await this.client.bulk({ body: bulkBody.join('\n') + '\n' });

        if (body.errors) {
          console.error('Bulk insert had errors in batch', i / batchSize, body.errors);
        } else {
          console.log('Successfully inserted batch', i / batchSize);
        }
      }
    } catch (error) {
      console.error('Failed to insert documents', error);
    }
  }
}
