import fetch from 'node-fetch';
import minimist from 'minimist';
import { pipeline } from 'stream';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { Readable } from 'stream';

interface State {
  apiKey: string;
  startDate: string;
  endDate: string;
  channel: string;
}

// Parse command-line arguments
const args = minimist(process.argv.slice(2));

// Initialize state with command-line arguments
const state: State = {
  apiKey: args.apiKey || '',
  startDate: args.startDate || '',
  endDate: args.endDate || '',
  channel: args.channel || '',
};

// Define the URL and headers
const url = 'https://example.com/api';  // Replace with your actual URL
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${state.apiKey}`,
};

// Define the POST data
const postData = {
  startDate: state.startDate,
  endDate: state.endDate,
  channel: state.channel,
};

// Function to process each JSON document
async function processJsonDocument(document: any) {
  console.log('Processing document:', document);
  // Add your processing logic here
}

async function makePostRequest() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        const jsonLine = buffer.substring(0, boundary).trim();
        buffer = buffer.substring(boundary + 1);
        boundary = buffer.indexOf('\n');

        if (jsonLine) {
          try {
            const jsonDocument = JSON.parse(jsonLine);
            await processJsonDocument(jsonDocument);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
    }

    if (buffer.trim()) {
      try {
        const jsonDocument = JSON.parse(buffer);
        await processJsonDocument(jsonDocument);
      } catch (error) {
        console.error('Error parsing final JSON:', error);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

makePostRequest();

/*
npm install node-fetch
npm install @types/node-fetch --save-dev
*/
