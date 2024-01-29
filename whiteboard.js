const axios = require('axios');
const https = require('https');

// Replace 'YOUR_API_KEY' with your actual API key
const apiKey = 'YOUR_API_KEY';

// Replace 'API_ENDPOINT' with the actual endpoint URL you want to access
const apiEndpoint = 'API_ENDPOINT';

const headers = {
  Authorization: `Bearer ${apiKey}`,
};

const axiosConfig = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Set this to false to disable SSL certificate verification
  }),
};

axios
  .get(apiEndpoint, { headers, ...axiosConfig }) // Pass axiosConfig directly here
  .then((response) => {
    if (response.status === 200) {
      console.log('Request was successful!');
      console.log('Response:');
      console.log(response.data); // You can access the response data here
    } else {
      console.error(`Request failed with status code: ${response.status}`);
    }
  })
  .catch((error) => {
    console.error(`An error occurred: ${error.message}`);
  });
