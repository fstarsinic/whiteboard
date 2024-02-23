import { Client } from '@opensearch-project/opensearch';
import fs from 'fs';
import csv from 'csv-parser';
import { Readable, Writable } from 'stream';

const client = new Client({
  node: 'http://localhost:9200', // Adjust this to your OpenSearch cluster
});

const ALIAS_NAME = 'your-alias-name'; // The alias to rollover
const INDEX_NAME_PREFIX = 'your-index-prefix-'; // Prefix for new indices
const CHUNK_SIZE = 1000; // Number of documents to index in each bulk request

async function rolloverIfNeeded(client: Client, aliasName: string) {
  try {
    const response = await client.indices.rollover({
      alias: aliasName,
      body: {
        conditions: {
          max_age: '7d', // Adjust rollover conditions as needed
          max_docs: 1000000,
        },
      },
    });

    console.log('Rollover response:', response);
    return response;
  } catch (error) {
    console.error('An error occurred during the rollover operation:', error);
    throw error;
  }
}

function createBulkInsertStream(client: Client, indexName: string, chunkSize: number) {
  let buffer: any[] = [];

  const flushBuffer = async () => {
    const body = buffer.flatMap(doc => [{ index: { _index: indexName } }, doc]);
    await client.bulk({ refresh: true, body });
    buffer = [];
  };

  return new Writable({
    objectMode: true,
    async write(doc, encoding, callback) {
      buffer.push(doc);
      if (buffer.length >= chunkSize) {
        await flushBuffer();
      }
      callback();
    },
    async final(callback) {
      if (buffer.length
