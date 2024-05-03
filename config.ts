type ConfigProperties = {
  logging_level?: string;
  data_retention?: string;
  default_archive_directory?: string;
  maintenance_window?: string;
  archive_dirs?: string[];
};

type Config = {
  id: string;
  type: string;
  properties: ConfigProperties;
};

// Simulated data retrieval from OpenSearch
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

function mergeConfigs(global: ConfigProperties, server: ConfigProperties, app: ConfigProperties): ConfigProperties {
  return {
    ...global,
    ...server,
    ...app
  };
}

// Parse and merge configurations
const finalConfig = mergeConfigs(globalConfig.properties, serverConfig.properties, appConfig.properties);

console.log(finalConfig);
