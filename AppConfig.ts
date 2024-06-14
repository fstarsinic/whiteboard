class AppConfig {
    private configData: any;

    constructor() {
        this.configData = {
            "applications": [
                {
                    "id": "CVE1",
                    "module": "CVE",
                    "type": "Executor",
                    "language": "typescript",
                    "cron": "0 */4 * * *",
                    "enabled": true,
                    "maintenance_window": "Saturday 1-3 AM",
                    "distribution_strategy": {"type": "regex", "value": ".*"},
                    "archive_dirs": ["/"]
                },
                {
                    "id": "CVE2",
                    "module": "CVE",
                    "type": "Executor",
                    "language": "typescript",
                    "cron": "0 */2 * * *",
                    "enabled": true,
                    "maintenance_window": "Saturday 1-3 AM",
                    "distribution_strategy": {"type": "regex", "value": ".*"},
                    "archive_dirs": ["/"]
                },
                // Add other applications here
            ],
            "servers": [
                {
                    "id": "dlawoscs03",
                    "hostname": "dlawoscs03.r1-core.r1.aig.net",
                    "type": "server",
                    "logging_level": "warning",
                    "applications": ["CVE2", "CVE1"],
                    "maintenance_window": "Saturday 1-3 AM"
                },
                // Add other servers here
            ],
            "global_config": {
                "id": "global_config",
                "type": "global",
                "properties": {
                    "logging_level": "info",
                    "data_retention": "180 days",
                    "default_archive_directory": "/opt/css",
                    "maintenance_window": "Sunday 2-4 AM"
                }
            }
        };
    }

    private getServerForApplication(appId: string): any {
        return this.configData.servers.find((server: any) =>
            server.applications.includes(appId)
        );
    }

    private getApplicationById(appId: string): any {
        return this.configData.applications.find((app: any) => app.id === appId);
    }

    public getApplicationConfig(appId: string): any {
        const appInstance = this.getApplicationById(appId);
        if (!appInstance) {
            throw new Error("Application instance not found");
        }

        const appModule = appInstance.module;
        const moduleConfigs = this.configData.applications.filter((app: any) => app.module === appModule);
        
        const serverConfig = this.getServerForApplication(appId);
        const globalConfig = this.configData.global_config.properties;

        const mergedConfig = this.mergeConfigs(globalConfig, serverConfig, appInstance);

        moduleConfigs.forEach((config: any) => {
            if (config.id !== appId) {
                Object.assign(mergedConfig, this.mergeConfigs(globalConfig, serverConfig, config));
            }
        });

        return mergedConfig;
    }

    public getServerConfig(serverId: string): any {
        const serverConfig = this.configData.servers.find((server: any) => server.id === serverId);
        if (!serverConfig) {
            throw new Error("Server not found");
        }

        const globalConfig = this.configData.global_config.properties;
        return this.mergeConfigs(globalConfig, serverConfig);
    }

    public getGlobalConfig(): any {
        return this.configData.global_config.properties;
    }

    private mergeConfigs(globalConfig: any, serverConfig: any, appConfig?: any): any {
        return { ...globalConfig, ...serverConfig, ...appConfig };
    }

    public validateConfigurations(): any {
        const errors: string[] = [];
        
        this.configData.servers.forEach((server: any) => {
            server.applications.forEach((appId: string) => {
                if (!this.getApplicationById(appId)) {
                    errors.push(`Server ${server.id} has an invalid application ID: ${appId}`);
                }
            });
        });

        if (errors.length > 0) {
            return { valid: false, errors };
        }
        return { valid: true, errors: [] };
    }

    public getServersForApplication(appId: string): any {
        const servers = this.configData.servers.filter((server: any) =>
            server.applications.includes(appId)
        );
        return servers.map((server: any) => server.id);
    }

    public getAllServers(): any {
        return this.configData.servers.map((server: any) => server.id);
    }

    public getAllModules(): any {
        const modules = new Set(this.configData.applications.map((app: any) => app.module));
        return Array.from(modules);
    }

    public getAllApplicationInstances(): any {
        return this.configData.applications.map((app: any) => app.id);
    }
}

export default AppConfig;
