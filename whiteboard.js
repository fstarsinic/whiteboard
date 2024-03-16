import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { Client } from '@opensearch-project/opensearch'; // Assume this is your OpenSearch client library

class YourOpenSearchClass {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async insertBulkFromFilePath(pathToFiles: string, indexName: string): Promise<void> {
    try {
      const files = await readdir(pathToFiles);
      const bulkBody: string[] = [];

      for (const file of files) {
        const filePath = join(pathToFiles, file);
        const document = await readFile(filePath, { encoding: 'utf-8' });
        const action = { index: { _index: indexName } };

        bulkBody.push(JSON.stringify(action));
        bulkBody.push(document);
      }

      const { body } = await this.client.bulk({ body: bulkBody.join('\n') + '\n' });

      if (body.errors) {
        console.error('Bulk insert had errors', body.errors);
      } else {
        console.log('Successfully inserted documents');
      }
    } catch (error) {
      console.error('Failed to insert documents', error);
    }
  }
}
