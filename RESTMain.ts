import fetch from 'node-fetch';
import minimist from 'minimist';

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

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

makePostRequest();


//npx ts-node postRequest.ts --apiKey=your_api_key --startDate=2024-01-01 --endDate=2024-01-31 --channel=your_channel


import fetch from 'node-fetch';
import minimist from 'minimist';

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
};

// Define the POST data
const postData = {
  apiKey: state.apiKey,
  startDate: state.startDate,
  endDate: state.endDate,
  channel: state.channel,
};

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

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

makePostRequest();


//npx ts-node postRequest.ts --apiKey=your_api_key --startDate=2024-01-01 --endDate=2024-01-31 --channel=your_channel

/*
curl -X POST https://example.com/api \
     -H "Content-Type: application/json" \
     -d '{
           "apiKey": "your_api_key",
           "startDate": "2024-01-01",
           "endDate": "2024-01-31",
           "channel": "your_channel"
         }'



curl -X POST https://example.com/api \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your_api_key" \
     -d '{
           "startDate": "2024-01-01",
           "endDate": "2024-01-31",
           "channel": "your_channel"
         }'
*/
