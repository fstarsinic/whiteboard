// Configuration storage (simulated database)
var config = {
    "global_config": {
        "id": "global_config",
        "type": "global",
        "logging_level": "info",
        "data_retention": "180 days",
        "archive_dirs": ["/opt/css"],
        "maintenance_window": "Sunday 2-4 AM"
    },
    "server1": {
        "id": "server1",
        "type": "server",
        "logging_level": "warning",
        "applications": [
            { "application": "ASN",
                "distribution_strategy": { "type": "round-robin" } },
            { "application": "BGP",
                "distribution_strategy": { "type": "round-robin" }
            }
        ],
        "maintenance_window": "Saturday 1-3 AM"
    },
    "server2": {
        "id": "server2",
        "type": "server",
        "logging_level": "warning",
        "applications": [
            { "application": "ASN",
                "distribution_strategy": { "type": "regex", "pattern": ".*[13579]$" } },
            { "application": "BGP",
                "distribution_strategy": { "type": "round-robin" }
            },
            { "application": "CVE",
                "distribution_strategy": { "type": "round-robin" }
            }
        ],
        "maintenance_window": "Saturday 1-3 AM"
    },
    "server3": {
        "id": "server3",
        "type": "server",
        "logging_level": "warning",
        "applications": [
            { "application": "ASN",
                "distribution_strategy": { "type": "regex", "pattern": ".*[02468]$" } },
            { "application": "BGP",
                "distribution_strategy": { "type": "round-robin" }
            }
        ],
        "maintenance_window": "Saturday 1-3 AM"
    },
    "ASN": {
        "id": "ASN",
        "type": "application",
        "logging_level": "debug",
        "archive_dirs": ["/app/ASN/archives"]
    },
    "BGP": {
        "id": "BGP",
        "type": "application",
        "logging_level": "info" // Inherits 'archive_dirs' from global
    }
};
// Methods to retrieve configurations
function getGlobalConfig() {
    return config["global_config"];
}
function getServerConfig(serverId) {
    return config[serverId];
}
function getApplicationConfig(serverId, appId) {
    var mergedConfig = {};
    // Merge global config
    Object.assign(mergedConfig, getGlobalConfig());
    // Retrieve server config and merge if the application is listed
    var serverConfig = getServerConfig(serverId);
    if (serverConfig && serverConfig.applications) {
        Object.assign(mergedConfig, serverConfig);
        // Find and merge specific application configurations from the server
        var appDetails = serverConfig.applications.find(function (app) { return app.application === appId; });
        if (appDetails) {
            Object.assign(mergedConfig, appDetails);
        }
    }
    // Merge application config
    var appConfig = config[appId];
    if (appConfig) {
        Object.assign(mergedConfig, appConfig);
    }
    return mergedConfig;
}
// Enhanced main function to demonstrate configuration retrieval and display
function main() {
    var serverId = "server1";
    var appId = "BGP";
    var finalConfig = getApplicationConfig(serverId, appId);
    console.log("Final configuration for Server: ".concat(serverId, ", Application: ").concat(appId, ":"));
    console.log(finalConfig);
    // Retrieve server configuration
    var serverConfig = getServerConfig(serverId);
    console.log("Server configuration for ".concat(serverId, ":"));
    console.log(serverConfig);
    // Retrieve and display final merged application configuration
    finalConfig = getApplicationConfig(serverId, appId);
    console.log("Final configuration for Server: ".concat(serverId, ", Application: ").concat(appId, ":"));
    console.log(finalConfig);
    serverId = "server2";
    appId = "ASN";
    // Retrieve server configuration
    serverConfig = getServerConfig(serverId);
    console.log("Server configuration for ".concat(serverId, ":"));
    console.log(serverConfig);
    // Retrieve server configuration
    serverConfig = getServerConfig(serverId);
    console.log("Server configuration for ".concat(serverId, ":"));
    console.log("Final configuration for Server: ".concat(serverId, ", Application: ").concat(appId, ":"));
    console.log(finalConfig);
}
main();
