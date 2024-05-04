// Configuration structure with a generic properties dictionary
type Config = {
  id: string;
  type: string;
  properties: { [key: string]: any }; // Using an index signature for flexibility
};

// Example data (simulated retrieval from OpenSearch)
const globalConfig: Config = {
  id: "global_config",
  type: "global",
  properties: {
    logging_level: "info",
    data_retention: "180 days",
    default_archive_directory: "/var/log/archives",
    maintenance_window: "Sunday 2-4 AM"
  }
};

const serverConfig: Config = {
  id: "server1",
  type: "server",
  properties: {
    logging_level: "warning",
    maintenance_window: "Saturday 1-3 AM"
  }
};

const appConfig: Config = {
  id: "XYZ",
  type: "application",
  properties: {
    logging_level: "debug",
    archive_dirs: ["/app/XYZ/archives"]
  }
};

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

// Merging the configurations
const finalConfig = mergeConfigs(globalConfig, serverConfig, appConfig);

console.log(finalConfig);
