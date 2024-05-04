import { Client } from '@opensearch-project/opensearch';

// Assuming you have an OpenSearch client configured and connected
const client: Client = new Client({
  node: 'http://localhost:9200'
});

// Configuration structure with a generic properties dictionary
type Config = {
  id: string;
  type: string;
  properties: { [key: string]: any };
};

// Function to fetch a configuration document by its ID from a specific index
async function fetchConfig(id: string, index: string): Promise<Config> {
  try {
    const result = await client.get({
      index: index,
      id: id
    });
    return {
      id: result.body._id,
      type: result.body._source.type,
      properties: result.body._source.properties
    };
  } catch (error) {
    console.error(`Failed to fetch config for ID ${id}:`, error);
    throw error; // Re-throw to handle it in caller
  }
}

// Function to merge configurations, handling arbitrary properties
function mergeConfigs(...configs: Config[]): { [key: string]: any } {
  const mergedProperties = {};

  configs.forEach(config => {
    Object.keys(config.properties).forEach(key => {
      mergedProperties[key] = config.properties[key]; // Later properties override earlier ones
    });
  });

  return mergedProperties;
}

// Main function to read and merge configurations
async function main() {
  try {
    const globalConfig = await fetchConfig("global_config", "config_index");
    const serverConfig = await fetchConfig("server1", "config_index");
    const appConfig = await fetchConfig("XYZ", "config_index");

    const mergedConfig = mergeConfigs(globalConfig, serverConfig, appConfig);
    console.log("Merged Configuration Output:");
    console.log(mergedConfig);
  } catch (error) {
    console.error("Error in configuration processing:", error);
  }
}

main();
