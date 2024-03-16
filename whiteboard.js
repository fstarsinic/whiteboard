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
          // Ensure the document content is correctly formatted as JSON
          const documentContent = await readFile(filePath, { encoding: 'utf-8' });
          try {
            // Parse and re-stringify the document content to ensure it's valid JSON and correctly formatted
            const document = JSON.stringify(JSON.parse(documentContent));
            const action = { index: { _index: indexName } };
            bulkBody.push(JSON.stringify(action));
            bulkBody.push(document);
          } catch (error) {
            console.error(`Error processing file: ${filePath}`, error);
            // Consider how you want to handle this error. Continue, break, return, etc.
            continue; // For now, we'll skip this file and continue with the next
          }
        }

        const { body } = await this.client.bulk({ body: bulkBody.join('\n') + '\n' });

        if (body.errors) {
          console.error('Bulk insert had errors in batch', Math.floor(i / batchSize), body.errors);
        } else {
          console.log('Successfully inserted batch', Math.floor(i / batchSize));
        }
      }
    } catch (error) {
      console.error('Failed to insert documents', error);
    }
  }
}
